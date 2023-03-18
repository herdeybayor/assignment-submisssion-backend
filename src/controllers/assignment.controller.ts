import AssignmentService from "../services/assignment.service";
import response from "../utils/response";

import type { Request, Response } from "express";

class AssignmentController {
    async create(req: Request, res: Response) {
        const assignment = await AssignmentService.create(req.$user.id, req.body);
        return res.status(200).send(response("assignment created", assignment));
    }

    async getAll(req: Request, res: Response) {
        const assignments = await AssignmentService.getAll(req.query);
        return res.status(200).send(response("all assignments", assignments));
    }

    async getOne(req: Request, res: Response) {
        const { assignmentId } = req.params;
        const assignment = await AssignmentService.getOne(assignmentId);
        return res.status(200).send(response("assignment data", assignment));
    }

    async update(req: Request, res: Response) {
        const { assignmentId } = req.params;
        const assignment = await AssignmentService.update(req.$user.id, assignmentId, req.body);
        return res.status(200).send(response("assignment updated", assignment));
    }

    async delete(req: Request, res: Response) {
        const { assignmentId } = req.params;
        const assignment = await AssignmentService.delete(req.$user.id, assignmentId);
        return res.status(200).send(response("assignment deleted", assignment));
    }
}

export default new AssignmentController();
