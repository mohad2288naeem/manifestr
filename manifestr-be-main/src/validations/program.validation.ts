import { z } from 'zod';

const weekWorkoutSchema = z.object({
    workout_id: z.number().int().positive('Workout ID must be a positive number'),
    day_number: z.number().int().min(1).max(7, 'Day number must be between 1 and 7'),
});

const programWeekSchema = z.object({
    week_name: z.string().min(1, 'Week name is required'),
    week_number: z.number().int().positive().optional(),
    workouts: z.array(weekWorkoutSchema).min(1, 'At least one workout is required'),
});

export const addProgramSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
        message: 'Level must be Beginner, Intermediate, or Advanced',
    }),
    length: z.string().min(1, 'Length is required'),
    location: z.enum(['GYM', 'HOME'], {
        message: 'Location must be either GYM or HOME',
    }),
    meta: z.any().optional(),
    public: z.boolean(),
    weeks: z.array(programWeekSchema).min(1, 'At least one week is required'),
});

export const updateProgramSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    trainer: z.enum(['FELIX', 'SOLENE'], {
        message: 'Trainer must be either FELIX or SOLENE',
    }).optional(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
        message: 'Level must be Beginner, Intermediate, or Advanced',
    }).optional(),
    length: z.string().min(1, 'Length is required').optional(),
    location: z.enum(['GYM', 'HOME'], {
        message: 'Location must be either GYM or HOME',
    }).optional(),
    meta: z.any().optional(),
    public: z.boolean().optional(),
});

export const updateProgramWeekSchema = z.object({
    week_name: z.string().min(1, 'Week name is required').optional(),
    week_number: z.number().int().positive().optional(),
    workouts: z.array(weekWorkoutSchema).min(1, 'At least one workout is required').optional(),
});

export type AddProgramInput = z.infer<typeof addProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type UpdateProgramWeekInput = z.infer<typeof updateProgramWeekSchema>;

