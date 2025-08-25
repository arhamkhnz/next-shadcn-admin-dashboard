-- Migration script to add unique constraint to branch_hours table
-- This ensures that each branch can only have one entry per day of the week

-- Add unique constraint on branch_id and day_of_week
ALTER TABLE public.branch_hours 
ADD CONSTRAINT unique_branch_day UNIQUE (branch_id, day_of_week);