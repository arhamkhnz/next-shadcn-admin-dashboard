# Global Services Implementation

This document explains how the global services feature has been implemented in the Karwi Dash application.

## Overview

The global services feature allows administrators to create services that are automatically available at all branches, eliminating the need to manually create the same service for each branch individually.

## Database Changes

### New Column

- `is_global` (boolean): Indicates whether a service is global (available at all branches) or branch-specific

### Migration

The database schema has been updated with a migration script that:

1. Adds the `is_global` column to the `services` table
2. Makes the `branch_id` column nullable to support global services
3. Sets all existing services to `is_global = false` explicitly

## Implementation Details

### Admin Dashboard

1. **Service Store** (`src/stores/admin-dashboard/service-store.ts`):
   - Added `addGlobalService` function to create services for all branches
   - Modified `addService` to handle global services
   - Updated `updateService` to handle global service updates
   - Updated `deleteService` to handle global service deletion
   - Modified `fetchServices` to include the `is_global` field

2. **Service Form** (`src/app/(main)/admin/services/_components/service-form.tsx`):
   - Removed branch selection dropdown
   - Added a toggle for "Global Service"
   - Updated form submission logic to handle global services

3. **Service Actions** (`src/app/(main)/admin/services/_components/service-actions.tsx`):
   - Updated to use `deleteService` instead of `removeService`
   - Added special confirmation message for global services

4. **Service Columns** (`src/app/(main)/admin/services/_components/columns.tsx`):
   - Added a "Global" badge for global services
   - Updated type definitions to include `is_global`

### Franchise Dashboard

1. **Service Store** (`src/stores/franchise-dashboard/service-store.ts`):
   - Added `addGlobalService` function to create services for all branches in the franchise
   - Updated `fetchServices` to include global services
   - Updated `updateService` to handle global service updates
   - Updated `deleteService` to handle global service deletion

2. **Service Form** (`src/app/(main)/franchise/branch-management/_components/service-form.tsx`):
   - Added a toggle for "Global Service"
   - Updated form submission logic to handle global services

3. **Service Management** (`src/app/(main)/franchise/branch-management/_components/service-management.tsx`):
   - Added visual indication for global services
   - Disabled delete button for global services (they can only be deleted from the admin dashboard)

### Branch Store

1. **Branch Store** (`src/stores/admin-dashboard/branch-store.ts`):
   - Updated `fetchBranches` to include global services for each branch
   - Ensures that global services appear in branch service lists

## Usage

### Creating a Global Service (Admin Dashboard)

1. Navigate to the Services page in the admin dashboard
2. Click "Create Service"
3. Fill in the service details
4. Toggle "Global Service" to ON
5. Click "Create"

The service will automatically be available at all branches.

### Creating a Global Service (Franchise Dashboard)

1. Navigate to Branch Management in the franchise dashboard
2. Select a branch
3. Click "Add Service" in the service management section
4. Fill in the service details
5. Toggle "Global Service" to ON
6. Click "Create Service"

The service will automatically be available at all branches within the franchise.

### Editing/Deleting Global Services

- Global services can be edited or deleted from the admin dashboard
- In the franchise dashboard, global services are displayed but cannot be deleted (only branch-specific services can be deleted)

## Technical Considerations

1. **Data Consistency**: When a global service is updated or deleted, all instances of that service across all branches are updated or deleted simultaneously.

2. **Performance**: The system fetches both branch-specific and global services, with global services being deduplicated to avoid duplicates in branch service lists.

3. **Backward Compatibility**: Existing branch-specific services continue to work as before, with the `is_global` field set to `false`.

4. **Scalability**: The implementation is designed to handle a large number of branches efficiently.
