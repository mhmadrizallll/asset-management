import { Router } from "express";
import { VendorController } from "./vendor.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.get("/", authMiddleware, VendorController.getAll);

router.post("/", authMiddleware, VendorController.create);

export default router;
