import db from "../../config/db";
import { PRODUCT_STATUS } from "../../utils/constans";
import { AssetLogService } from "../asset-log/assetLog.service";

export const ProductService = {
  async getAll(query: any) {
    const { page = 1, limit = 10, search, status, category } = query;

    const offset = (page - 1) * limit;

    let baseQuery = db("products as p")
      .leftJoin("product_types as pt", "pt.id", "p.product_type_id")
      .leftJoin("categories as c", "c.id", "pt.category_id")
      .leftJoin("product_statuses as ps", "ps.id", "p.status_id");

    // 🔍 SEARCH
    if (search) {
      baseQuery.where((qb) => {
        qb.where("p.asset_tag", "ilike", `%${search}%`).orWhere(
          "p.serial_number",
          "ilike",
          `%${search}%`,
        );
      });
    }

    // 🔥 FILTER STATUS (pakai nama)
    if (status) {
      baseQuery.where("ps.name", status);
    }

    // 🔥 FILTER CATEGORY
    if (category) {
      baseQuery.where("c.name", category);
    }

    // 📊 COUNT TOTAL
    const totalQuery = baseQuery
      .clone()
      .clearSelect()
      .count("* as total")
      .first();

    // 📦 DATA
    const dataQuery = baseQuery
      .clone()
      .select(
        "p.id",
        "p.asset_tag",
        "p.serial_number",
        "ps.name as status", // ✅ FIX
        "p.current_location_id",
        "pt.name as product_type",
        "c.name as category",
      )
      .limit(limit)
      .offset(offset)
      .orderBy("p.id", "desc");

    const [totalResult, data] = await Promise.all([totalQuery, dataQuery]);

    const total = Number(totalResult?.total || 0);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: number) {
    const row = await db("products as p")
      .leftJoin("product_types as pt", "pt.id", "p.product_type_id")
      .leftJoin("categories as c", "c.id", "pt.category_id")
      .leftJoin("locations as l", "l.id", "p.current_location_id")
      .leftJoin("product_statuses as ps", "ps.id", "p.status_id")
      .where("p.id", id)
      .first()
      .select(
        "p.id",
        "p.asset_tag",
        "p.serial_number",
        "ps.name as status",
        "pt.name as product_type",
        "c.name as category",
        "l.name as location",
        "p.created_at",
      );

    return row;
  },

  async create(payload: any) {
    if (!payload.asset_tag || !payload.serial_number) {
      throw new Error("asset_tag dan serial_number wajib");
    }

    // 🔍 UNIQUE CHECK
    if (await db("products").where("asset_tag", payload.asset_tag).first()) {
      throw new Error("Asset tag already exists");
    }

    if (
      await db("products").where("serial_number", payload.serial_number).first()
    ) {
      throw new Error("Serial number already exists");
    }

    const [product] = await db("products")
      .insert({
        ...payload,
        status_id: PRODUCT_STATUS.AVAILABLE,
      })
      .returning("*");

    // 🔥 LOG
    await AssetLogService.create({
      product_id: product.id,
      action: "CREATED",
    });

    return product;
  },

  async update(id: number, payload: any) {
    const existing = await db("products").where("id", id).first();

    if (!existing) {
      throw new Error("Product not found");
    }

    // 🔍 UNIQUE CHECK (exclude current id)
    if (
      payload.asset_tag &&
      (await db("products")
        .where("asset_tag", payload.asset_tag)
        .whereNot("id", id)
        .first())
    ) {
      throw new Error("Asset tag already exists");
    }

    if (
      payload.serial_number &&
      (await db("products")
        .where("serial_number", payload.serial_number)
        .whereNot("id", id)
        .first())
    ) {
      throw new Error("Serial number already exists");
    }

    const [updated] = await db("products")
      .where("id", id)
      .update(payload)
      .returning("*");

    return updated;
  },

  async delete(id: number) {
    const existing = await db("products").where("id", id).first();

    if (!existing) {
      throw new Error("Product not found or already deleted");
    }

    return await db("products").where("id", id).del();
  },

  async exportData() {
    return await db("products as p")
      .leftJoin("product_types as pt", "pt.id", "p.product_type_id")
      .leftJoin("categories as c", "c.id", "pt.category_id")
      .leftJoin("locations as l", "l.id", "p.current_location_id")
      .leftJoin("product_statuses as ps", "ps.id", "p.status_id")

      // 🔥 TAMBAHAN
      .leftJoin("transaction_items as ti", "ti.product_id", "p.id")
      .leftJoin("transactions as t", "t.id", "ti.transaction_id")
      .leftJoin("employees as e", "e.id", "t.employee_id")

      .select(
        "p.asset_tag",
        "p.serial_number",
        "ps.name as status",
        "pt.name as product_type",
        "c.name as category",
        "l.name as location",
        "e.name as employee", // ✅ INI YANG KURANG
        "t.issue_date",
        "t.return_date",
        "p.created_at",
      )
      .orderBy("p.id", "desc");
  },
};
