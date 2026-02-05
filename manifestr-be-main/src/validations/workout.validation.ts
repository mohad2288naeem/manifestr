import { z } from 'zod';

const tempoSchema = z.object({
    lowering: z.number().optional(),
    bottom_pause: z.number().optional(),
    lifting: z.number().optional(),
    top_pause: z.number().optional(),
}).optional();

const setItemSchema = z.object({
    reps: z.number().optional(),
    weight: z.number().optional(),
});

const setsSchema = z.array(setItemSchema).optional();

const exerciseSchema = z.object({
    exercise_id: z.number().int().positive('Exercise ID must be a positive number'),
    tempo: tempoSchema,
    sets: setsSchema,
});

export const addWorkoutSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }),
    location: z.enum(['home', 'gym'], {
        message: 'Location must be either home or gym',
    }),
    equipments: z.array(z.number().int().positive()).optional(),
    meta: z.any().optional(),
    public: z.boolean(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
        message: 'Level must be Beginner, Intermediate, or Advanced',
    }),
    duration_minutes: z.number().int().positive('Duration must be a positive number').optional(),
    calories_burned: z.number().int().positive('Calories burned must be a positive number').optional(),
    exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
});

export const updateWorkoutSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }).optional(),
    location: z.enum(['home', 'gym'], {
        message: 'Location must be either home or gym',
    }).optional(),
    equipments: z.array(z.number().int().positive()).optional(),
    meta: z.any().optional(),
    public: z.boolean().optional(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
        message: 'Level must be Beginner, Intermediate, or Advanced',
    }).optional(),
    duration_minutes: z.number().int().positive('Duration must be a positive number').optional(),
    calories_burned: z.number().int().positive('Calories burned must be a positive number').optional(),
    exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required').optional(),
});

export type AddWorkoutInput = z.infer<typeof addWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;

