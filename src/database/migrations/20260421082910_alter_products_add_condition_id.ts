import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("products", (table) => {
    table
      .integer("condition_id")
      .unsigned()
      .references("id")
      .inTable("conditions")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("condition_id");
  });
}
