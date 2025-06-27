import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";

export const titleSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();
export const assignedToSchema = z.string().trim().min(1).nullable();
export const prioritySchema = z.enum(Object.values(TaskPriorityEnum) as [string, ...string[]]);

export const statusSchema = z.enum(
    Object.values(TaskStatusEnum) as [string, ...string[]]
);

export const dueDateSchema = z.string().trim().optional().refine((val) => {
    return !val || !isNaN(Date.parse(val))
}, { message: "Invalid date format. please provide a valid date" });


// task id validation schema
export const taskIdSchema = z.string().trim().min(1);

// create task validation schema
export const createTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema
});

// update task validation schema
export const updateTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema
});