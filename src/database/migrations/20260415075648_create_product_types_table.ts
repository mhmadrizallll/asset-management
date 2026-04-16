import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("product_types", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();

    table
      .integer("category_id")
      .notNullable()
      .references("id")
      .inTable("categories")
      .onDelete("RESTRICT");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("product_types");
}
