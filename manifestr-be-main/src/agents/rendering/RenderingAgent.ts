import { BaseAgent } from "../core/BaseAgent";
import { GenerationJob, GenerationStatus } from "../../models/GenerationJob";
import { ContentResponse, RenderResponse } from "../protocols/types";
import { AppDataSource } from "../../lib/data-source"; // Added import
import { VaultItem, VaultItemStatus, VaultItemType } from "../../models/VaultItem"; // Added import
import { s3Util } from "../../utils/s3.util"; // Added import

export class RenderingAgent extends BaseAgent<ContentResponse, RenderResponse> {

    getProcessingStatus(): GenerationStatus {
        return GenerationStatus.RENDERING;
    }

    extractInput(job: GenerationJob): ContentResponse {
        return job.current_step_data as ContentResponse;
    }

    async process(input: ContentResponse, job: GenerationJob): Promise<RenderResponse> {
        console.log("Rendering Agent transforming to editor format...");

        // Defensive checks
        if (!input || !input.layout) {
            throw new Error("Invalid input: missing layout data");
        }

        if (!input.layout.blocks || !Array.isArray(input.layout.blocks)) {
            console.error("Invalid layout structure:", JSON.stringify(input.layout, null, 2));
            throw new Error("Invalid input: layout.blocks is missing or not an array");
        }

        const format = input.layout.intent.metadata.outputFormat;
        let editorState: any = {};

        if (format === 'presentation') {
            editorState = await this.convertToPolotno(input);
        } else if (format === 'document') {
            editorState = await this.convertToTiptap(input); // Tiptap JSON
        } else {
            editorState = this.convertToUniver(input);
        }

        // In real life, we might upload this JSON to S3 if it's huge
        // For now, we return it.

        return {
            jobId: input.jobId,
            outputFormat: format,
            editorState: editorState,
            tokensUsed: 0, // Placeholder
            status: "success"
        };
    }

