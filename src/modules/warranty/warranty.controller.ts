import { WarrantyService } from "./warranty.service";
import { Request, Response } from "express";

export const WarrantyController = {
  async create(req: Request, res: Response) {
    const data = await WarrantyService.create(req.body);

    res.json({ success: true, data });
  },

  async getByProduct(req: Request, res: Response) {
    const data = await WarrantyService.getByProduct(
      Number(req.params.productId),
    );

    res.json({ success: true, data });
  },
};
