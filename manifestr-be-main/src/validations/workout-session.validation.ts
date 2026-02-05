import { z } from 'zod';

const completedSetSchema = z.object({
    reps: z.number().optional(),
    weight: z.number().optional(),
});

export const startWorkoutSessionSchema = z.object({
    workout_id: z.number().int().positive('Workout ID must be a positive number'),
    program_id: z.number().int().positive('Program ID must be a positive number').optional(),
    program_week_id: z.number().int().positive('Program week ID must be a positive number').optional(),
    day_number: z.number().int().min(1).max(7, 'Day number must be between 1 and 7').optional(),
});

export const completeWorkoutSessionSchema = z.object({
    actual_duration_minutes: z.number().int().positive('Duration must be a positive number'),
    calories_burned: z.number().int().positive('Calories burned must be a positive number').optional(),
    notes: z.string().optional(),
    exercises: z.array(
        z.object({
            exercise_id: z.number().int().positive('Exercise ID must be a positive number'),
            completed_sets: z.array(completedSetSchema).optional(),
            notes: z.string().optional(),
        })
    ),
});

export type StartWorkoutSessionInput = z.infer<typeof startWorkoutSessionSchema>;
export type CompleteWorkoutSessionInput = z.infer<typeof completeWorkoutSessionSchema>;

