import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
  async getDashboard(req: Request, res: Response) {
    const data = await DashboardService.getDashboard();

    res.json({
      success: true,
      data,
    });
  },
};
