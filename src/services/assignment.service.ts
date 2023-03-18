import Assignment from "../models/assignment.model";
import CloudinaryUtil from "../utils/cloudinary";
import CustomError from "../utils/custom-error";
import User from "../models/user.model";
import Department from "../models/department.model";

import type { AssignmentDataInput, GetAssignmentsInput } from "../types/assignment";
import type { UploadApiResponse } from "cloudinary";

class AssignmentService {
    async create(userId: string, data: AssignmentDataInput) {
        if (!data.title) throw new CustomError("title is required");
        if (!data.description) throw new CustomError("description is required");
        if (!data.dueDate) throw new CustomError("due date is required");
        if (!data.level) throw new CustomError("level is required");
        if (!data.department) throw new CustomError("department is required");

        const department = await Department.findOne({ _id: data.department });
        if (!department) throw new CustomError("department does not exist");

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("user does not exist");

        // if (data.attachment) data.attachment = await this.uploadAttachment(data.attachment);

        const assignment = await new Assignment({ ...data, department: department._id, createdBy: user._id }).save();

        return assignment;
    }

    async getAll(query: GetAssignmentsInput) {
        const { limit = 10, next, level, department, createdBy } = query;

        const filter: any = {};

        if (level) filter.level = level;
        if (department) filter.department = department;
        if (createdBy) filter.createdBy = createdBy;

        if (next) {
            const [nextId, nextCreatedAt] = next.split("_");
            filter.$or = [{ createdAt: { $gt: nextCreatedAt } }, { createdAt: nextCreatedAt, _id: { $gt: nextId } }];
        }

        const total = await Assignment.countDocuments(filter);

        const assignments = await Assignment.find(filter).limit(limit).sort({ createdAt: -1 });

        const hasNext = assignments.length > limit;
        if (hasNext) assignments.pop(); // Remove the extra user from the array

        const nextCursor = hasNext ? `${assignments[assignments.length - 1]._id}_${assignments[assignments.length - 1].createdAt.getTime()}` : null;

        return {
            assignments,
            pagination: {
                total,
                hasNext,
                next: nextCursor
            }
        };
    }

    async getOne(assignmentId: string) {
        const assignment = await Assignment.findOne({ _id: assignmentId });
        if (!assignment) throw new CustomError("assignment does not exist");

        return assignment;
    }

    async update(userId: string, assignmentId: string, data: AssignmentDataInput, access = "user") {
        if (!data.title) throw new CustomError("title is required");
        if (!data.description) throw new CustomError("description is required");
        if (!data.dueDate) throw new CustomError("due date is required");
        if (!data.level) throw new CustomError("level is required");
        if (!data.department) throw new CustomError("department is required");

        const assignment = await this.getOne(assignmentId);

        if (access === "user" && assignment.createdBy._id.toString() !== userId) throw new CustomError("unauthorized");

        // if (data.attachment) {
        //     await this.deleteAttachment(assignmentId);
        //     data.attachment = await this.uploadAttachment(data.attachment);
        // }

        const department = await Department.findOne({ _id: data.department });
        if (!department) throw new CustomError("department does not exist");

        const updatedAssignment = await Assignment.findOneAndUpdate({ _id: assignmentId }, { ...data, department: department._id }, { new: true });
        return updatedAssignment;
    }

    async delete(userId: string, assignmentId: string, access = "user") {
        const assignment = await this.getOne(assignmentId);

        if (access === "user" && assignment.createdBy._id.toString() !== userId) throw new CustomError("unauthorized");

        // await this.deleteAttachment(assignmentId);

        return await Assignment.findOneAndDelete({ _id: assignmentId });
    }

    async deleteAttachment(assignmentId: string) {
        const assignment = await this.getOne(assignmentId);
        if (!assignment.attachment) return true;

        return await CloudinaryUtil.delete(assignment.attachment);
    }

    /** Helper function */
    async uploadAttachment(attachment: string) {
        return ((await CloudinaryUtil.uploadBase64(attachment, "assignments")) as UploadApiResponse).secure_url;
    }
}

export default new AssignmentService();
