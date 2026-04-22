import { Router } from "express";
import { PurchaseController } from "./purchase.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.get("/", authMiddleware, PurchaseController.getAll);
router.get("/:id", authMiddleware, PurchaseController.getDetail);

router.post("/", authMiddleware, PurchaseController.create);

export default router;
