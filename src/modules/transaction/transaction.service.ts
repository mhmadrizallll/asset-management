import db from "../../config/db";
import { AssetLogService } from "../asset-log/assetLog.service";
import { PRODUCT_STATUS } from "../../utils/constans";

export const TransactionService = {
  async getAll() {
    const rows = await db("transactions as t")
      .leftJoin("employees as e", "e.id", "t.employee_id")
      .leftJoin("transaction_items as ti", "ti.transaction_id", "t.id")
      .leftJoin("products as p", "p.id", "ti.product_id")
      .leftJoin("product_statuses as ps", "ps.id", "p.status_id")
      .leftJoin("transaction_statuses as ts", "ts.id", "t.status_id")

      .select(
        "t.id as transaction_id",
        "t.issue_date",
        "t.return_date",

        "ts.name as status",

        "e.id as employee_id",
        "e.name as employee_name",

        "ti.id as item_id",

        "p.id as product_id",
        "p.asset_tag",
        "p.serial_number",
        "ps.name as product_status",
      )
      .orderBy("t.id", "desc");

    // 🔥 GROUPING MANUAL
    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.transaction_id)) {
        map.set(row.transaction_id, {
          id: row.transaction_id,
          status: row.status,
          issue_date: row.issue_date,
          return_date: row.return_date,

          employee: {
            id: row.employee_id,
            name: row.employee_name,
          },

          items: [],
        });
      }

      // 🔥 push item
      if (row.item_id) {
        map.get(row.transaction_id).items.push({
          id: row.item_id,
          product: {
            id: row.product_id,
            asset_tag: row.asset_tag,
            serial_number: row.serial_number,
            status: row.product_status,
          },
        });
      }
    }

    return Array.from(map.values());
  },
  async create(payload: { employee_id: number; product_ids: number[] }) {
    return await db.transaction(async (trx) => {
      // 🔍 cek transaksi aktif
      // const existing = await trx("transactions")
      //   .where("employee_id", payload.employee_id)
      //   .where("status_id", 1) // ISSUED
      //   .first();

      // if (existing) {
      //   throw new Error("Employee already has an issued transaction");
      // }

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
