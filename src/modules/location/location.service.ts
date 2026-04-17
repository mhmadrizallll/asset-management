import db from "../../config/db";

export const LocationService = {
  async getAll() {
    const rows = await db("locations as l")
      .leftJoin("products as p", "p.current_location_id", "l.id")
      .select(
        "l.id as location_id",
        "l.name as location_name",
        "p.id as product_id",
        "p.asset_tag",
      )
      .orderBy("l.id", "asc");

    // 🔥 mapping nested
    const result: any = {};

    rows.forEach((row) => {
      if (!result[row.location_id]) {
        result[row.location_id] = {
          id: row.location_id,
          name: row.location_name,
          products: [],
        };
      }

      if (row.product_id) {
        result[row.location_id].products.push({
          id: row.product_id,
          asset_tag: row.asset_tag,
        });
      }
    });

    return Object.values(result);
  },

  async getById(id: number) {
    return await db("locations").where("id", id).first();
  },

  async create(payload: { name: string; description?: string }) {
    if (!payload.name) {
      throw new Error("Name is required");
    }

    const [data] = await db("locations").insert(payload).returning("*");

    return data;
  },

  async update(id: number, payload: any) {
    const [data] = await db("locations")
      .where("id", id)
      .update(payload)
      .returning("*");

    return data;
  },

  async delete(id: number) {
    return await db("locations").where("id", id).del();
  },
};
