import { PermissionType } from "../enums/role.eum";
import { unAuthorizedException } from "./appError";
import { RolePermissions } from "./role-permission";




export const roleGuard = (role: keyof typeof RolePermissions,
    requiredPermission: PermissionType[]) => {
    const permissions = RolePermissions[role];
    const hasPermission = requiredPermission.every((permission) => {
        return permissions.includes(permission)
    });

    if (!hasPermission) {
        throw new unAuthorizedException(
            "You do not have the necessary permission to perform this action ")
    }
}