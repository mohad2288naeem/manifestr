import { z } from 'zod';

export const addWeightSchema = z.object({
    weight: z.number().positive('Weight must be a positive number'),
});

export type AddWeightInput = z.infer<typeof addWeightSchema>;

