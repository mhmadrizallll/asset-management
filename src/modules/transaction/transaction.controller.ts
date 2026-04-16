import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";

export const TransactionController = {
  async create(req: Request, res: Response) {
    try {
      const { employee_id, product_ids } = req.body;

      if (!employee_id || !product_ids?.length) {
        return res.status(400).json({
          success: false,
          message: "employee_id dan product_ids wajib",
        });
      }

      const data = await TransactionService.create({
        employee_id,
        product_ids,
      });

      return res.status(201).json({
        success: true,
        message: "Transaction created",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create transaction",
        error,
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
