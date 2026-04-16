import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transaction_items", (table) => {
    table.increments("id").primary();

    table
      .integer("transaction_id")
      .notNullable()
      .references("id")
      .inTable("transactions")
      .onDelete("CASCADE");

    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");

    table.unique(["transaction_id", "product_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transaction_items");
}
