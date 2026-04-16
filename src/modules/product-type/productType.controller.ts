import { Request, Response } from "express";
import { ProductTypeService } from "./productType.service";

export const ProductTypeController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await ProductTypeService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch product types" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const data = await ProductTypeService.getById(Number(req.params.id));
      res
        .status(200)
        .json({ success: true, message: "Product type found", data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch product type" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await ProductTypeService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    const data = await ProductTypeService.update(
      Number(req.params.id),
      req.body,
    );
    res.json({ success: true, data });
  },

  async delete(req: Request, res: Response) {
    await ProductTypeService.delete(Number(req.params.id));
    res.json({ success: true, message: "Deleted" });
  },
};
