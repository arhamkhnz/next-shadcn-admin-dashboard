-- Migration script to add service promotions support
-- This script creates the service_promotions table to link services with promotions

-- Create the service_promotions table
CREATE TABLE IF NOT EXISTS public.service_promotions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid,
  promotion_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_promotions_pkey PRIMARY KEY (id),
  CONSTRAINT service_promotions_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE,
  CONSTRAINT service_promotions_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id) ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_promotions_service_id ON public.service_promotions(service_id);
CREATE INDEX IF NOT EXISTS idx_service_promotions_promotion_id ON public.service_promotions(promotion_id);

-- Add a comment to explain the table
COMMENT ON TABLE public.service_promotions IS 'Links services with promotions for branch-specific offers';