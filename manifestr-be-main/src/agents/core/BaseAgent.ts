import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import SupabaseDB from "../../lib/supabase-db";
import { ZodSchema } from "zod";

export abstract class BaseAgent<TInput, TOutput> {
    protected sqsClient: SQSClient;
    protected queueUrl: string;
    protected nextQueueUrl?: string; // If this agent forwards to another agent

    constructor(queueUrl: string, nextQueueUrl?: string) {
        this.sqsClient = new SQSClient({ region: process.env.AWS_REGION });
        this.queueUrl = queueUrl;
        this.nextQueueUrl = nextQueueUrl;
    }

    /**
     * Start polling the queue for messages
     */
    async start() {
        console.log(`[${this.constructor.name}] Starting listener on ${this.queueUrl}`);

        // In a real lambda, this loop isn't needed (AWS invokes it). 
        // For local dev "worker" mode, we poll.
        while (true) {
            try {
                const command = new ReceiveMessageCommand({
                    QueueUrl: this.queueUrl,
                    MaxNumberOfMessages: 1,
                    WaitTimeSeconds: 10, // Long polling
                    VisibilityTimeout: 300, // 5 minutes - enough time for OpenAI calls
                    AttributeNames: ["All"],
                });

                const response = await this.sqsClient.send(command);

                if (response.Messages && response.Messages.length > 0) {
                    for (const message of response.Messages) {
                        await this.handleMessage(message);
                    }
                }
            } catch (error) {
                console.error(`[${this.constructor.name}] Error polling queue:`, error);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Backoff
            }
        }
    }

    private async handleMessage(message: any) {
        console.log(`[${this.constructor.name}] Received message:`, message.Body);

        let jobId: string;
        try {
            const body = JSON.parse(message.Body);
            jobId = body.jobId;
        } catch (e) {
            console.error(`[${this.constructor.name}] Failed to parse message body`, e);
            // If we can't parse it, we delete it to avoid poison pills? Or DLQ? 
            // For now, simple console log.
            return;
        }

        // 1. Fetch Job using Supabase
        let job = await SupabaseDB.getGenerationJobById(jobId, 'system');

        if (!job) {
            console.error(`[${this.constructor.name}] Job ${jobId} not found in DB`);
            await this.deleteMessage(message.ReceiptHandle);
            return;
        }

        try {
            // 2. Update Status to processing
            const processingStatus = this.getProcessingStatus();
            job = await SupabaseDB.updateGenerationJob(jobId, job.user_id, {
                status: processingStatus
            });

            // 3. Process
            // We expect the previous step's data to be in `job.current_step_data`
            // Or if this is the first step (Intent), it uses `job.prompt`.
            const input = this.extractInput(job);
            const output = await this.process(input, job);

            // 4. Save Output to job
            const updateData: any = {
                result: output,
                progress: this.nextQueueUrl ? 50 : 100
            };

            if ((output as any).title) {
                updateData.title = (output as any).title;
            }

            // If there is a next queue, we are not done
            if (this.nextQueueUrl) {
                // Keep current status, just save output
            } else {
                // Final step - mark as completed
                updateData.status = 'completed';
                await this.onJobCompleted(job);
            }

            job = await SupabaseDB.updateGenerationJob(jobId, job.user_id, updateData);

            // 5. Trigger Next Agent
            const nextQueue = this.getNextQueueUrl(job, output);
            if (nextQueue) {
                await this.sqsClient.send(new SendMessageCommand({
                    QueueUrl: nextQueue,
                    MessageBody: JSON.stringify({ jobId: job.id }),
                    MessageGroupId: job.id, // Required for FIFO queues - ensures ordering per job
                    MessageDeduplicationId: `${job.id}-${Date.now()}`, // Unique per message
                }));
            }

            // 6. Delete Message
            await this.deleteMessage(message.ReceiptHandle);
            console.log(`[${this.constructor.name}] Job ${jobId} processed successfully.`);

        } catch (error) {
            console.error(`[${this.constructor.name}] Error processing job ${jobId}:`, error);

            // Update job to failed status
            await SupabaseDB.updateGenerationJob(jobId, job.user_id, {
                status: 'failed',
                error: (error as Error).message
            });

            // Delete message to prevent infinite retries
            await this.deleteMessage(message.ReceiptHandle);
        }
    }

    private async deleteMessage(receiptHandle: string) {
        try {
            await this.sqsClient.send(new DeleteMessageCommand({
                QueueUrl: this.queueUrl,
                ReceiptHandle: receiptHandle
            }));
        } catch (e: any) {
            // Expired receipt handles are expected if processing took longer than VisibilityTimeout
            if (e.Code === 'InvalidParameterValue' && e.message?.includes('expired')) {
                console.log(`[${this.constructor.name}] Receipt handle expired (message already processed)`);
            } else {
                console.error(`[${this.constructor.name}] Failed to delete message:`, e.message);
            }
        }
    }

    // --- Abstract Methods ---

    /** Which status enum does this agent represent when working? */
    abstract getProcessingStatus(): string;

    /** Extract the correct input type from the job entity */
    abstract extractInput(job: any): TInput;

    /** The core logic */
    abstract process(input: TInput, jobContext: any): Promise<TOutput>;

    /**
     * Determine the next queue URL based on job state/output.
     * Defaults to the static nextQueueUrl.
     */
    protected getNextQueueUrl(job: any, output: TOutput): string | undefined {
        return this.nextQueueUrl;
    }

    /**
     * Optional hook to run when a job reaches the final state in this agent.
     */
    protected async onJobCompleted(job: any): Promise<void> {
        // Override in specific agents if needed
    }
}
