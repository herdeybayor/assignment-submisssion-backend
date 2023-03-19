import { Router } from "express";

import { ROLE } from "../config";

import auth from "../middlewares/auth.middleware";
import SubmissionController from "../controllers/submission.controller";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.post("/", auth(ROLE.STUDENT), upload.single("attachment"), SubmissionController.create);

router.get("/", auth(ROLE.LECTURER), SubmissionController.getAll);

router.get("/:submissionId", auth(ROLE.LECTURER), SubmissionController.getOne);

router.put("/:submissionId", auth(ROLE.STUDENT), upload.single("attachment"), SubmissionController.update);

router.delete("/:submissionId", auth(ROLE.LECTURER), SubmissionController.delete);

export default router;
