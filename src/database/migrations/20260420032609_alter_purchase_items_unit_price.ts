import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("purchase_items", (table) => {
    table.decimal("unit_price", 15, 2).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("purchase_items", (table) => {
    table.decimal("unit_price").alter();
  });
}
