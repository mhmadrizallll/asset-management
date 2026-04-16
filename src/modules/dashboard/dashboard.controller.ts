import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
  async getSummary(req: Request, res: Response) {
    try {
      const data = await DashboardService.getSummary();

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to load dashboard",
        error,
      });
    }
  },
};
