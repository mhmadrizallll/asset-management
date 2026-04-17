import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("product_statuses").del();

  // Inserts seed entries
  await knex("product_statuses").insert([
    { id: 1, name: "AVAILABLE" },
    { id: 2, name: "IN_USE" },
    { id: 3, name: "MAINTENANCE" },
    { id: 4, name: "RETIRED" },
  ]);
}
