#!/usr/bin/env bash
# Restaura um backup num projeto Supabase onde o supabase/schema.sql já foi rodado.
# Uso: ./scripts/restaurar-backup.sh backup-2026-11-09.sql.gz.gpg "postgresql://...session pooler..."
set -euo pipefail
ARQ="$1"; DB="$2"
read -rsp "Senha do backup: " PW; echo
psql "$DB" -v ON_ERROR_STOP=1 -qc "truncate public.order_items, public.orders, public.cash_movements, public.cash_sessions,
  public.customer_ledger, public.customers, public.message_log, public.stories, public.products, public.categories,
  public.store_settings, public.system_status cascade"
gpg --batch --pinentry-mode loopback --passphrase "$PW" -d "$ARQ" | gunzip | psql "$DB" -v ON_ERROR_STOP=1 -q
echo "Pronto. Entre no /admin com o mesmo e-mail de dono (o usuário precisa existir em Authentication)."
