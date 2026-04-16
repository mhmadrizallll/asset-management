import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("asset_tag").unique().notNullable();
    table.string("serial_number").unique();

    table
      .integer("product_type_id")
      .notNullable()
      .references("id")
      .inTable("product_types")
      .onDelete("RESTRICT");

    table
      .integer("current_location_id")
      .references("id")
      .inTable("locations")
      .onDelete("SET NULL");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("products");
}
