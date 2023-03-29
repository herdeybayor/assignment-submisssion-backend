import { Router } from "express";

import { ROLE } from "./../config";

import auth from "./../middlewares/auth.middleware";
import DepartmentController from "./../controllers/department.controller";

const router = Router();

router.post("/", auth(ROLE.ADMIN), DepartmentController.create);

router.get("/", DepartmentController.getAll);

router.get("/:departmentId", auth(ROLE.ADMIN), DepartmentController.getOne);

router.put("/:departmentId", auth(ROLE.ADMIN), DepartmentController.update);

router.delete("/:departmentId", auth(ROLE.ADMIN), DepartmentController.delete);

export default router;
