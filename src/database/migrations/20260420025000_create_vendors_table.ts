import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("vendors", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("contact_number");
    table.text("address");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("vendors");
}
