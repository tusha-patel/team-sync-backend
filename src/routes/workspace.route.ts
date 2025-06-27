import { Router } from "express";
import {
    changeWorkspaceMemberRoleController, createWorkspaceController,
    deleteWorkspaceByIdController,
    getAllWorkspaceUserIsMemberController, getWorkspaceAnalyticsController,
    getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspaceByIdController
}
    from "../controllers/workspace.controller";


const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);
workspaceRoutes.put("/change/member/role/:id", changeWorkspaceMemberRoleController);
workspaceRoutes.get("/all", getAllWorkspaceUserIsMemberController);
workspaceRoutes.get("/:id", getWorkspaceByIdController);
workspaceRoutes.get("/member/:id", getWorkspaceMembersController);
workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController)
workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);
workspaceRoutes.delete("/delete/:id", deleteWorkspaceByIdController);


export default workspaceRoutes;