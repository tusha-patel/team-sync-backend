import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles } from "../enums/role.eum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import WorkspaceModel from "../models/workspace.model"
import { BadRequestException, NotFoundException, unAuthorizedException } from "../utils/appError";


// get member role service
export const getMemberRoleInWorkspace = async (
    userId: string,
    workspaceId: string
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const member = await MemberModel.findOne({
        userId,
        workspaceId,
    }).populate("role");

    if (!member) {
        throw new unAuthorizedException(
            "You are not a member of this workspace",
            ErrorCodeEnum.ACCESS_UNAUTHORIZED
        );
    }
    const roleName = member.role?.name;
    return { role: roleName };
};


// join to workspace service
export const joinWorkspaceByInviteService = async (
    userId: string,
    inviteCode: string
) => {
    // Find workspace by invite code
    const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
    if (!workspace) {
        throw new NotFoundException("Invalid invite code or workspace not found");
    }

    // Check if user is already a member
    const existingMember = await MemberModel.findOne({
        userId,
        workspaceId: workspace._id,
    }).exec();

    if (existingMember) {
        throw new BadRequestException("You are already a member of this workspace");
    }

    const role = await RoleModel.findOne({ name: Roles.MEMBER });

    if (!role) {
        throw new NotFoundException("Role not found");
    }

    // Add user to workspace as a member
    const newMember = new MemberModel({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });
    await newMember.save();

    return { workspaceId: workspace._id, role: role.name };
};