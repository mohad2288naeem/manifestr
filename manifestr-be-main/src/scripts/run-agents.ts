import "dotenv/config";
import { IntentAgent } from "../agents/intent/IntentAgent";
import { PresentationLayoutAgent } from "../agents/presentation/PresentationLayoutAgent";
import { DocumentLayoutAgent } from "../agents/document/DocumentLayoutAgent";
import { SpreadsheetLayoutAgent } from "../agents/spreadsheet/SpreadsheetLayoutAgent";
import { PresentationContentAgent } from "../agents/presentation/PresentationContentAgent";
import { DocumentContentAgent } from "../agents/document/DocumentContentAgent";
import { SpreadsheetContentAgent } from "../agents/spreadsheet/SpreadsheetContentAgent";
import { RenderingAgent } from "../agents/rendering/RenderingAgent";

async function main() {
    // 1. Check environment
    if (!process.env.SQS_QUEUE_INTENT_URL) {
        console.error("Missing SQS_QUEUE_* environment variables. Please check .env");
        process.exit(1);
    }

    console.log("✅ Starting Agents with Supabase (no TypeORM)...");

    const renderQueue = process.env.SQS_QUEUE_RENDER_URL!;

    // 2. Initialize Agents

    // Intent Agent (The Router)
    const intentAgent = new IntentAgent(
        process.env.SQS_QUEUE_INTENT_URL!,
        {
            'presentation': process.env.SQS_QUEUE_LAYOUT_PRESENTATION_URL!,
            'document': process.env.SQS_QUEUE_LAYOUT_DOCUMENT_URL!,
            'spreadsheet': process.env.SQS_QUEUE_LAYOUT_SPREADSHEET_URL!
        }
    );

    // Layout Agents
    const presLayout = new PresentationLayoutAgent(
        process.env.SQS_QUEUE_LAYOUT_PRESENTATION_URL!,
        process.env.SQS_QUEUE_CONTENT_PRESENTATION_URL!
    );

    const docLayout = new DocumentLayoutAgent(
        process.env.SQS_QUEUE_LAYOUT_DOCUMENT_URL!,
        process.env.SQS_QUEUE_CONTENT_DOCUMENT_URL!
    );

    const sheetLayout = new SpreadsheetLayoutAgent(
        process.env.SQS_QUEUE_LAYOUT_SPREADSHEET_URL!,
        process.env.SQS_QUEUE_CONTENT_SPREADSHEET_URL!
    );

    // Content Agents (All point to Render Queue)
    const presContent = new PresentationContentAgent(
        process.env.SQS_QUEUE_CONTENT_PRESENTATION_URL!,
        renderQueue
    );

    const docContent = new DocumentContentAgent(
        process.env.SQS_QUEUE_CONTENT_DOCUMENT_URL!,
        renderQueue
    );

    const sheetContent = new SpreadsheetContentAgent(
        process.env.SQS_QUEUE_CONTENT_SPREADSHEET_URL!,
        renderQueue
    );

    // Rendering Agent (Shared)
    const renderingAgent = new RenderingAgent(
        renderQueue,
        undefined // Last step
    );

    // 3. Start Polling
    Promise.all([
        intentAgent.start(),
        presLayout.start(),
        docLayout.start(),
        sheetLayout.start(),
        presContent.start(),
        docContent.start(),
        sheetContent.start(),
        renderingAgent.start()
    ]);

    console.log("All Branching Agents are running and listening to queues.");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
