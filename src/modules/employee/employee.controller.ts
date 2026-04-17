import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";

export const EmployeeController = {
  async getAll(req: Request, res: Response) {
    const data = await EmployeeService.getAll();
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response) {
    const data = await EmployeeService.getById(Number(req.params.id));

    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    try {
      const data = await EmployeeService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = await EmployeeService.update(
        Number(req.params.id),
        req.body,
      );
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await EmployeeService.delete(Number(req.params.id));
      res.json({ success: true, message: "Deleted" });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  },
};
