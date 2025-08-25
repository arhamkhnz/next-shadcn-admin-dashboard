-- Migration script to add location and contact fields to branches table

-- Add new columns to the branches table
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS ratings NUMERIC;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS pictures TEXT[];

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS latitude NUMERIC;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Add comments to explain the new columns
COMMENT ON COLUMN public.branches.address IS 'Branch location address';
COMMENT ON COLUMN public.branches.city IS 'Branch location city';
COMMENT ON COLUMN public.branches.phone_number IS 'Branch contact phone number';
COMMENT ON COLUMN public.branches.ratings IS 'Average rating for the branch';
COMMENT ON COLUMN public.branches.pictures IS 'Array of picture URLs for the branch';
COMMENT ON COLUMN public.branches.latitude IS 'Geographic latitude coordinate';
COMMENT ON COLUMN public.branches.longitude IS 'Geographic longitude coordinate';