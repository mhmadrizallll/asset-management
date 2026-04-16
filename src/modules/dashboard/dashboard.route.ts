import { Router } from "express";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get("/", DashboardController.getSummary);

export default router;
