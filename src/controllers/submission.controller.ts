import SubmissionService from "../services/submission.service";
import response from "../utils/response";

import type { Request, Response } from "express";

class SubmissionController {
    async create(req: Request, res: Response) {
        const submission = await SubmissionService.create(req.$user.id, req.body);
        return res.status(200).send(response("submission created", submission));
    }

    async getAll(req: Request, res: Response) {
        const submissions = await SubmissionService.getAll(req.query);
        return res.status(200).send(response("all submissions", submissions));
    }

    async getOne(req: Request, res: Response) {
        const { submissionId } = req.params;
        const submission = await SubmissionService.getOne(submissionId);
        return res.status(200).send(response("submission data", submission));
    }

    async update(req: Request, res: Response) {
        const { submissionId } = req.params;
        const submission = await SubmissionService.update(req.$user.id, submissionId, req.body);
        return res.status(200).send(response("submission updated", submission));
    }

    async delete(req: Request, res: Response) {
        const { submissionId } = req.params;
        const submission = await SubmissionService.delete(req.$user.id, submissionId);
        return res.status(200).send(response("submission deleted", submission));
    }
}

export default new SubmissionController();
