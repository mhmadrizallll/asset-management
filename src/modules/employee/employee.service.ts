import db from "../../config/db";

export const EmployeeService = {
  async getAll() {
    return await db("employees").select("*").orderBy("id", "desc");
  },

  async getById(id: number) {
    return await db("employees").where("id", id).first();
  },

  async create(payload: any) {
    if (!payload.name) {
      throw new Error("Name is required");
    }

    // jika nama dan email sudah ada
    if (
      await db("employees")
        .where("name", payload.name)
        .orWhere("email", payload.email)
        .first()
    ) {
      throw new Error("Name or email already exists");
    }

    const [data] = await db("employees").insert(payload).returning("*");

    return data;
  },

  async update(id: number, payload: any) {
    // jika id tidak ditemukan
    if (!(await db("employees").where("id", id).first())) {
      throw new Error("Employee not found");
    }
    const [data] = await db("employees")
      .where("id", id)
      .update(payload)
      .returning("*");

    return data;
  },

  async delete(id: number) {
    if (!(await db("employees").where("id", id).first())) {
      throw new Error("Employee not found / already deleted");
    }
    return await db("employees").where("id", id).del();
  },
};
