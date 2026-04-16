import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, source: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[source]);
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    }
  };
