import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("conditions", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable(); // GOOD, FAIR, POOR
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("conditions");
}
