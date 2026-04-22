import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("maintenances", (table) => {
    table.increments("id").primary();

    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");

    table.date("maintenance_date");
    table.text("description");
    table.decimal("cost");
    table.string("performed_by");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("maintenances");
}
