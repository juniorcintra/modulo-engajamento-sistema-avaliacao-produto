create table if not exists public.products_feedbacks (
  id text primary key,
  score int not null check (score between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now(),
  created_by text not null references public.accounts (id),
  product_id text not null references public.products (id) on delete cascade
);

create index if not exists products_feedbacks_product_created_idx
  on public.products_feedbacks (product_id, created_at desc);

-- Acesso apenas via service role (servidor); nenhuma policy para anon/authenticated.
alter table public.products_feedbacks enable row level security;
