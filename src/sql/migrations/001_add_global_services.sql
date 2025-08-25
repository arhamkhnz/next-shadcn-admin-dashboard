-- Migration script to add global services support
-- This script adds the is_global column to the services table

-- Add the is_global column to the services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS is_global boolean DEFAULT false;

-- Make branch_id nullable to support global services
ALTER TABLE public.services 
ALTER COLUMN branch_id DROP NOT NULL;

-- Update existing services to have is_global = false (explicitly set the default)
UPDATE public.services 
SET is_global = false 
WHERE is_global IS NULL;

-- Add a comment to explain the new column
COMMENT ON COLUMN public.services.is_global IS 'Indicates if this service is global (available at all branches) or branch-specific';