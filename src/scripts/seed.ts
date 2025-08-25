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
//     const user = userRes.users.find((u) => u.email === userData.email);

//     if (user) {
//       // Insert into the public.admins table
//       await supabase.from("admins").upsert({ id: user.id, name: userData.name, email: userData.email });

//       createdUsers.push(user);
//       console.log(`User ${userData.email} created and profile inserted.`);
//     } else {
//       console.error(`Could not find user ${userData.email} after creation.`);
//     }
//   }

//   const adminUser = createdUsers.find((u) => u.email === "admin@karwi.com");
//   const franchiseUser = createdUsers.find((u) => u.email === "franchise@karwi.com");

//   if (!adminUser || !franchiseUser) {
//     console.error("Failed to create one or more static users. Aborting.");
//     return;
//   }

//   // ----------------------------------------------------------------
//   // 2. Seed Franchises
//   // ----------------------------------------------------------------
//   console.log("Seeding franchises...");
//   const franchisesToCreate = [
//     {
//       admin_id: franchiseUser.id,
//       name: `${faker.company.name()} Holdings`,
//     },
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

//   // ----------------------------------------------------------------
//   // 3. Seed Branches for each Franchise
//   // ----------------------------------------------------------------
//   console.log("Seeding branches...");
//   const branchesToCreate = seededFranchises.flatMap((franchise) =>
//     Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
//       franchise_id: franchise.id,
//       name: `${faker.company.name()} ${faker.location.city()}`,
//       address: faker.location.streetAddress(),
//       city: faker.location.city(),
//       phone_number: faker.phone.number(),
//       latitude: faker.location.latitude(),
//       longitude: faker.location.longitude(),
//     })),
//   );

//   const { data: seededBranches, error: branchError } = await supabase
//     .from("branches")
//     .insert(branchesToCreate)
//     .select();

//   if (branchError || !seededBranches) {
//     console.error("Error seeding branches:", branchError?.message);
//     return;
//   }
//   console.log(`${seededBranches.length} branches seeded.`);

//   // ----------------------------------------------------------------
//   // 4. Seed Branch Hours
//   // ----------------------------------------------------------------
//   console.log("Seeding branch hours...");
//   const branchHoursToCreate = seededBranches.flatMap((branch) =>
//     Array.from({ length: 7 }, (_, i) => ({
//       branch_id: branch.id,
//       day_of_week: i, // 0 = Sunday, 6 = Saturday
//       open_time: "09:00:00",
//       close_time: "18:00:00",
//       is_closed: i === 0, // Close on Sundays
//     })),
//   );

//   const { error: branchHoursError } = await supabase.from("branch_hours").insert(branchHoursToCreate);

//   if (branchHoursError) {
//     console.error("Error seeding branch hours:", branchHoursError.message);
//     return;
//   }
//   console.log("Branch hours seeded.");

//   // ----------------------------------------------------------------
//   // 5. Seed Washers for each Branch
//   // ----------------------------------------------------------------
//   console.log("Seeding washers...");
//   const washersToCreate = seededBranches.flatMap((branch) =>
//     Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
//       id: faker.string.uuid(),
//       branch_id: branch.id,
//       name: faker.person.fullName(),
//       phone: faker.phone.number(),
//     })),
//   );

//   const { data: seededWashers, error: washerError } = await supabase.from("washers").insert(washersToCreate).select();

//   if (washerError || !seededWashers) {
//     console.error("Error seeding washers:", washerError.message);
//     return;
//   }
//   console.log(`${seededWashers.length} washers seeded.`);

//   // ----------------------------------------------------------------
//   // 6. Seed Services (Global and Branch-Specific)
//   // ----------------------------------------------------------------
//   console.log("Seeding services...");
//   const globalServicesToCreate = [
//     { name: "Standard Wash", price: 25.0, duration_min: 30, is_global: true },
//     { name: "Premium Wash", price: 45.0, duration_min: 45, is_global: true },
//     { name: "Interior Detailing", price: 80.0, duration_min: 90, is_global: true },
//   ];

//   const branchServicesToCreate = seededBranches.flatMap((branch) =>
//     Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
//       branch_id: branch.id,
//       name: faker.commerce.productName(),
//       price: faker.commerce.price({ min: 20, max: 150 }),
//       duration_min: faker.helpers.arrayElement([30, 45, 60, 90, 120]),
//       is_global: false,
//     })),
//   );

