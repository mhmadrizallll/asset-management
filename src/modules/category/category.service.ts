import db from "../../config/db";

export const CategoryService = {
  async getAll() {
    return await db("categories").select("*").orderBy("id", "desc");
  },

  async getById(id: number) {
    return await db("categories").where("id", id).first();
  },

  async create(payload: { name: string }) {
    if (!payload.name) {
      throw new Error("Name is required");
    }

    if (await db("categories").where("name", payload.name).first()) {
      throw new Error("Category already exists");
    }

    const [data] = await db("categories").insert(payload).returning("*");

    return data;
  },

  async update(id: number, payload: { name: string }) {
    if (!(await db("categories").where("id", id).first())) {
      throw new Error("Category not found");
    }

    if (await db("categories").where("name", payload.name).first()) {
      throw new Error("Category already exists");
    }

    const updated = await db("categories")
      .where("id", id)
      .update(payload)
      .returning("*");

    return updated[0];
  },

  async delete(id: number) {
    if (!(await db("categories").where("id", id).first())) {
      throw new Error("Category not found");
    }
    return await db("categories").where("id", id).del();
  },
};
