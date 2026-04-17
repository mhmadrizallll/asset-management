import db from "../../config/db";

import { AssetLogService } from "../asset-log/assetLog.service";

export const ProductLocationService = {
  async getAll() {
    return await db("product_locations").select("*").orderBy("id", "desc");
  },

  async getById(id: number) {
    return await db("product_locations").where("id", id).first();
  },
  async moveProduct(payload: {
    product_id: number;
    location_id: number;
    moved_by_employee_id?: number;
    transaction_id?: number;
  }) {
    return await db.transaction(async (trx) => {
      const now = new Date();

      // 🔍 tutup lokasi lama
      await trx("product_locations")
        .where("product_id", payload.product_id)
        .whereNull("end_date")
        .update({ end_date: now });

      // 🔥 insert lokasi baru
      const [data] = await trx("product_locations")
        .insert({
          product_id: payload.product_id,
          location_id: payload.location_id,
          moved_by_employee_id: payload.moved_by_employee_id,
          transaction_id: payload.transaction_id,
          start_date: now,
        })
        .returning("*");

      // 🔥 update current_location di products
      await trx("products")
        .where("id", payload.product_id)
        .update({ current_location_id: payload.location_id });

      await AssetLogService.create({
        product_id: payload.product_id,
        action: "MOVED",
        notes: "Pindah lokasi",
      });

      return data;
    });
  },

  async getHistory(productId: number) {
    return await db("product_locations as pl")
      .leftJoin("locations as l", "l.id", "pl.location_id")
      .leftJoin("employees as e", "e.id", "pl.moved_by_employee_id")
      .select(
        "pl.id",
        "l.name as location",
        "e.name as moved_by",
        "pl.start_date",
        "pl.end_date",
      )
      .where("pl.product_id", productId)
      .orderBy("pl.start_date", "desc");
  },
};
