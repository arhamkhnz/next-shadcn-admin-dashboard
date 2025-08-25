-- Migration to remove location-related fields from services table
-- Date: 2025-08-23

-- Remove columns from services table
ALTER TABLE public.services
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS ratings,
DROP COLUMN IF EXISTS latitude,
DROP COLUMN IF EXISTS longitude;