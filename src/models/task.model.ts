import mongoose, { Schema } from "mongoose";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum, TaskStatusEnumType } from "../enums/task.enum";
import { generateTaskCode } from "../utils/uuid";

export interface TaskDocument extends Document {
    taskCode: string;
    title: string;
    description: string | null;
    project: mongoose.Types.ObjectId,
    workspace: mongoose.Types.ObjectId,
    status: TaskStatusEnumType,
    priority: TaskPriorityEnumType,
    assignedTo: mongoose.Types.ObjectId | null,
    createdBy: mongoose.Types.ObjectId,
    dueDate: Date | null,
    createdAt: Date;
    updatedAt: Date;
}


const taskSChema: Schema<TaskDocument> = new Schema<TaskDocument>({
    taskCode: {
        type: String,
        unique: true,
        default: generateTaskCode,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: null,
        trim: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TaskStatusEnum),
        default: TaskStatusEnum.TODO,
    },
    priority: {
        type: String,
        enum: Object.values(TaskPriorityEnum),
        default: TaskPriorityEnum.MEDIUM,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dueDate: {
        type: Date,
        default: null,
    }
}, { timestamps: true });



const TaskModel = mongoose.model<TaskDocument>("Task", taskSChema);
export default TaskModel;