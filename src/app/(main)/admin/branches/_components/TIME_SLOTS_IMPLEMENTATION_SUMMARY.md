# Branch Time Slots Feature - Implementation Summary

## Overview

This feature allows administrators to set operating hours for each day of the week for branches. Users can view, add, and edit time slots for branches through both the branch detail page and the branch edit form.

## Database Schema

The feature uses the existing `branch_hours` table with the following structure:

```sql
CREATE TABLE public.branch_hours (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid,
  day_of_week integer NOT NULL,
  open_time time without time zone,
  close_time time without time zone,
  is_closed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branch_hours_pkey PRIMARY KEY (id),
  CONSTRAINT branch_hours_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
```

A unique constraint has been added to prevent duplicate entries for the same branch and day combination:

```sql
ALTER TABLE public.branch_hours
ADD CONSTRAINT unique_branch_day UNIQUE (branch_id, day_of_week);
```

## Implementation Details

### 1. Store (`src/stores/admin-dashboard/branch-hours-store.ts`)

- `fetchHoursForBranch` - Retrieves hours for a specific branch
- `getHoursForBranch` - Gets hours for a branch, creating default entries for missing days
- `updateHours` - Updates or creates hours for a specific day, with proper handling of unique constraint violations
- `addHours` - Adds new hours entry
- `deleteHours` - Removes hours entry (or marks as closed for default entries)

### 2. Components

#### Branch Time Slots (`src/app/(main)/admin/branches/[id]/_components/branch-time-slots.tsx`)

- Displays time slots on the branch detail page
- Allows editing time slots with individual save buttons
- Responsive design that works on mobile and desktop
- Shows all 7 days of the week with default values

#### Branch Time Slots Form (`src/app/(main)/admin/branches/_components/branch-time-slots-form.tsx`)

- Allows editing time slots in the branch edit form
- Batch save functionality with "Save Changes" button
- Responsive design that works on mobile and desktop
- Shows all 7 days of the week with default values

### 3. Integration Points

#### Branch Detail Page (`src/app/(main)/admin/branches/[id]/page.tsx`)

- Integrated the `BranchTimeSlots` component to display time slots

#### Branch Form (`src/app/(main)/admin/branches/_components/branch-form.tsx`)

- Integrated the `BranchTimeSlotsForm` component to edit time slots
- Only shows for existing branches (not during creation)

## Default Values

- Sunday and Saturday default to closed
- Weekdays default to 9:00 AM - 5:00 PM
- Default entries are identified by IDs starting with "default-"

## Migration Scripts

1. `src/sql/migrations/20250822_add_branch_hours_unique_constraint.sql` - Adds unique constraint
2. `src/sql/migrations/README.md` - Updated documentation

## Responsive Design

- Uses flexbox and grid layouts that adapt to different screen sizes
- Properly sized inputs and buttons for mobile touch targets
- Clear visual hierarchy that works on all devices
- Whitespace management that scales appropriately

## Error Handling

- Proper handling of unique constraint violations
- Graceful error handling for database operations
- User feedback through console logging

## Usage

1. Navigate to the branch detail page to view current time slots
2. Edit a branch to modify time slots in batch
3. For each day, set open/close times or mark as closed
4. Save changes to persist time slot updates
