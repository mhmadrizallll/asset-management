import { Request, Response } from "express";
import { CategoryService } from "./category.service";

export const CategoryController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await CategoryService.getAll();
      res
        .status(200)
        .json({ success: true, message: "Categories Available", data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const data = await CategoryService.getById(Number(req.params.id));

      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "Category Not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Category Available", data });
    } catch (error) {}
  },

  async create(req: Request, res: Response) {
    try {
      const data = await CategoryService.create(req.body);
      res
        .status(201)
        .json({ success: true, message: "Category created", data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await CategoryService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: "Category updated",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await CategoryService.delete(Number(req.params.id));
      res.status(200).json({ success: true, message: "Deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
