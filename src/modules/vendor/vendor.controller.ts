import { Request, Response } from "express";
import { VendorService } from "./vendor.service";

export const VendorController = {
  async create(req: Request, res: Response) {
    const data = await VendorService.create(req.body);
    res.json({ success: true, data });
  },

  async getAll(req: Request, res: Response) {
    const data = await VendorService.getAll();
    res.json({ success: true, data });
  },
};
