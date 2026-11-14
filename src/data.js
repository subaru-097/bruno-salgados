/* ================= utilidades ================= */
const SUPABASE_URL = "https://vlbnnlnffviozykdymqm.supabase.co";
const SUPABASE_KEY = "sb_publishable_vb8vBSsra8HbS_e_xmydlA_VIOvk0T5";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const money = v => BRL.format(Number(v || 0));
const n2 = v => Math.round(Number(v || 0) * 100) / 100;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "id-" + Math.random().toString(36).slice(2) + Date.now());
const dayKey = d => { const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const fmtDate = d => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
const fmtDateLong = d => new Date(d).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
const fmtTime = d => new Date(d).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const fmtDT = d => fmtDate(d) + " " + fmtTime(d);
const onlyDigits = s => String(s || "").replace(/\D/g, "");
const store = {
  get(k, def) { try { const v = localStorage.getItem("bs_" + k); return v == null ? def : JSON.parse(v); } catch { return def; } },
  set(k, v) { try { localStorage.setItem("bs_" + k, JSON.stringify(v)); } catch {} }
};

const METHOD_LABEL = { misto: "Dividido", dinheiro: "Dinheiro", pix: "Pix", cartao_credito: "Crédito", cartao_debito: "Débito", fiado: "Fiado", mercadopago: "Mercado Pago", outro: "Outro" };
const STATUS_LABEL = { novo: "Aguardando aceite", preparando: "Em preparo", pronto: "Pronto", saiu: "Saiu para entrega", entregue: "Concluído", cancelado: "Cancelado" };
const KIND_LABEL = { venda: "Venda", sangria: "Retirada (sangria)", suprimento: "Reforço de troco", recebimento_fiado: "Recebimento de fiado", despesa: "Despesa", estorno: "Estorno" };
const payParts = o => o.payments?.length ? o.payments : [{ method: o.payment_method, amount: Number(o.total) }];
const IN_KINDS = ["venda", "suprimento", "recebimento_fiado"];

const ERR = {
  LOJA_FECHADA: "A loja está fechada agora. Tente mais tarde.",
  FORA_DO_RAIO: "Esse endereço está fora da área de entrega.",
  LOJA_SEM_LOCALIZACAO: "A loja ainda não configurou o endereço de saída das entregas. Escolha retirada.",
  ENDERECO_INVALIDO: "Endereço não encontrado ou em branco. Confira a rua, o número e o CEP.",
  ENTREGA_DESATIVADA: "Entregas estão pausadas no momento. Escolha retirada.",
  RETIRADA_DESATIVADA: "Retirada indisponível no momento.",
  CAIXA_FECHADO: "Abra o caixa antes de registrar pagamentos.",
  CAIXA_JA_ABERTO: "Já existe um caixa aberto.",
  PEDIDO_JA_PAGO: "Esse pedido já foi pago.",
  PEDIDO_CANCELADO: "Esse pedido foi cancelado.",
  CLIENTE_OBRIGATORIO_FIADO: "Escolha o cliente para lançar no fiado.",
  NOME_OBRIGATORIO: "Informe seu nome.",
  CARRINHO_VAZIO: "A sacola está vazia.",
  SOMENTE_ADMIN: "Entre como dono para fazer isso.",
  PAGAMENTO_INVALIDO: "Essa forma de pagamento não está disponível.",
  QUANTIDADE_INVALIDA: "Quantidade inválida.",
  PEDIDO_NAO_ENCONTRADO: "Pedido não encontrado.",
  ENTREGA_INVALIDA: "Escolha entrega ou retirada.",
  TELEFONE_INVALIDO: "Informe um WhatsApp com DDD para avisarmos sobre o pedido.",
  MUITOS_PEDIDOS: "Você já enviou vários pedidos agora há pouco. Aguarde a loja confirmar ou fale com a gente no WhatsApp.",
  SEM_CONEXAO: "Sem conexão com o servidor da loja.",
  WHATSAPP_NAO_CONFIGURADO: "O envio automático ainda não foi ligado. Configure a API oficial do WhatsApp em Configurações › WhatsApp.",
  MODELO_OBRIGATORIO: "Informe o nome do modelo de mensagem aprovado pela Meta em Configurações › WhatsApp.",
  PAGAMENTO_NAO_FECHA: "A soma dos pagamentos não bate com o total da venda."
};
function errMsg(e) {
  const m = String(e?.message || e || "");
  const code = Object.keys(ERR).find(k => m.includes(k));
  if (code) return ERR[code];
  let r = m.match(/SEM_ESTOQUE:([^:]+):(\d+)/);
  if (r) return `${r[1]}: só restam ${r[2]} no estoque.`;
  r = m.match(/PRODUTO_INDISPONIVEL:(.+)/);
  if (r) return `${r[1]} não está mais disponível.`;
  r = m.match(/PEDIDO_MINIMO:([\d.]+)/);
  if (r) return `Pedido mínimo para entrega: ${money(r[1])}.`;
  if (/products_code_key/.test(m)) return "Esse código já está em outro produto. Use outro.";
  if (/Invalid login/i.test(m)) return "E-mail ou senha incorretos.";
  if (/Email not confirmed/i.test(m)) return "Confirme seu e-mail pelo link que enviamos e tente de novo.";
  if (/already registered/i.test(m)) return "Esse e-mail já tem conta. Use Entrar.";
  return m || "Algo deu errado. Tente de novo.";
}

/* fotos padrão até o dono subir as dele */
function photoFor(p) {
  if (p.image_url) return p.image_url;
  if (typeof PHOTOS === "undefined") return null;
  const n = (p.name || "").toLowerCase();
  const k = /kit|festa/.test(n) ? "kit" : /coxinha/.test(n) ? "coxinha" : /kibe|quibe/.test(n) ? "kibe" : /bolinha|queijo/.test(n) && !/risole/.test(n) ? "bolinha"
    : /esfiha|esfirra/.test(n) ? "esfiha" : /enroladinho|salsicha/.test(n) ? "enroladinho" : /combo/.test(n) ? "kit" : null;
  return k ? PHOTOS[k] : null;
}

/* barramento de eventos (tempo real) */
const bus = { h: {}, on(e, f) { (this.h[e] ||= []).push(f); }, emit(e, d) { (this.h[e] || []).forEach(f => { try { f(d); } catch (x) { console.error(x); } }); } };

/* cálculo de frete (mesma regra do banco) */
function calcFee(s, km, subtotal) {
  if (km > Number(s.delivery_max_km)) return { ok: false, reason: "FORA_DO_RAIO", distance_km: km };
  let fee = Number(s.delivery_base_fee) + Number(s.delivery_per_km) * Math.max(0, km - Number(s.delivery_included_km));
  fee = Math.ceil(fee * 2) / 2;
  if (s.free_delivery_over != null && s.free_delivery_over !== "" && subtotal >= Number(s.free_delivery_over)) fee = 0;
  return { ok: true, distance_km: n2(km), fee };
}
function haversine(a, b, c, d) {
  const R = 6371, r = x => x * Math.PI / 180;
  const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ================= backend Supabase ================= */
function makeSupabaseApi(sb) {
  const q = async p => { const { data, error } = await p; if (error) throw error; return data; };
  const rpc = (fn, args) => q(sb.rpc(fn, args));
  const removeMedia = async urls => { const mark = "/storage/v1/object/public/media/";
    const paths = urls.filter(u => u && u.includes(mark)).map(u => decodeURIComponent(u.split(mark)[1].split("?")[0]));
    if (paths.length) { try { await sb.storage.from("media").remove(paths); } catch {} } };
  async function all(build) {
    let out = [], from = 0, step = 1000;
    for (;;) { const rows = await q(build().range(from, from + step - 1)); out = out.concat(rows); if (rows.length < step) break; from += step; }
    return out;
  }
  const api = {
    mode: "supabase",
    settings: () => q(sb.from("store_settings").select("*").eq("id", 1).single()),
    saveSettings: patch => q(sb.from("store_settings").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", 1).select().single()),
    categories: () => q(sb.from("categories").select("*").order("sort")),
    saveCategory: c => c.id ? q(sb.from("categories").update({ name: c.name, sort: c.sort }).eq("id", c.id)) : q(sb.from("categories").insert({ name: c.name, sort: c.sort || 0 })),
    deleteCategory: id => q(sb.from("categories").delete().eq("id", id)),
    products: () => q(sb.from("products").select("*").order("sort").order("name")),
    saveProduct: p => { const { id, created_at, ...rest } = p; rest.updated_at = new Date().toISOString(); if (!rest.code) delete rest.code;
      return id ? q(sb.from("products").update(rest).eq("id", id)) : q(sb.from("products").insert(rest)); },
    deleteProduct: id => q(sb.from("products").delete().eq("id", id)),
    adjustStock: (id, delta) => rpc("adjust_stock", { p_product: id, p_delta: delta }),
    setStock: (id, stock) => q(sb.from("products").update({ stock, updated_at: new Date().toISOString() }).eq("id", id)),
    stories: () => q(sb.from("stories").select("*").order("created_at", { ascending: false })),
    addStory: s => q(sb.from("stories").insert({ image_url: s.image_url, caption: s.caption, media_type: s.media_type || "image", expires_at: new Date(Date.now() + (s.hours || 24) * 36e5).toISOString() })),
    async deleteStory(id) { const st = await q(sb.from("stories").select("image_url").eq("id", id).maybeSingle());
      await q(sb.from("stories").delete().eq("id", id)); await removeMedia([st?.image_url]); },
    // apaga do armazenamento os stories vencidos há mais de 2 dias (o plano grátis tem 1 GB)
    async cleanupStories() { const old = await q(sb.from("stories").select("id,image_url").lt("expires_at", new Date(Date.now() - 2 * 864e5).toISOString()));
      if (!old.length) return 0; await removeMedia(old.map(s => s.image_url)); await q(sb.from("stories").delete().in("id", old.map(s => s.id))); return old.length; },
    systemStatus: () => q(sb.from("system_status").select("*").eq("id", 1).maybeSingle()),
    async upload(file) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${new Date().getFullYear()}/${uid()}.${ext}`;
      const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
    },
    quote: (lat, lng, routeKm, subtotal) => rpc("quote_delivery", { p_lat: lat, p_lng: lng, p_route_km: routeKm, p_subtotal: subtotal }),
    placeOrder: p => rpc("place_order", { p }),
    orderPublic: id => rpc("get_order_public", { p_id: id }),
    setOptin: (id, phone, v) => rpc("set_marketing_optin", { p_order: id, p_phone: phone, p_optin: v }),
    logMessages: rows => q(sb.from("message_log").insert(rows)),
    messageLog: () => q(sb.from("message_log").select("*").order("created_at", { ascending: false }).limit(200)),
    async waSend(payload) { const { data, error } = await sb.functions.invoke("whatsapp-send", { body: payload });
      if (error) { let m = error.message; try { m = (await error.context.json()).error || m; } catch {} throw new Error(m); } return data; },
    orders: ({ from, to } = {}) => all(() => { let b = sb.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      if (from) b = b.gte("created_at", from.toISOString()); if (to) b = b.lt("created_at", to.toISOString()); return b; }),
    order: id => q(sb.from("orders").select("*, order_items(*)").eq("id", id).single()),
    setStatus: (id, s) => rpc("set_order_status", { p_order: id, p_status: s }),
    updateOrder: (id, patch) => q(sb.from("orders").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id)),
    setOrderItems: (id, items) => rpc("set_order_items", { p_order: id, p_items: items }),
    payOrderSplit: (id, pays, cid) => rpc("pay_order_split", { p_order: id, p_payments: pays, p_customer: cid || null }),
    async changeEmail(email) { const { error } = await sb.auth.updateUser({ email }); if (error) throw error; },
    async changePassword(password) { const { error } = await sb.auth.updateUser({ password }); if (error) throw error; },
    payOrder: (id, method, customerId) => rpc("pay_order", { p_order: id, p_method: method, p_customer: customerId || null }),
    customers: () => q(sb.from("customer_balances").select("*").order("name")),
    saveCustomer: c => { const { id, balance, last_movement, created_at, ...rest } = c;
      return id ? q(sb.from("customers").update(rest).eq("id", id).select().single()) : q(sb.from("customers").insert(rest).select().single()); },
    customerLedger: id => q(sb.from("customer_ledger").select("*").eq("customer_id", id).order("created_at", { ascending: false })),
    receiveDebt: (cid, amt, method, desc) => rpc("receive_debt", { p_customer: cid, p_amount: amt, p_method: method, p_desc: desc || null }),
    addDebt: (cid, amt, desc) => rpc("add_debt", { p_customer: cid, p_amount: amt, p_desc: desc }),
    async cashCurrent() {
      const s = await q(sb.from("cash_sessions").select("*").eq("status", "aberto").maybeSingle());
      if (!s) return null;
      s.movements = await q(sb.from("cash_movements").select("*").eq("session_id", s.id).order("created_at", { ascending: false }));
      return s;
    },
    openCash: (amt, notes) => rpc("open_cash", { p_amount: amt, p_notes: notes || null }),
    cashMove: (kind, amt, method, desc) => rpc("cash_move", { p_kind: kind, p_amount: amt, p_method: method, p_desc: desc || null }),
    closeCash: (counted, notes) => rpc("close_cash", { p_counted: counted, p_notes: notes || null }),
    cashSessions: ({ from } = {}) => all(() => { let b = sb.from("cash_sessions").select("*, cash_movements(*)").order("opened_at", { ascending: false });
      if (from) b = b.gte("opened_at", from.toISOString()); return b; }),
    // login fica salvo neste aparelho: se a internet ainda não conectou (PC acabou de ligar), espera e tenta de novo
    // em vez de mandar para a tela de login
    async getUser() {
      for (const wait of [0, 1500, 3000, 5000, 8000]) {
        if (wait) await new Promise(r => setTimeout(r, wait));
        const { data, error } = await sb.auth.getSession();
        if (data.session?.user) return data.session.user;
        if (!error) return null; // não tem login salvo
      }
      return null;
    },
    async signIn(email, password) { const { error } = await sb.auth.signInWithPassword({ email, password }); if (error) throw error; },
    async signUp(email, password) { const { data, error } = await sb.auth.signUp({ email, password }); if (error) throw error; return !!data.session; },
    signOut: () => sb.auth.signOut(),
    claimAdmin: () => rpc("claim_admin"),
    async startOnlinePayment(orderId) {
      // a Edge Function "mp-checkout" cria a cobrança com o Access Token guardado no servidor e devolve o link de pagamento
      const { data, error } = await sb.functions.invoke("mp-checkout", { body: { order_id: orderId } });
      if (data?.init_point) return data.init_point;
      let code = data?.error; try { code ||= (await error?.context?.json?.())?.error; } catch {}
      throw new Error({ PEDIDO_JA_PAGO: "Este pedido já está pago.", PEDIDO_CANCELADO: "Este pedido foi cancelado.", PEDIDO_EXPIRADO: "O prazo para pagar este pedido acabou." }[code]
        || "Não conseguimos abrir o pagamento online agora.");
    },
    // confere no Mercado Pago se o pedido já foi pago (quando o cliente volta do checkout)
    async checkOnlinePayment(orderId) { try { const { data } = await sb.functions.invoke("mp-checkout", { body: { order_id: orderId, action: "verificar" } }); return data?.status || null; } catch { return null; } },
    subscribeAll() {
      const ch = sb.channel("bs-live");
      [["products", "products"], ["store_settings", "settings"], ["stories", "stories"], ["categories", "products"], ["orders", "orders"]]
        .forEach(([t, ev]) => ch.on("postgres_changes", { event: "*", schema: "public", table: t }, p => bus.emit(ev, p)));
      ch.subscribe();
    }
  };
  return api;
}

/* ================= backend de demonstração (sem internet) ================= */
function makeDemoApi() {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const now = Date.now();
  const S = {
    settings: { id: 1, store_name: "Bruno Salgados", tagline: "Salgados fresquinhos, feitos na hora", whatsapp: "", address: "Rua Edna Antônio Bacete, 1508",
      lat: -23.0, lng: -47.0, is_open: true, pause_message: "Estamos fechados no momento. Volte logo!", opening_hours: "Seg a Sáb · 9h às 20h",
      delivery_enabled: true, pickup_enabled: true, delivery_base_fee: 7.8, delivery_included_km: 3, delivery_per_km: 1.5, table_count: 6, delivery_max_km: 10,
      delivery_min_order: 0, free_delivery_over: null, prep_minutes: 30, pix_key: "brunosalgados@exemplo.com", pix_name: "Bruno Salgados",
      accept_cash: true, accept_card_on_delivery: true, accept_pix: true, payment_provider: "none", mp_public_key: "", mp_enabled: false,
      wa_mode: "manual", wa_phone_id: "", wa_promo_template: "", wa_debt_template: "", wa_story_ask: true,
      wa_promo_text: "Oi {nome}! Novidade na {loja}: {mensagem}\nPeça pelo app: {link}", wa_debt_text: "Oi {nome}, tudo bem? Aqui é da {loja}. Seu saldo em aberto é de {valor}. Pode pagar no Pix {pix} ou na loja. Obrigado!",
      receipt_auto: false, receipt_width: 80, receipt_copies: 1, receipt_footer: "Obrigado pela preferência! Volte sempre.", alert_sound: "caixa", alert_volume: 0.8, alert_repeat: true },
    categories: [], products: [], stories: [], customers: [], ledger: [], sessions: [], movements: [], orders: [], log: [], code: 1001, user: null
  };
  const cats = [["Fritos", 1], ["Assados", 2], ["Combos e kits", 3], ["Bebidas", 4]].map(([name, sort]) => ({ id: uid(), name, sort }));
  S.categories = cats;
  const C = n => cats.find(c => c.name === n).id;
  [["Fritos", "Coxinha de frango", "Massa de batata, frango desfiado temperado e requeijão cremoso.", 10, 2.9, "unidade", 40, true],
   ["Fritos", "Kibe", "Carne moída com trigo, hortelã e um toque de limão.", 10, 3, "unidade", 30],
   ["Fritos", "Bolinha de queijo", "Massa leve e muito queijo derretido por dentro.", 10, 2.6, "unidade", 3],
   ["Fritos", "Risole de presunto e queijo", "Crocante por fora, cremoso por dentro.", 10, 2.6, "unidade", 25],
   ["Assados", "Esfiha de carne", "Massa macia assada com carne temperada.", 10, 2.4, "unidade", 30],
   ["Assados", "Enroladinho de salsicha", "Massa amanteigada assada no ponto.", 10, 2.2, "unidade", 0],
   ["Combos e kits", "Kit festa · 100 mini salgados", "Sortidos: coxinha, kibe, bolinha de queijo e risole.", 95, 38, "kit", 8, true, "25 coxinhas, 25 kibes, 25 bolinhas de queijo, 25 risoles"],
   ["Combos e kits", "Combo lanche", "2 salgados à escolha + refrigerante lata.", 24, 9, "combo", 15, false, "2 salgados + 1 refrigerante lata"],
   ["Bebidas", "Refrigerante lata", "350 ml, sabores variados.", 6, 3.2, "unidade", 48],
   ["Bebidas", "Suco natural", "500 ml, laranja ou maracujá.", 9, 3.5, "unidade", 12]
  ].forEach(([cat, name, description, price, cost, unit_label, stock, feat, combo], i) => S.products.push({
    id: uid(), category_id: C(cat), name, description, price, cost, unit_label, image_url: null, is_combo: cat === "Combos e kits",
    combo_items: combo || null, code: String(i + 1).padStart(3, "0"), track_stock: true, stock, low_stock_alert: 5, is_active: true, is_featured: !!feat, sort: i }));

  const storyImg = (bg, fg, t) => "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"><rect width="360" height="640" fill="${bg}"/><circle cx="180" cy="280" r="120" fill="${fg}" opacity=".9"/><path d="M180 175c-55 70-85 120-85 155a85 85 0 0 0 170 0c0-35-30-85-85-155z" fill="#F3C27A"/><text x="180" y="520" font-family="sans-serif" font-size="34" font-weight="700" text-anchor="middle" fill="#fff">${t}</text></svg>`);
  S.stories = [
    { id: uid(), image_url: PHOTOS.coxinha, caption: "Fornada das 16h", created_at: new Date(now - 36e5).toISOString(), expires_at: new Date(now + 20 * 36e5).toISOString() },
    { id: uid(), image_url: PHOTOS.kit, caption: "Kit festa", created_at: new Date(now - 2 * 36e5).toISOString(), expires_at: new Date(now + 22 * 36e5).toISOString() },
    { id: uid(), image_url: PHOTOS.bolinha, caption: "Bolinha saindo", created_at: new Date(now - 3 * 36e5).toISOString(), expires_at: new Date(now + 21 * 36e5).toISOString() }
  ];
  [["Dona Marta Ribeiro", "(19) 99812-4410", 0], ["Seu Jorge da oficina", "(19) 99701-2203", 0], ["Carla Mendes", "(19) 98845-1190", 0], ["Pedro Alves", "(19) 99123-7788", 0]]
    .forEach(([name, phone], i) => S.customers.push({ id: uid(), name, phone, cpf: "", rg: "", birth_date: null, address: "", notes: "", credit_limit: 150, is_active: true, whatsapp_optin: i !== 1, created_at: new Date(now - 40 * 864e5).toISOString() }));

  // histórico de 75 dias
  const active = S.products;
  const methods = ["dinheiro", "dinheiro", "pix", "pix", "pix", "cartao_debito", "cartao_credito"];
  for (let d = 75; d >= 1; d--) {
    const day = startOfDay(now - d * 864e5); if (day.getDay() === 0) continue;
    const open = new Date(day.getTime() + 8.5 * 36e5);
    const sess = { id: uid(), opened_at: open.toISOString(), opening_amount: 100, status: "fechado", notes: null };
    S.sessions.push(sess);
    const nOrders = 9 + Math.floor(rnd() * 14) + (day.getDay() === 5 || day.getDay() === 6 ? 7 : 0);
    for (let k = 0; k < nOrders; k++) {
      const hr = 9 + Math.min(10.8, Math.abs((rnd() + rnd() + rnd()) / 3 * 11 + (rnd() < .4 ? 5 : 0) - 2));
      const t = new Date(day.getTime() + hr * 36e5);
      const items = []; const ni = 1 + Math.floor(rnd() * 3);
      for (let j = 0; j < ni; j++) { const p = active[Math.floor(rnd() * (rnd() < .1 ? active.length : 6))]; const qty = p.unit_label === "kit" ? 1 : 1 + Math.floor(rnd() * 5);
        items.push({ id: uid(), product_id: p.id, name: p.name, unit_price: p.price, unit_cost: p.cost, qty, total: p.price * qty }); }
      const sub = items.reduce((a, b) => a + b.total, 0);
      const app = rnd() < .45, ent = app && rnd() < .6; const fee = ent ? 5 + Math.ceil(rnd() * 8) / 2 : 0;
      const fiado = !app && rnd() < .07; const canc = rnd() < .03;
      const m = fiado ? "fiado" : methods[Math.floor(rnd() * methods.length)];
      const cust = fiado ? S.customers[Math.floor(rnd() * S.customers.length)] : null;
      const an = Math.floor(rnd() * 6);
      const o = { id: uid(), code: S.code++, channel: app ? "app" : "balcao", customer_id: cust?.id || null, customer_name: cust?.name || (app ? ["Ana Paula", "Lucas Rocha", "Bia Souza", "Rafael Lima", "Juliana Alves", "Marcos Dias"][an] : "Balcão"),
        customer_phone: app ? "(19) 9" + (8100000 + an * 1311).toString().padStart(8, "0") : null, marketing_optin: app && an % 3 !== 2, fulfillment: app ? (ent ? "entrega" : "retirada") : "balcao", address: null, distance_km: ent ? n2(1 + rnd() * 7) : null,
        subtotal: sub, delivery_fee: fee, discount: 0, total: sub + fee, payment_method: m, payment_status: canc ? "estornado" : fiado ? "fiado" : "pago",
        status: canc ? "cancelado" : "entregue", notes: null, cash_session_id: sess.id, created_at: t.toISOString(), updated_at: t.toISOString(), order_items: items };
      S.orders.push(o);
      if (fiado) S.ledger.push({ id: uid(), customer_id: cust.id, kind: "debito", amount: o.total, description: "Pedido #" + o.code, order_id: o.id, created_at: o.created_at });
      else if (!canc) S.movements.push({ id: uid(), session_id: sess.id, kind: "venda", method: m, amount: o.total, description: `Pedido #${o.code} · ${o.customer_name}`, order_id: o.id, created_at: o.created_at });
    }
    const cashNow = expected(sess); if (rnd() < .5 && cashNow > 220) S.movements.push({ id: uid(), session_id: sess.id, kind: "sangria", method: "dinheiro", amount: Math.min(cashNow - 120, 100 + Math.floor(rnd() * 3) * 50), description: "Retirada para depósito", created_at: new Date(day.getTime() + 15 * 36e5).toISOString() });
    if (rnd() < .3 && expected(sess) > 150) S.movements.push({ id: uid(), session_id: sess.id, kind: "despesa", method: "dinheiro", amount: 30 + Math.floor(rnd() * 60), description: ["Óleo", "Gás", "Embalagens", "Farinha"][Math.floor(rnd() * 4)], created_at: new Date(day.getTime() + 11 * 36e5).toISOString() });
    if (rnd() < .15) { const c = S.customers[Math.floor(rnd() * S.customers.length)]; const a = 20 + Math.floor(rnd() * 40);
      S.ledger.push({ id: uid(), customer_id: c.id, kind: "pagamento", amount: a, description: "Pagamento de fiado", method: "dinheiro", created_at: new Date(day.getTime() + 13 * 36e5).toISOString() });
      S.movements.push({ id: uid(), session_id: sess.id, kind: "recebimento_fiado", method: "dinheiro", amount: a, description: "Fiado · " + c.name, customer_id: c.id, created_at: new Date(day.getTime() + 13 * 36e5).toISOString() }); }
    const exp = expected(sess); const counted = exp + (rnd() < .8 ? 0 : Math.round((rnd() - .5) * 20));
    Object.assign(sess, { closed_at: new Date(day.getTime() + 20.3 * 36e5).toISOString(), expected_cash: exp, counted_cash: counted, difference: n2(counted - exp) });
  }
  // caixa de hoje aberto com movimentos
  const today = startOfDay(now);
  const cur = { id: uid(), opened_at: new Date(Math.min(now - 60e3, today.getTime() + 8.5 * 36e5)).toISOString(), opening_amount: 100, status: "aberto" };
  S.sessions.push(cur);
  // pedidos do app chegando
  const mk = (name, fulfil, items, st, mins, method) => {
    const its = items.map(([i, q]) => { const p = S.products[i]; return { id: uid(), product_id: p.id, name: p.name, unit_price: p.price, unit_cost: p.cost, qty: q, total: p.price * q }; });
    const sub = its.reduce((a, b) => a + b.total, 0), fee = fulfil === "entrega" ? 8 : 0;
    const o = { id: uid(), code: S.code++, channel: "app", customer_id: null, customer_name: name, customer_phone: "(19) 9" + Math.floor(10000000 + rnd() * 89999999),
      fulfillment: fulfil, address: fulfil === "entrega" ? "Rua das Acácias, 220 · Jardim Primavera" : null, address_ref: fulfil === "entrega" ? "Portão verde" : null,
      distance_km: fulfil === "entrega" ? 3.4 : null, subtotal: sub, delivery_fee: fee, discount: 0, total: sub + fee, payment_method: method, change_for: method === "dinheiro" ? 50 : null,
      payment_status: "pendente", status: st, notes: null, created_at: new Date(now - mins * 6e4).toISOString(), updated_at: new Date(now - mins * 6e4).toISOString(), order_items: its };
    S.orders.push(o); return o;
  };
  const o1 = mk("Juliana", "retirada", [[0, 4], [8, 1]], "entregue", 150, "pix");
  S.movements.push({ id: uid(), session_id: cur.id, kind: "venda", method: "pix", amount: o1.total, description: `Pedido #${o1.code} · Juliana`, order_id: o1.id, created_at: new Date(now - 140 * 6e4).toISOString() });
  o1.payment_status = "pago"; o1.cash_session_id = cur.id;
  const b1 = { id: uid(), code: S.code++, channel: "balcao", customer_id: null, customer_name: "Balcão", fulfillment: "balcao", subtotal: 36, delivery_fee: 0, discount: 0, total: 36, payment_method: "dinheiro",
    payment_status: "pago", status: "entregue", created_at: new Date(now - 95 * 6e4).toISOString(), cash_session_id: cur.id,
    order_items: [{ id: uid(), product_id: S.products[0].id, name: S.products[0].name, unit_price: 10, unit_cost: 2.9, qty: 3, total: 30 }, { id: uid(), product_id: S.products[8].id, name: S.products[8].name, unit_price: 6, unit_cost: 3.2, qty: 1, total: 6 }] };
  S.orders.push(b1);
  S.movements.push({ id: uid(), session_id: cur.id, kind: "venda", method: "dinheiro", amount: 36, description: `Pedido #${b1.code} · Balcão`, order_id: b1.id, created_at: b1.created_at });
  S.movements.push({ id: uid(), session_id: cur.id, kind: "despesa", method: "dinheiro", amount: 42, description: "Gás de cozinha (complemento)", created_at: new Date(now - 70 * 6e4).toISOString() });
  mk("Rafael", "entrega", [[0, 6], [2, 2]], "preparando", 18, "dinheiro");
  mk("Bia Souza", "entrega", [[6, 1]], "novo", 4, "pix");
  mk("Lucas", "retirada", [[4, 3], [9, 1]], "novo", 2, "cartao_debito");
  // contas abertas nas mesas
  [[2, [[0, 4], [8, 2]], 35], [5, [[1, 3], [2, 3], [9, 2]], 12]].forEach(([mesa, items, mins]) => {
    const its = items.map(([i, q]) => { const p = S.products[i]; return { id: uid(), product_id: p.id, name: p.name, unit_price: p.price, unit_cost: p.cost, qty: q, total: p.price * q }; });
    const sub = its.reduce((a, b) => a + b.total, 0), t = new Date(now - mins * 6e4).toISOString();
    S.orders.push({ id: uid(), code: S.code++, channel: "balcao", table_no: mesa, customer_id: null, customer_name: "Mesa " + mesa, fulfillment: "balcao", subtotal: sub, delivery_fee: 0, discount: 0, total: sub,
      payment_method: "dinheiro", payment_status: "pendente", status: "preparando", created_at: t, updated_at: t, order_items: its }); });

  function expected(s) {
    const ms = S.movements.filter(m => m.session_id === s.id && m.method === "dinheiro");
    return n2(Number(s.opening_amount) + ms.filter(m => IN_KINDS.includes(m.kind)).reduce((a, m) => a + m.amount, 0)
      - ms.filter(m => !IN_KINDS.includes(m.kind)).reduce((a, m) => a + m.amount, 0));
  }
  const openSess = () => S.sessions.find(s => s.status === "aberto");
  const fail = c => { throw new Error(c); };
  const clone = x => JSON.parse(JSON.stringify(x));
  const tick = (ev, d) => setTimeout(() => bus.emit(ev, d), 0);
  const isAdmin = () => !!S.user;
  function pay(o, method, cid) {
    if (["pago", "fiado"].includes(o.payment_status)) fail("PEDIDO_JA_PAGO");
    if (o.status === "cancelado") fail("PEDIDO_CANCELADO");
    if (method === "fiado") { const c = cid || o.customer_id; if (!c) fail("CLIENTE_OBRIGATORIO_FIADO");
      S.ledger.push({ id: uid(), customer_id: c, kind: "debito", amount: o.total, description: "Pedido #" + o.code, order_id: o.id, created_at: new Date().toISOString() });
      Object.assign(o, { payment_status: "fiado", payment_method: "fiado", customer_id: c });
    } else { const s = openSess(); if (!s) fail("CAIXA_FECHADO");
      if (o.total > 0) S.movements.push({ id: uid(), session_id: s.id, kind: "venda", method, amount: o.total, description: `Pedido #${o.code} · ${o.customer_name}`, order_id: o.id, customer_id: o.customer_id, created_at: new Date().toISOString() });
      Object.assign(o, { payment_status: "pago", payment_method: method, cash_session_id: s.id }); }
  }
  function paySplit(o, pays, cid) {
    if (["pago", "fiado"].includes(o.payment_status)) fail("PEDIDO_JA_PAGO");
    if (o.status === "cancelado") fail("PEDIDO_CANCELADO");
    const sum = n2(pays.reduce((a, x) => a + Number(x.amount), 0)); if (Math.abs(sum - o.total) > .009) fail("PAGAMENTO_NAO_FECHA");
    const c = cid || o.customer_id, fi = pays.some(x => x.method === "fiado"); if (fi && !c) fail("CLIENTE_OBRIGATORIO_FIADO");
    const s = openSess(); if (pays.some(x => x.method !== "fiado") && !s) fail("CAIXA_FECHADO");
    const t = new Date().toISOString();
    pays.forEach(x => x.method === "fiado"
      ? S.ledger.push({ id: uid(), customer_id: c, kind: "debito", amount: n2(x.amount), description: "Pedido #" + o.code, order_id: o.id, created_at: t })
      : S.movements.push({ id: uid(), session_id: s.id, kind: "venda", method: x.method, amount: n2(x.amount), description: `Pedido #${o.code} · ${o.customer_name}${pays.length > 1 ? " (dividido)" : ""}`, order_id: o.id, customer_id: c, created_at: t }));
    Object.assign(o, { payment_status: fi ? "fiado" : "pago", payment_method: pays.length > 1 ? "misto" : pays[0].method, payments: pays, customer_id: c || null, cash_session_id: s?.id || null });
  }
  const api = {
    mode: "demo",
    async settings() { return clone(S.settings); },
    async saveSettings(p) { Object.assign(S.settings, p); tick("settings"); return clone(S.settings); },
    async categories() { return clone(S.categories.sort((a, b) => a.sort - b.sort)); },
    async saveCategory(c) { if (c.id) Object.assign(S.categories.find(x => x.id === c.id), c); else S.categories.push({ id: uid(), name: c.name, sort: c.sort || 0 }); tick("products"); },
    async deleteCategory(id) { S.categories = S.categories.filter(c => c.id !== id); S.products.forEach(p => { if (p.category_id === id) p.category_id = null; }); tick("products"); },
    async products() { return clone(S.products.slice().sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name))); },
    async saveProduct(p) { if (p.code && S.products.some(x => x.code === p.code && x.id !== p.id)) fail("products_code_key");
      if (!p.code) p.code = String(S.products.length + 1).padStart(3, "0");
      if (p.id) Object.assign(S.products.find(x => x.id === p.id), p); else S.products.push({ ...p, id: uid() }); tick("products"); },
    async deleteProduct(id) { S.products = S.products.filter(x => x.id !== id); tick("products"); },
    async adjustStock(id, d) { const p = S.products.find(x => x.id === id); p.stock = Math.max(0, p.stock + d); tick("products"); return p.stock; },
    async setStock(id, stock) { S.products.find(x => x.id === id).stock = stock; tick("products"); },
    async stories() { return clone(S.stories); },
    async addStory(s) { S.stories.unshift({ id: uid(), image_url: s.image_url, caption: s.caption, media_type: s.media_type || "image", created_at: new Date().toISOString(), expires_at: new Date(Date.now() + (s.hours || 24) * 36e5).toISOString() }); tick("stories"); },
    async deleteStory(id) { S.stories = S.stories.filter(s => s.id !== id); tick("stories"); },
    async cleanupStories() { const lim = Date.now() - 2 * 864e5, n = S.stories.length; S.stories = S.stories.filter(s => new Date(s.expires_at) >= lim); return n - S.stories.length; },
    checkOnlinePayment: async () => null,
    systemStatus: async () => ({ id: 1, last_ping: new Date(Date.now() - 3 * 36e5).toISOString(), last_backup: new Date(Date.now() - 2 * 864e5).toISOString(), ping_count: 12, idle_days: 0 }),
    upload: file => file.type.startsWith("video") ? Promise.resolve(URL.createObjectURL(file)) : new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); }),
    async quote(lat, lng, routeKm, subtotal) {
      if (!S.settings.delivery_enabled) return { ok: false, reason: "ENTREGA_DESATIVADA" };
      return calcFee(S.settings, Math.max(routeKm || 0, haversine(S.settings.lat, S.settings.lng, lat, lng)), subtotal);
    },
    async placeOrder(p) {
      const s = S.settings, ch = p.channel || "app";
      if (ch === "balcao" && !isAdmin()) fail("SOMENTE_ADMIN");
      if (ch === "app" && !s.is_open) fail("LOJA_FECHADA");
      if (!String(p.customer_name || "").trim()) fail("NOME_OBRIGATORIO");
      if (!p.items?.length) fail("CARRINHO_VAZIO");
      if (p.payment_method === "fiado" && !p.customer_id) fail("CLIENTE_OBRIGATORIO_FIADO");
      if (ch === "balcao" && p.fulfillment === "entrega" && !String(p.address || "").trim()) fail("ENDERECO_INVALIDO");
      for (const it of p.items) { const pr = S.products.find(x => x.id === it.product_id);
        if (!pr || !pr.is_active) fail("PRODUTO_INDISPONIVEL:" + (pr?.name || "?"));
        if (pr.track_stock && pr.stock < it.qty) fail(`SEM_ESTOQUE:${pr.name}:${pr.stock}`); }
      const items = p.items.map(it => { const pr = S.products.find(x => x.id === it.product_id); if (pr.track_stock) pr.stock -= it.qty;
        return { id: uid(), product_id: pr.id, name: pr.name, unit_price: pr.price, unit_cost: pr.cost, qty: it.qty, total: pr.price * it.qty }; });
      const sub = items.reduce((a, b) => a + b.total, 0);
      let fee = 0, dist = null;
      if (ch === "app" && p.fulfillment === "entrega") { const qd = await api.quote(p.lat, p.lng, p.distance_km, sub); if (!qd.ok) fail(qd.reason); fee = qd.fee; dist = qd.distance_km; }
      else if (ch === "balcao") fee = Number(p.delivery_fee || 0);
      const disc = Number(p.discount || 0);
      const o = { id: uid(), code: S.code++, channel: ch, customer_id: p.customer_id || null, customer_name: p.customer_name.trim(), customer_phone: p.customer_phone || null,
        fulfillment: ch === "balcao" ? (p.fulfillment === "entrega" ? "entrega" : "balcao") : p.fulfillment, address: p.address || null, address_ref: p.address_ref || null, distance_km: dist,
        subtotal: sub, delivery_fee: fee, discount: disc, total: Math.max(0, sub + fee - disc), payment_method: p.payment_method, change_for: p.change_for || null,
        payment_status: "pendente", status: "novo", notes: p.notes || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), order_items: items };
      S.orders.push(o);
      if (p.payments?.length) o.payment_method = p.payments.length > 1 ? "misto" : p.payments[0].method;
      if (ch === "balcao" && p.pay_now) { if (p.payments?.length) paySplit(o, p.payments, p.customer_id); else pay(o, p.payment_method, p.customer_id); o.status = o.fulfillment === "entrega" ? "preparando" : "entregue"; }
      tick("products"); tick("orders", { eventType: "INSERT", new: o });
      return { id: o.id, code: o.code, subtotal: sub, delivery_fee: fee, total: o.total };
    },
    async order(id) { return clone(S.orders.find(x => x.id === id)); },
    async updateOrder(id, patch) { Object.assign(S.orders.find(x => x.id === id), patch); tick("orders"); },
    async setOrderItems(id, items) { const o = S.orders.find(x => x.id === id); if (o.payment_status !== "pendente") fail("PEDIDO_JA_PAGO");
      o.order_items.forEach(i => { const p = S.products.find(x => x.id === i.product_id); if (p?.track_stock) p.stock += i.qty; });
      for (const it of items) { const p = S.products.find(x => x.id === it.product_id); if (p.track_stock && p.stock < it.qty) { o.order_items.forEach(i => { const q = S.products.find(x => x.id === i.product_id); if (q?.track_stock) q.stock -= i.qty; }); fail(`SEM_ESTOQUE:${p.name}:${p.stock}`); } }
      o.order_items = items.map(it => { const p = S.products.find(x => x.id === it.product_id); if (p.track_stock) p.stock -= it.qty; return { id: uid(), product_id: p.id, name: p.name, unit_price: p.price, unit_cost: p.cost, qty: it.qty, total: p.price * it.qty }; });
      o.subtotal = o.order_items.reduce((a, b) => a + b.total, 0); o.total = Math.max(0, o.subtotal + Number(o.delivery_fee || 0) - Math.min(Number(o.discount || 0), o.subtotal)); tick("orders"); tick("products"); return { total: o.total }; },
    async payOrderSplit(id, pays, cid) { paySplit(S.orders.find(x => x.id === id), pays, cid); tick("orders"); },
    async changeEmail(email) { S.user.email = email; },
    async changePassword() {},
    async setOptin(id, phone, v) { const o = S.orders.find(x => x.id === id); if (o) o.marketing_optin = v; },
    async logMessages(rows) { rows.forEach(r => S.log.unshift({ id: uid(), created_at: new Date().toISOString(), status: "enviado", ...r })); },
    async messageLog() { return clone(S.log); },
    async waSend() { throw new Error("WHATSAPP_NAO_CONFIGURADO"); },
    async orderPublic(id) { const o = S.orders.find(x => x.id === id); if (!o) return null;
      return { ...clone(o), items: o.order_items.map(i => ({ name: i.name, qty: i.qty, total: i.total })) }; },
    async orders({ from, to } = {}) { return clone(S.orders.filter(o => (!from || new Date(o.created_at) >= from) && (!to || new Date(o.created_at) < to))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))); },
    async setStatus(id, st) { const o = S.orders.find(x => x.id === id); if (o.status === "cancelado") fail("PEDIDO_CANCELADO");
      if (st === "cancelado") { o.order_items.forEach(i => { const p = S.products.find(x => x.id === i.product_id); if (p?.track_stock) p.stock += i.qty; });
        if (["pago", "fiado"].includes(o.payment_status) && o.total > 0) { const parts = o.payments || [{ method: o.payment_method, amount: o.total }]; const s = openSess();
          if (parts.some(x => x.method !== "fiado") && !s) fail("CAIXA_FECHADO"); const t = new Date().toISOString();
          parts.forEach(x => x.method === "fiado" ? o.customer_id && S.ledger.push({ id: uid(), customer_id: o.customer_id, kind: "ajuste", amount: Number(x.amount), description: "Cancelamento pedido #" + o.code, created_at: t })
            : S.movements.push({ id: uid(), session_id: s.id, kind: "estorno", method: x.method, amount: Number(x.amount), description: "Estorno pedido #" + o.code, order_id: o.id, created_at: t }));
          o.payment_status = "estornado"; } }
      o.status = st; o.updated_at = new Date().toISOString(); tick("orders"); tick("products"); },
    async payOrder(id, method, cid) { pay(S.orders.find(x => x.id === id), method, cid); tick("orders"); },
    async customers() { return clone(S.customers.map(c => { const l = S.ledger.filter(x => x.customer_id === c.id);
      return { ...c, balance: n2(l.filter(x => x.kind === "debito").reduce((a, x) => a + x.amount, 0) - l.filter(x => x.kind !== "debito").reduce((a, x) => a + x.amount, 0)),
        last_movement: l.map(x => x.created_at).sort().pop() || null }; }).sort((a, b) => a.name.localeCompare(b.name))); },
    async saveCustomer(c) { const { balance, last_movement, ...r } = c; if (r.id) { Object.assign(S.customers.find(x => x.id === r.id), r); return r; }
      const n = { ...r, id: uid(), is_active: true, created_at: new Date().toISOString() }; S.customers.push(n); return n; },
    async customerLedger(id) { return clone(S.ledger.filter(x => x.customer_id === id).sort((a, b) => b.created_at.localeCompare(a.created_at))); },
    async receiveDebt(cid, amt, method, desc) { const s = openSess(); if (!s) fail("CAIXA_FECHADO"); const c = S.customers.find(x => x.id === cid); const t = new Date().toISOString();
      S.ledger.push({ id: uid(), customer_id: cid, kind: "pagamento", amount: amt, description: desc || "Pagamento de fiado", method, created_at: t });
      S.movements.push({ id: uid(), session_id: s.id, kind: "recebimento_fiado", method, amount: amt, description: "Fiado · " + c.name, customer_id: cid, created_at: t }); },
    async addDebt(cid, amt, desc) { S.ledger.push({ id: uid(), customer_id: cid, kind: "debito", amount: amt, description: desc, created_at: new Date().toISOString() }); },
    async cashCurrent() { const s = openSess(); if (!s) return null;
      return { ...clone(s), movements: clone(S.movements.filter(m => m.session_id === s.id).sort((a, b) => b.created_at.localeCompare(a.created_at))) }; },
    async openCash(amt, notes) { if (openSess()) fail("CAIXA_JA_ABERTO"); S.sessions.push({ id: uid(), opened_at: new Date().toISOString(), opening_amount: amt, notes, status: "aberto" }); tick("cash"); },
    async cashMove(kind, amt, method, desc) { const s = openSess(); if (!s) fail("CAIXA_FECHADO");
      S.movements.push({ id: uid(), session_id: s.id, kind, method, amount: amt, description: desc, created_at: new Date().toISOString() }); tick("cash"); },
    async closeCash(counted, notes) { const s = openSess(); if (!s) fail("CAIXA_FECHADO"); const e = expected(s);
      Object.assign(s, { status: "fechado", closed_at: new Date().toISOString(), expected_cash: e, counted_cash: counted, difference: n2(counted - e), notes: notes || s.notes }); tick("cash");
      return { expected: e, counted, difference: n2(counted - e) }; },
    async cashSessions({ from } = {}) { return clone(S.sessions.filter(s => !from || new Date(s.opened_at) >= from).sort((a, b) => b.opened_at.localeCompare(a.opened_at))
      .map(s => ({ ...s, cash_movements: S.movements.filter(m => m.session_id === s.id) }))); },
    async getUser() { return S.user; },
    async signIn(email) { S.user = { email: email || "dono@brunosalgados.demo" }; },
    async signUp(email) { S.user = { email }; return true; },
    async signOut() { S.user = null; },
    async claimAdmin() { return true; },
    async startOnlinePayment() { throw new Error("Na apresentação o pagamento online fica desligado."); },
    subscribeAll() {}
  };
  return api;
}

