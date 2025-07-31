// import { createClient } from "@supabase/supabase-js";
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

// // Helper to generate a random geography point
// const getRandomPoint = () => {
//   const lat = faker.location.latitude();
//   const lon = faker.location.longitude();
//   return `POINT(${lon} ${lat})`;
// };

// const seedDatabase = async () => {
//   console.log("Starting to seed the database with corrected schema...");

//   // ----------------------------------------------------------------
//   // Clear existing data in the correct order
//   // ----------------------------------------------------------------
//   console.log("Clearing existing data...");
//   const tablesToDelete = [
//     "payments",
//     "washer_schedules",
//     "promotions",
//     "bookings",
//     "services",
//     "washers",
//     "cars",
//     "branch_hours",
//     "branches",
//     "franchises",
//     "admins",
//     "users",
//   ];
//   for (const table of tablesToDelete) {
//     const { error } = await supabase.from(table).delete().neq("id", faker.string.uuid());
//     if (error) {
//       console.error(`Error clearing table ${table}:`, error.message);
//       // Continue to next table instead of stopping
//     } else {
//       console.log(`Cleared table ${table}`);
//     }
//   }
//   console.log("Finished clearing data.");

//   // ----------------------------------------------------------------
//   // 1. Seed Admins
//   // ----------------------------------------------------------------
//   console.log("Seeding admins...");
//   const admins = Array.from({ length: 3 }, () => ({
//     name: faker.person.fullName(),
//     email: faker.internet.email(),
//     created_at: faker.date.past({ years: 1 }),
//   }));
//   const { data: seededAdmins, error: adminError } = await supabase.from("admins").insert(admins).select();
//   if (adminError || !seededAdmins) {
//     console.error("Error seeding admins:", adminError?.message);
//     return;
//   }
//   console.log(`${seededAdmins.length} admins seeded.`);

//   // ----------------------------------------------------------------
//   // 2. Seed Franchises
//   // ----------------------------------------------------------------
//   console.log("Seeding franchises...");
//   const franchises = Array.from({ length: 5 }, () => ({
//     admin_id: faker.helpers.arrayElement(seededAdmins).id,
//     name: `${faker.company.name()} Holdings`,
//     branches: 0,
//     washers: 0,
//     created_at: faker.date.past({ years: 1 }),
//   }));
//   const { data: seededFranchises, error: franchiseError } = await supabase
//     .from("franchises")
//     .insert(franchises)
//     .select();
//   if (franchiseError || !seededFranchises) {
//     console.error("Error seeding franchises:", franchiseError?.message);
//     return;
//   }
//   console.log(`${seededFranchises.length} franchises seeded.`);

//   // ----------------------------------------------------------------
//   // 3. Seed Branches
//   // ----------------------------------------------------------------
//   console.log("Seeding branches...");
//   const branches = seededFranchises.flatMap((franchise) =>
//     Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
//       franchise_id: franchise.id,
//       name: `Karwi Wash ${faker.location.city()}`,
//       location: getRandomPoint(),
//       services: faker.number.int({ min: 0, max: 5 }),
//       active_bookings: faker.number.int({ min: 0, max: 10 }),
//       created_at: faker.date.past({ years: 1 }),
//     })),
//   );
//   const { data: seededBranches, error: branchError } = await supabase.from("branches").insert(branches).select();
//   if (branchError || !seededBranches) {
//     console.error("Error seeding branches:", branchError?.message);
//     return;
//   }
//   console.log(`${seededBranches.length} branches seeded.`);

//   // ----------------------------------------------------------------
//   // 4. Seed Users (Customers)
//   // ----------------------------------------------------------------
//   console.log("Seeding users...");
//   const users = Array.from({ length: 50 }, () => ({
//     id: faker.string.uuid(), // Mocking Supabase Auth UID
//     name: faker.person.fullName(),
//     phone: faker.phone.number(),
//     cars: faker.number.int({ min: 1, max: 3 }),
//     bookings: faker.number.int({ min: 1, max: 10 }),
//     total_washes: faker.number.int({ min: 0, max: 50 }),
//     created_at: faker.date.past({ years: 1 }),
//   }));
//   const { data: seededUsers, error: userError } = await supabase.from("users").insert(users).select();
//   if (userError || !seededUsers) {
//     console.error("Error seeding users:", userError?.message);
//     return;
//   }
//   console.log(`${seededUsers.length} users seeded.`);

