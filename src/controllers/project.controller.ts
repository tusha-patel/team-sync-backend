import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { workspaceSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.services";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.eum";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../validation/project.validation";
import { HTTPSTATUS } from "../config/http.config";
import { createProjectServices, deleteProjectServices, getAllProjectsInWorkspaceServices, getProjectAnalyticsServices, getProjectByIdAndWorkspaceServices, updateProjectServices } from "../services/project.services";


// create new project controller
export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;
    const body = createProjectSchema.parse(req.body);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_PROJECT]);


    const { project } = await createProjectServices(userId, workspaceId, body)

    return res.status(HTTPSTATUS.CREATED).json({
        message: "project created successfully",
        project
    })
});



// get all projects controller 
export const getAllProjectsInWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;

    const { projects, totalCount, skip, totalPages } = await getAllProjectsInWorkspaceServices(workspaceId, pageSize, pageNumber);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "projects fetched successfully",
        projects,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit: pageSize,
        }
    });
});

// get single project controller
export const getProjectByIdAndWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { project } = await getProjectByIdAndWorkspaceServices(workspaceId, projectId);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Project fetched successfully",
        project
    });
})

//  get project analytics controller
export const getProjectAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getProjectAnalyticsServices(workspaceId, projectId)

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Project analytics retrieved successfully",
        analytics
    });
});

// update project controller
export const updateProjectController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const body = updateProjectSchema.parse(req.body);
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_PROJECT]);

    const { project } = await updateProjectServices(
        workspaceId,
        projectId,
        body
    )
    return res.status(HTTPSTATUS.CREATED).json({
        message: "Project update successfully",
        project
    });
});


// delete project controller
export const deleteProjectController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_PROJECT]);

    const project = await deleteProjectServices(workspaceId, projectId)

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Project delete successfully",
        project
    });
})