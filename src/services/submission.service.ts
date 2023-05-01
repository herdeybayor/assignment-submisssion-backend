import CustomError from "../utils/custom-error";
import Submission from "../models/submission.model";
import Assignment from "../models/assignment.model";
import User from "../models/user.model";

import type { SubmissionDataInput, GetSubmissionsInput } from "../types/submission";

class SubmissionService {
    async create(userId: string, data: SubmissionDataInput) {
        // if (!data.answer) throw new CustomError("answer is required");
        if (!data.assignment) throw new CustomError("assignment is required");

        const assignment = await Assignment.findOne({ _id: data.assignment });
        if (!assignment) throw new CustomError("assignment does not exist");

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("user does not exist");

        if (user.submissions.includes(assignment._id)) throw new CustomError("you have already submitted this assignment");

        if (assignment.level !== user.level) throw new CustomError("you are not allowed to submit this assignment");

        if (!assignment.departments.map((i) => i._id.toString()).includes(user.department.toString())) throw new CustomError("you are not allowed to submit this assignment");
        if (new Date() > assignment.dueDate) throw new CustomError("assignment is already due");

        const submission = await new Submission({ ...data, assignment: assignment._id, user: user._id }).save();
        console.log(submission);
        // update user submissions
        user.submissions.push(submission._id);
        await user.save();

        // update assignment submissions
        assignment.submissions.push(submission._id);
        await assignment.save();

        return submission;
    }

    async getAll(query: GetSubmissionsInput) {
        const { limit = 10, next, assignment, user } = query;

        const filter: any = {};

        if (assignment) filter.assignment = assignment;
        if (user) filter.user = user;

        if (next) {
            const [nextId, nextCreatedAt] = next.split("_");
            filter.$or = [{ createdAt: { $gt: nextCreatedAt } }, { createdAt: nextCreatedAt, _id: { $gt: nextId } }];
        }

        const total = await Submission.countDocuments(filter);

        const submissions = await Submission.find(filter).limit(limit).sort({ createdAt: -1 });

        const hasNext = submissions.length > limit;
        if (hasNext) submissions.pop(); // Remove the extra submission from the array

        const nextCursor = hasNext ? `${submissions[submissions.length - 1]._id}_${submissions[submissions.length - 1].createdAt.getTime()}` : null;

        return {
            submissions,
            pagination: {
                total,
                hasNext,
                next: nextCursor
            }
        };
    }

    async getOne(submissionId: string) {
        const submission = await Submission.findOne({ _id: submissionId });
        if (!submission) throw new CustomError("submission does not exist");

        return submission;
    }

    async update(userId: string, submissionId: string, data: SubmissionDataInput, access = "user") {
        const submission = await this.getOne(submissionId);

        if (access === "user" && submission.user._id.toString() !== userId) throw new CustomError("unauthorized");

        const updatedSubmission = await Submission.findByIdAndUpdate({ _id: submissionId }, { $set: data }, { new: true });
        return updatedSubmission;
    }

    async delete(userId: string, submissionId: string) {
        const submission = await this.getOne(submissionId);
        if (!submission) throw new CustomError("submission does not exist");

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("user does not exist");

        const roles = ["lecturer", "admin"];

        if (!roles.includes(user.role) && submission.user._id.toString() !== userId) throw new CustomError("unauthorized");

        return await Submission.findOneAndDelete({ _id: submissionId });
    }
}

export default new SubmissionService();
