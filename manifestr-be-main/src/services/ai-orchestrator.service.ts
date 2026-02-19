import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import SupabaseDB from "../lib/supabase-db";
import { UserPrompt } from "../agents/protocols/types";
import OpenAI from "openai";
import { fetchUnsplashImage } from "../utils/image.util";

export class AIOrchestrator {
    private sqsClient: SQSClient;
    private openai: OpenAI;

    constructor() {
        this.sqsClient = new SQSClient({ region: process.env.AWS_REGION });
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    /**
     * Starts the generation process
     */
    async startGeneration(userId: string, promptData: Partial<UserPrompt>): Promise<any> {
        // 1. Generate metadata first
        let title = "New Generation";
        let coverImage = null;

        try {
            [title, coverImage] = await Promise.all([
                this.generateTitle(promptData.prompt!),
                fetchUnsplashImage(promptData.prompt!)
            ]);
        } catch (error) {
            console.error("Error generating metadata:", error);
        }

        // 2. Create Job Entry using Supabase
        const job = await SupabaseDB.createGenerationJob(userId, {
            type: promptData.output as string,
            input_data: {
                prompt: promptData.prompt,
                style_guide_id: promptData.style_guide_id,
                output: promptData.output,
                meta: promptData.meta,
                title,
                cover_image: coverImage
            },
            status: 'queued'
        });

        // 2. Push to First Queue (Intent)
        // Construct the payload for the first agent
        const payload: UserPrompt = {
            prompt: promptData.prompt!,
            style_guide_id: promptData.style_guide_id,
            output: promptData.output,
            meta: promptData.meta,
            userId: userId,
            jobId: job.id,
        };

        // 3. Push to SQS Queue (Optional - graceful fallback if AWS not configured)
        const useAWS = process.env.USE_AWS_SQS === 'true';

        if (useAWS && process.env.SQS_QUEUE_INTENT_URL && process.env.AWS_ACCESS_KEY_ID) {
            try {
                await this.sqsClient.send(new SendMessageCommand({
                    QueueUrl: process.env.SQS_QUEUE_INTENT_URL!,
                    MessageBody: JSON.stringify({ jobId: job.id }),
                    MessageGroupId: job.id,
                    MessageDeduplicationId: `${job.id}-${Date.now()}`,
                }));

                console.log(`✅ [Orchestrator] Job ${job.id} pushed to AWS SQS Intent Queue`);

            } catch (e: any) {
                console.error("❌ Failed to push to SQS:", e.message);

                // Update job status to failed but don't crash
                await SupabaseDB.updateGenerationJob(job.id, userId, {
                    status: 'failed',
                    error: `AWS SQS Error: ${e.message}. Check AWS credentials in .env`
                });

                console.warn(`⚠️  Job ${job.id} failed to queue - check AWS credentials`);
            }
        } else {
            console.log(`ℹ️  AWS SQS disabled - Job ${job.id} created but not queued`);
            console.log(`ℹ️  Set USE_AWS_SQS=true in .env to enable background processing`);
        }

        return job;
    }

    async getJobStatus(jobId: string, userId: string) {
        // Get job using Supabase
        return await SupabaseDB.getGenerationJobById(jobId, userId);
    }

    async getUserJobs(userId: string) {
        // Get all user jobs using Supabase
        return await SupabaseDB.getUserGenerationJobs(userId);
    }

    async getRecentJobs(userId: string, limit: number = 3) {
        // Get recent jobs using Supabase
        const jobs = await SupabaseDB.getUserGenerationJobs(userId);
        return jobs.slice(0, limit);
    }

    private async generateTitle(prompt: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "Generate a concise 3-4 word title for this user request. No quotes. Do not use 'Presentation for' or 'Guide for' prefixes unless necessary, just the topic." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 15,
                temperature: 0.7
            });
            return response.choices[0].message.content?.replace(/^"|"$/g, '').trim() || "New Generation";
        } catch (e) {
            console.error("Failed to generate title", e);
            return "New Generation";
        }
    }
}
