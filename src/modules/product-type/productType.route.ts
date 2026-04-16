import { Router } from "express";
import { ProductTypeController } from "./productType.controller";

const router = Router();

router.get("/", ProductTypeController.getAll);
router.get("/:id", ProductTypeController.getById);
router.post("/", ProductTypeController.create);
router.put("/:id", ProductTypeController.update);
router.delete("/:id", ProductTypeController.delete);

export default router;
