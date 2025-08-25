-- Migration script to add new fields to the services table
-- This script adds address, city, phone_number, ratings, pictures, and latLong fields to services

-- Add new columns to the services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS address text;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS city text;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS phone_number text;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS ratings numeric;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS pictures text[];

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS latitude numeric;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Add comments to explain the new columns
COMMENT ON COLUMN public.services.address IS 'Service location address';
COMMENT ON COLUMN public.services.city IS 'Service location city';
COMMENT ON COLUMN public.services.phone_number IS 'Service contact phone number';
COMMENT ON COLUMN public.services.ratings IS 'Average rating for the service';
COMMENT ON COLUMN public.services.pictures IS 'Array of picture URLs for the service';
COMMENT ON COLUMN public.services.latitude IS 'Geographic latitude coordinate';
COMMENT ON COLUMN public.services.longitude IS 'Geographic longitude coordinate';