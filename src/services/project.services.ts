import mongoose from "mongoose";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import WorkspaceModel from "../models/workspace.model"
import { NotFoundException } from "../utils/appError";
import { TaskStatusEnum } from "../enums/task.enum";


// create project service
export const createProjectServices = async (
    userId: string,
    workspaceId: string,
    body: {
        name: string,
        description?: string | undefined,
        emoji?: string | null,
    }
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }
    const project = new ProjectModel({
        name: body.name,
        description: body.description,
        ...(body.emoji && { emoji: body.emoji }),
        workspace: workspaceId,
        createdBy: userId
    });

    await project.save();
    return {
        project
    }
}


// get All Project Service
export const getAllProjectsInWorkspaceServices = async (workspaceId: string, pageSize: number, pageNumber: number) => {

    const totalCount = await ProjectModel.countDocuments({
        workspace: workspaceId,
    });

    const skip = (pageNumber - 1) * pageSize;

    const projects = await ProjectModel.find({ workspace: workspaceId })
        .skip(skip)
        .limit(pageSize)
        .populate("createdBy", "_id name profilePicture -password ")
        .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        projects,
        totalCount,
        skip,
        totalPages
    }
}


// get single project service
export const getProjectByIdAndWorkspaceServices = async (workspaceId: string, projectId: string) => {
    const project = await ProjectModel.findOne({
        _id: projectId,
        workspace: workspaceId,
    }).select("_id emoji name description ");

    if (!project) {
        throw new NotFoundException("Project not found or does not belong to the specified workspace ")
    }
    return { project }
}


// get project analytics service
export const getProjectAnalyticsServices = async (workspaceId: string, projectId: string) => {
    const project = await ProjectModel.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
        throw new NotFoundException("Project not found or does not belong to this workspace");
    }

    const currentDate = new Date();
    const taskAnalytics = await TaskModel.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId),
            },
        },
        {
            $facet: {
                totalTasks: [{ $count: "count" }],
                overdueTasks: [
                    {
                        $match: {
                            dueDate: { $lt: currentDate },
                            status: {
                                $ne: TaskStatusEnum.DONE
                            }
                        },
                    },
                    {
                        $count: "count"
                    }
                ],
                completedTask: [
                    {
                        $match: {
                            status: TaskStatusEnum.DONE
                        }
                    },
                    { $count: "count" }
                ]
            }
        }
    ]);

    const _analytics = taskAnalytics[0];
    const analytics = {
        totalTasks: _analytics.totalTasks[0]?.count || 0,
        overdueTasks: _analytics.overdueTasks[0]?.count || 0,
        completedTasks: _analytics.completedTask[0]?.count || 0
    }

    return { analytics }
}

// update Project Service
export const updateProjectServices = async (
    workspaceId: string,
    projectId: string,
    body: {
        name: string,
        description?: string,
        emoji?: string,
    }
) => {

    const { name, description, emoji } = body;
    const project = await ProjectModel.findOne({
        _id: projectId,
        workspace: workspaceId,
    });

    if (!project) {
        throw new NotFoundException("Project not found or does not belong to the specified workspace ");
    }

    if (emoji) project.emoji = emoji;
    if (name) project.name = name;
    if (description) project.description = description;
    await project.save();

    return { project }
}


// delete Project Service
export const deleteProjectServices = async (workspaceId: string, projectId: string) => {
    const project = await ProjectModel.findOne({
        _id: projectId,
        workspace: workspaceId
    })
    if (!project) {
        throw new NotFoundException("Project not found or does not belong to the specified project ");
    }
    await project.deleteOne();
    await TaskModel.deleteMany({ project: project._id })

    return project;
}