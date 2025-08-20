-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  car_id uuid,
  branch_id uuid,
  washer_id uuid,
  service_id uuid,
  status text DEFAULT 'pending'::text,
  scheduled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT bookings_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id),
  CONSTRAINT bookings_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT bookings_washer_id_fkey FOREIGN KEY (washer_id) REFERENCES public.washers(id),
  CONSTRAINT bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);
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
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  franchise_id uuid,
  name text NOT NULL,
  location USER-DEFINED,
  services integer DEFAULT 0,
  active_bookings integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branches_pkey PRIMARY KEY (id),
  CONSTRAINT branches_franchise_id_fkey FOREIGN KEY (franchise_id) REFERENCES public.franchises(id)
);
CREATE TABLE public.cars (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  make text,
  model text,
  year integer,
  color text,
  plate_no text,
  created_at timestamp with time zone DEFAULT now(),
  type text,
  CONSTRAINT cars_pkey PRIMARY KEY (id),
  CONSTRAINT cars_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.franchises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid,
  name text NOT NULL,
  status text DEFAULT 'active'::text,
  branches integer DEFAULT 0,
  washers integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT franchises_pkey PRIMARY KEY (id),
  CONSTRAINT franchises_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid,
  amount numeric NOT NULL,
  status text NOT NULL,
  provider text,
  provider_txn_id text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
CREATE TABLE public.promotions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount numeric NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT promotions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  booking_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id)
);
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid,
  name text NOT NULL,
  price numeric,
  duration_min integer,
  created_at timestamp with time zone DEFAULT now(),
  description text,
  todos ARRAY DEFAULT '{}'::text[],
  include ARRAY DEFAULT '{}'::text[],
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.user_profiles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid DEFAULT gen_random_uuid(),
  full_name text,
  car_model text,
  car_nickname text,
  license_plate text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  name text,
  phone text,
  cars integer DEFAULT 0,
  bookings integer DEFAULT 0,
  total_washes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fk_auth FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.washer_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  washer_id uuid,
  day_of_week integer NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT washer_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT washer_schedules_washer_id_fkey FOREIGN KEY (washer_id) REFERENCES public.washers(id)
);
CREATE TABLE public.washers (
  id uuid NOT NULL,
  name text,
  branch_id uuid,
  phone text,
  status text DEFAULT 'active'::text,
  rating numeric DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT washers_pkey PRIMARY KEY (id),
  CONSTRAINT washers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);