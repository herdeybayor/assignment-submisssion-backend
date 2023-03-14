import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { BCRYPT_SALT } from "./../config";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    image: string;
    role: "student" | "lecturer" | "admin";
    level: string;
    department: mongoose.Schema.Types.ObjectId;
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
            enum: ["student", "lecturer", "admin"],
            default: "student"
        },
        level: {
            type: String,
            required: true,
            trim: true,
            enum: ["100", "200", "300", "400"]
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "department"
        },
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

userSchema.pre(/^save|^find/, function (next) {
    this.populate("department");
    next();
});

export default mongoose.model<IUser>("user", userSchema);
