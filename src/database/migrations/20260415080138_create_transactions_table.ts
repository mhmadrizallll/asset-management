import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();

    table
      .integer("employee_id")
      .notNullable()
      .references("id")
      .inTable("employees")
      .onDelete("RESTRICT");

    table.timestamp("issue_date");
    table.timestamp("return_date");

    table.string("status"); // simple dulu (ISSUED, RETURNED)

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
