import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.post("/", TransactionController.create);
router.post("/:id/return", TransactionController.returnTransaction);

export default router;
