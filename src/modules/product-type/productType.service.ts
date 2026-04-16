import db from "../../config/db";

export const ProductTypeService = {
  async getAll() {
    return await db("product_types as pt")
      .leftJoin("categories as c", "c.id", "pt.category_id")
      .select(
        "pt.id",
        "pt.name",
        "pt.category_id",
        "pt.created_at",
        "c.name as category",
      )
      .orderBy("pt.id", "desc");
  },

  async getById(id: number) {
    return await db("product_types").where("id", id).first();
  },

  async create(payload: any) {
    if (!payload.name || !payload.category_id) {
      throw new Error("name dan category_id wajib");
    }

    const [data] = await db("product_types").insert(payload).returning("*");

    return data;
  },

  async update(id: number, payload: any) {
    const [data] = await db("product_types")
      .where("id", id)
      .update(payload)
      .returning("*");

    return data;
  },

  async delete(id: number) {
    return await db("product_types").where("id", id).del();
  },
};
