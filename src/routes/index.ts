import { Router } from "express";

import AuthRoutes from "./auth.route";
import UserRoutes from "./user.route";
import DepartmentRoutes from "./department.route";
import AssignmentRoute from "./assignment.route";
import SubmissionRoute from "./submission.route";
import ResultRoute from "./result.route";
import trimIncomingRequests from "../middlewares/trim-incoming-requests.middleware";

import type { Request, Response } from "express";

const router = Router();

// Trim all incoming requests
router.use(trimIncomingRequests);

router.use("/auth", AuthRoutes);

router.use("/users", UserRoutes);

router.use("/departments", DepartmentRoutes);

router.use("/assignments", AssignmentRoute);

router.use("/submissions", SubmissionRoute);

router.use("/results", ResultRoute);

router.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Hello world from node-typescript-express-starter! :)" });
});

export default router;
