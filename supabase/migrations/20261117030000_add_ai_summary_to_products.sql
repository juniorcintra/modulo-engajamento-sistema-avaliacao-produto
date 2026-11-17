alter table public.products
  add column if not exists ai_summary text,
  add column if not exists ai_summary_feedback_count integer not null default 0,
  add column if not exists ai_summary_updated_at timestamptz;
