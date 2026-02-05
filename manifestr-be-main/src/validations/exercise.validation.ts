import { z } from 'zod';

export const addExerciseSchema = z.object({
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }),
    name: z.string().min(1, 'Name is required'),
    public: z.boolean(),
    meta: z.any().optional(),
});

export const updateExerciseSchema = z.object({
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }).optional(),
    name: z.string().min(1, 'Name is required').optional(),
    public: z.boolean().optional(),
    meta: z.any().optional(),
});

export type AddExerciseInput = z.infer<typeof addExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;

