# Database Migration Instructions

## Global Services Migration

This migration adds support for global services that apply to all branches.

### Files

- `001_add_global_services.sql` - Migration script to add global services support

### How to Run

1. Connect to your Supabase database
2. Run the migration script in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of 001_add_global_services.sql here
   ```
3. Verify the migration was successful by checking the services table structure

### What the Migration Does

1. Adds an `is_global` boolean column to the `services` table (default false)
2. Makes the `branch_id` column nullable to support global services
3. Sets all existing services to `is_global = false` explicitly
4. Adds a comment to explain the new column

### After Migration

After running the migration, you can:
1. Create new global services that will automatically be available at all branches
2. Existing branch-specific services will continue to work as before

## Branch Hours Unique Constraint Migration

This migration adds a unique constraint to the branch_hours table to prevent duplicate entries for the same branch and day combination.

### Files

- `20250822_add_branch_hours_unique_constraint.sql` - Migration script to add unique constraint

### How to Run

1. Connect to your Supabase database
2. Run the migration script in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of 20250822_add_branch_hours_unique_constraint.sql here
   ```
3. Verify the migration was successful by checking the branch_hours table structure

### What the Migration Does

1. Adds a unique constraint on `branch_id` and `day_of_week` in the `branch_hours` table
2. Prevents duplicate entries for the same branch and day combination

### After Migration

After running the migration, the branch hours feature will work correctly with proper data integrity.

## Service Availability Migration

This migration adds support for tracking when services are available for booking.

### Files

- `20250822_add_service_availability.sql` - Migration script to add service availability support

### How to Run

1. Connect to your Supabase database
2. Run the migration script in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of 20250822_add_service_availability.sql here
   ```
3. Verify the migration was successful by checking the service_availability table structure

### What the Migration Does

1. Creates the `service_availability` table to track when services are available
2. Adds foreign key constraint to link availability to services
3. Adds indexes for better query performance
4. Adds a comment to explain the table

### After Migration

After running the migration, you can:
1. Set availability schedules for services
2. Track when services are available for booking

## Service Promotions Migration

This migration adds support for linking services with promotions for branch-specific offers.

### Files

- `20250822_add_service_promotions.sql` - Migration script to add service promotions support

### How to Run

1. Connect to your Supabase database
2. Run the migration script in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of 20250822_add_service_promotions.sql here
   ```
3. Verify the migration was successful by checking the service_promotions table structure

### What the Migration Does

1. Creates the `service_promotions` table to link services with promotions
2. Adds foreign key constraints to link to services and promotions tables
3. Adds indexes for better query performance
4. Adds a comment to explain the table

### After Migration

After running the migration, you can:
1. Associate promotions with specific services
2. Create branch-specific promotional offers for services

## Service Details Migration

This migration adds new fields to the services table to store additional service information.

### Files

- `20250822_add_service_details.sql` - Migration script to add service details fields

### How to Run

1. Connect to your Supabase database
2. Run the migration script in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of 20250822_add_service_details.sql here
   ```
3. Verify the migration was successful by checking the services table structure

### What the Migration Does

1. Adds `address` text column for service location address
2. Adds `city` text column for service location city
3. Adds `phone_number` text column for service contact phone
4. Adds `ratings` numeric column for average service ratings
5. Adds `pictures` text[] column for service picture URLs
6. Adds `latitude` numeric column for geographic latitude coordinate
7. Adds `longitude` numeric column for geographic longitude coordinate
8. Adds comments to explain each new column

### After Migration

After running the migration, you can:
1. Store additional details for services
2. Maintain backward compatibility with existing data

## Service Location Fields Migration

This migration adds location and contact fields to the services table.

### Files

- `20250822_add_service_location_fields.sql` - Migration script to add location and contact fields

### How to Run

1. Connect to your Supabase database
2. Run the migration script in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of 20250822_add_service_location_fields.sql here
   ```
3. Verify the migration was successful by checking the services table structure

### What the Migration Does

1. Adds `address` text column for service location address
2. Adds `city` text column for service location city
3. Adds `phone_number` text column for service contact phone
4. Adds `ratings` numeric column for average service ratings
5. Adds `pictures` text[] column for service picture URLs
6. Adds `latitude` numeric column for geographic latitude coordinate
7. Adds `longitude` numeric column for geographic longitude coordinate
8. Adds comments to explain each new column

### After Migration

After running the migration, you can:
1. Store location and contact information for services
2. Maintain backward compatibility with existing data

## Branch Location Fields Migration

This migration adds location and contact fields to the branches table.

### Files

- `20250823_add_branch_location_fields.sql` - Migration script to add location and contact fields to branches

### How to Run

1. Connect to your Supabase database
2. Run the migration script in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of 20250823_add_branch_location_fields.sql here
   ```
3. Verify the migration was successful by checking the branches table structure

### What the Migration Does

1. Adds `address` text column for branch location address
2. Adds `city` text column for branch location city
3. Adds `phone_number` text column for branch contact phone
4. Adds `ratings` numeric column for average branch ratings
5. Adds `pictures` text[] column for branch picture URLs
6. Adds `latitude` numeric column for geographic latitude coordinate
7. Adds `longitude` numeric column for geographic longitude coordinate
8. Adds comments to explain each new column

### After Migration

After running the migration, you can:
1. Store location and contact information for branches
2. Maintain backward compatibility with existing data