//   // ----------------------------------------------------------------
//   // 5. Seed Cars
//   // ----------------------------------------------------------------
//   console.log("Seeding cars...");
//   const cars = seededUsers.flatMap((user) =>
//     Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => ({
//       user_id: user.id,
//       make: faker.vehicle.manufacturer(),
//       model: faker.vehicle.model(),
//       year: faker.number.int({ min: 2010, max: 2024 }),
//       color: faker.vehicle.color(),
//       plate_no: faker.vehicle.vrm(),
//       created_at: faker.date.past({ years: 1 }),
//     })),
//   );
//   const { data: seededCars, error: carError } = await supabase.from("cars").insert(cars).select();
//   if (carError || !seededCars) {
//     console.error("Error seeding cars:", carError?.message);
//     return;
//   }
//   console.log(`${seededCars.length} cars seeded.`);

//   // ----------------------------------------------------------------
//   // 6. Seed Washers
//   // ----------------------------------------------------------------
//   console.log("Seeding washers...");
//   const washers = seededBranches.flatMap((branch) =>
//     Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
//       id: faker.string.uuid(), // Mocking Supabase Auth UID
//       name: faker.person.fullName(),
//       branch_id: branch.id,
//       phone: faker.phone.number(),
//       status: faker.helpers.arrayElement(["active", "inactive"]),
//       rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
//       created_at: faker.date.past({ years: 1 }),
//     })),
//   );
//   const { data: seededWashers, error: washerError } = await supabase.from("washers").insert(washers).select();
//   if (washerError || !seededWashers) {
//     console.error("Error seeding washers:", washerError?.message);
//     return;
//   }
//   console.log(`${seededWashers.length} washers seeded.`);

//   // ----------------------------------------------------------------
//   // 7. Seed Services
//   // ----------------------------------------------------------------
//   console.log("Seeding services...");
//   const serviceTemplates = [
//     { name: "Basic Exterior Wash", price: 25.0, duration_min: 30 },
//     { name: "Interior Vacuum & Wipe", price: 40.0, duration_min: 45 },
//     { name: "Deluxe Wash & Wax", price: 60.0, duration_min: 60 },
//     { name: "Full Detail Package", price: 150.0, duration_min: 180 },
//   ];
//   const services = seededBranches.flatMap((branch) =>
//     serviceTemplates.map((service) => ({
//       branch_id: branch.id,
//       name: service.name,
//       price: service.price,
//       duration_min: service.duration_min,
//       created_at: faker.date.past({ years: 1 }),
//     })),
//   );
//   const { data: seededServices, error: serviceError } = await supabase.from("services").insert(services).select();
//   if (serviceError || !seededServices) {
//     console.error("Error seeding services:", serviceError?.message);
//     return;
//   }
//   console.log(`${seededServices.length} services seeded.`);

//   // ----------------------------------------------------------------
//   // 8. Seed Bookings
//   // ----------------------------------------------------------------
//   console.log("Seeding bookings...");
//   const bookings = Array.from({ length: 200 }, () => {
//     const branch = faker.helpers.arrayElement(seededBranches);
//     const user = faker.helpers.arrayElement(seededUsers);
//     const car = faker.helpers.arrayElement(seededCars.filter((c) => c.user_id === user.id));
//     const service = faker.helpers.arrayElement(seededServices.filter((s) => s.branch_id === branch.id));
//     const washer = faker.helpers.arrayElement(seededWashers.filter((w) => w.branch_id === branch.id));

//     if (!car || !service || !washer) return null;

//     return {
//       user_id: user.id,
//       car_id: car.id,
//       branch_id: branch.id,
//       washer_id: washer.id,
//       service_id: service.id,
//       status: faker.helpers.arrayElement(["completed", "confirmed", "pending", "cancelled"]),
//       scheduled_at: faker.date.past({ years: 1 }),
//       created_at: faker.date.past({ years: 1 }),
//     };
//   }).filter(Boolean);

