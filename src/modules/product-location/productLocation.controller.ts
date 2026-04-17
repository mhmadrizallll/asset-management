import { Request, Response } from "express";
import { ProductLocationService } from "./productLocation.service";

export const ProductLocationController = {
  async getAll(req: Request, res: Response) {
    const data = await ProductLocationService.getAll();
    res.json({ success: true, data });
  },
  async move(req: Request, res: Response) {
    try {
      const data = await ProductLocationService.moveProduct(req.body);

      res.status(201).json({
        success: true,
        message: "Product moved",
        data,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  async history(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);

      const data = await ProductLocationService.getHistory(productId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  },
};
