import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { workspaceSchema } from "../validation/workspace.validation";
import { projectIdSchema } from "../validation/project.validation";
import { getMemberRoleInWorkspace } from "../services/member.services";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.eum";
import { createTaskSchema, taskIdSchema } from "../validation/task.validation";
import { createTaskServices, deleteTaskServices, getAllTasksServices, getTaskByIdServices, updateTaskService } from "../services/task.services";
import { HTTPSTATUS } from "../config/http.config";


// create task controller
export const createTaskController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const userId = req.user?._id;
    const body = createTaskSchema.parse(req.body)

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);


    const { task } = await createTaskServices(workspaceId, projectId, userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Task created successfully",
        task
    });
})

// update task controller
export const updateTaskController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const userId = req.user?._id;
    const taskId = taskIdSchema.parse(req.params.id);
    const body = createTaskSchema.parse(req.body)

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);

    const { updatedTask } = await updateTaskService(workspaceId, projectId, taskId, body);

    return res.status(HTTPSTATUS.OK).json({
        message: "Task updated successfully",
        task: updatedTask
    });

});

// get all tasks controller
export const getAllTasksController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const filters = {
        projectId: req.query.projectId as string | undefined,
        status: req.query.status ? (req.query.status as string)?.split(",") : undefined,
        priority: req.query.priority ? (req.query.priority as string)?.split(",") : undefined,
        assignedTo: req.query.assignedTo ? (req.query.assignedTo as string)?.split(",") : undefined,
        keyword: req.query.keyword as string | undefined,
        dueDate: req.query.dueDate as string | undefined,

    }

    const pagination = {
        pageSize: parseInt(req.query.pageSize as string) || 10,
        pageNumber: parseInt(req.query.pageNumber as string) || 1
    }

    const result = await getAllTasksServices(workspaceId, filters, pagination);
    return res.status(HTTPSTATUS.OK).json({
        message: "Tasks fetched successfully",
        ...result
    });

});

// single task find by id controller
export const getTaskByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const userId = req.user?._id;
    const taskId = taskIdSchema.parse(req.params.id);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const task = await getTaskByIdServices(workspaceId, projectId, taskId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Task fetched successfully",
        task
    });
});


// delete task controller
export const deleteTaskController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const taskId = taskIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_TASK]);

    await deleteTaskServices(workspaceId, taskId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Task deleted successfully",
    });
});