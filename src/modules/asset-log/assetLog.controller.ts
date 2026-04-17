import { Request, Response } from "express";
import { AssetLogService } from "./assetLog.service";

export const AssetLogController = {
  async getByProduct(req: Request, res: Response) {
    const productId = Number(req.params.productId);

    const data = await AssetLogService.getByProduct(productId);

    res.json({
      success: true,
      data,
    });
  },
};
