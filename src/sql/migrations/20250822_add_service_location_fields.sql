-- Migration script to add location and contact fields to services table

-- Add new columns to the services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS ratings NUMERIC;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS pictures TEXT[];

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS latitude NUMERIC;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Add comments to explain the new columns
COMMENT ON COLUMN public.services.address IS 'Service location address';
COMMENT ON COLUMN public.services.city IS 'Service location city';
COMMENT ON COLUMN public.services.phone_number IS 'Service contact phone number';
COMMENT ON COLUMN public.services.ratings IS 'Average rating for the service';
COMMENT ON COLUMN public.services.pictures IS 'Array of picture URLs for the service';
COMMENT ON COLUMN public.services.latitude IS 'Geographic latitude coordinate';
COMMENT ON COLUMN public.services.longitude IS 'Geographic longitude coordinate';