import mongoose from "mongoose";

export interface IDepartment extends mongoose.Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const departmentSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            unique: true,
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IDepartment>("department", departmentSchema);
