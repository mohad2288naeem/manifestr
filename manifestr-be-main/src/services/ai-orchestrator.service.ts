import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { AppDataSource } from "../lib/data-source"; // Adjust path if needed
import { GenerationJob, GenerationStatus } from "../models/GenerationJob";
import { UserPrompt } from "../agents/protocols/types";
import { User } from "../models/User";
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
    async startGeneration(userId: string, promptData: Partial<UserPrompt>): Promise<GenerationJob> {
        const jobRepo = AppDataSource.getRepository(GenerationJob);

        // 1. Create Job Entry
        const job = jobRepo.create({
            userId: userId,
            prompt: promptData.prompt!,
            output_type: promptData.output as any,
            status: GenerationStatus.QUEUED,
            tokens_used: 0,
        });

        // 2. Generate Metadata (Title & Cover) - Run in parallel
        try {
            const [title, coverImage] = await Promise.all([
                this.generateTitle(promptData.prompt!),
                fetchUnsplashImage(promptData.prompt!)
            ]);
            job.title = title;
            job.cover_image = coverImage;
        } catch (error) {
            console.error("Error generating metadata:", error);
            // Fallbacks
            job.title = "New Generation";
        }

        await jobRepo.save(job);

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

        try {
            await this.sqsClient.send(new SendMessageCommand({
                QueueUrl: process.env.SQS_QUEUE_INTENT_URL!,
                MessageBody: JSON.stringify({ jobId: job.id }),
                MessageGroupId: job.id, // Required for FIFO queues - ensures ordering per job
                MessageDeduplicationId: `${job.id}-${Date.now()}`, // Unique per message
            }));

            // Update status to confirm it's in queue (though QUEUED is default)
            console.log(`[Orchestrator] Job ${job.id} pushed to Intent Queue`);

        } catch (e) {
            console.error("Failed to push to SQS:", e);
            job.status = GenerationStatus.FAILED;
            job.error_message = "Failed to queue job: " + (e as Error).message;
            await jobRepo.save(job);
            throw e;
        }

        return job;
    }

    async getJobStatus(jobId: string, userId: string) {
        const jobRepo = AppDataSource.getRepository(GenerationJob);
        // Ensure user owns the job
        if (userId === 'anon') {
            return jobRepo.findOne({ where: { id: jobId } });
        }

        return jobRepo.findOne({ where: { id: jobId, userId: userId } });
    }

    async getUserJobs(userId: string) {
        const jobRepo = AppDataSource.getRepository(GenerationJob);
        return jobRepo.find({
            where: { userId: userId },
            order: { created_at: "DESC" }
        });
    }

    async getRecentJobs(userId: string, limit: number = 3) {
        const jobRepo = AppDataSource.getRepository(GenerationJob);
        return jobRepo.find({
            where: { userId: userId },
            order: { created_at: "DESC" },
            take: limit
        });
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
