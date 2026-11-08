-- =====================================================================
-- Bruno Salgados · banco completo (snapshot de produção)
-- Rode este arquivo UMA vez no SQL Editor de um projeto Supabase novo.
-- Cria tabelas, regras de segurança, funções, tempo real, bucket de mídia
-- e o cardápio inicial (estoque zerado, sem vendas, sem clientes).
-- =====================================================================

-- ---------- sequências ----------
create sequence if not exists public.order_code_seq start 1;
create sequence if not exists public.product_code_seq start 1;

-- ---------- tabelas ----------
create table if not exists public.admins (
  user_id uuid not null,
  created_at timestamp with time zone default now() not null,
  constraint admins_pkey PRIMARY KEY (user_id)
);
alter table public.admins add constraint admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

create table if not exists public.store_settings (
  id integer default 1 not null,
  store_name text default 'Bruno Salgados'::text not null,
  tagline text default 'Salgados fresquinhos, feitos na hora'::text,
  whatsapp text,
  address text default 'Rua Edna Antônio Bacete, 1508'::text,
  lat double precision,
  lng double precision,
  is_open boolean default true not null,
  pause_message text default 'Estamos fechados no momento. Volte logo!'::text,
  opening_hours text default 'Seg a Sáb · 9h às 20h'::text,
  delivery_enabled boolean default true not null,
  pickup_enabled boolean default true not null,
  delivery_base_fee numeric(10,2) default 7.80 not null,
  delivery_included_km numeric(6,2) default 3 not null,
  delivery_per_km numeric(10,2) default 1.50 not null,
  delivery_max_km numeric(6,2) default 10 not null,
  delivery_min_order numeric(10,2) default 0 not null,
  free_delivery_over numeric(10,2),
  prep_minutes integer default 30 not null,
  pix_key text,
  pix_name text,
  accept_cash boolean default true not null,
  accept_card_on_delivery boolean default true not null,
  accept_pix boolean default true not null,
  payment_provider text default 'none'::text,
  mp_public_key text,
  mp_enabled boolean default false not null,
  updated_at timestamp with time zone default now() not null,
  receipt_auto boolean default false not null,
  receipt_width integer default 80 not null,
  receipt_copies integer default 1 not null,
  receipt_footer text default 'Obrigado pela preferência! Volte sempre.'::text,
  alert_sound text default 'caixa'::text not null,
  alert_volume numeric default 0.8 not null,
  alert_repeat boolean default true not null,
  wa_mode text default 'manual'::text not null,
  wa_phone_id text,
  wa_promo_template text,
  wa_debt_template text,
  wa_promo_text text default E'Oi {nome}! Novidade na {loja}: {mensagem}\nPeça pelo app: {link}'::text,
  wa_debt_text text default 'Oi {nome}, tudo bem? Aqui é da {loja}. Seu saldo em aberto é de {valor}. Pode pagar no Pix {pix} ou na loja. Obrigado!'::text,
  wa_story_ask boolean default true not null,
  table_count integer default 6 not null,
  constraint store_settings_pkey PRIMARY KEY (id),
  constraint store_settings_id_check CHECK ((id = 1)),
  constraint store_settings_payment_provider_check CHECK ((payment_provider = ANY (ARRAY['none'::text, 'mercadopago'::text, 'asaas'::text, 'infinitepay'::text, 'stripe'::text]))),
  constraint store_settings_receipt_copies_check CHECK (((receipt_copies >= 1) AND (receipt_copies <= 3))),
  constraint store_settings_receipt_width_check CHECK ((receipt_width = ANY (ARRAY[58, 80]))),
  constraint store_settings_table_count_check CHECK (((table_count >= 0) AND (table_count <= 99))),
  constraint store_settings_wa_mode_check CHECK ((wa_mode = ANY (ARRAY['manual'::text, 'api'::text])))
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() not null,
  name text not null,
  sort integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  constraint categories_pkey PRIMARY KEY (id)
);

create table if not exists public.products (
  id uuid default gen_random_uuid() not null,
  category_id uuid,
  name text not null,
  description text,
  price numeric(10,2) not null,
  cost numeric(10,2) default 0,
  unit_label text default 'unidade'::text not null,
  image_url text,
  is_combo boolean default false not null,
  combo_items text,
  track_stock boolean default true not null,
  stock integer default 0 not null,
  low_stock_alert integer default 5 not null,
  is_active boolean default true not null,
  is_featured boolean default false not null,
  sort integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  code text default lpad((nextval('product_code_seq'::regclass))::text, 3, '0'::text),
  constraint products_pkey PRIMARY KEY (id),
  constraint products_price_check CHECK ((price >= (0)::numeric))
);
alter table public.products add constraint products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

create table if not exists public.stories (
  id uuid default gen_random_uuid() not null,
  image_url text not null,
  caption text,
  created_at timestamp with time zone default now() not null,
  expires_at timestamp with time zone default (now() + '24:00:00'::interval) not null,
  media_type text default 'image'::text not null,
  constraint stories_pkey PRIMARY KEY (id),
  constraint stories_media_type_check CHECK ((media_type = ANY (ARRAY['image'::text, 'video'::text])))
);

create table if not exists public.customers (
  id uuid default gen_random_uuid() not null,
  name text not null,
  phone text,
  cpf text,
  rg text,
  birth_date date,
  address text,
  notes text,
  credit_limit numeric(10,2),
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null,
  whatsapp_optin boolean default false not null,
  constraint customers_pkey PRIMARY KEY (id)
);

