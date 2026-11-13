// Aviso automático do Mercado Pago. Quando um pagamento é aprovado, o pedido vira "Pago" sozinho.
// Não confia no conteúdo do aviso: busca o pagamento direto na API do Mercado Pago com o Access Token.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
let tokenCache = "";
async function token() {
  if (tokenCache) return tokenCache;
  tokenCache = Deno.env.get("MP_ACCESS_TOKEN") || "";
  if (!tokenCache) { const { data } = await sb.rpc("mp_token"); tokenCache = data || ""; }
  return tokenCache;
}
const ok = (msg = "ok") => new Response(msg, { status: 200 });

Deno.serve(async req => {
  const url = new URL(req.url);
  let body: any = {};
  if (req.method === "POST") { try { body = await req.json(); } catch { /* vazio */ } }
  const tipo = body.type || body.topic || url.searchParams.get("type") || url.searchParams.get("topic") || "";
  const id = String(body.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id") || "");
  if (tipo !== "payment" || !/^\d+$/.test(id)) return ok("ignorado");

  const tk = await token();
  if (!tk) return new Response("sem token", { status: 503 });
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, { headers: { Authorization: `Bearer ${tk}` } });
  if (r.status === 404) return ok("pagamento nao encontrado");
  if (!r.ok) return new Response("erro mp", { status: 502 }); // o Mercado Pago tenta de novo depois
  const p = await r.json();
  if (p.status !== "approved" || !p.external_reference) return ok("status " + p.status);
  const { data, error } = await sb.rpc("mp_confirm_payment", { p_order: p.external_reference, p_payment_id: String(p.id), p_amount: p.transaction_amount });
  if (error) { console.error("baixa_falhou", error.message); return new Response("erro", { status: 500 }); }
  console.log("pedido", p.external_reference, "->", data);
  return ok(String(data));
});
