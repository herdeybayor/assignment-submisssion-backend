import { Router } from "express";

import { ROLE } from "./../config";

import auth from "./../middlewares/auth.middleware";
import AssignmentController from "./../controllers/assignment.controller";

const router = Router();

router.post("/", auth(ROLE.LECTURER), AssignmentController.create);

router.get("/", auth(ROLE.USER), AssignmentController.getAll);

router.get("/:assignmentId", auth(ROLE.USER), AssignmentController.getOne);

router.put("/:assignmentId", auth(ROLE.LECTURER), AssignmentController.update);

router.delete("/:assignmentId", auth(ROLE.ADMIN), AssignmentController.delete);

export default router;
