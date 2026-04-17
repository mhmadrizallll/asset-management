import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("transaction_statuses").del();

  await knex("transaction_statuses").insert([
    { id: 1, name: "ISSUED" },
    { id: 2, name: "RETURNED" },
    { id: 3, name: "OVERDUE" },
    { id: 4, name: "LOST" },
  ]);
}
