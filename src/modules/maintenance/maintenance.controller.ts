import { MaintenanceService } from "./maintenance.service";
import { Request, Response } from "express";

export const MaintenanceController = {
  async create(req: Request, res: Response) {
    const data = await MaintenanceService.create(req.body);

    res.json({ success: true, data });
  },

  async getByProduct(req: Request, res: Response) {
    const productId = Number(req.params.productId); // Convert to number

    const data = await MaintenanceService.getByProduct(productId);

    res.json({ success: true, data });
  },
};
