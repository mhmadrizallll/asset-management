import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";

export const TransactionController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await TransactionService.getAll();
      return res.json({ success: true, message: "Transactions fetched", data });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch transactions",
        error,
      });
    }
  },
  async create(req: Request, res: Response) {
    try {
      const { employee_id, product_ids } = req.body;

      const data = await TransactionService.create({
        employee_id,
        product_ids,
      });

      return res.status(201).json({
        success: true,
        message: "Transaction created",
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async returnTransaction(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const data = await TransactionService.returnTransaction(id);

      return res.json({
        success: true,
        message: "Transaction returned successfully",
        data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