/* ================= inicialização ================= */
let API;
/* MODO_APRESENTACAO = true: usa sempre dados de exemplo e o painel abre com um clique (sem e-mail/senha).
   Para ligar o banco de dados real e o login do dono, troque para false e publique de novo. */
const MODO_APRESENTACAO = false;
function offlineScreen() {
  document.getElementById("app").innerHTML = `<div style="min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center;font-family:Manrope,system-ui,sans-serif">
    <div style="max-width:360px;display:flex;flex-direction:column;gap:12px;align-items:center"><h2 style="margin:0">Sem conexão</h2>
    <p style="margin:0;opacity:.75">Não conseguimos falar com o servidor da loja. Confira sua internet e tente de novo.</p>
    <button onclick="location.reload()" style="border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:700;background:#FF941F;color:#1B0F05;cursor:pointer">Tentar de novo</button></div></div>`;
}
async function initApi() {
  if (!MODO_APRESENTACAO && window.supabase?.createClient) {
    try {
      const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "bs-auth" } });
      const probe = sb.from("store_settings").select("id").eq("id", 1).single();
      const r = await Promise.race([probe, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000))]);
      if (r.error) throw r.error;
      API = makeSupabaseApi(sb);
      API.subscribeAll();
      return API;
    } catch (e) { console.warn("Supabase indisponível:", e);
      // no site publicado nunca mostra dados de exemplo: avisa que está sem conexão
      if (window.BS_APP) { offlineScreen(); throw new Error("SEM_CONEXAO"); } }
  } else if (!MODO_APRESENTACAO && window.BS_APP) { offlineScreen(); throw new Error("SEM_CONEXAO"); }
  API = makeDemoApi();
  return API;
}

