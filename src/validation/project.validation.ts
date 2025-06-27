import { z } from "zod";

export const nameSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();
export const emojiSchema = z.string().trim().optional();


// create new project validation schema
export const createProjectSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    emoji: emojiSchema,
});


// update project validation schema
export const updateProjectSchema = z.object({
    emoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema
});

// project id validation schema
export const projectIdSchema = z.string().trim().min(1);