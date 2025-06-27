import { z } from "zod";

export const userSChema = z.string().trim().min(1, { message: "name is required" }).max(255)
export const descriptionSchema = z.string().trim().optional();

// create workspace validation schema
export const createWorkspaceSchema = z.object({
    name: userSChema,
    description: descriptionSchema,
});

// update workspace validation schema
export const updateWorkspaceSchema = z.object({
    name: userSChema,
    description: descriptionSchema,
});

// workspace id schema
export const workspaceSchema = z.string().trim().min(1, { message: "workspace Id is required" });

// update workspace role
export const changeRoleSchema = z.object({
    roleId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
})