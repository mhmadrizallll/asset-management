import db from "../../config/db";
import { AssetLogService } from "../asset-log/assetLog.service";
import { PRODUCT_STATUS } from "../../utils/constans";

export const TransactionService = {
  async getAll() {
    return await db("transactions").select("*").orderBy("id", "desc");
  },
  async create(payload: { employee_id: number; product_ids: number[] }) {
    return await db.transaction(async (trx) => {
      // 🔍 cek transaksi aktif
      const existing = await trx("transactions")
        .where("employee_id", payload.employee_id)
        .where("status_id", 1) // ISSUED
        .first();

      if (existing) {
        throw new Error("Employee already has an issued transaction");
      }

      // 🔍 cek products
      const products = await trx("products").whereIn("id", payload.product_ids);

      if (products.length !== payload.product_ids.length) {
        throw new Error("Some products not found");
      }

      for (const p of products) {
        if (p.status_id !== PRODUCT_STATUS.AVAILABLE) {
          throw new Error(`Product ${p.id} not available`);
        }
      }

      // 🔥 insert transaksi
      const [transaction] = await trx("transactions")
        .insert({
          employee_id: payload.employee_id,
          issue_date: new Date(),
          status_id: 1,
        })
        .returning("*");

      // 🔥 insert items
      const items = payload.product_ids.map((product_id) => ({
        transaction_id: transaction.id,
        product_id,
      }));

      await trx("transaction_items").insert(items);

      // 🔥 update product
      await trx("products")
        .whereIn("id", payload.product_ids)
        .update({ status_id: PRODUCT_STATUS.IN_USE });

      return transaction;
    });
  },

  async returnTransaction(transactionId: number) {
    return await db.transaction(async (trx) => {
      const TRANSACTION_STATUS = {
        ISSUED: 1,
        RETURNED: 2,
      };

      const transaction = await trx("transactions")
        .where("id", transactionId)
        .first();

      if (!transaction) throw new Error("Transaction not found");

      if (transaction.status_id === TRANSACTION_STATUS.RETURNED) {
        throw new Error("Transaction already returned");
      }

      const items = await trx("transaction_items").where(
        "transaction_id",
        transactionId,
      );

      if (!items.length) {
        throw new Error("No products found");
      }

      const productIds = items.map((i) => i.product_id);

      await trx("transactions").where("id", transactionId).update({
        status_id: TRANSACTION_STATUS.RETURNED,
        return_date: new Date(),
      });

      await trx("products").whereIn("id", productIds).update({
        status_id: PRODUCT_STATUS.AVAILABLE,
      });

      for (const product_id of productIds) {
        await AssetLogService.create(
          {
            product_id,
            action: "RETURNED",
            reference_type: "transaction",
            reference_id: transactionId,
          },
          trx,
        );
      }

      return { transactionId, productIds };
    });
  },
};
