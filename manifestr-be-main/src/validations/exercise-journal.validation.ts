import { z } from 'zod';

export const createExerciseJournalSchema = z.object({
    text: z.string().min(1, 'Text is required'),
    exercise_id: z.number().int().positive('Exercise ID must be a positive number'),
});

export type CreateExerciseJournalInput = z.infer<typeof createExerciseJournalSchema>;

