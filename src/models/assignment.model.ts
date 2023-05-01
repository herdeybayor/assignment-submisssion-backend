import mongoose from "mongoose";
import { Level } from "../types/user";
import { IDepartment } from "./department.model";
import { IUser } from "./user.model";

export interface IAssignment extends mongoose.Document {
    title: string;
    description: string;
    attachment: string;
    dueDate: Date;
    level: Level;
    departments: IDepartment[];
    submissions: mongoose.Schema.Types.ObjectId[];
    isReleased: boolean;
    createdBy: IUser;
    createdAt: Date;
    updatedAt: Date;
}

const assignmentSchema: mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        attachment: {
            type: String
        },
        dueDate: {
            type: Date,
            required: true
        },
        level: {
            type: String,
            required: true,
            trim: true,
            enum: Level
        },
        departments: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            ref: "department"
        },
        submissions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "submission"
        },
        isReleased: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        }
    },
    {
        timestamps: true
    }
);

assignmentSchema.pre(/^save|^find/, function (next) {
    this.populate("createdBy departments");
    next();
});

export default mongoose.model<IAssignment>("assignment", assignmentSchema);
