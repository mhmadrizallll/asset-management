import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("warranties", (table) => {
    table.increments("id").primary();

    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");

    table.date("start_date");
    table.date("expiry_date");
    table.text("notes");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("warranties");
}
