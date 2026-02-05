import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../lib/data-source';
import { StyleGuide } from '../models/StyleGuide';

export class StyleGuideController extends BaseController {
    public basePath = '/api/style-guides';

    protected initializeRoutes(): void {
        this.routes = [
            { verb: 'GET', path: '/', handler: this.listGuides, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/', handler: this.createGuide, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/:id', handler: this.getGuide, middlewares: [authenticateToken] },
            { verb: 'PATCH', path: '/:id', handler: this.updateGuide, middlewares: [authenticateToken] }
        ];
    }

    /**
     * @swagger
     * /style-guides:
     *   get:
     *     summary: List all style guides
     *     tags: [Style Guides]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of style guides
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private listGuides = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const repo = AppDataSource.getRepository(StyleGuide);

            const guides = await repo.find({
                where: { userId },
                order: { updated_at: 'DESC' },
                select: ['id', 'name', 'thumbnail_url', 'updated_at', 'is_completed', 'current_step']
            });

            return res.json({
                status: "success",
                data: guides
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /style-guides:
     *   post:
     *     summary: Initialize a new style guide
     *     tags: [Style Guides]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name]
     *             properties:
     *               name: { type: string }
     *     responses:
     *       201:
     *         description: Guide created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private createGuide = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ status: "error", message: "Name is required" });
            }

            const repo = AppDataSource.getRepository(StyleGuide);
            const newGuide = repo.create({
                userId,
                name,
                current_step: 1,
                is_completed: false
            });

            await repo.save(newGuide);
            return res.status(201).json({ status: "success", data: newGuide });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /style-guides/{id}:
     *   get:
     *     summary: Get full details
     *     tags: [Style Guides]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Style guide details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private getGuide = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const repo = AppDataSource.getRepository(StyleGuide);
            const guide = await repo.findOne({ where: { id, userId } });

            if (!guide) return res.status(404).json({ status: "error", message: "Style guide not found" });

            return res.json({ status: "success", data: guide });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /style-guides/{id}:
     *   patch:
     *     summary: Update style guide (incremental)
     *     tags: [Style Guides]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name: { type: string }
     *               logo: { type: object }
     *               typography: { type: object }
     *               colors: { type: object }
     *               style: { type: object }
     *               currentStep: { type: number }
     *               isCompleted: { type: boolean }
     *               thumbnailUrl: { type: string }
     *     responses:
     *       200:
     *         description: Guide updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private updateGuide = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            const updates = req.body;

            const repo = AppDataSource.getRepository(StyleGuide);
            const guide = await repo.findOne({ where: { id, userId } });

            if (!guide) return res.status(404).json({ status: "error", message: "Style guide not found" });

            // Using Object.assign or specific mapping for safety
            // Allowing partial JSON updates for jsonb columns
            if (updates.name) guide.name = updates.name;
            if (updates.logo) guide.logo = { ...guide.logo, ...updates.logo };
            if (updates.typography) guide.typography = { ...guide.typography, ...updates.typography };
            if (updates.colors) guide.colors = { ...guide.colors, ...updates.colors };
            if (updates.style) guide.style = { ...guide.style, ...updates.style };

            if (updates.currentStep !== undefined) guide.current_step = updates.currentStep;
            if (updates.isCompleted !== undefined) guide.is_completed = updates.isCompleted;
            if (updates.thumbnailUrl) guide.thumbnail_url = updates.thumbnailUrl;

            await repo.save(guide);
            return res.json({ status: "success", data: guide });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }
}
