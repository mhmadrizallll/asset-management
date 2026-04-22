import db from "../../config/db";

export const DashboardService = {
  async getSummary() {
    const total = await db("products").count("id as count").first();

    const byStatus = await db("products as p")
      .leftJoin("product_statuses as ps", "ps.id", "p.status_id")
      .select("ps.name")
      .count("p.id as total")
      .groupBy("ps.name");

    const result = {
      total: total ? Number(total.count) : 0,
      available: 0,
      in_use: 0,
      maintenance: 0,
    };

    byStatus.forEach((item) => {
      if (item.name === "AVAILABLE") result.available = Number(item.total);
      if (item.name === "IN_USE") result.in_use = Number(item.total);
      if (item.name === "MAINTENANCE") result.maintenance = Number(item.total);
    });

    return result;
  },

  async getByCategory() {
    return await db("products as p")
      .leftJoin("product_types as pt", "pt.id", "p.product_type_id")
      .leftJoin("categories as c", "c.id", "pt.category_id")
      .select("c.name as category")
      .count("p.id as total")
      .groupBy("c.name");
  },

  async getMaintenancePerMonth() {
    return await db("maintenances")
      .select(db.raw("TO_CHAR(maintenance_date, 'YYYY-MM') as month"))
      .count("id as total")
      .groupByRaw("month")
      .orderBy("month");
  },

  async getDashboard() {
    const summary = await this.getSummary();
    const by_category = await this.getByCategory();
    const maintenance_per_month = await this.getMaintenancePerMonth();

    return {
      summary,
      by_category,
      maintenance_per_month,
    };
  },
};
