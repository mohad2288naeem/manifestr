import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../lib/data-source';
import { VaultItem, VaultItemType, VaultItemStatus } from '../models/VaultItem';
import { IsNull, Like } from 'typeorm';
import { s3Util } from '../utils/s3.util';
import { validate as uuidValidate } from 'uuid';

export class VaultController extends BaseController {
    public basePath = '/api/vaults';

    protected initializeRoutes(): void {
        this.routes = [
            { verb: 'GET', path: '/', handler: this.listItems, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/', handler: this.createItem, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/folder', handler: this.createFolder, middlewares: [authenticateToken] },
            { verb: 'PATCH', path: ('/:id'), handler: this.updateItem, middlewares: [authenticateToken] },
            { verb: 'DELETE', path: '/:id', handler: this.deleteItem, middlewares: [authenticateToken] }
        ];
    }

    /**
     * @swagger
     * /vaults:
     *   get:
     *     summary: List vault items
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: parentId
     *         schema: { type: string }
     *         description: Filter by parent folder ID (use 'root' or omit for top-level)
     *       - in: query
     *         name: search
     *         schema: { type: string }
     *         description: Search by title
     *     responses:
     *       200:
     *         description: List of items
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private listItems = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { parentId, search } = req.query;
            const repo = AppDataSource.getRepository(VaultItem);

            let where: any = { userId };

            if (search) {
                where.title = Like(`%${search}%`);
            } else if (parentId && parentId !== 'root') {
                if (!uuidValidate(parentId as string)) {
                    return res.status(400).json({ status: "error", message: "Invalid parentId" });
                }
                where.parent_id = parentId;
            } else {
                where.parent_id = IsNull(); // Root items
            }

            const items = await repo.find({
                where,
                order: { type: 'DESC', title: 'ASC' } // Folders first
            });

            return res.json({
                status: "success",
                data: items,
                meta: { total: items.length }
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /vaults:
     *   post:
     *     summary: Create a new file item
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [title, fileKey]
     *             properties:
     *               title: { type: string }
     *               fileKey: { type: string }
     *               parentId: { type: string }
     *               status: { type: string, enum: [Draft, In Progress, In Review, Final] }
     *               project: { type: string }
     *               size: { type: number }
     *               thumbnailUrl: { type: string }
     *     responses:
     *       201:
     *         description: Item created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private createItem = async (req: AuthRequest, res: Response) => {
        try {
            console.log('[Vault] createItem START');
            console.log('[Vault] User:', req.user);
            console.log('[Vault] Body:', req.body);

            const userId = req.user!.userId;
            const { title, fileKey, parentId, status, project, size, thumbnailUrl } = req.body;

            if (!title || !fileKey) {
                console.log('[Vault] Missing required fields');
                return res.status(400).json({ status: "error", message: "Title and fileKey are required" });
            }

            let validatedParentId = parentId;
            if (parentId === 'root') {
                validatedParentId = null;
            } else if (parentId && !uuidValidate(parentId)) {
                console.log('[Vault] Invalid parentId:', parentId);
                return res.status(400).json({ status: "error", message: "Invalid parentId" });
            }

            const repo = AppDataSource.getRepository(VaultItem);
            const newItem = repo.create({
                userId,
                title,
                type: VaultItemType.FILE,
                file_key: fileKey,
                parent_id: validatedParentId,
                status: status || VaultItemStatus.DRAFT,
                project,
                size,
                thumbnail_url: thumbnailUrl
            });

            console.log('[Vault] Saving item:', newItem);
            await repo.save(newItem);
            console.log('[Vault] Item saved:', newItem.id);
            return res.status(201).json({ status: "success", data: newItem });

        } catch (error: any) {
            console.error('[Vault] createItem CRITICAL ERROR:', error);
            console.error('[Vault] Error Stack:', error.stack);
            if (error.code === '23503') {
                return res.status(400).json({ status: "error", message: "User not found or Invalid References" });
            }
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    /**
     * @swagger
     * /vaults/folder:
     *   post:
     *     summary: Create a new folder
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [title]
     *             properties:
     *               title: { type: string }
     *               parentId: { type: string }
     *               project: { type: string }
     *     responses:
     *       201:
     *         description: Folder created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private createFolder = async (req: AuthRequest, res: Response) => {
        try {
            console.log('[Vault] createFolder:', req.body);
            const userId = req.user!.userId;
            const { title, parentId, project } = req.body;

            if (!title) {
                return res.status(400).json({ status: "error", message: "Title is required" });
            }

            let validatedParentId = parentId;
            if (parentId === 'root') {
                validatedParentId = null;
            } else if (parentId && !uuidValidate(parentId)) {
                return res.status(400).json({ status: "error", message: "Invalid parentId" });
            }

            const repo = AppDataSource.getRepository(VaultItem);
            const newItem = repo.create({
                userId,
                title,
                type: VaultItemType.FOLDER,
                parent_id: validatedParentId,
                status: VaultItemStatus.DRAFT,
                project
            });

            await repo.save(newItem);
            return res.status(201).json({ status: "success", data: newItem });

        } catch (error) {
            console.error('[Vault] createFolder Error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /vaults/{id}:
     *   patch:
     *     summary: Update an item
     *     tags: [Vaults]
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
     *               title: { type: string }
     *               status: { type: string }
     *               parentId: { type: string }
     *     responses:
     *       200:
     *         description: Item updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private updateItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            const { title, status, parentId } = req.body;

            const repo = AppDataSource.getRepository(VaultItem);
            const item = await repo.findOne({ where: { id, userId } });

            if (!item) return res.status(404).json({ status: "error", message: "Item not found" });

            if (title) item.title = title;
            if (status) item.status = status;

            if (parentId !== undefined) {
                if (parentId === 'root') {
                    item.parent_id = null; // Explicit null, typeorm might complain if not handled or type is strictly string
                    // Wait, VaultItem.parent_id is string | null in DB? 
                    // Let's assume TypeORM handles null fine if column is nullable.
                    // But typescript might complain if 'null' is assigned to something strictly typed?
                    // VaultItem model says `parent_id: string;` but usually nullable columns are `string | null`.
                    // Let's cast to any or fix model if needed, but 'null' is fine for nullable column.
                    (item as any).parent_id = null;
                } else if (parentId === null) {
                    (item as any).parent_id = null;
                } else {
                    if (!uuidValidate(parentId)) {
                        return res.status(400).json({ status: "error", message: "Invalid parentId" });
                    }
                    item.parent_id = parentId;
                }
            }

            await repo.save(item);
            return res.json({ status: "success", data: item });

        } catch (error) {
            console.error('[Vault] updateItem Error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /vaults/{id}:
     *   delete:
     *     summary: Delete an item
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Item deleted
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private deleteItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const repo = AppDataSource.getRepository(VaultItem);
            const item = await repo.findOne({ where: { id, userId } });

            if (!item) return res.status(404).json({ status: "error", message: "Item not found" });

            // If it's a file, delete from S3
            if (item.type === VaultItemType.FILE && item.file_key) {
                try {
                    await s3Util.deleteFile(item.file_key);
                } catch (e) {
                    console.warn(`Failed to delete S3 file: ${item.file_key}`, e);
                }
            }

            // If it's a folder, we should recursively delete children, 
            // but for MVP we might just error if not empty or use database cascade.
            // Using TypeORM cascade relies on FK setup. For now, simple delete.
            // A better approach for folders is to find all descendants.

            await repo.remove(item);
            return res.json({ status: "success", message: "Item deleted" });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }
}
