import { Router } from "express";
import { WarrantyController } from "./warranty.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post("/", WarrantyController.create);

router.get("/product/:productId", WarrantyController.getByProduct);

export default router;
