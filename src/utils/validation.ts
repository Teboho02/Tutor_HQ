import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address');

export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format');

export const nameSchema = z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters');

export const usernameSchema = z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

// Login form schema
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

// Signup form schema
export const signupSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

// Contact form schema
export const contactSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    subject: z.string().min(1, 'Subject is required').max(100, 'Subject must be less than 100 characters'),
    message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

// Profile update schema
export const profileSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema.optional(),
});

// Goal creation schema
export const goalSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    targetDate: z.string().min(1, 'Target date is required'),
    category: z.string().min(1, 'Category is required'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;

// Validation helper function
export function validateField<T>(schema: z.ZodSchema<T>, value: unknown): { success: boolean; error?: string } {
    try {
        schema.parse(value);
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || 'Validation failed' };
        }
        return { success: false, error: 'Validation failed' };
    }
}

export default {
    emailSchema,
    passwordSchema,
    phoneSchema,
    nameSchema,
    usernameSchema,
    loginSchema,
    signupSchema,
    contactSchema,
    profileSchema,
    goalSchema,
    validateField,
};
