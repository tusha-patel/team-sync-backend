import { Router } from "express";
import { createProjectController, deleteProjectController, getAllProjectsInWorkspaceController, getProjectAnalyticsController, getProjectByIdAndWorkspaceController, updateProjectController } from "../controllers/project.controller";


const projectRoute = Router();


projectRoute.post("/workspace/:workspaceId/create", createProjectController);
projectRoute.get("/workspace/:workspaceId/all", getAllProjectsInWorkspaceController);
projectRoute.get("/:id/workspace/:workspaceId", getProjectByIdAndWorkspaceController);
projectRoute.get("/:id/workspace/:workspaceId/analytics", getProjectAnalyticsController);
projectRoute.put("/:id/workspace/:workspaceId/update", updateProjectController);
projectRoute.delete("/:id/workspace/:workspaceId/delete", deleteProjectController);



export default projectRoute;