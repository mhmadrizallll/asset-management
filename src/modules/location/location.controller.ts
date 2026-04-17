import { Request, Response } from "express";
import { LocationService } from "./location.service";

export const LocationController = {
  async getAll(req: Request, res: Response) {
    const data = await LocationService.getAll();
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response) {
    const data = await LocationService.getById(Number(req.params.id));

    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    try {
      const data = await LocationService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    const data = await LocationService.update(Number(req.params.id), req.body);
    res.json({ success: true, data });
  },

  async delete(req: Request, res: Response) {
    await LocationService.delete(Number(req.params.id));
    res.json({ success: true, message: "Deleted" });
  },
};