//   const { data: seededServices, error: serviceError } = await supabase
//     .from("services")
//     .insert([...globalServicesToCreate, ...branchServicesToCreate])
//     .select();

//   if (serviceError || !seededServices) {
//     console.error("Error seeding services:", serviceError.message);
//     return;
//   }
//   console.log(`${seededServices.length} services seeded.`);

//   // ----------------------------------------------------------------
//   // 7. Seed Customers (Users)
//   // ----------------------------------------------------------------
//   console.log("Seeding customers...");
//   const customersToCreate = Array.from({ length: 50 }, () => ({
//     email: faker.internet.email(),
//     password: "password",
//     name: faker.person.fullName(),
//     phone: faker.phone.number(),
//   }));

//   const seededCustomers: User[] = [];
//   for (const customer of customersToCreate) {
//     const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
//       email: customer.email,
//       password: customer.password,
//       email_confirm: true,
//     });

//     if (authError || !authUser.user) {
//       console.error(`Error creating customer auth user ${customer.email}:`, authError?.message);
//       continue;
//     }

//     const { error: userProfileError } = await supabase.from("users").insert({
//       id: authUser.user.id,
//       name: customer.name,
//       phone: customer.phone,
//     });

//     if (userProfileError) {
//       console.error(`Error creating customer profile ${customer.email}:`, userProfileError.message);
//     } else {
//       seededCustomers.push(authUser.user);
//     }
//   }
//   console.log(`${seededCustomers.length} customers seeded.`);

//   // ----------------------------------------------------------------
//   // 8. Seed Cars for Customers
//   // ----------------------------------------------------------------
//   console.log("Seeding cars...");
//   const carsToCreate = seededCustomers.flatMap((customer) =>
//     Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => ({
//       user_id: customer.id,
//       make: faker.vehicle.manufacturer(),
//       model: faker.vehicle.model(),
//       year: faker.number.int({ min: 2010, max: 2024 }),
//       color: faker.vehicle.color(),
//       plate_no: faker.vehicle.vrm(),
//       type: faker.vehicle.type(),
//     })),
//   );

//   const { data: seededCars, error: carError } = await supabase.from("cars").insert(carsToCreate).select();

//   if (carError || !seededCars) {
//     console.error("Error seeding cars:", carError.message);
//     return;
//   }
//   console.log(`${seededCars.length} cars seeded.`);

//   // ----------------------------------------------------------------
//   // 9. Seed Bookings
//   // ----------------------------------------------------------------
//   console.log("Seeding bookings...");
//   const bookingsToCreate = Array.from({ length: 200 }, () => {
//     const randomBranch = faker.helpers.arrayElement(seededBranches);
//     const branchWashers = seededWashers.filter((w) => w.branch_id === randomBranch.id);
//     const randomWasher = faker.helpers.arrayElement(branchWashers);
//     const randomCustomer = faker.helpers.arrayElement(seededCustomers);
//     const customerCars = seededCars.filter((c) => c.user_id === randomCustomer.id);
//     const randomCar = faker.helpers.arrayElement(customerCars);
//     const availableServices = seededServices.filter((s) => s.is_global || s.branch_id === randomBranch.id);
//     const randomService = faker.helpers.arrayElement(availableServices);

//     return {
//       branch_id: randomBranch.id,
//       washer_id: randomWasher.id,
//       user_id: randomCustomer.id,
//       car_id: randomCar.id,
//       service_id: randomService.id,
//       scheduled_at: faker.date.future(),
//       status: faker.helpers.arrayElement(["pending", "confirmed", "completed", "cancelled"]),
//     };
//   });

//   const { error: bookingError } = await supabase.from("bookings").insert(bookingsToCreate);

//   if (bookingError) {
//     console.error("Error seeding bookings:", bookingError.message);
//     return;
//   }
//   console.log(`${bookingsToCreate.length} bookings seeded.`);

//   console.log("Database seeding completed successfully!");
// };

// seedDatabase().catch((error) => {
//   console.error("An unexpected error occurred during seeding:", error.message);
// });