create table if not exists public.customer_ledger (
  id uuid default gen_random_uuid() not null,
  customer_id uuid not null,
  kind text not null,
  amount numeric(10,2) not null,
  description text,
  order_id uuid,
  method text,
  created_at timestamp with time zone default now() not null,
  constraint customer_ledger_pkey PRIMARY KEY (id),
  constraint customer_ledger_amount_check CHECK ((amount > (0)::numeric)),
  constraint customer_ledger_kind_check CHECK ((kind = ANY (ARRAY['debito'::text, 'pagamento'::text, 'ajuste'::text])))
);
alter table public.customer_ledger add constraint customer_ledger_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

create table if not exists public.cash_sessions (
  id uuid default gen_random_uuid() not null,
  opened_at timestamp with time zone default now() not null,
  opening_amount numeric(10,2) default 0 not null,
  closed_at timestamp with time zone,
  expected_cash numeric(10,2),
  counted_cash numeric(10,2),
  difference numeric(10,2),
  notes text,
  status text default 'aberto'::text not null,
  constraint cash_sessions_pkey PRIMARY KEY (id),
  constraint cash_sessions_status_check CHECK ((status = ANY (ARRAY['aberto'::text, 'fechado'::text])))
);

create table if not exists public.orders (
  id uuid default gen_random_uuid() not null,
  code integer default nextval('order_code_seq'::regclass) not null,
  channel text default 'app'::text not null,
  customer_id uuid,
  customer_name text not null,
  customer_phone text,
  fulfillment text default 'retirada'::text not null,
  address text,
  address_ref text,
  lat double precision,
  lng double precision,
  distance_km numeric(6,2),
  subtotal numeric(10,2) default 0 not null,
  delivery_fee numeric(10,2) default 0 not null,
  discount numeric(10,2) default 0 not null,
  total numeric(10,2) default 0 not null,
  payment_method text not null,
  change_for numeric(10,2),
  payment_status text default 'pendente'::text not null,
  status text default 'novo'::text not null,
  notes text,
  cash_session_id uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  payments jsonb,
  marketing_optin boolean default false not null,
  table_no integer,
  constraint orders_pkey PRIMARY KEY (id),
  constraint orders_channel_check CHECK ((channel = ANY (ARRAY['app'::text, 'balcao'::text]))),
  constraint orders_fulfillment_check CHECK ((fulfillment = ANY (ARRAY['entrega'::text, 'retirada'::text, 'balcao'::text]))),
  constraint orders_payment_method_check CHECK ((payment_method = ANY (ARRAY['dinheiro'::text, 'pix'::text, 'cartao_credito'::text, 'cartao_debito'::text, 'fiado'::text, 'mercadopago'::text, 'misto'::text]))),
  constraint orders_payment_status_check CHECK ((payment_status = ANY (ARRAY['pendente'::text, 'pago'::text, 'fiado'::text, 'estornado'::text]))),
  constraint orders_status_check CHECK ((status = ANY (ARRAY['novo'::text, 'preparando'::text, 'pronto'::text, 'saiu'::text, 'entregue'::text, 'cancelado'::text]))),
  constraint orders_text_len CHECK (((length(customer_name) <= 120) AND (length(COALESCE(notes, ''::text)) <= 1000) AND (length(COALESCE(address, ''::text)) <= 400)))
);
alter table public.orders add constraint orders_cash_session_id_fkey FOREIGN KEY (cash_session_id) REFERENCES cash_sessions(id);
alter table public.orders add constraint orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

create table if not exists public.order_items (
  id uuid default gen_random_uuid() not null,
  order_id uuid not null,
  product_id uuid,
  name text not null,
  unit_price numeric(10,2) not null,
  unit_cost numeric(10,2) default 0,
  qty integer not null,
  total numeric(10,2) not null,
  constraint order_items_pkey PRIMARY KEY (id),
  constraint order_items_qty_check CHECK ((qty > 0))
);
alter table public.order_items add constraint order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
alter table public.order_items add constraint order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

create table if not exists public.cash_movements (
  id uuid default gen_random_uuid() not null,
  session_id uuid not null,
  kind text not null,
  method text default 'dinheiro'::text not null,
  amount numeric(10,2) not null,
  description text,
  order_id uuid,
  customer_id uuid,
  created_at timestamp with time zone default now() not null,
  constraint cash_movements_pkey PRIMARY KEY (id),
  constraint cash_movements_amount_check CHECK ((amount > (0)::numeric)),
  constraint cash_movements_kind_check CHECK ((kind = ANY (ARRAY['venda'::text, 'sangria'::text, 'suprimento'::text, 'recebimento_fiado'::text, 'despesa'::text, 'estorno'::text]))),
  constraint cash_movements_method_check CHECK ((method = ANY (ARRAY['dinheiro'::text, 'pix'::text, 'cartao_credito'::text, 'cartao_debito'::text, 'mercadopago'::text, 'outro'::text])))
);
alter table public.cash_movements add constraint cash_movements_session_id_fkey FOREIGN KEY (session_id) REFERENCES cash_sessions(id) ON DELETE CASCADE;

