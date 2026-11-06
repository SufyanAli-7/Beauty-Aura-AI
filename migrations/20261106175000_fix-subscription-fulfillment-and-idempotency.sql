-- Fix fulfill_subscription_payment to share session and invoice idempotency keys
CREATE OR REPLACE FUNCTION public.fulfill_subscription_payment(
  p_user_id UUID,
  p_plan TEXT,
  p_stripe_session_id TEXT DEFAULT NULL,
  p_stripe_invoice_id TEXT DEFAULT NULL,
  p_stripe_customer_id TEXT DEFAULT NULL,
  p_stripe_subscription_id TEXT DEFAULT NULL,
  p_amount TEXT DEFAULT '$9.99',
  p_credits INTEGER DEFAULT 450
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, payments, auth, pg_catalog, pg_temp
AS $$
DECLARE
  v_existing_tx UUID;
  v_new_credits INTEGER;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User ID is required');
  END IF;

  -- 1. Check idempotency: check if either session_id or invoice_id was already recorded
  IF p_stripe_session_id IS NOT NULL THEN
    SELECT id INTO v_existing_tx FROM public.billing_transactions WHERE stripe_session_id = p_stripe_session_id;
    IF v_existing_tx IS NOT NULL THEN
      -- If invoice_id was missing on the existing row, link it now
      IF p_stripe_invoice_id IS NOT NULL THEN
        UPDATE public.billing_transactions SET stripe_invoice_id = p_stripe_invoice_id WHERE id = v_existing_tx AND stripe_invoice_id IS NULL;
      END IF;
      RETURN jsonb_build_object('success', true, 'already_processed', true, 'tx_id', v_existing_tx);
    END IF;
  END IF;

  IF p_stripe_invoice_id IS NOT NULL THEN
    SELECT id INTO v_existing_tx FROM public.billing_transactions WHERE stripe_invoice_id = p_stripe_invoice_id;
    IF v_existing_tx IS NOT NULL THEN
      -- If session_id was missing on the existing row, link it now
      IF p_stripe_session_id IS NOT NULL THEN
        UPDATE public.billing_transactions SET stripe_session_id = p_stripe_session_id WHERE id = v_existing_tx AND stripe_session_id IS NULL;
      END IF;
      RETURN jsonb_build_object('success', true, 'already_processed', true, 'tx_id', v_existing_tx);
    END IF;
  END IF;

  -- 2. Update user profile, plan, subscription status and add credits
  UPDATE public.users
  SET
    plan = p_plan,
    subscription_status = 'active',
    credits = COALESCE(credits, 0) + p_credits,
    stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
    stripe_subscription_id = COALESCE(p_stripe_subscription_id, stripe_subscription_id),
    plan_period_end = NOW() + INTERVAL '1 month',
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING credits INTO v_new_credits;

  -- 3. Record transaction ledger with both keys if known
  INSERT INTO public.billing_transactions (
    user_id,
    stripe_session_id,
    stripe_invoice_id,
    plan,
    amount,
    currency,
    credits_allotted,
    status,
    created_at
  ) VALUES (
    p_user_id,
    p_stripe_session_id,
    p_stripe_invoice_id,
    p_plan,
    p_amount,
    'usd',
    p_credits,
    'completed',
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'plan', p_plan,
    'credits_allotted', p_credits,
    'total_credits', v_new_credits
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.fulfill_subscription_payment(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER) TO authenticated;

-- Fix webhook trigger to accurately detect Pro vs Basic by amount_paid and properly link checkout sessions
CREATE OR REPLACE FUNCTION public.process_stripe_subscription_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, payments, auth, pg_catalog, pg_temp
AS $$
DECLARE
  v_subject_type TEXT;
  v_subject_id TEXT;
  v_customer_id TEXT;
  v_subscription_id TEXT;
  v_price_id TEXT;
  v_plan TEXT;
  v_credits INTEGER;
  v_amount TEXT;
  v_invoice_id TEXT;
  v_session_id TEXT;
  v_amount_paid INT;
  v_line_desc TEXT;
BEGIN
  IF NEW.provider <> 'stripe' OR NEW.processing_status <> 'processed' THEN
    RETURN NEW;
  END IF;

  -- Handle Invoice Paid (Recurring Renewals & Initial Invoices)
  IF NEW.event_type = 'invoice.paid' THEN
    v_subject_type := COALESCE(
      NEW.payload -> 'data' -> 'object' -> 'parent' -> 'subscription_details' -> 'metadata' ->> 'insforge_subject_type',
      NEW.payload -> 'data' -> 'object' -> 'metadata' ->> 'insforge_subject_type',
      NEW.payload -> 'data' -> 'object' -> 'lines' -> 'data' -> 0 -> 'metadata' ->> 'insforge_subject_type'
    );
    v_subject_id := COALESCE(
      NEW.payload -> 'data' -> 'object' -> 'parent' -> 'subscription_details' -> 'metadata' ->> 'insforge_subject_id',
      NEW.payload -> 'data' -> 'object' -> 'metadata' ->> 'insforge_subject_id',
      NEW.payload -> 'data' -> 'object' -> 'lines' -> 'data' -> 0 -> 'metadata' ->> 'insforge_subject_id'
    );

    v_customer_id := NEW.payload -> 'data' -> 'object' ->> 'customer';
    v_subscription_id := NEW.payload -> 'data' -> 'object' ->> 'subscription';
    v_invoice_id := NEW.payload -> 'data' -> 'object' ->> 'id';

    IF v_subject_id IS NULL AND v_customer_id IS NOT NULL THEN
      SELECT m.subject_type, m.subject_id
      INTO v_subject_type, v_subject_id
      FROM payments.customer_mappings m
      WHERE m.provider = NEW.provider
        AND m.environment = NEW.environment
        AND m.provider_customer_id = v_customer_id;
    END IF;

    IF v_subject_id IS NOT NULL AND (v_subject_type = 'user' OR v_subject_type IS NULL) THEN
      v_amount_paid := COALESCE((NEW.payload -> 'data' -> 'object' ->> 'amount_paid')::int, 0);
      v_line_desc := COALESCE(NEW.payload -> 'data' -> 'object' -> 'lines' -> 'data' -> 0 ->> 'description', '');
      v_price_id := COALESCE(NEW.payload -> 'data' -> 'object' -> 'lines' -> 'data' -> 0 -> 'price' ->> 'id', '');

      -- Detect Pro plan vs Basic plan
      IF v_amount_paid >= 2000 
         OR v_line_desc ILIKE '%pro%'
         OR v_price_id = 'price_1UYlAiGStzBzliwj6mr56dFh' THEN
        v_plan := 'pro';
        v_credits := 1000;
        v_amount := '$24.99';
      ELSE
        v_plan := 'basic';
        v_credits := 450;
        v_amount := '$9.99';
      END IF;

      -- Look up matching checkout_session_id from payments.stripe_checkout_sessions
      SELECT checkout_session_id INTO v_session_id
      FROM payments.stripe_checkout_sessions
      WHERE (raw->>'invoice') = v_invoice_id
         OR subscription_id = v_subscription_id
      ORDER BY created_at DESC
      LIMIT 1;

      PERFORM public.fulfill_subscription_payment(
        v_subject_id::uuid,
        v_plan,
        v_session_id,
        v_invoice_id,
        v_customer_id,
        v_subscription_id,
        v_amount,
        v_credits
      );
    END IF;
  END IF;

  -- Handle Checkout Session Completed
  IF NEW.event_type = 'checkout.session.completed' AND (NEW.payload -> 'data' -> 'object' ->> 'mode') = 'subscription' THEN
    v_subject_type := COALESCE(
      NEW.payload -> 'data' -> 'object' -> 'metadata' ->> 'insforge_subject_type',
      NEW.payload -> 'data' -> 'object' -> 'subscription_data' -> 'metadata' ->> 'insforge_subject_type'
    );
    v_subject_id := COALESCE(
      NEW.payload -> 'data' -> 'object' -> 'metadata' ->> 'insforge_subject_id',
      NEW.payload -> 'data' -> 'object' -> 'subscription_data' -> 'metadata' ->> 'insforge_subject_id',
      NEW.payload -> 'data' -> 'object' ->> 'client_reference_id'
    );

    v_customer_id := NEW.payload -> 'data' -> 'object' ->> 'customer';
    v_subscription_id := NEW.payload -> 'data' -> 'object' ->> 'subscription';
    v_session_id := NEW.payload -> 'data' -> 'object' ->> 'id';
    v_invoice_id := NEW.payload -> 'data' -> 'object' ->> 'invoice';

    IF v_subject_id IS NOT NULL THEN
      IF (NEW.payload -> 'data' -> 'object' ->> 'amount_total')::int >= 2000 THEN
        v_plan := 'pro';
        v_credits := 1000;
        v_amount := '$24.99';
      ELSE
        v_plan := 'basic';
        v_credits := 450;
        v_amount := '$9.99';
      END IF;

      PERFORM public.fulfill_subscription_payment(
        v_subject_id::uuid,
        v_plan,
        v_session_id,
        v_invoice_id,
        v_customer_id,
        v_subscription_id,
        v_amount,
        v_credits
      );
    END IF;
  END IF;

  -- Handle Subscription Cancelled / Deleted: ONLY cancel if this specific subscription ID was the active one!
  IF NEW.event_type = 'customer.subscription.deleted' THEN
    v_subscription_id := NEW.payload -> 'data' -> 'object' ->> 'id';

    UPDATE public.users
    SET subscription_status = 'canceled',
        plan = 'free',
        updated_at = NOW()
    WHERE stripe_subscription_id = v_subscription_id;
  END IF;

  -- Handle Subscription Status Updates
  IF NEW.event_type = 'customer.subscription.updated' THEN
    v_subscription_id := NEW.payload -> 'data' -> 'object' ->> 'id';

    UPDATE public.users
    SET subscription_status = (NEW.payload -> 'data' -> 'object' ->> 'status'),
        updated_at = NOW()
    WHERE stripe_subscription_id = v_subscription_id;
  END IF;

  RETURN NEW;
END;
$$;

