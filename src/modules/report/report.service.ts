import db from "../../config/db";

export const ReportService = {
  async exportFullReport() {
    // 🔥 TRANSAKSI TERAKHIR
    const latestTransaction = db("transaction_items as ti")
      .join("transactions as t", "t.id", "ti.transaction_id")
      .select(
        "ti.product_id",
        "t.employee_id",
        "t.issue_date",
        "t.return_date",
        db.raw(`
        ROW_NUMBER() OVER (
          PARTITION BY ti.product_id
          ORDER BY t.issue_date DESC
        ) as rn
      `),
      )
      .as("lt");

    // 🔥 MAINTENANCE TERAKHIR
    const latestMaintenance = db("maintenances")
      .select("product_id")
      .max("maintenance_date as maintenance_date")
      .groupBy("product_id")
      .as("m");

    // 🔥 WARRANTY TERAKHIR
    const latestWarranty = db("warranties")
      .select("product_id")
      .max("expiry_date as expiry_date")
      .groupBy("product_id")
      .as("w");

    return await db("products as p")
      .leftJoin("product_types as pt", "pt.id", "p.product_type_id")
      .leftJoin("categories as c", "c.id", "pt.category_id")
      .leftJoin("product_statuses as ps", "ps.id", "p.status_id")

      // ⚠️ OPTIONAL (kalau sudah ada di DB)
      .leftJoin("conditions as cond", "cond.id", "p.condition_id")

      .leftJoin("locations as l", "l.id", "p.current_location_id")

      // 🔥 JOIN TRANSAKSI TERAKHIR
      .leftJoin(latestTransaction, function () {
        this.on("lt.product_id", "=", "p.id").andOn("lt.rn", "=", db.raw("1"));
      })

      .leftJoin("employees as e", "e.id", "lt.employee_id")

      // 🔥 JOIN MAINTENANCE & WARRANTY
      .leftJoin(latestMaintenance, "m.product_id", "p.id")
      .leftJoin(latestWarranty, "w.product_id", "p.id")

      .select(
        "p.asset_tag",
        "p.serial_number",

        "ps.name as status",
        "pt.name as product_type",
        "c.name as category",

        // ⚠️ kalau belum ada, hapus
        "cond.name as condition",

        "l.name as location",

        // 🔥 transaksi terakhir
        "e.name as employee",
        "lt.issue_date",
        "lt.return_date",

        // 🔥 maintenance & warranty
        "m.maintenance_date as maintenance",
        "w.expiry_date as warranty",

        "p.created_at",
      )

      .orderBy("p.id", "desc");
  },
  async getMaintenance(productId: Number) {
    return await db("maintenances")
      .where("product_id", productId)
      .orderBy("maintenance_date", "desc")
      .first();
  },

  async getWarranty(productId: Number) {
    return await db("warranties")
      .where("product_id", productId)
      .orderBy("expiry_date", "desc")
      .first();
  },
};
