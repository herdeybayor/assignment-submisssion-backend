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
    department: IDepartment;
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
        department: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "department"
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
    this.populate("department createdBy");
    next();
});

export default mongoose.model<IAssignment>("assignment", assignmentSchema);
