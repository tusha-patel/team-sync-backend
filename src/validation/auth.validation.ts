import { z } from "zod"

export const emailSchema = z.string().trim().email("invalid email").min(1).max(255);
export const passwordSchema = z.string().trim().min(6);

// register validation
export const registerSchema = z.object({
    name: z.string().trim().min(2).max(255),
    email: emailSchema,
    password: passwordSchema
});

// login validation
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

