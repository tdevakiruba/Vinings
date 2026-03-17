-- Make Graduate Access the recommended plan for Workforce Ready
-- and remove highlighted from the Institution License

UPDATE public.program_pricing
SET highlighted = true
WHERE id = '3c89b0d5-f6ba-4e9c-1b7d-45c3d6e7f8a9';

UPDATE public.program_pricing
SET highlighted = false
WHERE id = '4d9ac1e6-a7cb-4fad-2c8e-56d4e7f8a9b0';
