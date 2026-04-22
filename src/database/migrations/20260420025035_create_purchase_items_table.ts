import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("purchase_items", (table) => {
    table.increments("id").primary();

    table
      .integer("purchase_id")
      .notNullable()
      .references("id")
      .inTable("purchases")
      .onDelete("CASCADE");

    table
      .integer("product_type_id")
      .notNullable()
      .references("id")
      .inTable("product_types");

    table.integer("qty").notNullable();
    table.decimal("unit_price");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("purchase_items");
}
