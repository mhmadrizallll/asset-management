import { Request, Response } from "express";
import { ProductService } from "./product.service";

import ExcelJS from "exceljs";

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

  async exportExcel(req: Request, res: Response) {
    try {
      const data = await ProductService.exportData();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Products");

      // 🔥 HEADER
      worksheet.columns = [
        { header: "Asset Tag", key: "asset_tag", width: 20 },
        { header: "Serial Number", key: "serial_number", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Product Type", key: "product_type", width: 20 },
        { header: "Category", key: "category", width: 20 },
        { header: "Location", key: "location", width: 20 },
        { header: "Created At", key: "created_at", width: 25 },
        { header: "Employee", key: "employee", width: 20 },
        { header: "Issue Date", key: "issue_date", width: 20 },
        { header: "Return Date", key: "return_date", width: 20 },
      ];

      // 🔥 DATA
      data.forEach((item) => {
        worksheet.addRow(item);
      });

      // 🔥 RESPONSE HEADER
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=products.xlsx",
      );

      // 🔥 SEND FILE
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Export failed",
      });
    }
  },
};
