// Cria a cobrança do Mercado Pago (Pix ou cartão) para um pedido feito no app.
// Também confere o pagamento quando o cliente volta do Mercado Pago (fallback do aviso automático).
// O Access Token fica no cofre do banco (Vault) ou no segredo MP_ACCESS_TOKEN; nunca vai para o navegador.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const sb = createClient(SB_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const SITES = ["https://bruno-salgados.vercel.app", "https://quiosdatata.online", "https://www.quiosdatata.online",
  ...(Deno.env.get("SITE_URLS") || "").split(",").map(s => s.trim()).filter(Boolean)];
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, GET, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let tokenCache = "";
async function token() {
  if (tokenCache) return tokenCache;
  tokenCache = Deno.env.get("MP_ACCESS_TOKEN") || "";
  if (!tokenCache) { const { data } = await sb.rpc("mp_token"); tokenCache = data || ""; }
  return tokenCache;
}
async function mp(path: string, init: RequestInit = {}) {
  const r = await fetch("https://api.mercadopago.com" + path, { ...init, headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json", ...(init.headers || {}) } });
  const body = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, body };
}

// procura um pagamento aprovado deste pedido e dá baixa (usado quando o cliente volta do checkout)
async function verificar(orderId: string) {
  const r = await mp(`/v1/payments/search?external_reference=${orderId}&sort=date_created&criteria=desc`);
  const pago = (r.body?.results || []).find((p: any) => p.status === "approved");
  if (!pago) return "pendente";
  const { data } = await sb.rpc("mp_confirm_payment", { p_order: orderId, p_payment_id: String(pago.id), p_amount: pago.transaction_amount });
  return data;
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!(await token())) return json({ error: "MP_NAO_CONFIGURADO" }, 503);
  if (req.method === "GET") {
    // teste de conexão: confirma que o Access Token é válido (não devolve dados da conta)
    const me = await mp("/users/me");
    return json({ ok: me.ok, site: me.body?.site_id ?? null });
  }
  let body: any = {};
  try { body = await req.json(); } catch { /* vazio */ }
  const orderId = String(body.order_id || "");
  if (!UUID.test(orderId)) return json({ error: "PEDIDO_INVALIDO" }, 400);

  const { data: o } = await sb.from("orders").select("id,code,total,status,payment_method,payment_status,customer_name,created_at,mp_checkout_url,channel").eq("id", orderId).maybeSingle();
  if (!o || o.channel !== "app") return json({ error: "PEDIDO_NAO_ENCONTRADO" }, 404);
  if (body.action === "verificar") return json({ status: await verificar(orderId) });
  if (o.payment_method !== "mercadopago") return json({ error: "PAGAMENTO_INVALIDO" }, 400);
  if (o.payment_status !== "pendente") return json({ error: "PEDIDO_JA_PAGO" }, 409);
  if (o.status === "cancelado") return json({ error: "PEDIDO_CANCELADO" }, 409);
  if (Date.now() - new Date(o.created_at).getTime() > 24 * 36e5) return json({ error: "PEDIDO_EXPIRADO" }, 409);
  if (o.mp_checkout_url) return json({ init_point: o.mp_checkout_url });

  const origin = req.headers.get("origin") || "";
  const site = SITES.includes(origin) ? origin : SITES[0];
  const volta = `${site}/?pedido=${o.id}`;
  const pref = await mp("/checkout/preferences", { method: "POST", body: JSON.stringify({
    items: [{ id: o.id, title: `Pedido #${o.code} · Bruno Salgados`, quantity: 1, currency_id: "BRL", unit_price: Number(o.total) }],
    external_reference: o.id,
    notification_url: `${SB_URL}/functions/v1/mp-webhook`,
    back_urls: { success: volta, pending: volta, failure: volta },
    auto_return: "approved",
    statement_descriptor: "BRUNOSALGADOS",
    payment_methods: { excluded_payment_types: [{ id: "ticket" }], installments: 1 },
    expires: true,
    expiration_date_to: new Date(Date.now() + 2 * 36e5).toISOString(),
  }) });
  if (!pref.ok || !pref.body?.init_point) {
    console.error("preferencia_falhou", pref.status, JSON.stringify(pref.body).slice(0, 300));
    return json({ error: "MP_FALHOU" }, 502);
  }
  await sb.from("orders").update({ mp_preference_id: pref.body.id, mp_checkout_url: pref.body.init_point }).eq("id", o.id);
  return json({ init_point: pref.body.init_point });
});
