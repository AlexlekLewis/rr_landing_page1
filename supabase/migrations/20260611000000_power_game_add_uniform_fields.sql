-- Power Game uniform/kit selection captured at application.
ALTER TABLE public.power_game_applications
    ADD COLUMN IF NOT EXISTS uniform_selection TEXT,
    ADD COLUMN IF NOT EXISTS uniform_total_cents INTEGER DEFAULT 0;

COMMENT ON COLUMN public.power_game_applications.uniform_selection IS 'Human-readable kit selection, e.g. "Training Shirt (L), Training Shorts (M)".';
COMMENT ON COLUMN public.power_game_applications.uniform_total_cents IS 'Special first-time kit price total in cents, added to the program fee at checkout.';
