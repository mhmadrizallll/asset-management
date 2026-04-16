import db from "../../config/db";

export const ProductService = {
  async getAll(query: any) {
    const { page = 1, limit = 10, search, status, category } = query;

    const offset = (page - 1) * limit;

    let baseQuery = db("products as p")
      .leftJoin("product_types as pt", "pt.id", "p.product_type_id")
      .leftJoin("categories as c", "c.id", "pt.category_id");

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

    // 🔥 FILTER STATUS
    if (status) {
      baseQuery.where("p.status", status);
    }

    // 🔥 FILTER CATEGORY
    if (category) {
      baseQuery.where("c.name", category);
    }

    // 📊 COUNT TOTAL (tanpa pagination)
    const totalQuery = baseQuery
      .clone()
      .clearSelect()
      .count("* as total")
      .first();

    // 📦 DATA PAGINATION
    const dataQuery = baseQuery
      .clone()
      .select(
        "p.id",
        "p.asset_tag",
        "p.serial_number",
        "p.status",
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
      .where("p.id", id)
      .first()
      .select(
        "p.id",
        "p.asset_tag",
        "p.serial_number",
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

    if (await db("products").where("asset_tag", payload.asset_tag).first()) {
      throw new Error("Asset tag already exists");
    }

    if (
      await db("products").where("serial_number", payload.serial_number).first()
    ) {
      throw new Error("Serial number already exists");
    }

    const [product] = await db("products").insert(payload).returning("*");

    return product;
  },

  async update(id: number, payload: any) {
    // jika id tidak ditemukan
    if (!(await db("products").where("id", id).first())) {
      throw new Error("Product not found");
    }

    if (await db("products").where("asset_tag", payload.asset_tag).first()) {
      throw new Error("Asset tag already exists");
    }

    if (
      await db("products").where("serial_number", payload.serial_number).first()
    ) {
      throw new Error("Serial number already exists");
    }

    const updated = await db("products")
      .where("id", id)
      .update(payload)
      .returning("*");

    return updated[0];
  },

  async delete(id: number) {
    // jika id tidak ditemukan
    if (!(await db("products").where("id", id).first())) {
      throw new Error("Product not found or already deleted");
    }
    return await db("products").where("id", id).del();
  },
};
