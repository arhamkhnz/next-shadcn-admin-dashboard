# Branch Time Slots Feature

This feature allows administrators to set operating hours for each day of the week for branches.

## Database Structure

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

### Frontend Components

1. **BranchTimeSlots** - Displays time slots on the branch detail page
2. **BranchTimeSlotsForm** - Allows editing time slots in the branch edit form

### Store

The `useBranchHoursStore` manages the time slots data with the following functions:

- `fetchHoursForBranch` - Retrieves hours for a specific branch
- `getHoursForBranch` - Gets hours for a branch, creating default entries for missing days
- `updateHours` - Updates or creates hours for a specific day
- `addHours` - Adds new hours entry
- `deleteHours` - Removes hours entry (or marks as closed for default entries)

### Default Values

- Sunday and Saturday default to closed
- Weekdays default to 9:00 AM - 5:00 PM
- Default entries are identified by IDs starting with "default-"

## Usage

1. Navigate to the branch detail page to view current time slots
2. Edit a branch to modify time slots
3. For each day, set open/close times or mark as closed
4. Save changes to persist time slot updates

## API Considerations

When the unique constraint is in place, the store handles potential constraint violations by attempting an update instead of an insert.
