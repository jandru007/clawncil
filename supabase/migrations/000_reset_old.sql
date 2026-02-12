-- RESET: Drop old tables from previous Agent Council
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.cards CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.agents CASCADE;

-- Now run 001_initial_schema.sql
-- (Copy and paste the contents of 001_initial_schema.sql in the Supabase SQL Editor)
