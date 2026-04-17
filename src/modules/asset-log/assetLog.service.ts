import db from "../../config/db";
import { Knex } from "knex";

export const AssetLogService = {
  async create(
    payload: {
      product_id: number;
      action: string;
      reference_type?: string;
      reference_id?: number;
      notes?: string;
    },
    trx?: Knex.Transaction,
  ) {
    const query = trx || db;

    return await query("asset_logs").insert(payload);
  },

  async getByProduct(productId: number) {
    return await db("asset_logs")
      .where("product_id", productId)
      .orderBy("created_at", "desc");
  },
};
