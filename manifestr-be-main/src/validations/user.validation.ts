import { z } from 'zod';

export const setTrainerPreferenceSchema = z.object({
    trainer: z.enum(['SOLENE', 'FELIX'], {
        message: 'Trainer must be either SOLENE or FELIX',
    }),
});

export const setUserProfileSchema = z.object({
    gender: z.string().min(1, 'Gender is required'),
    age: z.number().int().positive('Age must be a positive number'),
    weight: z.string().min(1, 'Weight is required'),
    height: z.string().min(1, 'Height is required'),
    goal: z.string().min(1, 'Goal is required'),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
        message: 'Level must be Beginner, Intermediate, or Advanced',
    }),
    meta: z.any().optional(),
});

export const setCurrentProgramSchema = z.object({
    program_id: z.number().int().positive('Program ID must be a positive number'),
});

export type SetTrainerPreferenceInput = z.infer<typeof setTrainerPreferenceSchema>;
export type SetUserProfileInput = z.infer<typeof setUserProfileSchema>;

