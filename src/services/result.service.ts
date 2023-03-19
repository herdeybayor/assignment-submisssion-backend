import CustomError from "../utils/custom-error";
import Result from "../models/result.model";
import Assignment from "../models/assignment.model";
import User from "../models/user.model";

import type { ResultDataInput, GetResultsInput } from "../types/result";

class ResultService {
    async create(userId: string, data: ResultDataInput) {
        if (!data.assignment) throw new CustomError("assignment is required");

        const assignment = await Assignment.findOne({ _id: data.assignment });
        if (!assignment) throw new CustomError("assignment does not exist");

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("user does not exist");

        const result = await new Result({ ...data, assignment: assignment._id, user: user._id }).save();

        return result;
    }

    async getAll(query: GetResultsInput) {
        const { limit = 10, next, user, assignment } = query;

        const _query: any = {};

        if (assignment) _query.assignment = assignment;
        if (user) _query.user = user;

        if (next) {
            const [nextId, nextCreatedAt] = next.split("_");
            _query.$or = [{ createdAt: { $gt: nextCreatedAt } }, { createdAt: nextCreatedAt, _id: { $gt: nextId } }];
        }

        const total = await Result.countDocuments(_query);

        const results = await Result.find(_query).limit(limit).sort({ createdAt: -1 });

        const hasNext = results.length > limit;
        if (hasNext) results.pop(); // Remove the extra results from the array

        const nextCursor = hasNext ? `${results[results.length - 1]._id}_${results[results.length - 1].createdAt.getTime()}` : null;

        return {
            results,
            pagination: {
                total,
                hasNext,
                next: nextCursor
            }
        };
    }

    async getOne(resultId: string) {
        const result = await Result.findOne({ _id: resultId });
        if (!result) throw new CustomError("result does not exist");

        return result;
    }

    async update(userId: string, resultId: string, data: GetResultsInput, access = "user") {
        const result = await this.getOne(resultId);

        if (access === "user" && result.user._id.toString() !== userId) throw new CustomError("unauthorized");

        const updatedResult = await Result.findByIdAndUpdate({ _id: resultId }, { $set: data }, { new: true });
        return updatedResult;
    }

    async delete(userId: string, resultId: string) {
        const result = await this.getOne(resultId);
        if (!result) throw new CustomError("result does not exist");

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("user does not exist");

        const roles = ["lecturer", "admin"];

        if (!roles.includes(user.role) && result.user._id.toString() !== userId) throw new CustomError("unauthorized");

        return await Result.findOneAndDelete({ _id: resultId });
    }
}

export default new ResultService();
