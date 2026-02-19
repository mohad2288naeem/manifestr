import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import OpenAI from 'openai';
import SupabaseDB from '../lib/supabase-db';
import { AIOrchestrator } from '../services/ai-orchestrator.service';
import { UserPromptSchema } from '../agents/protocols/types';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

export class AIController extends BaseController {
    public basePath = '/ai';
    private openai: OpenAI;
    private orchestrator: AIOrchestrator;

    constructor() {
        super();
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.orchestrator = new AIOrchestrator();
    }

    protected initializeRoutes(): void {
        this.routes = [
            // Old Motivation Quote Endpoint
            { verb: 'GET', path: '/motivation-quote', handler: this.getMotivationQuote },

            // New Agentic Endpoints (Protected)
            { verb: 'POST', path: '/generate', handler: this.startGeneration, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/status/:id', handler: this.getJobStatus, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/generations', handler: this.getUserGenerations, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/recent-generations', handler: this.getRecentGenerations, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/generation/:id', handler: this.getGenerationDetails, middlewares: [authenticateToken] },
        ];
    }

    /**
     * @swagger
     * /ai/generate:
     *   post:
     *     summary: Start a new AI document generation job
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [prompt]
     *             properties:
     *               prompt:
     *                 type: string
     *                 example: "A pitch deck for a Series A AI startup"
     *               output:
     *                 type: string
     *                 enum: [presentation, document, spreadsheet]
     *                 default: presentation
     *     responses:
     *       200:
     *         description: Job successfully queued
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 message: { type: string }
     *                 data:
     *                   type: object
     *                   properties:
     *                     jobId: { type: string, format: uuid }
     *                     status: { type: string }
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     */
    private startGeneration = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId; // Extracted from JWT by middleware

            const validation = UserPromptSchema.safeParse({
                ...req.body,
                userId: userId,
                jobId: uuidv4()
            });

            if (!validation.success) {
                return res.status(400).json({ status: "error", message: "Invalid Input", details: validation.error });
            }

            try {
                const job = await this.orchestrator.startGeneration(validation.data.userId, validation.data);

                return res.json({
                    status: "success",
                    message: "Generation Job Queued",
                    data: {
                        jobId: job.id,
                        status: job.status || 'queued'
                    }
                });
            } catch (awsError: any) {
                // If AWS fails, still return success but with warning
                console.error('AWS SQS Error:', awsError.message);
                return res.json({
                    status: "success",
                    message: "Job created (AWS SQS unavailable)",
                    data: {
                        jobId: validation.data.jobId,
                        status: 'pending',
                        warning: 'Job created but not queued for processing. Check AWS credentials.'
                    }
                });
            }

        } catch (error) {
            console.error('Error starting generation:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/status/{id}:
     *   get:
     *     summary: Get the status of a specific generation job
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The Job ID
     *     responses:
     *       200:
     *         description: Current job status
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: object
     *                   properties:
     *                     id: { type: string }
     *                     status: { type: string, enum: [QUEUED, PROCESSING_INTENT, PROCESSING_LAYOUT, PROCESSING_CONTENT, RENDERING, COMPLETED, FAILED] }
     *                     tokensUsed: { type: number }
     *                     errorMessage: { type: string, nullable: true }
     *       404:
     *         description: Job not found
     */
    private getJobStatus = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            const job = await this.orchestrator.getJobStatus(id, userId);

            if (!job) {
                return res.status(404).json({ status: "error", message: "Job not found" });
            }

            return res.json({
                status: "success",
                data: {
                    id: job.id,
                    status: job.status,
                    tokensUsed: job.tokens_used,
                    errorMessage: job.error_message
                }
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/generations:
     *   get:
     *     summary: List all generation jobs for the current user
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of jobs
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id: { type: string }
     *                       prompt: { type: string }
     *                       type: { type: string }
     *                       status: { type: string }
     *                       createdAt: { type: string, format: date-time }
     */
    private getUserGenerations = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            const jobs = await this.orchestrator.getUserJobs(userId);

            return res.json({
                status: "success",
                data: jobs.map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    prompt: j.prompt || j.input_data?.prompt,
                    type: j.type || j.output_type || j.input_data?.output || 'document',  // FIX: Use correct column!
                    status: j.status,
                    createdAt: j.created_at
                }))
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/recent-generations:
     *   get:
     *     summary: List the last 3 generation jobs
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of recent jobs
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id: { type: string }
     *                       title: { type: string }
     *                       coverImage: { type: string }
     *                       type: { type: string }
     *                       status: { type: string }
     *                       createdAt: { type: string, format: date-time }
     *                       prompt: { type: string }
     *                       errorMessage: { type: string }
     *                       tokensUsed: { type: number }
     *                       currentStepData: { type: object }
     *                       finalUrl: { type: string }
     */
    private getRecentGenerations = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const jobs = await this.orchestrator.getRecentJobs(userId, 3);

            return res.json({
                status: "success",
                data: jobs.map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    coverImage: j.cover_image || j.input_data?.cover_image,
                    type: j.type || j.output_type || j.input_data?.output || 'document',  // FIX: Use correct column!
                    status: j.status,
                    createdAt: j.created_at,
                    prompt: j.prompt || j.input_data?.prompt,
                    errorMessage: j.error_message || j.error,
                    tokensUsed: j.tokens_used || 0,
                    currentStepData: j.current_step_data,
                    finalUrl: j.final_url
                }))
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/generation/{id}:
     *   get:
     *     summary: Get full details of a completed generation
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Full job details including intermediate steps and final output
     *       404:
     *         description: Job not found
     */
    private getGenerationDetails = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            const job = await this.orchestrator.getJobStatus(id, userId);

            if (!job) return res.status(404).json({ status: "error", message: "Job not found" });

            return res.json({
                status: "success",
                data: job
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/motivation-quote:
     *   get:
     *     summary: Get a fresh AI-generated motivation quote
     *     tags: [AI]
     *     responses:
     *       200:
     *         description: A motivational quote
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string }
     *                 message: { type: string }
     *                 details:
     *                   type: object
     *                   properties:
     *                     quote: { type: string }
     */
    private getMotivationQuote = async (req: Request, res: Response) => {
        try {
            // Try to get from database first (if table exists)
            const dbQuote = await SupabaseDB.getRandomMotivationQuote();

            if (dbQuote && dbQuote.quote) {
                return res.status(200).json({
                    status: "success",
                    message: "Quote retrieved",
                    details: { quote: dbQuote.quote }
                });
            }

            // Generate fresh quote with OpenAI
            console.log('Generating fresh motivation quote with OpenAI...');
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a motivation engine. Generate a short motivational quote (43-50 chars), ending with a VERB. No quotes." },
                    { role: "user", content: "Inspire me now." }
                ],
                model: "gpt-4o",
                temperature: 0.9,
            });

            const content = completion.choices[0].message.content?.trim() || "Rise up every morning to actively learn";

            return res.status(200).json({
                status: "success",
                message: "Quote generated",
                details: { quote: content }
            });

        } catch (error) {
            console.error('Error serving quote:', error);
            // Return fallback quote instead of error
            return res.status(200).json({
                status: "success",
                message: "Quote retrieved (fallback)",
                details: { quote: "Think bold. Move fast. Stay limitless." }
            });
        }
    }
}
