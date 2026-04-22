import { Router } from "express";
import { ReportController } from "./report.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.get("/excel", ReportController.exportExcel);

router.get("/pdf", ReportController.exportPDF);

export default router;
