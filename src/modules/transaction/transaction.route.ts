import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.get("/", TransactionController.getAll);
router.post("/", TransactionController.create);
router.post("/:id/return", TransactionController.returnTransaction);

export default router;
