import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("purchases", (table) => {
    table.increments("id").primary();
    table.string("invoice_number");
    table.date("purchase_date");

    table
      .integer("vendor_id")
      .references("id")
      .inTable("vendors")
      .onDelete("SET NULL");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("purchases");
}
