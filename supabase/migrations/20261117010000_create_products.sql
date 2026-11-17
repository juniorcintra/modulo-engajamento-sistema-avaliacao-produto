create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  image_url text not null,
  external_link text not null,
  score numeric(2,1) not null default 0 check (score >= 0 and score <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_created_at_id_idx
  on public.products (created_at desc, id desc);

-- Acesso apenas via service role (servidor); nenhuma policy para anon/authenticated.
alter table public.products enable row level security;
