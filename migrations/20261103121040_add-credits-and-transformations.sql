-- 1. Add credits column to public.users (50 credits by default for new users)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 50;

-- Update any existing users who have NULL or less than 50 credits
UPDATE public.users SET credits = 50 WHERE credits IS NULL OR credits < 50;

-- 2. Update trigger to automatically assign 50 credits to new users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_catalog, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, credits, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.profile->>'name', NEW.profile->>'full_name', ''),
    NEW.profile->>'avatar_url',
    50,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(NULLIF(EXCLUDED.name, ''), public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Create public.transformations table
CREATE TABLE IF NOT EXISTS public.transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  source_image_url TEXT NOT NULL,
  result_image_url TEXT NOT NULL,
  storage_key TEXT,
  look_name TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  task_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  credits_deducted INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) on transformations
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own transformations" ON public.transformations;
CREATE POLICY "Users can read own transformations" ON public.transformations
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own transformations" ON public.transformations;
CREATE POLICY "Users can insert own transformations" ON public.transformations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own transformations" ON public.transformations;
CREATE POLICY "Users can update own transformations" ON public.transformations
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own transformations" ON public.transformations;
CREATE POLICY "Users can delete own transformations" ON public.transformations
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Grants
GRANT ALL ON public.transformations TO authenticated;
GRANT SELECT ON public.transformations TO anon;

-- 5. Atomic RPC function to deduct credits (default 5 credits per generation)
CREATE OR REPLACE FUNCTION public.deduct_user_credits(p_amount INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_catalog, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_current_credits INTEGER;
  v_new_credits INTEGER;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT credits INTO v_current_credits
  FROM public.users
  WHERE id = v_uid
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    v_current_credits := 50;
  END IF;

  IF v_current_credits < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits. You need ' || p_amount || ' credits, but currently have ' || v_current_credits || '.',
      'credits', v_current_credits
    );
  END IF;

  v_new_credits := v_current_credits - p_amount;

  UPDATE public.users
  SET credits = v_new_credits, updated_at = NOW()
  WHERE id = v_uid;

  RETURN jsonb_build_object(
    'success', true,
    'previous_credits', v_current_credits,
    'deducted', p_amount,
    'credits', v_new_credits
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.deduct_user_credits(INTEGER) TO authenticated;

-- 6. RPC function to get current user credits
CREATE OR REPLACE FUNCTION public.get_user_credits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_catalog, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_credits INTEGER;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN 0;
  END IF;

  SELECT credits INTO v_credits
  FROM public.users
  WHERE id = v_uid;

  RETURN COALESCE(v_credits, 50);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_credits() TO authenticated;

