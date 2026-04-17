import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table
      .integer("status_id")
      .references("id")
      .inTable("transaction_statuses")
      .onDelete("SET NULL");

    table.dropColumn("status"); // optional kalau mau hapus
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("status_id");
    table.string("status");
  });
}
