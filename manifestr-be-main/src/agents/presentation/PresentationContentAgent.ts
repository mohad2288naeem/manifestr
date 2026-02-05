import { BaseAgent } from "../core/BaseAgent";
import { GenerationJob, GenerationStatus } from "../../models/GenerationJob";
import { LayoutResponse, ContentResponse, ContentGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/openai";
import { z } from "zod";

export class PresentationContentAgent extends BaseAgent<LayoutResponse, ContentResponse> {

  getProcessingStatus(): GenerationStatus {
    return GenerationStatus.PROCESSING_CONTENT;
  }

  extractInput(job: GenerationJob): LayoutResponse {
    return job.current_step_data as LayoutResponse;
  }

  async process(input: LayoutResponse, job: GenerationJob): Promise<ContentResponse> {
    if (!input || !input.blocks) {
      throw new Error("Invalid Input: LayoutResponse is missing 'blocks'. Ensure LayoutAgent completed successfully.");
    }
    console.log("Presentation Content Agent Generating Text for:", input.blocks.length, "blocks");

    const systemPrompt = `
      You are an expert STRATEGIC COMMUNICATOR and GHOSTWRITER for Fortune 500 Executives (McKinsey, Apple, TED).
      Your mission: Populate the presentation structure with DEEP, INSIGHTFUL, and HIGH-IMPACT content.

      ### CRITICAL QUALITY STANDARDS (PREMIUM TIER):
      1. **SUBSTANCE OVER STYLE**: While it must be punchy, it MUST have depth. Do not write generic marketing fluff.
      2. **NO "LOREM IPSUM" or "TEXT GOES HERE"**: INVENT specific, plausible, high-quality data and names if missing.
      3. **EXPLAIN "WHY" and "HOW"**: Don't just state facts. State implications.
      4. **AUTHORITATIVE TONE**: Confident, Sophisticated, World-Class. ${input.intent.metadata.tone || 'Professional'}.
      5. **DATA-BACKED**: Use precise numbers, percentages, and dollar amounts.

      ### 1. CONTENT PRINCIPLES
      
      **Voice**:
      - Intellectual yet accessible.
      - Use active voice. "We achieved X" not "X was achieved".
      - **Rule**: Every slide must have a clear "Takeaway".

      **Examples of UPGRADE**:
      - ❌ WEAK: "We are growing fast."
      - ✅ PREMIUM: "Accelerating trajectory: 220% YoY growth driven by Enterprise adoption."

      - ❌ WEAK: "Our team is great."
      - ✅ PREMIUM: "Led by industry veterans from Google, SpaceX, and Stripe with 40+ combined years of domain expertise."

      ### 2. DATA & VISUALS GENERATION (MANDATORY)
      
      **For "chart" components**:
      - RETURN VALID JSON STRING.
      - Data must be REALISTIC and tell a STORY (e.g. J-curve, steady growth, comparative advantage).
      - Example: "{\\"labels\\": [\\"2021\\", \\"2022\\", \\"2023\\", \\"2024\\"], \\"data\\": [10, 25, 60, 140], \\"datasetLabel\\": \\"Active Users (M)\\"}"
      
      **For "table" components**:
      - Return a JSON string representing a comparison or financial model.
      - Example: "{\\"headers\\": [\\"Metric\\", \\"Q1\\", \\"Q2\\"], \\"rows\\": [[\\"Revenue\\", \\"$2.5M\\", \\"$3.1M\\"], [\\"CAC\\", \\"$120\\", \\"$95\\"]]}"

      **For "image" components**:
      - Write "Editorial" style prompts. Cinematic, 4K, Architectural, Minimalist. 
      - Avoid "people shaking hands". Prefer "Abstract connections," "Futuristic cityscape," "Clean workspace key light".

      ### 3. COMPONENT INSTRUCTIONS
      
      **For "title" components**:
      - Strong, Action-Oriented Headlines.
      - BAD: "Introduction"
      - GOOD: "The Market Opportunity is $50B+"
      
      **For "subtitle" components**:
      - A cohesive thesis statement for the slide. 1-2 powerful sentences.
      
      **For "body" components**:
      - **Structure**: Use short paragraphs or clear statements.
      - If appropriate, use bullet points (Unicode: •).
      - **Do NOT use Markdown** (**, *, #) as it is not supported. Use CAPS for emphasis if needed.
      - Focus on **Insights**, **Metrics**, and **Proofs**.
      - Max length: ~300-400 characters, but EXPERTLY crafted. No wasted words.
      
      **For "quote" components**:
      - Use REAL quotes from relevant industry leaders or historical figures if applicable to the topic.
      - Or generate a "Customer Testimonial" that sounds authentic.
      
      **For "stat" components**:
      - BIG NUMBER + Specific Label.
      - "98.5% | Customer Retention Rate"

      ### 4. ID MATCHING (CRITICAL)
      - Map content EXACTLY to the component IDs in \`input.blocks\`.
      - Missing IDs = Broken Presentation.

      ### 5. CONTEXT
      - Goal: ${input.intent.metadata.goal}
      - Audience: ${input.intent.metadata.audience}
      
      ### 6. OUTPUT FORMAT
      Return valid JSON matching \`ContentGenerationSchema\`.
        `;

    const generatedData = await generateJSON<z.infer<typeof ContentGenerationSchema>>(
      ContentGenerationSchema,
      systemPrompt,
      JSON.stringify(input.blocks)
    );

    const response: ContentResponse = {
      jobId: input.jobId,
      layout: input,
      ...generatedData
    };

    return response;
  }
}
