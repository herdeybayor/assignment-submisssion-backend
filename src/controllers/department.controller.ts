import DepartmentService from "./../services/department.service";
import response from "./../utils/response";

import type { Request, Response } from "express";

class DepartmentController {
    async create(req: Request, res: Response) {
        const { name } = req.body;
        const department = await DepartmentService.create(name);
        return res.status(200).send(response("department created", department));
    }

    async getAll(req: Request, res: Response) {
        const departments = await DepartmentService.getAll();
        return res.status(200).send(response("all departments", departments));
    }

    async getOne(req: Request, res: Response) {
        const { departmentId } = req.params;
        const department = await DepartmentService.getOne(departmentId);
        return res.status(200).send(response("department data", department));
    }

    async update(req: Request, res: Response) {
        const { departmentId } = req.params;
        const { name } = req.body;
        const department = await DepartmentService.update(departmentId, name);
        return res.status(200).send(response("department updated", department));
    }

    async delete(req: Request, res: Response) {
        const { departmentId } = req.params;
        const department = await DepartmentService.delete(departmentId);
        return res.status(200).send(response("department deleted", department));
    }
}

export default new DepartmentController();
