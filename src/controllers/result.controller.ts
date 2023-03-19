import ResultService from "../services/result.service";
import response from "../utils/response";

import type { Request, Response } from "express";

class ResultController {
    async create(req: Request, res: Response) {
        const result = await ResultService.create(req.$user.id, req.body);
        return res.status(200).send(response("result created", result));
    }

    async getAll(req: Request, res: Response) {
        const results = await ResultService.getAll(req.query);
        return res.status(200).send(response("all results", results));
    }

    async getMe(req: Request, res: Response) {
        const results = await ResultService.getAll({ ...req.query, user: req.$user.id });
        return res.status(200).send(response("my results", results));
    }

    async getOne(req: Request, res: Response) {
        const { resultId } = req.params;
        const result = await ResultService.getOne(resultId);
        return res.status(200).send(response("result data", result));
    }

    async update(req: Request, res: Response) {
        const { resultId } = req.params;
        const result = await ResultService.update(req.$user.id, resultId, req.body);
        return res.status(200).send(response("result updated", result));
    }

    async delete(req: Request, res: Response) {
        const { resultId } = req.params;
        const result = await ResultService.delete(req.$user.id, resultId);
        return res.status(200).send(response("result deleted", result));
    }
}

export default new ResultController();
