import { Router } from "express";

import { ROLE } from "./../config";
import auth from "./../middlewares/auth.middleware";
import UserCtrl from "./../controllers/user.controller";
import upload from "./../middlewares/multer.middleware";

const router = Router();

router.post("/", auth(ROLE.ADMIN), upload.single("image"), UserCtrl.create);

router.get("/", auth(ROLE.ADMIN), UserCtrl.getAll);

router.get("/me", auth(ROLE.USER), UserCtrl.getMe);

router.get("/:userId", auth(ROLE.ADMIN), UserCtrl.getOne);

router.put("/me", auth(ROLE.USER), upload.single("image"), UserCtrl.updateMe);

router.put("/:userId", auth(ROLE.ADMIN), upload.single("image"), UserCtrl.update);

router.delete("/:userId", auth(ROLE.ADMIN), UserCtrl.delete);

export default router;
