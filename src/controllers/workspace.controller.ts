import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { changeRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceSchema } from "../validation/workspace.validation";
import { HTTPSTATUS } from "../config/http.config";
import {
    ChangeMemberRoleServices, createWorkspaceServices, deleteWorkspaceServices, getAllWorkspaceUserIsMemberServices, getWorkspaceAnalyticsServices,
    getWorkspaceByIdServices, getWorkspaceMembersService, updateWorkspaceByIdServices
} from "../services/workspace.services";
import { getMemberRoleInWorkspace } from "../services/member.services";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.eum";

// create new workspace controller
export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;
    const { workspace } = await createWorkspaceServices(userId, body);
    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace created successfully",
        workspace,
    })
});



// get All Workspace User Is Member Controller
export const getAllWorkspaceUserIsMemberController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { workspaces } = await getAllWorkspaceUserIsMemberServices(userId);

    return res.status(HTTPSTATUS.OK).json({
        message: "User workspace fetched successfully",
        workspaces,
    })
});



// get Workspace By Id Controller
export const getWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);
    const { workspace } = await getWorkspaceByIdServices(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        workspace,
    })
});

// get workspace members controller
export const getWorkspaceMembersController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace members retrieved successfully ",
        members,
        roles,
    })

});

// get workspace analytics controller
export const getWorkspaceAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);
    const { analytics } = await getWorkspaceAnalyticsServices(workspaceId)

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace analytics retrieved successfully ",
        analytics,
    })

});

// change Workspace Member Role Controller
export const changeWorkspaceMemberRoleController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { roleId, memberId } = changeRoleSchema.parse(req.body);

    const { member } = await ChangeMemberRoleServices(workspaceId, memberId, roleId)

    return res.status(HTTPSTATUS.OK).json({
        message: "Member Role changed successFully ",
        member,
    })

});



//  update Workspace Controller
export const updateWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdServices(
        workspaceId,
        name,
        description,
    );

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace update successFully ",
        workspace,
    });

});

// delete Workspace Controller
export const deleteWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);
    const { currentWorkspace } = await deleteWorkspaceServices(workspaceId, userId);
    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace delete successFully ",
        currentWorkspace,
    });
})
