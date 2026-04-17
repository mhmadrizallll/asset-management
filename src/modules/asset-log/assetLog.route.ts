import { Router } from "express";
import { AssetLogController } from "./assetLog.controller";

const router = Router();

router.get("/:productId", AssetLogController.getByProduct);

export default router;
