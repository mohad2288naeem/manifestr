import { BaseAgent } from "../core/BaseAgent";
import { GenerationJob, GenerationStatus } from "../../models/GenerationJob";
import { IntentResponse, IntentResponseSchema, UserPrompt } from "../protocols/types";
import { generateJSON } from "../../lib/openai";

export class IntentAgent extends BaseAgent<UserPrompt, IntentResponse> {
    private layoutQueues: Record<string, string>;

    constructor(intentQueueUrl: string, layoutQueues: Record<string, string>) {
        super(intentQueueUrl);
        this.layoutQueues = layoutQueues;
    }

    protected getNextQueueUrl(job: GenerationJob, output: IntentResponse): string | undefined {
        const format = output.metadata.outputFormat || 'presentation';
        const queue = this.layoutQueues[format];
        if (!queue) {
            console.warn(`No layout queue found for format: ${format}. Defaulting to presentation.`);
            return this.layoutQueues['presentation'];
        }
        return queue;
    }

    getProcessingStatus(): GenerationStatus {
        return GenerationStatus.PROCESSING_INTENT;
    }

    extractInput(job: GenerationJob): UserPrompt {
        return {
            prompt: job.prompt,
            userId: job.userId,
            jobId: job.id,
            output: job.output_type as any, // Cast from DB enum
            meta: job.meta,
        };
    }

    async process(input: UserPrompt, job: GenerationJob): Promise<IntentResponse> {
        console.log("Intent Agent Processing:", input.prompt);

        const systemPrompt = `
      You are a STRATEGIC CREATIVE DIRECTOR at a world-class agency (Ogilvy/Pentagram/IDEO).
      Your mission: Transform the user's request into a COMPREHENSIVE, STRATEGIC creative brief for a premium presentation.

      ### USER METADATA (CRITICAL CONTEXT)
      This is extra data provided by the user. PRIORITIZE this over generic inference.
      ${JSON.stringify(input.meta || {}, null, 2)}

      ### CRITICAL REQUIREMENTS (UPDATED):
      1. **SLIDE COUNT**: STRICTLY generate between **10 to 20 slides**.
         - Less than 10 is FAILURE. 
         - A standard request should default to **12-15 slides**.
      2. **COMPREHENSIVE COVERAGE**: Every topic must be broken down. Do not compress complex topics into one slide.
      3. **STRATEGIC NARRATIVE**: Build a complete story: Problem -> Agitation -> Solution -> Evidence -> Action.

      ### 1. DEEP AUDIENCE & CONTEXT ANALYSIS
      - **Audience Psychology**: Who are we REALLY talking to? What keeps them up at night?
        * Example: "Investors" → Need: ROI proof, risk mitigation, market validation, competitive moats
      - **Tone Calibration**: Match the exact emotional register needed.
      - **Goal Precision**: What specific action should the audience take after viewing?

      ### 2. COMPREHENSIVE STRUCTURE PLANNING
      Create a DETAILED narrative arc with 10-20 items.

      **Universal Structure (Adapt but keep length):**
      1.  **Title & Hook**: The Big Idea (1 Slide)
      2.  **Executive Summary**: The "Too Long; Didn't Read" (1 Slide)
      3.  **The Problem/Context**: Current state, pain points, market gaps (2-3 Slides)
      4.  **The Solution/Product**: How it works, key features, magic moment (3-4 Slides)
      5.  **Market & Validation**: Size, trends, testimonials, metrics (2-3 Slides)
      6.  **Business/Strategy**: Revenue, go-to-market, timeline (2-3 Slides)
      7.  **Team & Vision**: Why us, where we are going (1-2 Slides)
      8.  **The Ask/Conclusion**: Clear next steps (1 Slide)
      
      *Total: ~13-18 slides*

      ### 3. SECTION NAMING EXCELLENCE
      - Use COMPELLING, SPECIFIC titles (not generic labels)
      - Bad: "Introduction", "Overview", "Conclusion"
      - Good: "The $10B Problem Nobody's Solving", "Why Traditional Solutions Fail", "Our Unfair Advantage"

      ### 5. OUTPUT FORMAT
      Return valid JSON matching \`IntentResponseSchema\`. ensure structurePlan has 10-20 items.
      {
        "styleGuide": null,
        "jobId": "${input.jobId}",
        "originalPrompt": "${input.prompt}",
        "title": "Project Title",
        "metadata": {
          "type": "Presentation",
          "tone": "Professional",
          "goal": "Persuade",
          "audience": "Stakeholders",
          "depth": "Deep",
          "scope": "Comprehensive",
          "size": "Medium-Large (10-20 slides)",
          "outputFormat": "presentation"
        },
        "designPreferences": { ... },
        "structurePlan": [
           "1. The New Reality: Market Shift",
           "2. Why Existing Tools Fail",
           ... (at least 10 items) ...
        ]
      }

      **REMEMBER**: You MUST generate at least 10 slides. Depth is key.
    `;

        // In a real app, use the Zod Schema to validate specifically, or use LangChain structured output
        const response = await generateJSON<IntentResponse>(IntentResponseSchema, systemPrompt, input.prompt);

        // Fallback if AI forgot outputFormat but we knew it from input
        if (input.output && response.metadata.outputFormat !== input.output) {
            response.metadata.outputFormat = input.output;
        }

        return response;
    }
}
