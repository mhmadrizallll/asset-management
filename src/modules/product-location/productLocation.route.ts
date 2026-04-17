import { Router } from "express";
import { ProductLocationController } from "./productLocation.controller";

const router = Router();

router.get("/", ProductLocationController.getAll);
router.post("/move", ProductLocationController.move);
router.get("/:productId/history", ProductLocationController.history);

export default router;
