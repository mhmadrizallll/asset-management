import db from "../../config/db";

interface PurchasePayload {
  invoice_number: string;
  purchase_date: Date;
  vendor_id: number;
  items: any[]; // add this line to define the items property
}

export const PurchaseService = {
  async create(payload: PurchasePayload) {
    // jika unit_price bukan angka
    for (const item of payload.items) {
      if (
        typeof item.unit_price !== "number" ||
        Number.isNaN(item.unit_price)
      ) {
        throw new Error("Unit price must be a valid number");
      }
    }
    return await db.transaction(async (trx) => {
      // 1. insert purchase
      const [purchase] = await trx("purchases")
        .insert({
          invoice_number: payload.invoice_number,
          purchase_date: payload.purchase_date,
          vendor_id: payload.vendor_id,
        })
        .returning("*");

      // 2. insert items
      const items = payload.items.map((item) => ({
        purchase_id: purchase.id,
        product_type_id: item.product_type_id,
        qty: item.qty,
        unit_price: item.unit_price,
      }));

      await trx("purchase_items").insert(items);

      return purchase;
    });
  },

  async getAll() {
    const rows = await db("purchases as p")
      .leftJoin("vendors as v", "v.id", "p.vendor_id")
      .leftJoin("purchase_items as pi", "pi.purchase_id", "p.id")
      .leftJoin("product_types as pt", "pt.id", "pi.product_type_id")
      .select(
        "p.id",
        "p.invoice_number",
        "p.purchase_date",
        "v.name as vendor_name",

        "pi.id as item_id",
        "pi.qty",
        "pi.unit_price",

        "pt.name as product_type",
      )
      .orderBy("p.id", "desc");

    // 🔥 GROUPING
    const result: any = {};

    for (const row of rows) {
      if (!result[row.id]) {
        result[row.id] = {
          id: row.id,
          invoice_number: row.invoice_number,
          purchase_date: row.purchase_date,
          vendor: row.vendor_name,
          items: [],
        };
      }

      // kalau ada item
      if (row.item_id) {
        result[row.id].items.push({
          id: row.item_id,
          product_type: row.product_type,
          qty: row.qty,
          unit_price: row.unit_price,
        });
      }
    }

    return Object.values(result);
  },
  async getDetail(id: number) {
    // 🔹 ambil purchase + vendor
    const purchase = await db("purchases as p")
      .leftJoin("vendors as v", "v.id", "p.vendor_id")
      .select(
        "p.id",
        "p.invoice_number",
        "p.purchase_date",
        "v.name as vendor_name",
      )
      .where("p.id", id)
      .first();

    if (!purchase) throw new Error("Purchase not found");

    // 🔹 ambil items
    const items = await db("purchase_items as pi")
      .leftJoin("product_types as pt", "pt.id", "pi.product_type_id")
      .leftJoin("categories as c", "c.id", "pt.category_id")
      .select(
        "pi.id",
        "pt.name as product_type",
        "c.name as category",
        "pi.qty",
        "pi.unit_price",
      )
      .where("pi.purchase_id", id);

    return {
      ...purchase,
      items,
    };
  },
};
