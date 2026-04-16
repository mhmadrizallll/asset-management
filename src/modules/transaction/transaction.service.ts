import db from "../../config/db";

export const TransactionService = {
  async create(payload: { employee_id: number; product_ids: number[] }) {
    return await db.transaction(async (trx) => {
      // 🔥 insert transaksi
      const [transaction] = await trx("transactions")
        .insert({
          employee_id: payload.employee_id,
          issue_date: new Date(),
          status: "ISSUED",
        })
        .returning("*");

      // 🔥 insert transaction_items
      const items = payload.product_ids.map((product_id) => ({
        transaction_id: transaction.id,
        product_id,
      }));

      await trx("transaction_items").insert(items);

      return transaction;
    });
  },

  async returnTransaction(transactionId: number) {
    return await db.transaction(async (trx) => {
      // 🔍 cek transaksi
      const transaction = await trx("transactions")
        .where("id", transactionId)
        .first();

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.status === "RETURNED") {
        throw new Error("Transaction already returned");
      }

      // 🔍 ambil semua product di transaksi
      const items = await trx("transaction_items").where(
        "transaction_id",
        transactionId,
      );

      const productIds = items.map((item) => item.product_id);

      // 🔥 update transaksi
      await trx("transactions").where("id", transactionId).update({
        status: "RETURNED",
        return_date: new Date(),
      });

      // 🔥 update product jadi AVAILABLE
      await trx("products").whereIn("id", productIds).update({
        status: "AVAILABLE",
      });

      return {
        transaction_id: transactionId,
        returned_products: productIds,
      };
    });
  },
};
