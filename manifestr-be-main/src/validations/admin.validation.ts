import { z } from 'zod';

export const adminLoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export const addAdminSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

export const changeAdminPasswordSchema = z.object({
    new_password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AddAdminInput = z.infer<typeof addAdminSchema>;
export type ChangeAdminPasswordInput = z.infer<typeof changeAdminPasswordSchema>;

