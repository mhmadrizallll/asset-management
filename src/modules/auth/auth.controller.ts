import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const data = await AuthService.register(req.body);
      res.json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Register failed",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const data = await AuthService.login(req.body);
      res.json({ success: true, ...data });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  },
};
