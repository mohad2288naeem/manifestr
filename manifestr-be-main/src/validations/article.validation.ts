import { z } from 'zod';

export const addArticleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    text: z.string().min(1, 'Text is required'),
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }),
    public: z.boolean(),
});

export const updateArticleSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    text: z.string().min(1, 'Text is required').optional(),
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }).optional(),
    public: z.boolean().optional(),
});

export const addVideoArticleSchema = z.object({
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }),
    public: z.boolean(),
});

export const updateVideoArticleSchema = z.object({
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }).optional(),
    public: z.boolean().optional(),
});

export const addMealArticleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    text: z.string().min(1, 'Text is required'),
    prep_time_minutes: z.number().int().positive('Prep time must be a positive number'),
    tags: z.array(z.string()).max(2, 'Maximum 2 tags allowed').optional(),
});

export const updateMealArticleSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    text: z.string().min(1, 'Text is required').optional(),
    prep_time_minutes: z.number().int().positive('Prep time must be a positive number').optional(),
    tags: z.array(z.string()).max(2, 'Maximum 2 tags allowed').optional(),
});

export type AddArticleInput = z.infer<typeof addArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type AddVideoArticleInput = z.infer<typeof addVideoArticleSchema>;
export type UpdateVideoArticleInput = z.infer<typeof updateVideoArticleSchema>;
export type AddMealArticleInput = z.infer<typeof addMealArticleSchema>;
export type UpdateMealArticleInput = z.infer<typeof updateMealArticleSchema>;

