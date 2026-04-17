import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("product_locations", (table) => {
    table.increments("id").primary();

    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");

    table
      .integer("location_id")
      .notNullable()
      .references("id")
      .inTable("locations")
      .onDelete("RESTRICT");

    table
      .integer("moved_by_employee_id")
      .references("id")
      .inTable("employees")
      .onDelete("SET NULL");

    table
      .integer("transaction_id")
      .references("id")
      .inTable("transactions")
      .onDelete("SET NULL");

    table.timestamp("start_date").defaultTo(knex.fn.now());
    table.timestamp("end_date").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("product_locations");
}
