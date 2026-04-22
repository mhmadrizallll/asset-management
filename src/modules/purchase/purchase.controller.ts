import { Request, Response } from "express";
import { PurchaseService } from "./purchase.service";

export const PurchaseController = {
  async create(req: Request, res: Response) {
    try {
      const data = await PurchaseService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const data = await PurchaseService.getAll();
    res.json({ success: true, data });
  },
  async getDetail(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const data = await PurchaseService.getDetail(id);

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },
};
