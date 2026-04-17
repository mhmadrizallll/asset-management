import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 🔥 DELETE (urutan dari child → parent)
  await knex("transaction_items").del();
  await knex("transactions").del();
  await knex("products").del();
  await knex("employees").del();
  await knex("locations").del();
  await knex("product_types").del();
  await knex("categories").del();
  await knex("transaction_statuses").del(); // ✅ tambah ini

  // ✅ transaction_statuses (WAJIB DULU)
  await knex("transaction_statuses").insert([
    { id: 1, name: "ISSUED" },
    { id: 2, name: "RETURNED" },
  ]);

  // ✅ categories
  await knex("categories").insert([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Furniture" },
  ]);

  // ✅ product_types
  await knex("product_types").insert([
    { id: 1, name: "Laptop", category_id: 1 },
    { id: 2, name: "Monitor", category_id: 1 },
    { id: 3, name: "Chair", category_id: 2 },
  ]);

  // ✅ locations
  await knex("locations").insert([
    { id: 1, name: "Gudang Utama" },
    { id: 2, name: "Ruang IT" },
  ]);

  // ✅ employees
  await knex("employees").insert([
    { id: 1, name: "Rizal", email: "rizal@mail.com", department: "IT" },
    { id: 2, name: "Budi", email: "budi@mail.com", department: "HR" },
  ]);

  // ✅ products
  await knex("products").insert([
    {
      id: 1,
      asset_tag: "AST-001",
      serial_number: "SN-LAP-001",
      product_type_id: 1,
      current_location_id: 1,
      status_id: 1, // AVAILABLE (pastikan ada di product_statuses)
    },
    {
      id: 2,
      asset_tag: "AST-002",
      serial_number: "SN-MON-001",
      product_type_id: 2,
      current_location_id: 1,
      status_id: 1,
    },
    {
      id: 3,
      asset_tag: "AST-003",
      serial_number: "SN-CHR-001",
      product_type_id: 3,
      current_location_id: 2,
      status_id: 1,
    },
  ]);

  // ✅ transactions (FIX DI SINI)
  await knex("transactions").insert([
    {
      id: 1,
      employee_id: 1,
      issue_date: new Date(),
      status_id: 1, // ISSUED
    },
  ]);

  // ✅ transaction_items
  await knex("transaction_items").insert([
    {
      transaction_id: 1,
      product_id: 1,
    },
    {
      transaction_id: 1,
      product_id: 2,
    },
  ]);
}
