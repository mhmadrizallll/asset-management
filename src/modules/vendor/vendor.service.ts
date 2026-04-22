import db from "../../config/db";

interface VendorPayload {
  name: string;
  email: string;
  description?: string;
}

export const VendorService = {
  async create(payload: VendorPayload) {
    return await db("vendors").insert(payload).returning("*");
  },

  async getAll() {
    return await db("vendors").orderBy("id", "desc");
  },

  async update(id: number, payload: VendorPayload) {
    return await db("vendors").where({ id }).update(payload).returning("*");
  },

  async delete(id: number) {
    return await db("vendors").where({ id }).del();
  },
};
