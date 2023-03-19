import { Router } from "express";

import { ROLE } from "../config";

import auth from "../middlewares/auth.middleware";
import ResultController from "../controllers/result.controller";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.post("/", auth(ROLE.LECTURER), upload.single("attachment"), ResultController.create);

router.get("/", auth(ROLE.USER), ResultController.getAll);

router.get("/me", auth(ROLE.LECTURER), ResultController.getMe);

router.get("/:resultId", auth(ROLE.LECTURER), ResultController.getOne);

router.put("/:resultId", auth(ROLE.LECTURER), upload.single("attachment"), ResultController.update);

router.delete("/:resultId", auth(ROLE.LECTURER), ResultController.delete);

export default router;
