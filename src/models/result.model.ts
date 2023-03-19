import mongoose from "mongoose";
import { IAssignment } from "./assignment.model";
import { IUser } from "./user.model";

export interface IResult extends mongoose.Document {
    attachment: string;
    assignment: IAssignment;
    user: IUser;
    createdAt: Date;
    updatedAt: Date;
}

const resultSchema: mongoose.Schema = new mongoose.Schema(
    {
        attachment: {
            type: String,
            required: [true, "Attachment is required"]
        },
        assignment: {
            unique: true,
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Assignment is required"],
            ref: "assignment"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        }
    },
    {
        timestamps: true
    }
);

resultSchema.pre(/^save|^find/, function (next) {
    this.populate("assignment user");
    next();
});

export default mongoose.model<IResult>("result", resultSchema);
