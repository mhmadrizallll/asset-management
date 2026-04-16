import db from "../../config/db";

export const DashboardService = {
  async getSummary() {
    const result = await db("products")
      .select(
        db.raw("COUNT(*) as total"),
        db.raw("COUNT(*) FILTER (WHERE status = 'AVAILABLE') as available"),
        db.raw("COUNT(*) FILTER (WHERE status = 'IN_USE') as in_use"),
        db.raw("COUNT(*) FILTER (WHERE status = 'MAINTENANCE') as maintenance"),
      )
      .first();

    return {
      total_assets: Number(result.total),
      available: Number(result.available),
      in_use: Number(result.in_use),
      maintenance: Number(result.maintenance),
    };
  },
};