//   const { data: seededBookings, error: bookingError } = await supabase.from("bookings").insert(bookings).select();
//   if (bookingError || !seededBookings) {
//     console.error("Error seeding bookings:", bookingError?.message);
//     return;
//   }
//   console.log(`${seededBookings.length} bookings seeded.`);

//   // ----------------------------------------------------------------
//   // 9. Seed Payments
//   // ----------------------------------------------------------------
//   console.log("Seeding payments...");
//   const payments = seededBookings
//     .filter((b) => b.status === "completed")
//     .map((booking) => {
//       const service = seededServices.find((s) => s.id === booking.service_id);
//       if (!service) return null;

//       return {
//         booking_id: booking.id,
//         amount: service.price,
//         status: faker.helpers.arrayElement(["succeeded", "failed", "refunded"]),
//         provider: faker.helpers.arrayElement(["Stripe", "PayPal", "Credit Card"]),
//         provider_txn_id: faker.string.alphanumeric(20),
//         created_at: faker.date.past({ years: 1 }),
//       };
//     })
//     .filter(Boolean);

//   if (payments.length > 0) {
//     const { error: paymentError } = await supabase.from("payments").insert(payments);
//     if (paymentError) {
//       console.error("Error seeding payments:", paymentError.message);
//       return;
//     }
//     console.log(`${payments.length} payments seeded.`);
//   } else {
//     console.log("No completed bookings to create payments for.");
//   }

//   // ----------------------------------------------------------------
//   // 10. Seed Washer Schedules
//   // ----------------------------------------------------------------
//   console.log("Seeding washer schedules...");
//   const schedules = seededWashers.flatMap((washer) =>
//     Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
//       washer_id: washer.id,
//       day_of_week: faker.number.int({ min: 0, max: 6 }),
//       start_time: `${faker.number.int({ min: 8, max: 10 })}:00`,
//       end_time: `${faker.number.int({ min: 16, max: 18 })}:00`,
//       created_at: faker.date.past({ years: 1 }),
//     })),
//   );
//   const { error: scheduleError } = await supabase.from("washer_schedules").insert(schedules);
//   if (scheduleError) {
//     console.error("Error seeding washer schedules:", scheduleError.message);
//     return;
//   }
//   console.log(`${schedules.length} washer schedules seeded.`);

//   // ----------------------------------------------------------------
//   // 11. Seed Promotions
//   // ----------------------------------------------------------------
//   console.log("Seeding promotions...");
//   const promotions = Array.from({ length: 15 }, () => ({
//     code: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
//     discount: faker.number.int({ min: 5, max: 30 }),
//     start_date: faker.date.past({ years: 1 }),
//     end_date: faker.date.future({ years: 1 }),
//     active: faker.datatype.boolean(0.8),
//     created_at: faker.date.past({ years: 1 }),
//   }));
//   const { error: promotionError } = await supabase.from("promotions").insert(promotions);
//   if (promotionError) {
//     console.error("Error seeding promotions:", promotionError.message);
//     return;
//   }
//   console.log(`${promotions.length} promotions seeded.`);

//   // ----------------------------------------------------------------
//   // 12. Seed Branch Hours
//   // ----------------------------------------------------------------
//   console.log("Seeding branch hours...");
//   const branchHours = seededBranches.flatMap((branch) =>
//     Array.from({ length: 7 }, (_, index) => ({
//       branch_id: branch.id,
//       day_of_week: index, // 0 (Sunday) to 6 (Saturday)
//       open_time: faker.datatype.boolean(0.9) ? `${faker.number.int({ min: 8, max: 10 })}:00` : null,
//       close_time: faker.datatype.boolean(0.9) ? `${faker.number.int({ min: 16, max: 20 })}:00` : null,
//       is_closed: faker.datatype.boolean(0.1), // 10% chance of being closed
//       created_at: faker.date.past({ years: 1 }),
//     })),
//   );
//   const { error: branchHoursError } = await supabase.from("branch_hours").insert(branchHours);
//   if (branchHoursError) {
//     console.error("Error seeding branch hours:", branchHoursError.message);
//     return;
//   }
//   console.log(`${branchHours.length} branch hours seeded.`);

//   console.log("Database seeding completed successfully!");
// };

// seedDatabase().catch((error) => {
//   console.error("An unexpected error occurred during seeding:", error.message);
// });
