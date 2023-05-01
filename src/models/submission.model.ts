import mongoose from "mongoose";
import { IAssignment } from "./assignment.model";
import { IUser } from "./user.model";

export interface ISubmission extends mongoose.Document {
    answer: string;
    attachment?: string;
    assignment: IAssignment;
    user: IUser;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema: mongoose.Schema = new mongoose.Schema(
    {
        answer: {
            type: String,
            // required: true,
            trim: true
        },
        attachment: {
            type: String,
            required: true
        },
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
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

submissionSchema.pre(/^save|^find/, function (next) {
    this.populate("assignment user");
    next();
});

export default mongoose.model<ISubmission>("submission", submissionSchema);
