import db from "../../config/db";

interface WarrantyPayload {
  name: string;
  description: string;
  // add other properties as needed
}

export const WarrantyService = {
  async create(payload: WarrantyPayload) {
    return await db("warranties").insert(payload).returning("*");
  },

  async getByProduct(productId: number) {
    return await db("warranties")
      .where("product_id", productId)
      .orderBy("created_at", "desc");
  },
};