    protected async onJobCompleted(job: GenerationJob): Promise<void> {
        console.log(`[RenderingAgent] Finalizing job ${job.id} - Saving to Vault`);

        try {
            // 1. Upload JSON output to S3
            const jsonContent = JSON.stringify(job.current_step_data);
            const fileKey = `vaults/generations/${job.userId}/${job.id}.json`;

            await s3Util.uploadFile(fileKey, jsonContent, 'application/json');

            // 2. Update Job with location
            job.final_url = fileKey;
            // Job is saved by BaseAgent after this hook returns, or we can save here to be safe but BaseAgent saves it.
            // Actually BaseAgent saves job AFTER this hook. So we just modify the object.

            // 3. Create Vault Item
            const vaultRepo = AppDataSource.getRepository(VaultItem);
            const vaultItem = vaultRepo.create({
                title: job.title || "Untitled Generation",
                type: VaultItemType.FILE,
                status: VaultItemStatus.FINAL,
                file_key: fileKey,
                thumbnail_url: job.cover_image,
                project: "Generations", // Or create a folder for it? For now, flat or "Generations" project tag.
                userId: job.userId,
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: job.output_type
                }
            });

            await vaultRepo.save(vaultItem);
            console.log(`[RenderingAgent] Vault Item created: ${vaultItem.id}`);

        } catch (error) {
            console.error(`[RenderingAgent] Failed to save to vault:`, error);
            // We don't throw here to avoid failing the job status itself, or maybe we do?
            // If vault save fails, the job is technically done but not persisted as user wants.
            // Let's log and proceed.
        }
    }

    // --- Adapters ---

    private async convertToPolotno(input: ContentResponse) {
        const pages: any[] = [];
        const designSystem = input.layout?.designSystem || {
            colors: ["#000000", "#FFFFFF", "#333333", "#666666"],
            fonts: { heading: "Inter", body: "Roboto" }
        };

        const colors = designSystem.colors;
        const fonts = designSystem.fonts;

        const contentMap = input.generatedContent || [];
        if (!input.generatedContent) {
            console.error("Critical: ContentResponse is missing 'generatedContent'. Using empty array.");
        }

        for (const block of input.layout.blocks) {
            const blockContent = contentMap.find(c => c.blockId === block.id);
            if (!blockContent) console.warn(`No content generated for block ${block.id}`);

            const children: any[] = [];

            // --- 1. Background System (Consistent Theme) ---
            const isDarkMode = input.layout.intent.designPreferences?.colorTheme?.toLowerCase().includes('dark') || false;

            // Define Palette Roles based on LayoutAgent's output contract: [Primary, Secondary, Accent, Dark, Light]
            const brandColor = colors[0];
            const secondaryColor = colors[1];
            const darkColor = colors[3];
            const lightColor = colors[4];

            // Determine Base Theme
            const themeBg = isDarkMode ? darkColor : lightColor;

            // Layout Classification
            const isHero = block.layoutType.includes('hero') || block.layoutType.includes('title') || block.layoutType.includes('center') || block.layoutType.includes('cta');
            const isImage = block.layoutType.includes('image') || block.layoutType.includes('full-bleed');

            let bgConfig: any = { fill: themeBg };

            if (isImage) {
                // Full screen image with overlay
                children.push(await this.createBackgroundImage(block, blockContent));
                children.push({
                    id: `overlay-${block.id}`,
                    type: "figure",
                    x: 0, y: 0, width: 1920, height: 1080,
                    fill: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
                    subType: "rect"
                });
            } else if (isHero) {
                // Hero Slide: Use Brand Color or Deep Theme Color
                // If it's dark mode, maybe use the Brand Color for pop. If light mode, use Brand Color too.
                children.push({
                    id: `bg-${block.id}`,
                    type: "figure",
                    x: 0, y: 0, width: 1920, height: 1080,
                    fill: brandColor, // Consistent "Statement" Background
                    subType: "rect"
                });

                // Add decorative element
                children.push({
                    id: `deco-blob-${block.id}`,
                    type: "figure",
                    x: -200, y: -200, width: 1200, height: 1200,
                    fill: secondaryColor,
                    subType: "circle",
                    opacity: 0.3
                });
            } else {
                // Standard Content Slide: ALWAYS use the Theme Background
                children.push({
                    id: `bg-${block.id}`,
                    type: "figure",
                    x: 0, y: 0, width: 1920, height: 1080,
                    fill: themeBg,
                    subType: "rect"
                });

                // Minimal accent for consistency
                if (!isDarkMode) {
                    children.push({
                        id: `top-bar-${block.id}`,
                        type: "figure",
                        x: 0, y: 0, width: 1920, height: 20,
                        fill: brandColor,
                        subType: "rect"
                    });
                }
            }

            // --- 2. Advanced Layout Engine ---
            // --- 2. Advanced Layout Engine ---
            const layoutStrategy = this.getLayoutStrategyV2(block.layoutType);

            // Layout State
            let currentY = layoutStrategy.startY;
            let currentCol2Y = layoutStrategy.startY; // For split column right side

            for (const comp of block.components) {
                let content = blockContent?.content[comp.id];

                if (!content) {
                    // Smart Fallback to prevent "Lorem Ipsum"
                    if (comp.role === 'image') {
                        content = block.title + " high quality professional photography";
                    } else if (comp.role === 'title') {
                        content = block.title || "Key Insight";
                    } else if (comp.role === 'subtitle') {
                        content = "Strategic overview of " + (block.title || "this section");
                    } else if (comp.role === 'body') {
                        content = `Comprehensive analysis of ${block.title}. Highlighting key metrics, growth opportunities, and strategic advantages in the current market landscape.`;
                    } else if (comp.role === 'stat') {
                        content = "95%";
                    } else {
                        content = "Details pending...";
                    }
                }

                // get base position from strategy
                const basePos = layoutStrategy.getPos(comp.role, block.components.indexOf(comp));

                // Override Y with dynamic cursor
                // If it's a split layout, we track two cursors
                let x = basePos.x;
                let y = basePos.y;
                let width = basePos.width;

                const isRightColumn = x > 900;
                if (layoutStrategy.type === 'split') {
                    y = isRightColumn ? currentCol2Y : currentY;
                } else if (layoutStrategy.type === 'grid') {
                    // Grid uses fixed positions, assume generous spacing or standard items
                    y = basePos.y;
                } else {
                    y = currentY;
                }

                // Style logic
                // If we are on an Image or Hero (Brand Color), we usually want white text on dark/strong backgrounds.
                // If we are on Standard, we follow the Theme.
                const isStrongBg = isImage || isHero;
                const isDarkThemeBg = isDarkMode; // Standard slide background is dark

                // Determine effective background darkness for text contrast
                const useLightText = isStrongBg || isDarkThemeBg;

                const textColor = useLightText ? "#FFFFFF" : (darkColor || "#000000");
                const subTextColor = useLightText ? "#E0E0E0" : "#555555";

                let elementHeight = 0;

                if (comp.role === 'title') {
                    elementHeight = this.estimateTextHeight(content, 80, width);
                    children.push({
                        id: comp.id,
                        type: "text",
                        x: x,
                        y: y,
                        width: width,
                        fontSize: 80,
                        fontFamily: fonts.heading,
                        text: content,
                        fill: textColor,
                        align: basePos.align,
                        fontWeight: "bold"
                    });
                } else if (comp.role === 'subtitle') {
                    elementHeight = this.estimateTextHeight(content, 40, width);
                    children.push({
                        id: comp.id,
                        type: "text",
                        x: x,
                        y: y,
                        width: width,
                        fontSize: 40,
                        fontFamily: fonts.body,
                        text: content,
                        fill: subTextColor,
                        align: basePos.align
                    });
                } else if (comp.role === 'body') {
                    elementHeight = this.estimateTextHeight(content, 32, width);

                    // Add a "Card" background only if on a complex background (Image) to ensure readability
                    if (isImage) {
                        children.push({
                            id: `card-${comp.id}`,
                            type: "figure",
                            x: x - 40,
                            y: y - 30,
                            width: width + 80,
                            height: elementHeight + 60,
                            fill: "rgba(0,0,0,0.5)", // Dark semi-transparent card for readability
                            subType: "rect",
                            rx: 20
                        });
                    }

                    children.push({
                        id: comp.id,
                        type: "text",
                        x: x,
                        y: y,
                        width: width,
                        fontSize: 32,
                        fontFamily: fonts.body,
                        text: content,
                        fill: textColor, // Ensure high contrast
                        align: basePos.align
                    });
                } else if (comp.role === 'chart') {
                    const chartUrl = await this.generateChartUrl(content);

                    if (chartUrl) {
                        elementHeight = 500;
                        children.push({
                            id: comp.id,
                            type: "image",
                            x: x,
                            y: y,
                            width: width,
                            height: elementHeight,
                            src: chartUrl,
                        });
                    } else if (!content.trim().startsWith('{')) {
                        // Fallback: Text Insight (only if not raw JSON)
                        elementHeight = 100;
                        children.push({
                            id: comp.id,
                            type: "text",
                            x: x,
                            y: y,
                            width: width,
                            fontSize: 32,
                            fontFamily: fonts.body,
                            text: content,
                            fill: textColor,
                            align: basePos.align,
                            fontStyle: "italic"
                        });
                    }
                } else if (comp.role === 'image') {
                    elementHeight = 500;
                    const imgUrl = await this.fetchUnsplashImage(content);
                    children.push({
                        id: comp.id,
                        type: "image",
                        x: x,
                        y: y,
                        width: width,
                        height: elementHeight,
                        src: imgUrl,
                    });
                } else if (comp.role === 'quote') {
                    elementHeight = this.estimateTextHeight(content, 60, width);
                    children.push({
                        id: comp.id,
                        type: "text",
                        x: x, y: y, width: width,
                        fontSize: 60,
                        fontFamily: fonts.heading,
                        text: `"${content}"`,
                        fill: textColor,
                        align: 'center',
                        fontStyle: 'italic'
                    });
                } else if (comp.role === 'stat') {
                    elementHeight = this.estimateTextHeight(content, 120, width);
                    children.push({
                        id: comp.id,
                        type: "text",
                        x: x, y: y, width: width,
                        fontSize: 120,
                        fontFamily: fonts.heading,
                        text: content,
                        fill: colors[0],
                        align: 'center',
                        fontWeight: 'bold'
                    });
                } else {
                    // Catch-all: caption, label, header, etc.
                    elementHeight = this.estimateTextHeight(content, 24, width);
                    children.push({
                        id: comp.id,
                        type: "text",
                        x: x, y: y, width: width,
                        fontSize: 24,
                        fontFamily: fonts.body,
                        text: content,
                        fill: subTextColor,
                        align: basePos.align
                    });
                }

                // Increment Cursor with Padding
                const padding = 60;
                if (layoutStrategy.type === 'split') {
                    if (isRightColumn) currentCol2Y += elementHeight + padding;
                    else currentY += elementHeight + padding;
                } else if (layoutStrategy.type !== 'grid') {
                    currentY += elementHeight + padding;
                }
            }

            // --- 3. Decorative Elements (The "Premium" Touch) ---
            if (block.layoutType === 'two-column-asymmetric' || block.layoutType === 'minimal-center') {
                // Add a subtle accent line
                children.push({
                    id: `accent-line-${block.id}`,
                    type: "figure",
                    x: 100,
                    y: 80,
                    width: 200,
                    height: 10,
                    fill: colors[2] || "red",
                    subType: "rect"
                });
            }

            pages.push({
                id: block.id,
                background: "#000", /* Canvas background */
                children: children
            });
        }

        return {
            schemaVersion: 1,
            width: 1920,
            height: 1080,
            unit: "px",
            dpi: 72,
            pages: pages,
            fonts: [
                { fontFamily: fonts.heading },
                { fontFamily: fonts.body }
            ],
            audios: []
        };
    }

    // --- Helper Methods ---

    private estimateTextHeight(text: string, fontSize: number, width: number): number {
        if (!text) return 0;
        const charWidth = fontSize * 0.6;
        const charsPerLine = Math.floor(width / charWidth);
        const lines = Math.ceil(text.length / charsPerLine);
        return lines * (fontSize * 1.2);
    }

    private getLayoutStrategy(layoutType: string, components: any[]) {
        // Returns a function that calculates x, y, width, align based on role/index

        // 1. Full Bleed / Centered Hero
        if (layoutType.includes('full-bleed') || layoutType.includes('center') || layoutType.includes('hero')) {
            return (role: string, index: number) => {
                const baseX = 100;
                const width = 1720;
                let y = 300 + (index * 120);
                if (role === 'title') y = 400;
                if (role === 'subtitle') y = 520;

                return { x: baseX, y, width, align: 'center' };
            };
        }

        // 2. Split (Left Text, Right Visual)
        if (layoutType.includes('split') || layoutType.includes('two-column')) {
            return (role: string, index: number) => {
                // If it's text (title/body), put left. If image/chart, put right.
                const isVisual = role === 'image' || role === 'chart';

                if (!isVisual) {
                    return { x: 100, y: 150 + (index * 120), width: 800, align: 'left' };
                } else {
                    return { x: 1000, y: 200, width: 800, align: 'center' };
                }
            };
        }

        // 3. Grid / Feature (3 Columns)
        if (layoutType.includes('grid')) {
            return (role: string, index: number) => {
                if (role === 'title') return { x: 100, y: 100, width: 1720, align: 'center' };

                // Distribute rest in a grid
                const itemIndex = index - 1; // Assuming title is 0
                const col = itemIndex % 2;
                const row = Math.floor(itemIndex / 2);

                return {
                    x: 200 + (col * 800),
                    y: 300 + (row * 300),
                    width: 700,
                    align: 'left'
                };
            };
        }

        // Default Fallback
        return (role: string, index: number) => ({ x: 100, y: 100 + (index * 150), width: 1720, align: 'left' });
    }

    private getLayoutStrategyV2(layoutType: string) {
        if (layoutType.includes('full-bleed') || layoutType.includes('center') || layoutType.includes('hero') || layoutType.includes('minimal') || layoutType.includes('quote') || layoutType.includes('cta')) {
            return {
                type: 'center',
                startY: 400,
                getPos: (role: string, index: number) => {
                    const baseX = 100;
                    const width = 1720;
                    return { x: baseX, y: 0, width, align: 'center' };
                }
            };
        }

        if (layoutType.includes('split') || layoutType.includes('two-column')) {
            return {
                type: 'split',
                startY: 150,
                getPos: (role: string, index: number) => {
                    const isVisual = role === 'image' || role === 'chart';
                    if (!isVisual) {
                        return { x: 100, y: 0, width: 800, align: 'left' };
                    } else {
                        return { x: 1000, y: 0, width: 800, align: 'center' };
                    }
                }
            };
        }

        if (layoutType.includes('grid') || layoutType.includes('gallery') || layoutType.includes('feature')) {
            return {
                type: 'grid',
                startY: 100,
                getPos: (role: string, index: number) => {
                    if (role === 'title') return { x: 100, y: 100, width: 1720, align: 'center' };
                    const itemIndex = index - 1;
                    const col = itemIndex % 2;
                    const row = Math.floor(itemIndex / 2);
                    return {
                        x: 200 + (col * 800),
                        y: 300 + (row * 300),
                        width: 700,
                        align: 'left'
                    };
                }
            };
        }

        return {
            type: 'default',
            startY: 100,
            getPos: (role: string, index: number) => ({ x: 100, y: 0, width: 1720, align: 'left' })
        };
    }

    private async createBackgroundImage(block: any, blockContent: any) {
        let bgUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";
        const imgComp = block.components.find((c: any) => c.role === 'image');
        const query = imgComp ? blockContent?.content[imgComp.id] : block.title;
        bgUrl = await this.fetchUnsplashImage(query);

        return {
            id: `bg-${block.id}`,
            type: "image",
            x: 0, y: 0, width: 1920, height: 1080,
            src: bgUrl,
            opacity: 1
        };
    }

    private async fetchUnsplashImage(query: string) {
        const fallback = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";
        if (!process.env.UNSPLASH_ACCESS_KEY) return fallback;

        try {
            const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`, {
                headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
            });
            const data = await res.json();
            if (data.results && data.results[0]) {
                return data.results[0].urls.regular;
            }
        } catch (e) {
            console.error("Unsplash fetch failed", e);
        }
        return fallback;
    }

    private async generateChartUrl(content: string): Promise<string | null> {
        let chartConfig: any = null;

        try {
            if (content && typeof content === 'string') {
                // 1. Try JSON Parsing (New Format)
                if (content.trim().startsWith('{')) {
                    const parsed = JSON.parse(content);
                    if (parsed.labels && parsed.data) {
                        chartConfig = {
                            type: 'bar',
                            data: {
                                labels: parsed.labels,
                                datasets: [{
                                    label: parsed.datasetLabel || 'Data',
                                    data: parsed.data,
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                                }]
                            },
                            options: { plugins: { legend: { display: false } } }
                        };
                    }
                }
                // 2. Try Legacy Parsing "Label: Value"
                else if (content.includes(':')) {
                    const pairs = content.split(',').map(s => s.trim().split(':'));
                    const labels: string[] = [];
                    const data: number[] = [];

                    pairs.forEach(p => {
                        if (p.length === 2) {
                            labels.push(p[0].trim());
                            const num = parseFloat(p[1].replace(/[^0-9.-]/g, ''));
                            if (!isNaN(num)) data.push(num);
                        }
                    });

                    if (labels.length > 0 && data.length > 0) {
                        chartConfig = {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{ label: 'Data', data: data, backgroundColor: 'rgba(54, 162, 235, 0.5)' }]
                            },
                            options: { plugins: { legend: { display: false } } }
                        };
                    }
                }
            }
        } catch (e) {
            console.warn("Failed to generate dynamic chart", e);
        }

        if (!chartConfig) return null;

        return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
    }

    private async convertToTiptap(input: ContentResponse) {
        const contentNodes: any[] = [];

        for (const block of input.layout.blocks) {
            const blockContent = input.generatedContent.find(c => c.blockId === block.id);

            // Section Header
            contentNodes.push({
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: block.title }]
            });

            // Components
            for (const comp of block.components) {
                let text = blockContent?.content[comp.id];

                // Handle Images specifically
                if (comp.role === 'image') {
                    // Start async fetch
                    // The text here is the "prompt" for the image
                    const prompt = text || block.title;
                    const imageUrl = await this.fetchUnsplashImage(prompt);

                    contentNodes.push({
                        type: "image",
                        attrs: {
                            src: imageUrl,
                            alt: prompt,
                            title: prompt
                        }
                    });
                    continue;
                }

                if (!text) {
                    if (comp.role === 'body') {
                        console.warn(`[RenderingAgent] Missing content for body ${comp.id}, using fallback.`);
                        text = "Writing content..."; // Better placeholder for UI
                    } else {
                        continue;
                    }
                }

                // Premium Components
                else if (comp.role === 'quote') {
                    contentNodes.push({
                        type: "blockquote",
                        content: [{ type: "paragraph", content: [{ type: "text", text: text }] }]
                    });
                } else if (comp.role === 'callout') {
                    // Simulating a callout with a specialized blockquote or just bold text if no extension
                    // Ideally use a 'callout' node if available, else Blockquote with strong.
                    contentNodes.push({
                        type: "blockquote",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    { type: "text", text: "💡 PRO TIP: ", marks: [{ type: "bold" }] },
                                    { type: "text", text: text }
                                ]
                            }
                        ]
                    });
                } else if (comp.role === 'stat') {
                    // Render as a large centered heading
                    contentNodes.push({
                        type: "heading",
                        attrs: { level: 2, textAlign: 'center' }, // alignment might depend on editor
                        content: [{ type: "text", text: text }]
                    });
                } else if (comp.role === 'table') {
                    // Table Rendering
                    try {
                        let tableData = text;
                        // Attempt to parse if string
                        if (typeof text === 'string') {
                            try { tableData = JSON.parse(text); } catch (e) {
                                // Fallback for simple csv or raw text? 
                                console.warn("Failed to parse table data:", text);
                            }
                        }

                        // Tiptap expected structure: table > tableRow > tableHeader/tableCell
                        if (tableData && tableData.headers && tableData.rows) {
                            const tableRows: any[] = [];

                            // Headers
                            const headerCells = tableData.headers.map((h: string) => ({
                                type: "tableHeader",
                                content: [{ type: "paragraph", content: [{ type: "text", text: String(h) }] }]
                            }));
                            tableRows.push({ type: "tableRow", content: headerCells });

                            // Rows
                            tableData.rows.forEach((row: string[]) => {
                                const cells = row.map(cell => ({
                                    type: "tableCell",
                                    content: [{ type: "paragraph", content: [{ type: "text", text: String(cell) }] }]
                                }));
                                tableRows.push({ type: "tableRow", content: cells });
                            });

                            contentNodes.push({
                                type: "table",
                                content: tableRows
                            });
                        }
                    } catch (e) {
                        console.warn("Table rendering failed", e);
                    }
                }

                if (comp.role === 'title') {
                    contentNodes.push({
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: text }]
                    });
                } else if (comp.role === 'author') {
                    contentNodes.push({
                        type: "paragraph",
                        content: [{ type: "text", text: text, marks: [{ type: "italic" }] }]
                    });
                } else if (comp.role === 'subtitle') {
                    contentNodes.push({
                        type: "heading",
                        attrs: { level: 3 },
                        content: [{ type: "text", text: text }]
                    });
                } else if (comp.role === 'body') {
                    // Markdown Parsing Logic
                    // 1. Split by newlines allowing for empty lines to signal paragraph breaks
                    const lines = text.split('\n');

                    lines.forEach((line: string) => {
                        const trimmed = line.trim();
                        if (!trimmed) return;

                        // Check for Headers (###, ##, #)
                        // IMPORTANT: Tiptap doesn't like converting paragraphs to headings if they are mixed
                        if (trimmed.startsWith('#')) {
                            const level = trimmed.match(/^#+/)?.[0].length || 1;
                            const cleanText = trimmed.replace(/^#+\s*/, '');

                            // Adjust level: MD '##' -> Tiptap Level 2, etc.
                            // We start at level 3 for body headings to keep hierarchy below section titles
                            const tiptapLevel = Math.min(Math.max(level + 1, 3), 5); // Shift +1, so # -> H3

                            contentNodes.push({
                                type: "heading",
                                attrs: { level: tiptapLevel },
                                content: [{ type: "text", text: cleanText }]
                            });
                        }
                        // Basic Paragraph
                        else {
                            // Check for Bold (**text**) - Simple implementation
                            const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                            const paragraphContent: any[] = [];

                            parts.forEach(part => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    paragraphContent.push({
                                        type: "text",
                                        text: part.slice(2, -2),
                                        marks: [{ type: "bold" }]
                                    });
                                } else if (part) {
                                    paragraphContent.push({
                                        type: "text",
                                        text: part
                                    });
                                }
                            });

                            if (paragraphContent.length > 0) {
                                contentNodes.push({
                                    type: "paragraph",
                                    content: paragraphContent
                                });
                            }
                        }
                    });
                }
            }

            // Add a horizontal rule between sections
            contentNodes.push({ type: "horizontalRule" });
        }

        return {
            type: "doc",
            content: contentNodes
        };
    }

    private convertToUniver(input: ContentResponse) {
        // Check for direct workbook injection (Advanced Generation from ContentAgent)
        // This allows ContentAgent to generate the FULL complex JSON structure (styles, sheets, formulas)
        // instead of us trying to piece it together from blocks.
        const firstBlock = input.generatedContent[0];
        if (firstBlock && firstBlock.content && firstBlock.content['workbook']) {
            const wb = firstBlock.content['workbook'];
            return typeof wb === 'string' ? JSON.parse(wb) : wb;
        }

        // Fallback: Create a basic Univer Snapshot structure from blocks
        // This is a simplified version; Univer's spec is very complex.
        const styles: any = {};
        const sheets: any = {};

        input.layout.blocks.forEach((block, index) => {
            const blockContent = input.generatedContent.find(c => c.blockId === block.id);
            const sheetId = `sheet-${index}`;
            const cellData: any = {};

            // We assume mapped components are Columns for a spreadsheet layout
            // Unless one component IS the whole table. 
            // Let's implement a logical flow where if content is an array, we spread it down rows.

            let currentRow = 0;

            // 1. Headers (Component Roles/Titles)
            cellData[currentRow] = {};
            block.components.forEach((comp, colIndex) => {
                cellData[currentRow][colIndex] = {
                    v: comp.role === 'table' ? (blockContent?.content[comp.id]?.title || "Table") : comp.role.toUpperCase(),
                    t: 1,
                    s: { key: 'headerStyle' } // Placeholder for style
                };
            });
            currentRow++;

            // 2. Data Population
            // Check if any component has Array data (e.g. a Table component)
            const tableComp = block.components.find(c => c.role === 'table');

            if (tableComp) {
                const tableData = blockContent?.content[tableComp.id];
                // Expecting tableData to be [{ col1: val, col2: val }, ...] or [[val, val], ...]
                if (Array.isArray(tableData)) {
                    tableData.forEach((rowItem: any) => {
                        cellData[currentRow] = {};
                        // If rowItem is object, map to columns? Or just dump values?
                        // Simple dump for robustness:
                        const values = typeof rowItem === 'object' ? Object.values(rowItem) : [rowItem];
                        values.forEach((v: any, cIdx) => {
                            cellData[currentRow][cIdx] = { v: String(v), t: typeof v === 'number' ? 2 : 1 };
                        });
                        currentRow++;
                    });
                }
            } else {
                // Standard Key-Value Vertical List 
                cellData[currentRow] = {};
                block.components.forEach((comp, colIndex) => {
                    const val = blockContent?.content[comp.id] || "";
                    cellData[currentRow][colIndex] = {
                        v: val,
                        t: typeof val === 'number' ? 2 : 1
                    };
                });
            }

            sheets[sheetId] = {
                id: sheetId,
                name: block.title,
                rowCount: Math.max(100, currentRow + 20),
                columnCount: 20,
                cellData: cellData
            };
        });

        return {
            id: input.jobId,
            appVersion: "3.0.0",
            sheets: sheets,
            locale: "en_US",
            styles: styles,
            resources: []
        };
    }
    private isDarkColor(hex: string): boolean {
        if (!hex || !hex.startsWith('#')) return false;
        const c = hex.substring(1);
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma < 100; // Slightly stricter than 128 to prefer dark text on mid-tones
    }
}
