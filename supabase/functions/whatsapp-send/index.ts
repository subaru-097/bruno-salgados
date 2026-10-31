// Envio pelo WhatsApp Business Platform (API oficial da Meta).
// Precisa dos segredos WA_TOKEN (token permanente) e WA_PHONE_ID (ID do número), configurados no Supabase.
// Só o dono logado consegue chamar. Envia um modelo aprovado pela Meta para cada contato e registra em message_log.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const user = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: isAdmin } = await user.rpc("is_admin");
    if (!isAdmin) return json({ error: "SOMENTE_ADMIN" }, 403);

    const token = Deno.env.get("WA_TOKEN"), phoneId = Deno.env.get("WA_PHONE_ID");
    if (!token || !phoneId) return json({ error: "WHATSAPP_NAO_CONFIGURADO" }, 400);

    const { recipients = [], template, lang = "pt_BR", image_url, kind = "promo" } = await req.json();
    if (!template) return json({ error: "MODELO_OBRIGATORIO" }, 400);
    if (!Array.isArray(recipients) || !recipients.length || recipients.length > 500) return json({ error: "CONTATOS_INVALIDOS" }, 400);

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const results: { phone: string; ok: boolean; error?: string }[] = [];
    for (const r of recipients) {
      let to = String(r.phone || "").replace(/\D/g, "");
      if (to.length <= 11) to = "55" + to;
      const components: unknown[] = [];
      if (image_url) components.push({ type: "header", parameters: [{ type: "image", image: { link: image_url } }] });
      if (Array.isArray(r.params) && r.params.length) components.push({ type: "body", parameters: r.params.map((t: string) => ({ type: "text", text: String(t).slice(0, 900) })) });
      const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to, type: "template", template: { name: template, language: { code: lang }, components } }),
      });
      const body = await res.json().catch(() => ({}));
      const ok = res.ok;
      const error = ok ? undefined : (body?.error?.message ?? `HTTP ${res.status}`);
      results.push({ phone: to, ok, error });
      await admin.from("message_log").insert({ kind, channel: "api", phone: to, name: r.name ?? null, body: (r.params ?? []).join(" | "), status: ok ? "enviado" : "erro", error });
      await new Promise((ok) => setTimeout(ok, 120));
    }
    return json({ sent: results.filter((x) => x.ok).length, failed: results.filter((x) => !x.ok).length, results });
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
