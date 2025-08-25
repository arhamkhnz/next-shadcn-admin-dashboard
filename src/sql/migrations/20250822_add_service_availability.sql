-- Migration script to add service availability support
-- This script creates the service_availability table to track when services are available

-- Create the service_availability table
CREATE TABLE IF NOT EXISTS public.service_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid,
  day_of_week integer NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_availability_pkey PRIMARY KEY (id),
  CONSTRAINT service_availability_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_availability_service_id ON public.service_availability(service_id);
CREATE INDEX IF NOT EXISTS idx_service_availability_day_of_week ON public.service_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_service_availability_is_active ON public.service_availability(is_active);

-- Add a comment to explain the table
COMMENT ON TABLE public.service_availability IS 'Tracks when services are available for booking';