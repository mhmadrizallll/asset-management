import { Request, Response } from "express";
import { ProductService } from "./product.service";

export const ProductController = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await ProductService.getAll(req.query);

      res.json({
        success: true,
        message: "Products fetched",
        ...result,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Failed to fetch products",
        error,
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const data = await ProductService.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product fetched",
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error",
        error,
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await ProductService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Product created",
        data,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const data = await ProductService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: "Product updated",
        data,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await ProductService.delete(id);

      res.status(200).json({
        success: true,
        message: "Product deleted",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};
