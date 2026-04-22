import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { Request, Response } from "express";
import { ReportService } from "./report.service";

/**
 * Helper
 */
const formatValue = (val: any) => val || "-";

/**
 * Status Color Excel
 */
const getStatusColorExcel = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "FF28A745"; // hijau
    case "IN_USE":
      return "FFFFC107"; // kuning
    case "BROKEN":
      return "FFDC3545"; // merah
    case "MAINTENANCE":
      return "FF17A2B8"; // biru
    default:
      return "FF6C757D"; // abu
  }
};

/**
 * Status Color PDF
 */
const getStatusColorPDF = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "green";
    case "IN_USE":
      return "orange";
    case "BROKEN":
      return "red";
    case "MAINTENANCE":
      return "blue";
    default:
      return "gray";
  }
};

export const ReportController = {
  /**
   * EXPORT EXCEL
   */
  async exportExcel(req: Request, res: Response) {
    try {
      const data = await ReportService.exportFullReport();

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Asset Report");

      /**
       * COLUMN
       */
      sheet.columns = [
        { header: "Asset Tag", key: "asset_tag", width: 20 },
        { header: "Serial Number", key: "serial_number", width: 25 }, // ✅ FIX
        { header: "Type", key: "product_type", width: 20 },
        { header: "Category", key: "category", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Location", key: "location", width: 20 },
        { header: "Employee", key: "employee", width: 20 },
        { header: "Issue Date", key: "issue_date", width: 20 },
        { header: "Return Date", key: "return_date", width: 20 },
        { header: "Maintenance", key: "maintenance", width: 25 },
        { header: "Warranty", key: "warranty", width: 25 },
      ];

      /**
       * HEADER STYLE
       */
      sheet.getRow(1).eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" }, // putih
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1F4E78" }, // biru gelap
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      /**
       * DATA
       */
      data.forEach((item) => {
        const row = sheet.addRow({
          asset_tag: item.asset_tag,
          serial_number: item.serial_number, // ✅ FIX INI
          product_type: item.product_type,
          category: item.category,
          status: item.status,
          location: item.location,
          employee: formatValue(item.employee),
          issue_date: formatValue(item.issue_date),
          return_date: formatValue(item.return_date),
          maintenance: formatValue(item.maintenance),
          warranty: formatValue(item.warranty),
        });

        /**
         * ZEBRA ROW (JALAN DULU)
         */
        if (row.number > 1 && row.number % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF2F2F2" }, // abu muda
            };
          });
        }

        /**
         * STATUS COLOR (OVERRIDE ZEBRA)
         */
        const statusCell = row.getCell("status");

        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: getStatusColorExcel(item.status) },
        };

        statusCell.font = {
          color: { argb: "FFFFFFFF" },
          bold: true,
        };

        statusCell.alignment = {
          horizontal: "center",
        };

        /**
         * BORDER
         */
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      /**
       * AUTO FILTER
       */
      sheet.autoFilter = {
        from: "A1",
        to: "J1",
      };

      /**
       * RESPONSE
       */
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=asset-report.xlsx",
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed export Excel" });
    }
  },

  /**
   * EXPORT PDF
   */
  async exportPDF(req: Request, res: Response) {
    try {
      const data = await ReportService.exportFullReport();

      const doc = new PDFDocument({
        margin: 30,
        size: "A4",
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=asset-report.pdf",
      );

      doc.pipe(res);

      /**
       * TITLE
       */
      doc
        .fillColor("#1F4E78")
        .fontSize(16)
        .text("Asset Report", { align: "center" });

      doc.moveDown();
      doc.fillColor("black");

      /**
       * TABLE HEADER
       */
      doc
        .fontSize(10)
        .text("Asset | Type | Category | Status | Location | Employee", {
          underline: true,
        });

      doc.moveDown(0.5);

      /**
       * DATA
       */
      data.forEach((item) => {
        doc
          .fillColor("black")
          .text(
            `${item.asset_tag} | ${item.product_type} | ${item.category} | ${item.location} | ${formatValue(item.employee)}`,
          );

        doc
          .fillColor(getStatusColorPDF(item.status))
          .text(`Status: ${item.status}`);

        doc.moveDown(0.5);
      });

      /**
       * DETAIL
       */
      doc.moveDown();

      doc
        .fontSize(12)
        .fillColor("#1F4E78")
        .text("Detail Information", { underline: true });

      doc.moveDown(0.5);
      doc.fillColor("black");

      data.forEach((item) => {
        doc
          .fontSize(9)
          .text(`Asset: ${item.asset_tag}`)
          .text(`Issue Date: ${formatValue(item.issue_date)}`)
          .text(`Return Date: ${formatValue(item.return_date)}`)
          .text(`Maintenance: ${formatValue(item.maintenance)}`)
          .text(`Warranty: ${formatValue(item.warranty)}`)
          .moveDown();
      });

      doc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed export PDF" });
    }
  },
};
