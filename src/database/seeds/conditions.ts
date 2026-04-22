import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("conditions").del();

  // Inserts seed entries
  await knex("conditions").insert([
    { id: 1, name: "GOOD" },
    { id: 2, name: "FAIR" },
    { id: 3, name: "POOR" },
    { id: 4, name: "DAMAGED" },
  ]);
}