/* ================= endereço e distância ================= */
async function fetchJson(url, ms = 8000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { const r = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json" } }); if (!r.ok) throw new Error("HTTP " + r.status); return await r.json(); }
  finally { clearTimeout(t); }
}
async function lookupCep(cep) {
  if (API.mode === "demo") return { logradouro: "Rua das Acácias", bairro: "Jardim Primavera", localidade: "Sua cidade", uf: "SP" };
  const d = await fetchJson(`https://viacep.com.br/ws/${onlyDigits(cep)}/json/`);
  if (d.erro) throw new Error("CEP não encontrado.");
  return d;
}
async function geocode({ street, number, city, uf, cep, district }) {
  if (API.mode === "demo") { const h = [...(street + number)].reduce((a, c) => a + c.charCodeAt(0), 0); const km = 1 + (h % 70) / 10;
    return { lat: -23.0 + km / 111, lng: -47.0, simulated: true }; }
  const tries = [
    `street=${encodeURIComponent(`${number} ${street}`)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(uf)}&postalcode=${onlyDigits(cep)}`,
    `street=${encodeURIComponent(`${number} ${street}`)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(uf)}`,
    `q=${encodeURIComponent(`${street}, ${number}, ${district || ""}, ${city}, ${uf}`)}`,
    `q=${encodeURIComponent(`${street}, ${city}, ${uf}`)}`
  ];
  for (const qs of tries) {
    const r = await fetchJson(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&${qs}`);
    if (r?.[0]) return { lat: Number(r[0].lat), lng: Number(r[0].lon) };
  }
  throw new Error("ENDERECO_INVALIDO");
}
async function geocodeFree(text) {
  const r = await fetchJson(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(text)}`);
  if (!r?.[0]) throw new Error("ENDERECO_INVALIDO");
  return { lat: Number(r[0].lat), lng: Number(r[0].lon), label: r[0].display_name };
}
async function routeKm(from, to) {
  if (API.mode === "demo") return haversine(from.lat, from.lng, to.lat, to.lng) * 1.25;
  try {
    const r = await fetchJson(`https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`);
    if (r.routes?.[0]) return r.routes[0].distance / 1000;
  } catch (e) { console.warn("rota indisponível", e); }
  return haversine(from.lat, from.lng, to.lat, to.lng) * 1.3; // aproximação de ruas
}
