import db from "../../config/db";
import { PRODUCT_STATUS } from "../../utils/constans";
import { AssetLogService } from "../asset-log/assetLog.service";

interface MaintenancePayload {
  product_id: number;
  // add other properties if needed
}

export const MaintenanceService = {
  async create(payload: MaintenancePayload) {
    return await db.transaction(async (trx) => {
      // 1. insert maintenance
      const [maintenance] = await trx("maintenances")
        .insert(payload)
        .returning("*");

      // 2. update product status → MAINTENANCE
      await trx("products").where("id", payload.product_id).update({
        status_id: PRODUCT_STATUS.MAINTENANCE,
      });

      // 3. log
      await AssetLogService.create({
        product_id: payload.product_id,
        action: "MAINTENANCE",
        reference_type: "maintenance",
        reference_id: maintenance.id,
      });

      return maintenance;
    });
  },

  async getByProduct(productId: number) {
    return await db("maintenances")
      .where("product_id", productId)
      .orderBy("created_at", "desc");
  },
};
