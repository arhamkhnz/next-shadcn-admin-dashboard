// import { createClient, User } from "@supabase/supabase-js";
// import { faker } from "@faker-js/faker";
// import * as dotenv from "dotenv";
// import * as path from "path";

// // Load environment variables from .env.local
// dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!supabaseUrl || !supabaseServiceKey) {
//   throw new Error("Supabase URL or Service Role Key is not defined in environment variables.");
// }

// const supabase = createClient(supabaseUrl, supabaseServiceKey);

// const seedDatabase = async () => {
//   console.log("Starting to seed the database...");

//   // ----------------------------------------------------------------
//   // 1. Create Static Users for Login
//   // ----------------------------------------------------------------
//   console.log("Creating static users...");

//   const usersToCreate = [
//     { email: "admin@karwi.com", password: "password", name: "Karwi Admin" },
//     { email: "franchise@karwi.com", password: "password", name: "Franchise Owner" },
//   ];

//   const createdUsers: User[] = [];

//   for (const userData of usersToCreate) {
//     // Create user in Supabase Auth
//     await supabase.auth.admin.createUser({
//       email: userData.email,
//       password: userData.password,
//       email_confirm: true,
//     });

//     // Get the created user
//     const { data: userRes, error: userErr } = await supabase.auth.admin.listUsers();
//     if (userErr || !userRes) {
//       console.error(`Could not list users: ${userErr?.message}`);
//       continue;
//     }
//     const user = userRes.users.find(u => u.email === userData.email);

//     if (user) {
//       // Insert into the public.admins table
//       await supabase
//         .from("admins")
//         .upsert({ id: user.id, name: userData.name, email: userData.email });

//       createdUsers.push(user);
//       console.log(`User ${userData.email} created and profile inserted.`);
//     } else {
//       console.error(`Could not find user ${userData.email} after creation.`);
//     }
//   }

//   const adminUser = createdUsers.find(u => u.email === "admin@karwi.com");
//   const franchiseUser = createdUsers.find(u => u.email === "franchise@karwi.com");

//   if (!adminUser || !franchiseUser) {
//     console.error("Failed to create one or more static users. Aborting.");
//     return;
//   }

//   // ----------------------------------------------------------------
//   // 2. Seed Franchises and link one to the franchise user
//   // ----------------------------------------------------------------
//   console.log("Seeding franchises...");
//   const franchisesToCreate = [
//     // Link the first franchise to our specific franchise owner
//     {
//       admin_id: franchiseUser.id,
//       name: `${faker.company.name()} Holdings`,
//     },
//     // Create other franchises linked to the general admin or franchise user
//     ...Array.from({ length: 4 }, () => ({
//       admin_id: faker.helpers.arrayElement([adminUser.id, franchiseUser.id]),
//       name: `${faker.company.name()} Holdings`,
//     })),
//   ];

//   const { data: seededFranchises, error: franchiseError } = await supabase
//     .from("franchises")
//     .insert(franchisesToCreate)
//     .select();

//   if (franchiseError || !seededFranchises) {
//     console.error("Error seeding franchises:", franchiseError?.message);
//     return;
//   }
//   console.log(`${seededFranchises.length} franchises seeded.`);

//   console.log("Database seeding completed successfully!");
// };

// seedDatabase().catch((error) => {
//   console.error("An unexpected error occurred during seeding:", error.message);
// });
