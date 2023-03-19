import Assignment from "../models/assignment.model";
import CustomError from "../utils/custom-error";
import User from "../models/user.model";
import Department from "../models/department.model";

import type { AssignmentDataInput, GetAssignmentsInput } from "../types/assignment";

class AssignmentService {
    async create(userId: string, data: AssignmentDataInput) {
        if (!data.title) throw new CustomError("title is required");
        if (!data.description) throw new CustomError("description is required");
        if (!data.dueDate) throw new CustomError("due date is required");
        if (!data.level) throw new CustomError("level is required");
        if (!data.departments) throw new CustomError("department is required");

        // check if department exists
        for (const departmentId of data.departments) {
            const department = await Department.findOne({ _id: departmentId });
            if (!department) throw new CustomError(`department ${departmentId} does not exist`);
        }

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("user does not exist");

        const assignment = await new Assignment({ ...data, createdBy: user._id }).save();

        return assignment;
    }

    async getAll(query: GetAssignmentsInput) {
        const { limit = 10, next, level, departments, createdBy } = query;

        const filter: any = {};

        if (level) filter.level = level;
        if (departments) filter.departments = { $in: departments };
        if (createdBy) filter.createdBy = createdBy;

        if (next) {
            const [nextId, nextCreatedAt] = next.split("_");
            filter.$or = [{ createdAt: { $gt: nextCreatedAt } }, { createdAt: nextCreatedAt, _id: { $gt: nextId } }];
        }

        const total = await Assignment.countDocuments(filter);

        const assignments = await Assignment.find(filter, { __v: 0 })
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("createdBy", { __v: 0, password: 0, createdAt: 0, updatedAt: 0 })
            .populate("departments", { __v: 0, createdAt: 0, updatedAt: 0 });

        const hasNext = assignments.length > limit;
        const nextCursor = hasNext ? `${assignments[limit - 1]._id}_${assignments[limit - 1].createdAt}` : null;

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
        const assignment = await this.getOne(assignmentId);

        if (access === "user" && assignment.createdBy._id.toString() !== userId) throw new CustomError("unauthorized");

        for (const departmentId of data.departments) {
            const department = await Department.findOne({ _id: departmentId });
            if (!department) throw new CustomError(`department ${departmentId} does not exist`);
        }

        const updatedAssignment = await Assignment.findByIdAndUpdate({ _id: userId }, { $set: data }, { new: true });
        return updatedAssignment;
    }

    async delete(userId: string, assignmentId: string, access = "user") {
        const assignment = await this.getOne(assignmentId);

        if (access === "user" && assignment.createdBy._id.toString() !== userId) throw new CustomError("unauthorized");

        return await Assignment.findOneAndDelete({ _id: assignmentId });
    }
}

export default new AssignmentService();
