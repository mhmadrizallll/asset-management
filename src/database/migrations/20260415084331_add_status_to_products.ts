import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("products", (table) => {
    table
      .enu("status", ["AVAILABLE", "IN_USE", "MAINTENANCE", "BROKEN"])
      .defaultTo("AVAILABLE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("status");
  });
}