create table if not exists public.message_log (
  id uuid default gen_random_uuid() not null,
  kind text not null,
  channel text default 'manual'::text not null,
  phone text not null,
  name text,
  body text,
  status text default 'enviado'::text not null,
  error text,
  created_at timestamp with time zone default now() not null,
  constraint message_log_pkey PRIMARY KEY (id),
  constraint message_log_channel_check CHECK ((channel = ANY (ARRAY['manual'::text, 'api'::text]))),
  constraint message_log_kind_check CHECK ((kind = ANY (ARRAY['promo'::text, 'cobranca'::text, 'story'::text])))
);

-- ---------- índices ----------
CREATE INDEX cash_movements_order_idx ON public.cash_movements USING btree (order_id);
CREATE INDEX customers_name_idx ON public.customers USING btree (lower(name));
CREATE INDEX ledger_customer_idx ON public.customer_ledger USING btree (customer_id, created_at DESC);
CREATE INDEX ledger_order_idx ON public.customer_ledger USING btree (order_id);
CREATE INDEX message_log_created ON public.message_log USING btree (created_at DESC);
CREATE INDEX movements_session_idx ON public.cash_movements USING btree (session_id, created_at);
CREATE UNIQUE INDEX one_open_session ON public.cash_sessions USING btree (status) WHERE (status = 'aberto'::text);
CREATE INDEX order_items_order_idx ON public.order_items USING btree (order_id);
CREATE INDEX order_items_product_idx ON public.order_items USING btree (product_id);
CREATE INDEX orders_created_idx ON public.orders USING btree (created_at DESC);
CREATE INDEX orders_payment_idx ON public.orders USING btree (payment_status) WHERE (payment_status = 'pendente'::text);
CREATE INDEX orders_status_idx ON public.orders USING btree (status, created_at DESC);
CREATE INDEX products_category_idx ON public.products USING btree (category_id);
CREATE UNIQUE INDEX products_code_key ON public.products USING btree (code);

-- ---------- view de saldo de fiado ----------
create or replace view public.customer_balances with (security_invoker = true) as
  SELECT c.id, c.name, c.phone, c.cpf, c.rg, c.birth_date, c.address, c.notes, c.credit_limit, c.is_active, c.created_at,
    (COALESCE(sum(l.amount) FILTER (WHERE (l.kind = 'debito'::text)), (0)::numeric)
     - COALESCE(sum(l.amount) FILTER (WHERE (l.kind = ANY (ARRAY['pagamento'::text, 'ajuste'::text]))), (0)::numeric)) AS balance,
    max(l.created_at) AS last_movement
  FROM (customers c LEFT JOIN customer_ledger l ON ((l.customer_id = c.id)))
  GROUP BY c.id;

-- ---------- funções ----------
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  select exists(select 1 from public.admins where user_id = auth.uid());
$function$;

CREATE OR REPLACE FUNCTION public.claim_admin()
 RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if auth.uid() is null then return false; end if;
  if exists(select 1 from public.admins) then
    return exists(select 1 from public.admins where user_id = auth.uid());
  end if;
  insert into public.admins(user_id) values (auth.uid());
  return true;
end $function$;

CREATE OR REPLACE FUNCTION public.haversine_km(lat1 double precision, lng1 double precision, lat2 double precision, lng2 double precision)
 RETURNS double precision LANGUAGE sql IMMUTABLE SET search_path TO 'public'
AS $function$
  select 2 * 6371 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)
  ));
$function$;

CREATE OR REPLACE FUNCTION public.quote_delivery(p_lat double precision, p_lng double precision, p_route_km numeric DEFAULT NULL::numeric, p_subtotal numeric DEFAULT 0)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare s public.store_settings; d numeric; fee numeric;
begin
  select * into s from public.store_settings where id = 1;
  if not s.delivery_enabled then return jsonb_build_object('ok', false, 'reason', 'ENTREGA_DESATIVADA'); end if;
  if s.lat is null or s.lng is null then return jsonb_build_object('ok', false, 'reason', 'LOJA_SEM_LOCALIZACAO'); end if;
  if p_lat is null or p_lng is null or abs(p_lat) > 90 or abs(p_lng) > 180 then return jsonb_build_object('ok', false, 'reason', 'ENDERECO_INVALIDO'); end if;
  d := greatest(least(coalesce(p_route_km, 0), 500), public.haversine_km(s.lat, s.lng, p_lat, p_lng)::numeric);
  d := round(d, 2);
  if d > s.delivery_max_km then
    return jsonb_build_object('ok', false, 'reason', 'FORA_DO_RAIO', 'distance_km', d, 'max_km', s.delivery_max_km);
  end if;
  fee := s.delivery_base_fee + s.delivery_per_km * greatest(0, d - s.delivery_included_km);
  fee := ceil(fee * 2) / 2.0;
  if s.free_delivery_over is not null and p_subtotal >= s.free_delivery_over then fee := 0; end if;
  return jsonb_build_object('ok', true, 'distance_km', d, 'fee', fee);
end $function$;

CREATE OR REPLACE FUNCTION public.cash_expected(p_session uuid)
 RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  select s.opening_amount
    + coalesce(sum(m.amount) filter (where m.method = 'dinheiro' and m.kind in ('venda','suprimento','recebimento_fiado')), 0)
    - coalesce(sum(m.amount) filter (where m.method = 'dinheiro' and m.kind in ('sangria','despesa','estorno')), 0)
  from public.cash_sessions s left join public.cash_movements m on m.session_id = s.id
  where s.id = p_session group by s.opening_amount;
$function$;

