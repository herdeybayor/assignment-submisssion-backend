import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { BCRYPT_SALT } from "./../config";

import { Level, Role } from "../types/user";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    image: string;
    role: Role;
    matric: number;
    level: string;
    department: mongoose.Schema.Types.ObjectId;
    submissions: mongoose.Schema.Types.ObjectId[];
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: true,
            trim: true,
            enum: Role,
            default: Role.student
        },
        matric: {
            type: Number
        },
        level: {
            type: String,
            trim: true,
            enum: Level
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "department"
        },
        submissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "submission"
            }
        ],
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const hash = await bcrypt.hash(this.password, BCRYPT_SALT);
    this.password = hash;

    next();
});

// userSchema.pre(/^save|^find/, function (next) {
//     this.populate("department");
//     next();
// });

export default mongoose.model<IUser>("user", userSchema);
