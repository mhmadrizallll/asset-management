import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("asset_logs", (table) => {
    table.increments("id").primary();

    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");

    table.string("action").notNullable();

    table.string("reference_type");
    table.integer("reference_id");

    table.text("notes");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("asset_logs");
}