CREATE OR REPLACE FUNCTION public.open_cash(p_amount numeric, p_notes text DEFAULT NULL::text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v uuid;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  if exists(select 1 from public.cash_sessions where status = 'aberto') then raise exception 'CAIXA_JA_ABERTO'; end if;
  insert into public.cash_sessions(opening_amount, notes) values (coalesce(p_amount,0), p_notes) returning id into v;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public.cash_move(p_kind text, p_amount numeric, p_method text DEFAULT 'dinheiro'::text, p_desc text DEFAULT NULL::text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_sess uuid;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  if p_kind not in ('sangria','suprimento','despesa') then raise exception 'TIPO_INVALIDO'; end if;
  select id into v_sess from public.cash_sessions where status = 'aberto';
  if v_sess is null then raise exception 'CAIXA_FECHADO'; end if;
  insert into public.cash_movements(session_id, kind, method, amount, description)
  values (v_sess, p_kind, coalesce(p_method,'dinheiro'), p_amount, p_desc);
end $function$;

CREATE OR REPLACE FUNCTION public.close_cash(p_counted numeric, p_notes text DEFAULT NULL::text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_sess uuid; v_exp numeric;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  select id into v_sess from public.cash_sessions where status = 'aberto';
  if v_sess is null then raise exception 'CAIXA_FECHADO'; end if;
  v_exp := public.cash_expected(v_sess);
  update public.cash_sessions set status = 'fechado', closed_at = now(), expected_cash = v_exp,
    counted_cash = p_counted, difference = p_counted - v_exp,
    notes = coalesce(nullif(p_notes,''), notes)
  where id = v_sess;
  return jsonb_build_object('expected', v_exp, 'counted', p_counted, 'difference', p_counted - v_exp);
end $function$;

CREATE OR REPLACE FUNCTION public.add_debt(p_customer uuid, p_amount numeric, p_desc text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  insert into public.customer_ledger(customer_id, kind, amount, description) values (p_customer, 'debito', p_amount, p_desc);
end $function$;

CREATE OR REPLACE FUNCTION public.receive_debt(p_customer uuid, p_amount numeric, p_method text, p_desc text DEFAULT NULL::text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_sess uuid; c public.customers;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  select * into c from public.customers where id = p_customer;
  if not found then raise exception 'CLIENTE_NAO_ENCONTRADO'; end if;
  select id into v_sess from public.cash_sessions where status = 'aberto';
  if v_sess is null then raise exception 'CAIXA_FECHADO'; end if;
  insert into public.customer_ledger(customer_id, kind, amount, description, method)
  values (p_customer, 'pagamento', p_amount, coalesce(p_desc, 'Pagamento de fiado'), p_method);
  insert into public.cash_movements(session_id, kind, method, amount, description, customer_id)
  values (v_sess, 'recebimento_fiado', p_method, p_amount, 'Fiado · ' || c.name, p_customer);
end $function$;

CREATE OR REPLACE FUNCTION public.adjust_stock(p_product uuid, p_delta integer)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v int;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  update public.products set stock = greatest(0, stock + p_delta), updated_at = now() where id = p_product returning stock into v;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public.get_order_public(p_id uuid)
 RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'id', o.id, 'code', o.code, 'status', o.status, 'fulfillment', o.fulfillment,
    'subtotal', o.subtotal, 'delivery_fee', o.delivery_fee, 'total', o.total,
    'payment_method', o.payment_method, 'payment_status', o.payment_status,
    'created_at', o.created_at, 'updated_at', o.updated_at,
    'items', (select coalesce(jsonb_agg(jsonb_build_object('name', i.name, 'qty', i.qty, 'total', i.total)), '[]'::jsonb)
              from public.order_items i where i.order_id = o.id))
  from public.orders o where o.id = p_id;
$function$;

CREATE OR REPLACE FUNCTION public.set_marketing_optin(p_order uuid, p_phone text, p_optin boolean)
 RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $function$
  update public.orders set marketing_optin = p_optin
  where id = p_order and right(regexp_replace(coalesce(customer_phone,''), '\D', '', 'g'), 9) = right(regexp_replace(coalesce(p_phone,''), '\D', '', 'g'), 9)
    and created_at > now() - interval '1 hour';
$function$;

CREATE OR REPLACE FUNCTION public.pay_order(p_order uuid, p_method text, p_customer uuid DEFAULT NULL::uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare o public.orders; v_sess uuid; v_cust uuid;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  select * into o from public.orders where id = p_order for update;
  if not found then raise exception 'PEDIDO_NAO_ENCONTRADO'; end if;
  if o.payment_status in ('pago','fiado') then raise exception 'PEDIDO_JA_PAGO'; end if;
  if o.status = 'cancelado' then raise exception 'PEDIDO_CANCELADO'; end if;

  if p_method = 'fiado' then
    v_cust := coalesce(p_customer, o.customer_id);
    if v_cust is null then raise exception 'CLIENTE_OBRIGATORIO_FIADO'; end if;
    insert into public.customer_ledger(customer_id, kind, amount, description, order_id)
    values (v_cust, 'debito', o.total, 'Pedido #' || o.code, o.id);
    update public.orders set payment_status = 'fiado', payment_method = 'fiado', customer_id = v_cust, updated_at = now()
    where id = o.id;
  else
    select id into v_sess from public.cash_sessions where status = 'aberto';
    if v_sess is null then raise exception 'CAIXA_FECHADO'; end if;
    if o.total > 0 then
      insert into public.cash_movements(session_id, kind, method, amount, description, order_id, customer_id)
      values (v_sess, 'venda', p_method, o.total, 'Pedido #' || o.code || ' · ' || o.customer_name, o.id, o.customer_id);
    end if;
    update public.orders set payment_status = 'pago', payment_method = p_method, cash_session_id = v_sess, updated_at = now()
    where id = o.id;
  end if;
end $function$;

CREATE OR REPLACE FUNCTION public.pay_order_split(p_order uuid, p_payments jsonb, p_customer uuid DEFAULT NULL::uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare o public.orders; v_sess uuid; v_sum numeric := 0; it jsonb; m text; a numeric; v_cust uuid; v_fiado boolean := false; v_n int;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  select * into o from public.orders where id = p_order for update;
  if not found then raise exception 'PEDIDO_NAO_ENCONTRADO'; end if;
  if o.payment_status in ('pago','fiado') then raise exception 'PEDIDO_JA_PAGO'; end if;
  if o.status = 'cancelado' then raise exception 'PEDIDO_CANCELADO'; end if;
  v_n := jsonb_array_length(coalesce(p_payments, '[]'::jsonb));
  if v_n = 0 then raise exception 'PAGAMENTO_INVALIDO'; end if;
  for it in select * from jsonb_array_elements(p_payments) loop
    m := it->>'method'; a := round((it->>'amount')::numeric, 2);
    if a is null or a <= 0 or m not in ('dinheiro','pix','cartao_credito','cartao_debito','fiado','mercadopago') then raise exception 'PAGAMENTO_INVALIDO'; end if;
    v_sum := v_sum + a;
    if m = 'fiado' then v_fiado := true; end if;
  end loop;
  if abs(v_sum - o.total) > 0.009 then raise exception 'PAGAMENTO_NAO_FECHA'; end if;
  v_cust := coalesce(p_customer, o.customer_id);
  if v_fiado and v_cust is null then raise exception 'CLIENTE_OBRIGATORIO_FIADO'; end if;
  select id into v_sess from public.cash_sessions where status = 'aberto';
  for it in select * from jsonb_array_elements(p_payments) loop
    m := it->>'method'; a := round((it->>'amount')::numeric, 2);
    if m = 'fiado' then
      insert into public.customer_ledger(customer_id, kind, amount, description, order_id)
      values (v_cust, 'debito', a, 'Pedido #' || o.code, o.id);
    else
      if v_sess is null then raise exception 'CAIXA_FECHADO'; end if;
      insert into public.cash_movements(session_id, kind, method, amount, description, order_id, customer_id)
      values (v_sess, 'venda', m, a, 'Pedido #' || o.code || ' · ' || o.customer_name || case when v_n > 1 then ' (dividido)' else '' end, o.id, v_cust);
    end if;
  end loop;
  update public.orders set payment_status = case when v_fiado then 'fiado' else 'pago' end,
    payment_method = case when v_n > 1 then 'misto' else p_payments->0->>'method' end,
    payments = p_payments, customer_id = v_cust, cash_session_id = coalesce(v_sess, cash_session_id), updated_at = now()
  where id = o.id;
end $function$;

CREATE OR REPLACE FUNCTION public.place_order(p jsonb)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare
  s public.store_settings;
  v_admin boolean := public.is_admin();
  v_channel text := coalesce(p->>'channel', 'app');
  v_fulfill text := coalesce(p->>'fulfillment', 'retirada');
  v_pays jsonb := case when jsonb_typeof(p->'payments') = 'array' and jsonb_array_length(p->'payments') > 0 then p->'payments' else null end;
  v_method text := case when v_pays is null then p->>'payment_method' when jsonb_array_length(v_pays) > 1 then 'misto' else v_pays->0->>'method' end;
  v_order uuid; v_code int;
  it jsonb; pr public.products; q int;
  v_sub numeric := 0; v_fee numeric := 0; v_dist numeric; v_disc numeric := greatest(0, coalesce((p->>'discount')::numeric, 0));
  v_total numeric; dq jsonb; v_cust uuid := nullif(p->>'customer_id','')::uuid;
  v_pay_now boolean := coalesce((p->>'pay_now')::boolean, false);
  v_name text := left(trim(coalesce(p->>'customer_name','')), 80);
  v_phone text := left(trim(coalesce(p->>'customer_phone','')), 30);
  v_change numeric := nullif(p->>'change_for','')::numeric;
begin
  select * into s from public.store_settings where id = 1;
  if v_channel not in ('app','balcao') then raise exception 'PAGAMENTO_INVALIDO'; end if;
  if v_channel = 'balcao' and not v_admin then raise exception 'SOMENTE_ADMIN'; end if;
  if (v_method in ('fiado','misto') or v_disc > 0 or v_pays is not null) and not v_admin then raise exception 'SOMENTE_ADMIN'; end if;
  if v_name = '' then raise exception 'NOME_OBRIGATORIO'; end if;
  if jsonb_array_length(coalesce(p->'items','[]'::jsonb)) = 0 then raise exception 'CARRINHO_VAZIO'; end if;
  if jsonb_array_length(p->'items') > 50 then raise exception 'QUANTIDADE_INVALIDA'; end if;

  if v_channel = 'app' then
    if not s.is_open then raise exception 'LOJA_FECHADA'; end if;
    if v_fulfill not in ('entrega','retirada') then raise exception 'ENTREGA_INVALIDA'; end if;
    if length(regexp_replace(v_phone, '\D', '', 'g')) < 10 then raise exception 'TELEFONE_INVALIDO'; end if;
    if v_fulfill = 'entrega' and not s.delivery_enabled then raise exception 'ENTREGA_DESATIVADA'; end if;
    if v_fulfill = 'retirada' and not s.pickup_enabled then raise exception 'RETIRADA_DESATIVADA'; end if;
    if v_method = 'pix' and not s.accept_pix then raise exception 'PAGAMENTO_INVALIDO'; end if;
    if v_method = 'dinheiro' and not s.accept_cash then raise exception 'PAGAMENTO_INVALIDO'; end if;
    if v_method in ('cartao_credito','cartao_debito') and not s.accept_card_on_delivery then raise exception 'PAGAMENTO_INVALIDO'; end if;
    if v_method = 'mercadopago' and not s.mp_enabled then raise exception 'PAGAMENTO_INVALIDO'; end if;
    if v_method not in ('pix','dinheiro','cartao_credito','cartao_debito','mercadopago') then raise exception 'PAGAMENTO_INVALIDO'; end if;
    -- evita enxurrada de pedidos falsos do mesmo telefone
    if (select count(*) from public.orders where channel = 'app' and status = 'novo' and created_at > now() - interval '15 minutes'
        and right(regexp_replace(coalesce(customer_phone,''), '\D', '', 'g'), 9) = right(regexp_replace(v_phone, '\D', '', 'g'), 9)) >= 3 then
      raise exception 'MUITOS_PEDIDOS'; end if;
  end if;
  if v_method = 'fiado' and v_cust is null then raise exception 'CLIENTE_OBRIGATORIO_FIADO'; end if;

  insert into public.orders(channel, customer_id, customer_name, customer_phone, fulfillment, address, address_ref,
    lat, lng, payment_method, change_for, notes, discount)
  values (v_channel, v_cust, v_name, nullif(v_phone,''),
    case when v_channel = 'balcao' then 'balcao' else v_fulfill end,
    left(p->>'address', 300), left(p->>'address_ref', 200), (p->>'lat')::float8, (p->>'lng')::float8,
    v_method, case when v_change > 0 then least(v_change, 100000) end, left(p->>'notes', 500), v_disc)
  returning id, code into v_order, v_code;

  for it in select * from jsonb_array_elements(p->'items') loop
    q := (it->>'qty')::int;
    if q is null or q <= 0 or q > 1000 then raise exception 'QUANTIDADE_INVALIDA'; end if;
    select * into pr from public.products where id = (it->>'product_id')::uuid for update;
    if not found or not pr.is_active then raise exception 'PRODUTO_INDISPONIVEL:%', coalesce(pr.name, '?'); end if;
    if pr.track_stock then
      if pr.stock < q then raise exception 'SEM_ESTOQUE:%:%', pr.name, pr.stock; end if;
      update public.products set stock = stock - q, updated_at = now() where id = pr.id;
    end if;
    insert into public.order_items(order_id, product_id, name, unit_price, unit_cost, qty, total)
    values (v_order, pr.id, pr.name, pr.price, coalesce(pr.cost,0), q, pr.price * q);
    v_sub := v_sub + pr.price * q;
  end loop;

  if v_channel = 'app' and v_sub < s.delivery_min_order and v_fulfill = 'entrega' then
    raise exception 'PEDIDO_MINIMO:%', s.delivery_min_order;
  end if;
  if v_channel = 'app' and v_fulfill = 'entrega' then
    dq := public.quote_delivery((p->>'lat')::float8, (p->>'lng')::float8, nullif(p->>'distance_km','')::numeric, v_sub);
    if not (dq->>'ok')::boolean then raise exception '%', dq->>'reason'; end if;
    v_fee := (dq->>'fee')::numeric; v_dist := (dq->>'distance_km')::numeric;
  elsif v_admin and p ? 'delivery_fee' then
    v_fee := greatest(0, coalesce((p->>'delivery_fee')::numeric, 0));
  end if;

  v_disc := least(v_disc, v_sub + v_fee);
  v_total := greatest(0, v_sub + v_fee - v_disc);
  update public.orders set subtotal = v_sub, delivery_fee = v_fee, distance_km = v_dist, total = v_total, discount = v_disc where id = v_order;

  if v_channel = 'balcao' and v_pay_now then
    if v_pays is not null then perform public.pay_order_split(v_order, v_pays, v_cust);
    else perform public.pay_order(v_order, v_method, v_cust); end if;
    update public.orders set status = 'entregue', updated_at = now() where id = v_order;
  end if;
  return jsonb_build_object('id', v_order, 'code', v_code, 'subtotal', v_sub, 'delivery_fee', v_fee, 'total', v_total);
end $function$;

CREATE OR REPLACE FUNCTION public.set_order_items(p_order uuid, p_items jsonb)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare o public.orders; it jsonb; pr public.products; q int; v_sub numeric := 0; v_total numeric;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  select * into o from public.orders where id = p_order for update;
  if not found then raise exception 'PEDIDO_NAO_ENCONTRADO'; end if;
  if o.status = 'cancelado' then raise exception 'PEDIDO_CANCELADO'; end if;
  if o.payment_status <> 'pendente' then raise exception 'PEDIDO_JA_PAGO'; end if;
  if jsonb_array_length(coalesce(p_items,'[]'::jsonb)) = 0 then raise exception 'CARRINHO_VAZIO'; end if;
  update public.products p set stock = p.stock + i.qty, updated_at = now()
    from public.order_items i where i.order_id = o.id and i.product_id = p.id and p.track_stock;
  delete from public.order_items where order_id = o.id;
  for it in select * from jsonb_array_elements(p_items) loop
    q := (it->>'qty')::int;
    if q is null or q <= 0 or q > 1000 then raise exception 'QUANTIDADE_INVALIDA'; end if;
    select * into pr from public.products where id = (it->>'product_id')::uuid for update;
    if not found then raise exception 'PRODUTO_INDISPONIVEL:?'; end if;
    if pr.track_stock then
      if pr.stock < q then raise exception 'SEM_ESTOQUE:%:%', pr.name, pr.stock; end if;
      update public.products set stock = stock - q, updated_at = now() where id = pr.id;
    end if;
    insert into public.order_items(order_id, product_id, name, unit_price, unit_cost, qty, total)
    values (o.id, pr.id, pr.name, pr.price, coalesce(pr.cost,0), q, pr.price * q);
    v_sub := v_sub + pr.price * q;
  end loop;
  v_total := greatest(0, v_sub + o.delivery_fee - least(o.discount, v_sub));
  update public.orders set subtotal = v_sub, total = v_total, updated_at = now() where id = o.id;
  return jsonb_build_object('subtotal', v_sub, 'total', v_total);
end $function$;

CREATE OR REPLACE FUNCTION public.set_order_status(p_order uuid, p_status text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare o public.orders; v_sess uuid; it jsonb; parts jsonb;
begin
  if not public.is_admin() then raise exception 'SOMENTE_ADMIN'; end if;
  select * into o from public.orders where id = p_order for update;
  if not found then raise exception 'PEDIDO_NAO_ENCONTRADO'; end if;
  if o.status = 'cancelado' then raise exception 'PEDIDO_CANCELADO'; end if;
  if p_status = 'cancelado' then
    update public.products p set stock = p.stock + i.qty, updated_at = now()
    from public.order_items i where i.order_id = o.id and i.product_id = p.id and p.track_stock;
    if o.payment_status in ('pago','fiado') and o.total > 0 then
      parts := coalesce(o.payments, jsonb_build_array(jsonb_build_object('method', o.payment_method, 'amount', o.total)));
      select id into v_sess from public.cash_sessions where status = 'aberto';
      for it in select * from jsonb_array_elements(parts) loop
        if it->>'method' = 'fiado' then
          if o.customer_id is not null then
            insert into public.customer_ledger(customer_id, kind, amount, description, order_id)
            values (o.customer_id, 'ajuste', (it->>'amount')::numeric, 'Cancelamento pedido #' || o.code, o.id);
          end if;
        else
          if v_sess is null then raise exception 'CAIXA_FECHADO'; end if;
          insert into public.cash_movements(session_id, kind, method, amount, description, order_id)
          values (v_sess, 'estorno', it->>'method', (it->>'amount')::numeric, 'Estorno pedido #' || o.code, o.id);
        end if;
      end loop;
      update public.orders set payment_status = 'estornado' where id = o.id;
    end if;
  end if;
  update public.orders set status = p_status, updated_at = now() where id = o.id;
end $function$;

-- ---------- quem pode chamar cada função ----------
do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
  end loop;
end $$;
-- públicas (app do cliente, sem login)
grant execute on function public.is_admin(), public.haversine_km(float8,float8,float8,float8),
  public.quote_delivery(float8,float8,numeric,numeric), public.place_order(jsonb),
  public.get_order_public(uuid), public.set_marketing_optin(uuid,text,boolean) to anon, authenticated;
-- só usuário logado (e cada uma confere is_admin por dentro)
grant execute on function public.claim_admin(), public.adjust_stock(uuid,integer), public.cash_expected(uuid),
  public.open_cash(numeric,text), public.cash_move(text,numeric,text,text), public.close_cash(numeric,text),
  public.add_debt(uuid,numeric,text), public.receive_debt(uuid,numeric,text,text),
  public.pay_order(uuid,text,uuid), public.pay_order_split(uuid,jsonb,uuid),
  public.set_order_items(uuid,jsonb), public.set_order_status(uuid,text) to authenticated;

-- ---------- segurança por linha (RLS) ----------
alter table public.admins enable row level security;
alter table public.store_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.stories enable row level security;
alter table public.customers enable row level security;
alter table public.customer_ledger enable row level security;
alter table public.cash_sessions enable row level security;
alter table public.cash_movements enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.message_log enable row level security;

create policy admins_self on public.admins as PERMISSIVE for SELECT to authenticated using ((user_id = auth.uid()));
create policy movements_admin on public.cash_movements as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy sessions_admin on public.cash_sessions as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy categories_admin on public.categories as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy categories_read on public.categories as PERMISSIVE for SELECT to anon, authenticated using (true);
create policy ledger_admin on public.customer_ledger as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy customers_admin on public.customers as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy message_log_admin on public.message_log as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy order_items_admin on public.order_items as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy orders_admin on public.orders as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy products_admin on public.products as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy products_read on public.products as PERMISSIVE for SELECT to anon, authenticated using ((is_active OR is_admin()));
create policy settings_admin on public.store_settings as PERMISSIVE for UPDATE to authenticated using (is_admin()) with check (is_admin());
create policy settings_read on public.store_settings as PERMISSIVE for SELECT to anon, authenticated using (true);
create policy stories_admin on public.stories as PERMISSIVE for ALL to authenticated using (is_admin()) with check (is_admin());
create policy stories_read on public.stories as PERMISSIVE for SELECT to anon, authenticated using (((expires_at > now()) OR is_admin()));

-- ---------- tempo real (cliente e painel se atualizam sozinhos) ----------
alter publication supabase_realtime add table public.store_settings, public.categories, public.products, public.stories, public.orders;

-- ---------- vigia do plano grátis (ping diário + data do último backup) ----------
create table if not exists public.system_status (
  id integer primary key default 1 check (id = 1),
  last_ping timestamptz,
  last_backup timestamptz,
  ping_count integer not null default 0,
  idle_days integer not null default 0
);
insert into public.system_status (id) values (1) on conflict do nothing;
alter table public.system_status enable row level security;
create policy system_status_admin on public.system_status for select to authenticated using (public.is_admin());

create or replace function public.manter_ativo()
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_last timestamptz; v_idle int;
begin
  select greatest(
    (select max(created_at) from public.orders),
    (select max(updated_at) from public.store_settings),
    (select max(created_at) from public.cash_movements)) into v_last;
  v_idle := coalesce(extract(day from now() - v_last)::int, 0);
  update public.system_status set last_ping = now(), ping_count = ping_count + 1, idle_days = v_idle where id = 1;
  return jsonb_build_object('ok', true, 'dias_sem_movimento', v_idle, 'modo_vigia', v_idle >= 3);
end $$;
revoke all on function public.manter_ativo() from public, anon, authenticated;
grant execute on function public.manter_ativo() to anon, authenticated;

-- ---------- fotos e vídeos (stories, produtos) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('media', 'media', true, 20971520,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']) on conflict (id) do nothing;
create policy media_admin_insert on storage.objects as PERMISSIVE for INSERT to authenticated with check (((bucket_id = 'media'::text) AND is_admin()));
create policy media_admin_update on storage.objects as PERMISSIVE for UPDATE to authenticated using (((bucket_id = 'media'::text) AND is_admin()));
create policy media_admin_delete on storage.objects as PERMISSIVE for DELETE to authenticated using (((bucket_id = 'media'::text) AND is_admin()));

-- =====================================================================
-- CARDÁPIO INICIAL (sem vendas, sem clientes, estoque zerado)
-- Edite preços/nomes à vontade depois, pelo painel.
-- =====================================================================
insert into public.store_settings (id) values (1) on conflict (id) do nothing;

insert into public.categories (id, name, sort) values
  ('569c1a1b-691b-4c5c-8227-5c6cb907225d', 'Fritos', 1),
  ('7cd7d508-a326-467e-bdae-fb44b384f8e5', 'Assados', 2),
  ('778eb7cd-5308-4aaa-94ca-97de28fd47a5', 'Combos e kits', 3),
  ('2c03675c-7a6d-4118-8e29-c1465020aae0', 'Bebidas', 4)
on conflict (id) do nothing;

insert into public.products (code, category_id, name, description, price, cost, unit_label, is_combo, combo_items, is_featured, sort, stock) values
  ('001', '569c1a1b-691b-4c5c-8227-5c6cb907225d', 'Coxinha de frango', 'Massa de batata, frango desfiado temperado e requeijão cremoso.', 10, 2.86, 'unidade', false, null, true, 1, 0),
  ('002', '7cd7d508-a326-467e-bdae-fb44b384f8e5', 'Esfiha de carne', 'Massa macia assada com carne temperada.', 10, 2.34, 'unidade', false, null, false, 1, 0),
  ('003', '778eb7cd-5308-4aaa-94ca-97de28fd47a5', 'Kit festa · 100 mini salgados', 'Sortidos: coxinha, kibe, bolinha de queijo e risole.', 95, 38, 'kit', true, '25 coxinhas, 25 kibes, 25 bolinhas de queijo, 25 risoles', true, 1, 0),
  ('004', '2c03675c-7a6d-4118-8e29-c1465020aae0', 'Refrigerante lata', '350 ml, sabores variados.', 6, 3.2, 'unidade', false, null, false, 1, 0),
  ('005', '778eb7cd-5308-4aaa-94ca-97de28fd47a5', 'Combo lanche', '2 salgados à escolha + refrigerante lata.', 24, 7, 'combo', true, '2 salgados + 1 refrigerante lata', false, 2, 0),
  ('006', '7cd7d508-a326-467e-bdae-fb44b384f8e5', 'Enroladinho de salsicha', 'Massa amanteigada assada no ponto.', 10, 2.21, 'unidade', false, null, false, 2, 0),
  ('007', '569c1a1b-691b-4c5c-8227-5c6cb907225d', 'Kibe', 'Carne moída com trigo, hortelã e um toque de limão.', 10, 2.99, 'unidade', false, null, false, 2, 0),
  ('008', '2c03675c-7a6d-4118-8e29-c1465020aae0', 'Suco natural', '500 ml, laranja ou maracujá.', 9, 3.5, 'unidade', false, null, false, 2, 0),
  ('009', '569c1a1b-691b-4c5c-8227-5c6cb907225d', 'Bolinha de queijo', 'Massa leve e muito queijo derretido por dentro.', 10, 2.6, 'unidade', false, null, false, 3, 0),
  ('010', '569c1a1b-691b-4c5c-8227-5c6cb907225d', 'Risole de presunto e queijo', 'Crocante por fora, cremoso por dentro.', 10, 2.6, 'unidade', false, null, false, 4, 0)
on conflict (code) do nothing;
select setval('public.product_code_seq', 10, true);
