import { Router } from "express";
import { MaintenanceController } from "./maintenance.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post("/", MaintenanceController.create);

router.get("/product/:productId", MaintenanceController.getByProduct);

export default router;
