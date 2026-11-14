/* ======================= PAINEL DO DONO ======================= */
const AD = { view: "inicio", s: null, user: null, newIds: new Set(), charts: [] };
const VIEWS = [
  ["inicio", "Início", "home"], ["vendas", "Vendas", "pos"], ["pedidos", "Pedidos", "orders"], ["caixa", "Caixa", "cash"],
  ["clientes", "Clientes", "people"], ["produtos", "Produtos", "box"], ["stories", "Stories", "story"], ["relatorios", "Relatórios", "chart"],
  ["ajustes", "Configurações", "gear"], ["ajuda", "Ajuda", "help"]
];
ICON.help = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.1 15.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm1.6-5.4c-.7.4-.9.7-.9 1.3v.4h-2v-.5c0-1.4.6-2.1 1.6-2.7.8-.5 1.1-.8 1.1-1.4 0-.7-.6-1.2-1.4-1.2-.9 0-1.5.5-1.6 1.4H8.4C8.5 7.4 9.9 6 12.2 6c2.1 0 3.6 1.2 3.6 3 0 1.3-.7 2.4-2.1 3.2z"/></svg>';
ICON.bell = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8a2.5 2.5 0 0 0 2.4 2zm7-6V11a7 7 0 0 0-5.5-6.8V3.5a1.5 1.5 0 0 0-3 0v.7A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z"/></svg>';
ICON.menu = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
ICON.cart = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h2.6l.6 2H21l-2.2 8.2a2 2 0 0 1-1.9 1.5H8.2l.5 1.8H19v2H7.2L4 5H2V3z"/><circle cx="9" cy="20.5" r="1.5"/><circle cx="17" cy="20.5" r="1.5"/></svg>';
ICON.cube = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 6.5l9 4.5 9-4.5L12 2zM3 8.3v9.2l8 4V12.3l-8-4zm18 0-8 4v9.2l8-4V8.3z"/></svg>';
ICON.users = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><circle cx="8.5" cy="7.5" r="3.5"/><circle cx="16.5" cy="8.5" r="3"/><path d="M1.5 20c0-3.9 3.1-7 7-7s7 3.1 7 7v1h-14v-1zM15 13.2a6 6 0 0 1 7.5 5.8v1h-5v-1c0-2.3-.9-4.3-2.5-5.8z"/></svg>';
ICON.bars = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>';
ICON.clockF = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
ICON.bulb = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2zM9 19h6v1.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 20.5V19z"/></svg>';
ICON.down = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
ICON.minusC = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 4v12M7 11l5 5 5-5M5 20h14"/></svg>';
ICON.plusC = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 20V8M7 13l5-5 5 5M5 4h14"/></svg>';
ICON.receipt = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>';
ICON.checkBig = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
ICON.lock = '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const sumBy = (arr, f) => arr.reduce((a, x) => a + Number(f(x) || 0), 0);
const validOrder = o => o.status !== "cancelado";
const orderRevenue = o => validOrder(o) && ["pago", "fiado"].includes(o.payment_status) ? Number(o.total) : 0;
const pct = (a, b) => b ? (a - b) / b * 100 : a ? 100 : 0;
const delta = (a, b) => { const p = pct(a, b); const cls = !b && !a ? "flat" : p >= 0 ? "up" : "down";
  return `<span class="d ${cls}">${cls === "flat" ? "sem movimento" : (p >= 0 ? "↑ +" : "↓ ") + Math.abs(p).toFixed(0) + "%"}</span>`; };
const stPill = s => `<span class="st ${s}">${STATUS_LABEL[s]}</span>`;
const payPill = o => `<span class="pay ${o.payment_status}">${{ pago: "Pago", fiado: "Fiado", pendente: "A receber", estornado: "Estornado" }[o.payment_status]}</span>`;
const kindOf = o => o.fulfillment === "entrega" ? "Entrega" : o.fulfillment === "retirada" ? "Retirada" : "Balcão";
const custKey = o => o.customer_id || (onlyDigits(o.customer_phone).length >= 10 ? "t" + onlyDigits(o.customer_phone).slice(-9) : null);
const initials = n => String(n || "?").split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
function spark(values) {
  if (!values.length) return "";
  const w = 120, hh = 40, max = Math.max(...values, 1), min = Math.min(...values, 0);
  const pts = values.map((v, i) => [i / Math.max(1, values.length - 1) * w, hh - 4 - (v - min) / (max - min || 1) * (hh - 8)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${hh}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sg${values.length}${Math.round(max)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cssVar("--accent")}" stop-opacity=".28"/><stop offset="1" stop-color="${cssVar("--accent")}" stop-opacity="0"/></linearGradient></defs>
    <path d="${d} L${w} ${hh} L0 ${hh}Z" fill="url(#sg${values.length}${Math.round(max)})"/><path d="${d}" fill="none" stroke="${cssVar("--accent")}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}
const head = (title, sub, actions = "") => `<div class="page-h"><div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}</div><div class="tools">${actions}</div></div>`;

/* ---------- arranque e login ---------- */
async function startAdmin() {
  document.title = "Bruno Salgados · Painel";
  AD.user = await API.getUser();
  // só tira o acesso se o servidor disser que a conta não é do dono; falha de internet não desloga ninguém
  if (AD.user) { let ok = null; for (const w of [0, 2000, 4000]) { if (w) await new Promise(r => setTimeout(r, w)); try { ok = await API.claimAdmin(); break; } catch {} }
    if (ok === false) { await API.signOut(); AD.user = null; } }
  if (!AD.user && API.mode === "demo") { await API.signIn(); AD.user = await API.getUser(); }
  if (!AD.user) return renderLogin();
  AD.s = await API.settings();
  AD.sys = await API.systemStatus().catch(() => null);
  // faxina diária: tira do armazenamento os stories vencidos (plano grátis = 1 GB)
  try { const k = "bs_cleanup", d = dayKey(new Date()); if (localStorage.getItem(k) !== d) { localStorage.setItem(k, d); API.cleanupStories().catch(() => {}); } } catch {}
  const hv = location.hash.replace("#admin-", "").replace("#admin", "");
  if (VIEWS.some(v => v[0] === hv)) AD.view = hv;
  renderShell();
  AD.seen ||= new Set();
  const checkNew = (first) => API.orders({ from: new Date(Date.now() - 2 * 864e5) }).then(os => {
    const pend = os.filter(o => o.channel === "app" && o.status === "novo" && !AD.seen.has(o.id)).reverse();
    pend.forEach((o, i) => { AD.seen.add(o.id); enqueueOrder(o.id, { sound: i === pend.length - 1 }); });
    if (!first && pend.length) { refreshNav(); if (["inicio", "pedidos"].includes(AD.view)) renderView(); } }).catch(() => {});
  checkNew(true);
  // reserva: se a conexão ao vivo cair, confere pedidos novos a cada 30 segundos
  clearInterval(AD.poll); AD.poll = setInterval(() => { if (AD.user) checkNew(false); }, 30000);
  if (!AD.live) {
    AD.live = true;
    bus.on("orders", p => { if (!AD.user) return; const o = p?.new;
      if (p?.eventType === "INSERT" && o?.channel === "app" && o.status === "novo" && !AD.seen?.has(o.id)) { AD.seen?.add(o.id); AD.newIds.add(o.id); enqueueOrder(o.id); }
      if (p?.eventType === "UPDATE" && o?.mp_paid_at && o.payment_status === "pago" && Date.now() - new Date(o.mp_paid_at) < 120e3 && !(AD.mpOk ||= new Set()).has(o.id)) {
        AD.mpOk.add(o.id); toast(`Pagamento online confirmado · pedido #${o.code} (${money(o.total)})`); }
      refreshNav(); if (["inicio", "pedidos", "vendas"].includes(AD.view)) renderView(); });
    bus.on("cash", () => AD.user && AD.view === "caixa" && renderView());
    bus.on("products", debounce(() => AD.user && ["produtos", "inicio"].includes(AD.view) && renderView(), 400));
    bus.on("theme", () => AD.user && ["inicio", "relatorios"].includes(AD.view) && renderView());
  }
}
let audioCtx;
function beep() { try { audioCtx ||= new AudioContext(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination);
  g.gain.setValueAtTime(.15, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + .4); o.start(); o.stop(audioCtx.currentTime + .4); } catch {} }

function renderLogin() {
  const demo = API.mode === "demo";
  $("#app").innerHTML = `<div class="login"><div class="card">
    <div class="brand">${LOGO}<div><div class="brand-name">Bruno Salgados</div><div class="brand-sub">Painel do dono</div></div></div>
    ${demo ? `<p class="muted">Você está no modo demonstração, com dados de exemplo. Nada aqui afeta a loja de verdade.</p>
      <button class="btn primary block" id="lg-demo">Entrar na demonstração</button>`
    : `<p class="muted" style="font-size:.9rem">Entre com o e-mail e a senha do painel. Você só faz isso uma vez neste aparelho: depois ele abre direto.</p>
      <form id="lg-form" style="display:flex;flex-direction:column;gap:12px">
        <div class="field"><label for="lg-email">E-mail</label><input class="input" id="lg-email" type="email" autocomplete="username" required></div>
        <div class="field"><label for="lg-pass">Senha</label><input class="input" id="lg-pass" type="password" autocomplete="current-password" required></div>
        <button class="btn primary block" id="lg-go" type="submit">Entrar</button></form>`}
    </div></div>`;
  if (demo) { $("#lg-demo").onclick = async () => { await API.signIn(); startAdmin(); }; return; }
  $("#lg-form").onsubmit = e => { e.preventDefault(); busy($("#lg-go"), async () => {
    await API.signIn($("#lg-email").value.trim(), $("#lg-pass").value);
    if (!(await API.claimAdmin())) { await API.signOut(); toast("Essa conta não tem acesso ao painel.", true); return; }
    startAdmin(); }); };
}

/* ---------- moldura: barra lateral + topo ---------- */
function renderShell() {
  const hi = new Date().getHours(), greet = hi < 12 ? "Bom dia" : hi < 18 ? "Boa tarde" : "Boa noite";
  $("#app").innerHTML = `<div class="a-shell" id="a-shell"><div class="scrim" id="a-scrim"></div>
    <aside class="a-side" aria-label="Menu do painel"><div class="brand">${LOGO}<div><div class="brand-name">Bruno Salgados</div><div class="brand-sub">Painel do dono</div></div></div>
      <nav id="a-nav" style="display:flex;flex-direction:column;gap:4px"></nav>
      <div class="side-foot"><div class="store-card"><label class="switch"><span><b id="sc-l">${AD.s.is_open ? "Loja aberta" : "Loja fechada"}</b></span><input type="checkbox" id="sc-open" ${AD.s.is_open ? "checked" : ""}></label>
        <small>Quando fechada, o app não aceita pedidos.</small></div></div></aside>
    <div class="a-main">
      <header class="a-top"><button class="icon-btn menu-btn" id="a-menu" aria-label="Abrir menu">${ICON.menu}</button>
        <div class="hello"><h1>${greet}, Bruno!</h1><p>Tenha um ótimo dia vendendo mais.</p></div>
        <button class="icon-btn" id="a-bell" aria-label="Avisos">${ICON.bell}<span class="dotn num" id="a-bell-n" hidden></span></button>
        <button class="avatar" id="a-prof" aria-label="Conta">${"<b>B</b>"}${ICON.down}</button></header>
      <main class="a-body"><div class="a-inner" id="a-view"></div></main>
    </div></div>`;
  $("#a-menu").onclick = () => $("#a-shell").classList.add("nav-open");
  $("#a-scrim").onclick = () => $("#a-shell").classList.remove("nav-open");
  $("#sc-open").onchange = async e => { try { AD.s = await API.saveSettings({ is_open: e.target.checked }); $("#sc-l").textContent = AD.s.is_open ? "Loja aberta" : "Loja fechada";
    toast(AD.s.is_open ? "Loja aberta para pedidos" : "Loja fechada para pedidos"); } catch (x) { e.target.checked = !e.target.checked; toast(errMsg(x), true); } };
  $("#a-bell").onclick = e => { e.stopPropagation(); openBell(); };
  $("#a-prof").onclick = e => { e.stopPropagation(); openProfile(); };
  refreshNav(); renderView();
}
function closePops() { $$(".pop").forEach(p => p.remove()); }
document.addEventListener("click", e => { if (!e.target.closest(".pop")) closePops(); });
async function openBell() {
  if ($(".pop")) return closePops();
  const [orders, prods] = await Promise.all([API.orders({ from: new Date(Date.now() - 2 * 864e5) }), API.products()]);
  const news = orders.filter(o => o.channel === "app" && o.status === "novo"), low = prods.filter(p => p.is_active && p.track_stock && p.stock <= p.low_stock_alert);
  const pop = h(`<div class="pop" role="menu"><div class="pop-h">Avisos</div>
    ${news.map(o => `<button data-o="${o.id}">${ICON.cart}<span>Pedido #${o.code} de ${esc(o.customer_name)}<br><span class="sm">${money(o.total)} · ${fmtTime(o.created_at)}</span></span></button>`).join("")}
    ${low.map(p => `<button data-p>${ICON.cube}<span>${esc(p.name)}<br><span class="sm">${p.stock <= 0 ? "Esgotado" : p.stock + " no estoque"}</span></span></button>`).join("")}
    ${!news.length && !low.length ? `<p class="muted" style="padding:6px 12px 12px">Nenhum aviso agora.</p>` : ""}</div>`);
  $(".a-main").appendChild(pop);
  $$("[data-o]", pop).forEach(b => b.onclick = () => { closePops(); go("pedidos"); });
  $$("[data-p]", pop).forEach(b => b.onclick = () => { closePops(); go("produtos"); });
}
function openProfile() {
  if ($(".pop")) return closePops();
  const pop = h(`<div class="pop" role="menu" style="width:260px"><div class="pop-h">${esc(AD.user?.email || "Dono")}</div>
    <a href="${CLIENT_URL()}" target="_blank" rel="noopener">${ICON.bag}Ver cardápio do cliente</a><button id="pp-theme">${isDark() ? ICON.sun : ICON.moon}${isDark() ? "Modo claro" : "Modo escuro"}</button>
    <button id="pp-out">${ICON.out}Sair</button></div>`);
  $(".a-main").appendChild(pop);
  $("#pp-theme").onclick = () => { closePops(); themeToggle(); renderShell(); };
  $("#pp-out").onclick = async () => { closePops(); if (API.mode === "demo") { location.hash = ""; return; } await API.signOut(); AD.user = null; renderLogin(); };
}
async function refreshNav() {
  const orders = await API.orders({ from: new Date(Date.now() - 2 * 864e5) }).catch(() => []);
  const pend = orders.filter(o => o.channel === "app" && ["novo", "preparando", "pronto", "saiu"].includes(o.status)).length;
  const news = orders.filter(o => o.channel === "app" && o.status === "novo").length;
  const nav = $("#a-nav"); if (!nav) return;
  nav.innerHTML = VIEWS.map(([k, l, i]) => `<button class="nav-btn" data-v="${k}" ${AD.view === k ? 'aria-current="page"' : ""}>${{ inicio: ICON.home, vendas: ICON.cart, pedidos: ICON.receipt, caixa: ICON.cash, clientes: ICON.users, produtos: ICON.cube, stories: ICON.story, relatorios: ICON.bars, ajustes: ICON.gear, ajuda: ICON.help, mensagens: ICON.wa }[k]}${l}${k === "pedidos" && pend ? `<span class="badge num">${pend}</span>` : ""}</button>`).join("");
  $$("[data-v]", nav).forEach(b => b.onclick = () => go(b.dataset.v));
  const bn = $("#a-bell-n"); if (bn) { bn.hidden = !news; bn.textContent = news; }
}
function go(v) { AD.view = v; try { history.replaceState(null, "", "#admin-" + v); } catch {} $("#a-shell")?.classList.remove("nav-open"); closePops(); refreshNav(); renderView(); window.scrollTo(0, 0); }
async function renderView() {
  const el = $("#a-view"); if (!el) return;
  AD.charts.forEach(c => c.destroy()); AD.charts = [];
  try { await ({ inicio: vInicio, vendas: vVendas, pedidos: vPedidos, caixa: vCaixa, clientes: vClientes, produtos: vProdutos, stories: vStories, relatorios: vRelatorios, ajustes: vAjustes, ajuda: vAjuda, mensagens: vMensagens }[AD.view])(el); magnify(document); }
  catch (e) { console.error(e); el.innerHTML = `<div class="card empty-row"><h3>Não deu para carregar</h3><p>${esc(errMsg(e))}</p><button class="btn" onclick="renderView()">Tentar de novo</button></div>`; }
}

/* ---------- gráficos ---------- */
function lineChart(canvas, labels, data) {
  if (!window.Chart) { canvas.parentElement.innerHTML = `<p class="muted">Gráfico indisponível sem conexão.</p>`; return; }
  const acc = cssVar("--accent"), fg2 = cssVar("--fg-2"), line = cssVar("--line"), ctx = canvas.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, canvas.parentElement.clientHeight || 260); g.addColorStop(0, color_mix(acc, .32)); g.addColorStop(1, color_mix(acc, 0));
  const c = new Chart(canvas, { type: "line", data: { labels, datasets: [{ data, borderColor: acc, backgroundColor: g, fill: true, tension: .35, borderWidth: 2.5,
      pointRadius: data.length > 31 ? 0 : 4, pointHoverRadius: 6, pointBackgroundColor: acc, pointBorderColor: cssVar("--surface"), pointBorderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 300 }, interaction: { mode: "index", intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: cssVar("--fg"), titleColor: cssVar("--bg"), bodyColor: cssVar("--bg"), displayColors: false, padding: 10, callbacks: { label: x => money(x.raw) } } },
      scales: { x: { grid: { display: false }, border: { color: line }, ticks: { color: fg2, maxRotation: 0, autoSkip: true, autoSkipPadding: 14, font: { size: 12 } } },
        y: { beginAtZero: true, grid: { color: line }, border: { display: false }, ticks: { color: fg2, padding: 8, maxTicksLimit: 5, font: { size: 12 }, callback: v => v >= 1000 ? (v / 1000).toLocaleString("pt-BR") + "k" : v } } } } });
  AD.charts.push(c); return c;
}

/* ================= INÍCIO ================= */
async function vInicio(el) {
  AD.range ||= 7;
  const today = startOfDay(new Date()), yest = new Date(today - 864e5);
  const [orders, sess, prods, stories] = await Promise.all([API.orders({ from: new Date(today - 180 * 864e5) }), API.cashCurrent(), API.products(), API.stories()]);
  const dayRev = d => sumBy(orders.filter(o => dayKey(o.created_at) === dayKey(d)), orderRevenue);
  const dayCnt = d => orders.filter(o => validOrder(o) && dayKey(o.created_at) === dayKey(d)).length;
  const last7 = Array.from({ length: 7 }, (_, i) => new Date(today - (6 - i) * 864e5));
  const active = (from, to) => new Set(orders.filter(o => validOrder(o) && new Date(o.created_at) >= from && new Date(o.created_at) < to).map(custKey).filter(Boolean)).size;
  const tomorrow = new Date(+today + 864e5);
  const act = active(new Date(today - 29 * 864e5), tomorrow), actPrev = active(new Date(today - 59 * 864e5), new Date(today - 29 * 864e5));
  const recent = orders.slice(0, 6);
  const low = prods.filter(p => p.is_active && p.track_stock && p.stock <= p.low_stock_alert);
  const liveStories = stories.filter(s => new Date(s.expires_at) > new Date());
  const pingAge = AD.sys?.last_ping ? (Date.now() - new Date(AD.sys.last_ping)) / 864e5 : null;
  const tip = API.mode !== "demo" && AD.sys && (pingAge == null || pingAge > 2) ? { t: "O vigia automático parou", d: "Ele mantém o sistema acordado no plano grátis. Abra o GitHub › Actions e reative o “Manter ativo”.", b: "Ver detalhes", go: "ajustes" }
    : AD.s?.delivery_enabled && AD.s.lat == null ? { t: "Localize a loja para ligar as entregas", d: "Sem o ponto de saída no mapa, o app não calcula o frete e só aceita retirada.", b: "Localizar agora", go: "ajustes" }
    : low.length ? { t: `${low.length} produto${low.length > 1 ? "s" : ""} com estoque baixo`, d: low.slice(0, 3).map(p => p.name).join(", ") + ". Reponha para não perder vendas.", b: "Ajustar estoque", go: "produtos" }
    : !liveStories.length ? { t: "Poste o story do dia", d: "Uma foto da fornada saindo chama o cliente para pedir.", b: "Postar story", go: "stories" }
    : { t: "Mantenha seu cardápio sempre atualizado!", d: "Ofereça novidades e aumente suas vendas.", b: "Editar cardápio", go: "produtos" };
  el.innerHTML = `
  <section class="dash-top">
    <div class="banner"><div class="glow"></div><div class="photo"><img src="${PHOTOS.coxinha}" alt=""></div>
      <div class="copy"><button class="badge" data-go="caixa">${sess ? ICON.check + "Caixa aberto · " + fmtTime(sess.opened_at) : ICON.lock + "Abrir o caixa"}</button>
        <h2>Mais vendas,<em>mais lucro!</em></h2></div></div>
    <div class="stat">${ICON.cart}<span class="v">${money(dayRev(today))}</span><span class="l">Vendas hoje</span>${delta(dayRev(today), dayRev(yest))}${spark(last7.map(dayRev))}</div>
    <div class="stat">${ICON.cube}<span class="v num">${dayCnt(today)}</span><span class="l">Pedidos hoje</span>${delta(dayCnt(today), dayCnt(yest))}${spark(last7.map(dayCnt))}</div>
    <div class="stat">${ICON.users}<span class="v num">${act}</span><span class="l">Clientes ativos</span>${delta(act, actPrev)}${spark(last7.map(d => active(d, new Date(+d + 864e5))))}</div>
  </section>
  <section class="dash-mid">
    <div class="card" id="in-sales"></div>
    <div class="card"><div class="card-h"><h3>${ICON.bolt}Ações rápidas</h3></div>
      <div class="qa-grid">
        <button class="qa" data-new-sale>${ICON.cart}<b>Nova venda</b><span>Vender no balcão</span><span class="chev">${ICON.chev}</span></button>
        <button class="qa" data-new-prod>${ICON.cube}<b>Cadastrar produto</b><span>Adicionar um salgado</span><span class="chev">${ICON.chev}</span></button>
        <button class="qa" data-go="clientes">${ICON.users}<b>Ver clientes</b><span>Cadastro e fiado</span><span class="chev">${ICON.chev}</span></button>
        <button class="qa" data-go="relatorios">${ICON.bars}<b>Ver relatórios</b><span>Acompanhar resultados</span><span class="chev">${ICON.chev}</span></button>
      </div></div>
  </section>
  <section class="dash-bot">
    <div class="card tight"><div class="card-h"><h3>${ICON.clockF}Pedidos recentes</h3><button class="link-btn" data-go="pedidos">Ver todos ${ICON.arrow}</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Status</th><th class="hide-sm">Horário</th></tr></thead>
      <tbody>${recent.length ? recent.map(o => `<tr class="click" data-o="${o.id}"><td><span class="oid num">#${o.code}</span></td><td>${esc(o.customer_name)}</td><td class="num">${money(o.total)}</td><td>${stPill(o.status)}</td><td class="hide-sm faint num">${fmtTime(o.created_at)}</td></tr>`).join("")
        : `<tr><td colspan="5" class="empty-row">Os pedidos aparecem aqui assim que chegarem.</td></tr>`}</tbody></table></div></div>
    <div class="tip"><img src="${PHOTOS.coxinha}" alt=""><div class="copy"><span class="badge">${ICON.bulb}Dica do dia</span><h3>${esc(tip.t)}</h3><p>${esc(tip.d)}</p>
      <button class="btn primary" data-go="${tip.go}">${esc(tip.b)}</button></div></div>
  </section>`;
  const drawSales = () => {
    const n = AD.range, days = Array.from({ length: n }, (_, i) => new Date(today - (n - 1 - i) * 864e5));
    const vals = days.map(dayRev), tot = sumBy(vals, v => v);
    const prev = sumBy(Array.from({ length: n }, (_, i) => new Date(today - (2 * n - 1 - i) * 864e5)), dayRev);
    const p = pct(tot, prev);
    $("#in-sales").innerHTML = `<div class="card-h"><h3>${ICON.bars}Vendas nos últimos ${n} dias</h3><div class="pills">${[7, 30, 90].map(r => `<button data-r="${r}" aria-pressed="${n === r}">${r} dias</button>`).join("")}</div></div>
      <div><div class="big-num">${money(tot)}</div><div class="faint" style="margin-top:2px"><span class="d ${p >= 0 ? "up" : "down"}" style="padding:0;display:inline">${prev ? (p >= 0 ? "↑ +" : "↓ ") + Math.abs(p).toFixed(0) + "%" : ""}</span> ${prev ? "em relação ao período anterior" : "sem período anterior para comparar"}</div></div>
      <div class="chart-box"><canvas id="in-chart" aria-label="Vendas por dia"></canvas></div>`;
    AD.charts.forEach(c => c.destroy()); AD.charts = [];
    lineChart($("#in-chart"), days.map(d => n === 7 ? d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").replace(/^./, c => c.toUpperCase()) : fmtDate(d)), vals.map(n2));
    $$("[data-r]", $("#in-sales")).forEach(b => b.onclick = () => { AD.range = +b.dataset.r; drawSales(); });
  };
  drawSales();
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
  $("[data-new-prod]", el).onclick = async () => productForm({}, await API.categories());
  $("[data-new-sale]", el).onclick = () => saleModal();
  $$("[data-o]", el).forEach(r => r.onclick = () => orderDetail(recent.find(o => o.id === r.dataset.o)));
}

/* ================= VENDAS (balcão) ================= */
const typeChip = o => { const k = o.fulfillment === "entrega" ? "ent" : o.fulfillment === "retirada" ? "ret" : "bal";
  return `<span class="tchip ${k}">${k === "ent" ? ICON.bolt : k === "ret" ? ICON.bag : ICON.pos}${kindOf(o)}</span>`; };
const payText = o => o.payments?.length > 1 ? o.payments.map(x => METHOD_LABEL[x.method]).join(" + ")
  : METHOD_LABEL[o.payment_method] + (o.payment_method === "mercadopago" && o.payment_status === "pendente" && o.status !== "cancelado" ? " · aguardando pagamento online" : "");

async function openTabs() {
  const os = await API.orders({ from: new Date(Date.now() - 3 * 864e5) });
  return os.filter(o => o.channel === "balcao" && o.fulfillment !== "entrega" && o.payment_status === "pendente" && o.status !== "cancelado").sort((a, b) => (a.table_no || 99) - (b.table_no || 99) || a.created_at.localeCompare(b.created_at));
}
async function vVendas(el) {
  const today = startOfDay(new Date());
  const [sess, orders] = await Promise.all([API.cashCurrent(), API.orders({ from: today })]);
  const ok = orders.filter(validOrder), rev = sumBy(ok, orderRevenue), paidN = ok.filter(o => ["pago", "fiado"].includes(o.payment_status)).length;
  const pend = ok.filter(o => o.payment_status === "pendente");
  const by = k => ok.filter(o => (o.fulfillment === k)).length;
  const open = await openTabs(), nT = Number(AD.s?.table_count || 0), busyT = new Set(open.map(o => o.table_no).filter(Boolean));
  el.innerHTML = head("Vendas", "Registre vendas do balcão e acompanhe o que saiu hoje") + `
  ${!sess ? `<div class="warn-bar"><span>O caixa está fechado. Abra o caixa para receber em dinheiro, Pix ou cartão. Vendas no fiado funcionam assim mesmo.</span><button class="btn primary sm" data-go="caixa">Abrir caixa</button></div>` : ""}
  <section class="sale-home">
    <button class="sale-cta" id="sv-new"><span class="ic">${ICON.cart}</span><span class="tx"><b>Nova venda</b><span>Escolha os produtos pelo código ou pelo nome e depois a forma de pagamento.</span></span><span class="go">${ICON.plus}Começar</span></button>
    <button class="sale-today" id="sv-today"><span class="l">${ICON.receipt}Vendas de hoje</span><span class="v num">${money(rev)}</span>
      <span class="s">${paidN} venda${paidN === 1 ? "" : "s"} · ticket médio ${money(paidN ? rev / paidN : 0)}</span>
      <span class="chips"><span class="tchip bal">${ICON.pos}Balcão ${by("balcao")}</span><span class="tchip ret">${ICON.bag}Retirada ${by("retirada")}</span><span class="tchip ent">${ICON.bolt}Entrega ${by("entrega")}</span></span>
      ${pend.length ? `<span class="pend">${pend.length} a receber · ${money(sumBy(pend, o => o.total))}</span>` : ""}<span class="link-btn" style="margin-top:auto">Ver vendas de hoje ${ICON.arrow}</span></button>
  </section>
  <section class="await ${open.length ? "hot" : ""}"><div class="card-h"><h3>${ICON.receipt}Aguardando pagamento</h3>
      <span class="faint">${open.length} conta${open.length === 1 ? "" : "s"} aberta${open.length === 1 ? "" : "s"}${nT ? ` · ${nT - busyT.size} de ${nT} mesas livres` : ""}</span></div>
    ${nT ? `<div class="tables">${Array.from({ length: nT }, (_, i) => i + 1).map(n => { const o = open.find(x => x.table_no === n);
      return `<button class="tbl-chip ${o ? "busy" : ""}" data-tbl="${n}" title="${o ? "Abrir a conta da mesa " + n : "Nova venda na mesa " + n}"><b>Mesa ${n}</b><span class="num">${o ? money(o.total) : "livre"}</span></button>`; }).join("")}</div>` : ""}
    ${open.length ? `<div class="await-grid">${open.map(o => { const mins = Math.max(1, Math.round((Date.now() - new Date(o.created_at)) / 6e4));
      return `<article class="aw tab" data-tab="${o.id}" title="Dois cliques para editar">
        <div class="aw-h"><div><b>${o.table_no ? "Mesa " + o.table_no : esc(o.customer_name)}</b><span class="faint">Nº ${o.code} · aberta ${fmtTime(o.created_at)} · há ${mins < 60 ? mins + " min" : Math.floor(mins / 60) + " h"}</span></div><span class="st preparando">Comendo</span></div>
        <div class="aw-items">${(o.order_items || []).map(i => `<span>${i.qty}× ${esc(i.name)}</span>`).join("")}</div>
        <div class="aw-f"><b class="num" style="font-size:1.15rem">${money(o.total)}</b><span class="row" style="gap:8px"><button class="btn sm ghost" data-edit="${o.id}">Editar</button><button class="btn sm primary" data-pay="${o.id}">Pagar</button></span></div>
      </article>`; }).join("")}</div>` : `<p class="muted">Nenhuma conta aberta. Na nova venda, escolha a mesa e toque em <b>Aguardar pagamento</b> para o cliente pagar no fim.</p>`}
  </section>`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
  $("#sv-new").onclick = () => saleModal();
  const byId = id => open.find(o => o.id === id);
  $$("[data-edit]", el).forEach(b => b.onclick = e => { e.stopPropagation(); saleModal({ edit: byId(b.dataset.edit) }); });
  $$("[data-pay]", el).forEach(b => b.onclick = e => { e.stopPropagation(); saleModal({ edit: byId(b.dataset.pay), toPay: true }); });
  $$("[data-tab]", el).forEach(c => c.ondblclick = () => saleModal({ edit: byId(c.dataset.tab) }));
  $$("[data-tbl]", el).forEach(b => b.onclick = () => { const o = open.find(x => x.table_no === +b.dataset.tbl); o ? saleModal({ edit: o }) : saleModal({ mesa: +b.dataset.tbl }); });
  $("#sv-today").onclick = () => todaySales(orders);
  if (!AD.saleKey) { AD.saleKey = true; document.addEventListener("keydown", e => { if (e.key === "F2" && AD.view === "vendas" && !$(".overlay")) { e.preventDefault(); saleModal(); } }); }
}

async function saleModal({ edit, toPay, mesa } = {}) {
  const [prods, custs, sess, open] = await Promise.all([API.products(), API.customers(), API.cashCurrent(), openTabs()]);
  if (edit) edit = open.find(o => o.id === edit.id) || edit;
  const act = prods.filter(p => p.is_active || edit?.order_items?.some(i => i.product_id === p.id));
  // na edição, o estoque já descontado pela conta volta a contar como disponível
  if (edit) (edit.order_items || []).forEach(i => { const p = act.find(x => x.id === i.product_id); if (p?.track_stock) p.stock += i.qty; });
  const nT = Number(AD.s?.table_count || 0), busyT = new Set(open.filter(o => o.id !== edit?.id).map(o => o.table_no).filter(Boolean));
  const S = { items: edit ? (edit.order_items || []).filter(i => i.product_id).map(i => ({ id: i.product_id, qty: i.qty })) : [], step: toPay ? "pay" : "prod", pays: [],
    cust: edit?.customer_id ? custs.find(c => c.id === edit.customer_id) || null : null, disc: Number(edit?.discount || 0), method: null, q: "", sel: 0, mesa: edit ? edit.table_no || null : mesa || null,
    ent: { on: false, name: "", phone: "", address: "", ref: "", fee: 0 } };
  const title = edit ? (edit.table_no ? `Mesa ${edit.table_no}` : `Conta nº ${edit.code}`) : "Nova venda";
  const sh = openSheet(`<div class="sheet-head"><div><h2>${esc(title)}</h2><p class="faint" id="sm-sub" style="margin-top:2px">1. Escolha os produtos</p></div><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="sale"><div class="sale-left" id="sm-left"></div><aside class="sale-right" id="sm-right"></aside></div><div class="sm-bar" id="sm-bar" hidden></div>`, { cls: "wide" });
  const el = sh.el;
  const line = id => act.find(p => p.id === id);
  const lines = () => S.items.map(i => ({ ...i, p: line(i.id) }));
  const fee = () => S.ent.on ? Number(S.ent.fee || 0) : 0;
  const sub = () => sumBy(lines(), l => l.p.price * l.qty), total = () => n2(Math.max(0, sub() + fee() - S.disc));
  // entrega feita pelo balcão: precisa de nome e endereço antes de seguir
  const entOk = () => { if (!S.ent.on) return true; if (!(S.ent.name || S.cust?.name || "").trim()) { toast("Digite o nome do cliente da entrega.", true); $("#se-name", el)?.focus(); return false; }
    if (!S.ent.address.trim()) { toast("Digite o endereço da entrega.", true); $("#se-addr", el)?.focus(); return false; } return true; };
  const paid = () => n2(sumBy(S.pays, x => x.amount)), remaining = () => n2(total() - paid());
  const change = () => sumBy(S.pays, x => x.change || 0);
  const inCart = id => S.items.find(i => i.id === id)?.qty || 0;
  const add = (p, n = 1) => { if (!p) return; if (p.track_stock && inCart(p.id) + n > p.stock) { toast(`${p.name}: só ${p.stock - inCart(p.id)} no estoque`, true); return; }
    const it = S.items.find(i => i.id === p.id); if (it) it.qty += n; else S.items.push({ id: p.id, qty: n }); drawRight(); drawList(); };

  function drawLeft() {
    $("#sm-sub", el).textContent = S.step === "prod" ? (edit ? "Adicione ou tire produtos da conta" : "1. Escolha os produtos") : S.step === "pay" ? (edit ? "Fechar a conta" : "2. Forma de pagamento") : "Venda concluída";
    const L = $("#sm-left", el);
    if (S.step === "prod") {
      L.innerHTML = `<label class="sm-search">${ICON.search}<input id="sm-q" placeholder="Digite o código ou o nome do produto" autocomplete="off" value="${esc(S.q)}" aria-label="Código ou nome do produto"></label>
        <div class="sm-list" id="sm-list"></div>`;
      const q = $("#sm-q", L);
      q.oninput = () => { S.q = q.value; S.sel = 0; drawList(); };
      q.onkeydown = e => { const f = filtered();
        if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!f.length) return; S.sel = (S.sel + (e.key === "ArrowDown" ? 1 : -1) + f.length) % f.length; drawList(); }
        if (e.key === "Enter") { e.preventDefault(); const p = f[S.sel]; if (p) { add(p); q.value = S.q = ""; S.sel = 0; drawList(); } } };
      drawList(); if (matchMedia("(min-width:720px)").matches) setTimeout(() => q.focus(), 60);
    } else if (S.step === "pay") drawPay();
  }
  const filtered = () => { const t = S.q.trim().toLowerCase(); if (!t) return act;
    const ex = act.filter(p => (p.code || "").toLowerCase() === t); return ex.concat(act.filter(p => !ex.includes(p) && ((p.code || "").toLowerCase().startsWith(t) || p.name.toLowerCase().includes(t)))); };
  function drawList() {
    const box = $("#sm-list", el); if (!box) return; const f = filtered();
    box.innerHTML = f.length ? f.map((p, i) => { const left = p.track_stock ? p.stock - inCart(p.id) : null, n = inCart(p.id);
      return `<button class="sm-item" data-add="${p.id}" aria-selected="${i === S.sel && !!S.q}" ${left !== null && left <= 0 ? "disabled" : ""}>${productThumb(p)}
        <span class="nm"><b>${esc(p.name)}</b><span>${p.code ? "Cód. " + esc(p.code) + " · " : ""}${left === null ? "sem controle de estoque" : left <= 0 ? "sem estoque" : left + " em estoque"}</span></span>
        <span class="pr num">${money(p.price)}</span><span class="plus">${n ? `<b class="num">${n}</b>` : ICON.plus}</span></button>`; }).join("")
      : `<p class="empty-row">Nenhum produto com esse código ou nome.</p>`;
    $$("[data-add]", box).forEach(b => b.onclick = () => add(line(b.dataset.add)));
  }
  function drawPay() {
    const L = $("#sm-left", el), rem = remaining();
    const M = [["dinheiro", "Dinheiro", ICON.cash], ["pix", "Pix", ICON.bolt], ["cartao_debito", "Débito", ICON.receipt], ["cartao_credito", "Crédito", ICON.receipt], ["fiado", "Fiado", ICON.users]];
    L.innerHTML = `<button class="link-btn" id="sm-back" style="align-self:flex-start">← Voltar aos produtos</button>
      ${rem > 0 ? `<div class="pay-need"><span>${S.pays.length ? "Falta pagar" : "Total a pagar"}</span><b class="num">${money(rem)}</b></div>
        <div class="pay-methods">${M.map(([k, l, ic]) => `<button data-m="${k}" aria-pressed="${S.method === k}">${ic}${l}</button>`).join("")}</div>
        <div id="sm-form"></div>
        ${S.pays.length ? "" : `<p class="faint" style="font-size:.85rem">Pode dividir: por exemplo, uma parte no Pix e o resto em dinheiro. Basta lançar o primeiro valor e escolher a próxima forma.</p>`}`
      : `<div class="pay-done">${ICON.checkBig}<b>Pagamento completo</b>${change() > 0 ? `<span>Troco: <b class="num">${money(change())}</b></span>` : ""}</div>`}`;
    $("#sm-back", L).onclick = () => { S.step = "prod"; S.pays = []; S.method = null; drawLeft(); drawRight(); };
    $$("[data-m]", L).forEach(b => b.onclick = () => { S.method = b.dataset.m; drawPay(); drawRight(); });
    drawForm();
  }
  function drawForm() {
    const F = $("#sm-form", el); if (!F || !S.method) return; const rem = remaining(), m = S.method;
    if (m === "dinheiro") {
      F.innerHTML = `<div class="field"><label for="sm-v">Valor recebido em dinheiro</label><input class="input num big-in" id="sm-v" inputmode="decimal" placeholder="${moneyInput(rem)}"></div>
        <div id="sm-calc"></div><button class="btn primary block" id="sm-ok">Confirmar dinheiro</button>`;
      const v = $("#sm-v", F), calc = () => { const r = v.value.trim() ? parseMoney(v.value) : rem;
        $("#sm-calc", F).innerHTML = r < rem ? `<div class="diff bad">Faltando ${money(rem - r)}. Complete com outra forma depois.</div>` : r > rem ? `<div class="diff ok">Troco ${money(r - rem)}</div>` : `<div class="diff ok">Valor certo, sem troco</div>`; };
      v.oninput = calc; calc(); setTimeout(() => v.focus(), 30);
      const ok = () => { const r = v.value.trim() ? parseMoney(v.value) : rem; if (r <= 0) return toast("Digite o valor recebido.", true);
        const applied = n2(Math.min(r, rem)); S.pays.push({ method: "dinheiro", amount: applied, received: r, change: n2(Math.max(0, r - rem)) }); S.method = null; drawPay(); drawRight(); };
      $("#sm-ok", F).onclick = ok; v.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); ok(); } };
    } else if (m === "fiado") {
      F.innerHTML = `${customerPicker(custs, null, S.cust?.id)}<div class="field"><label for="sm-v">Valor no fiado</label><input class="input num" id="sm-v" inputmode="decimal" value="${moneyInput(rem)}"></div>
        <div id="sm-lim"></div><button class="btn primary block" id="sm-ok">OK, lançar na conta do cliente</button>`;
      $("label[for=cp-q]", F).textContent = "Nome do cliente";
      bindPicker(F, custs, c => { S.cust = c; const v = parseMoney($("#sm-v", F).value);
        $("#sm-lim", F).innerHTML = c.credit_limit && Number(c.balance) + v > Number(c.credit_limit) ? `<div class="diff bad">Passa do limite: já deve ${money(c.balance)}, limite ${money(c.credit_limit)}</div>` : ""; });
      setTimeout(() => $("#cp-q", F).focus(), 30);
      $("#sm-ok", F).onclick = () => { if (!S.cust) return toast("Escolha o cliente do fiado.", true); const v = n2(Math.min(parseMoney($("#sm-v", F).value), rem));
        if (v <= 0) return toast("Digite o valor.", true); S.pays.push({ method: "fiado", amount: v }); S.method = null; drawPay(); drawRight(); };
    } else {
      F.innerHTML = `<div class="field"><label for="sm-v">Valor no ${METHOD_LABEL[m]}</label><input class="input num big-in" id="sm-v" inputmode="decimal" value="${moneyInput(rem)}"></div>
        <button class="btn primary block" id="sm-ok">Confirmar ${METHOD_LABEL[m]}</button>`;
      const v = $("#sm-v", F); setTimeout(() => { v.focus(); v.select(); }, 30);
      const ok = () => { const a = n2(parseMoney(v.value)); if (a <= 0) return toast("Digite o valor.", true); if (a > rem + .009) return toast(`O valor passa do que falta (${money(rem)}).`, true);
        S.pays.push({ method: m, amount: a }); S.method = null; drawPay(); drawRight(); };
      $("#sm-ok", F).onclick = ok; v.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); ok(); } };
    }
  }
  function drawRight() {
    const R = $("#sm-right", el), ls = lines(), rem = remaining(), editing = S.step === "prod";
    const needCash = S.pays.some(x => x.method !== "fiado") && !sess;
    const mesaSel = nT ? `<div class="field"><label for="sm-mesa">Mesa</label><select class="input" id="sm-mesa" ${!editing && !edit ? "" : ""}><option value="">Sem mesa (balcão)</option>${Array.from({ length: nT }, (_, i) => i + 1).map(n => `<option value="${n}" ${S.mesa === n ? "selected" : ""} ${busyT.has(n) ? "disabled" : ""}>Mesa ${n}${busyT.has(n) ? " (ocupada)" : ""}</option>`).join("")}</select></div>` : "";
    const E = S.ent, entSel = !edit && editing ? `<div class="seg ent-seg" role="group" aria-label="Tipo de venda"><button type="button" data-ft="bal" aria-pressed="${!E.on}">Balcão / mesa</button><button type="button" data-ft="ent" aria-pressed="${E.on}">${ICON.pin}Entrega</button></div>
      ${E.on ? `<div class="ent-box"><div class="field"><label for="se-name">Cliente</label><input class="input" id="se-name" value="${esc(E.name || S.cust?.name || "")}" placeholder="Nome de quem recebe" autocomplete="off"></div>
        <div class="field"><label for="se-phone">Telefone</label><input class="input" id="se-phone" inputmode="tel" value="${esc(E.phone)}" placeholder="(19) 99999-0000"></div>
        <div class="field"><label for="se-addr">Endereço</label><input class="input" id="se-addr" value="${esc(E.address)}" placeholder="Rua, número e bairro" autocomplete="off"></div>
        <div class="field"><label for="se-ref">Referência (opcional)</label><input class="input" id="se-ref" value="${esc(E.ref)}" placeholder="Ex.: portão verde"></div>
        <div class="field"><label for="se-fee">Taxa de entrega (R$)</label><input class="input num" id="se-fee" inputmode="decimal" value="${E.fee ? moneyInput(E.fee) : ""}" placeholder="0,00"></div></div>` : ""}` : "";
    const entInfo = E.on && !editing ? `<div class="box ent-info">${ICON.pin}<div><b>Entrega · ${esc(E.name || S.cust?.name || "")}</b><span class="faint">${esc(E.address)}${E.ref ? " · " + esc(E.ref) : ""}</span></div></div>` : "";
    R.innerHTML = `<h3>${edit ? "Conta" : "Resumo da venda"}</h3>${entSel}${entInfo}${(editing || !edit) && !E.on ? mesaSel : ""}
      <div class="sm-cart">${ls.length ? ls.map(l => `<div class="sm-line"><div class="grow"><b>${esc(l.p.name)}</b><span class="faint num">${money(l.p.price)} cada</span></div>
        ${editing ? `<span class="qty"><button data-m="${l.id}" aria-label="Menos">−</button><b class="num">${l.qty}</b><button data-pl="${l.id}" aria-label="Mais">+</button></span>` : `<span class="faint num">${l.qty}×</span>`}
        <b class="num">${money(l.p.price * l.qty)}</b></div>`).join("") : `<p class="faint" style="padding:18px 0;text-align:center">Nenhum produto ainda.<br>Toque num produto para adicionar.</p>`}</div>
      ${ls.length ? `${editing ? `<div class="field"><label for="sm-disc">Desconto (R$)</label><input class="input num" id="sm-disc" inputmode="decimal" value="${S.disc ? moneyInput(S.disc) : ""}" placeholder="0,00"></div>` : S.disc ? `<div class="calc-row"><span>Desconto</span><b class="num">−${money(S.disc)}</b></div>` : ""}
        ${fee() ? `<div class="calc-row"><span>Taxa de entrega</span><b class="num">${money(fee())}</b></div>` : ""}
        <div class="total-line"><span class="muted">Total</span><b>${money(total())}</b></div>
        ${S.pays.length ? `<div class="sm-pays">${S.pays.map((x, i) => `<div class="calc-row"><span>${METHOD_LABEL[x.method]}${x.method === "fiado" && S.cust ? " · " + esc(S.cust.name) : ""}${x.change ? ` <span class="faint">(recebido ${money(x.received)})</span>` : ""}</span><span class="row" style="gap:6px;flex-wrap:nowrap"><b class="num">${money(x.amount)}</b><button class="x-btn" data-rm="${i}" aria-label="Remover pagamento">✕</button></span></div>`).join("")}
          ${rem > 0 ? `<div class="calc-row" style="color:var(--bad)"><span style="color:inherit">Falta</span><b class="num">${money(rem)}</b></div>` : change() > 0 ? `<div class="calc-row" style="color:var(--good)"><span style="color:inherit">Troco</span><b class="num">${money(change())}</b></div>` : ""}</div>` : ""}
        ${editing ? `<button class="btn primary block big-btn" id="sm-next">${edit ? "Pagar e concluir" : "Ir para pagamento"} ${ICON.arrow}</button>`
          : `<button class="btn primary block big-btn" id="sm-fin" ${rem > 0 || needCash ? "disabled" : ""}>${needCash ? "Abra o caixa para receber" : rem > 0 ? "Falta " + money(rem) : edit ? "Concluir venda" : "Pagar agora e finalizar"}</button>`}
        ${edit ? `<button class="btn ghost block" id="sm-save">Salvar alterações e voltar a esperar</button>` : `<button class="btn ghost block" id="sm-later">${ICON.clockF}${E.on ? "Receber na entrega" : "Aguardar pagamento" + (S.mesa ? " · Mesa " + S.mesa : "")}</button>`}` : ""}
      ${edit ? `<button class="link-btn" id="sm-cancel" style="color:var(--bad);align-self:center">Cancelar esta conta</button>` : ""}`;
    const bar = $("#sm-bar", el), n = sumBy(ls, l => l.qty);
    bar.hidden = !ls.length || S.step === "done" || (S.step === "pay" && !!S.method);
    bar.innerHTML = editing ? `<span><b class="num">${money(total())}</b><span class="faint"> · ${n} ${n === 1 ? "item" : "itens"}</span></span><button class="btn primary" id="smb-go">Pagamento ${ICON.arrow}</button>`
      : rem > 0 ? `<span><span class="faint">Falta </span><b class="num" style="color:var(--bad)">${money(rem)}</b></span><button class="btn ghost" id="smb-sum">Ver resumo</button>`
      : `<span><b class="num">${money(total())}</b>${change() > 0 ? `<span class="faint"> · troco ${money(change())}</span>` : ""}</span><button class="btn primary" id="smb-fin" ${needCash ? "disabled" : ""}>Finalizar venda</button>`;
    $("#smb-go", bar) && ($("#smb-go", bar).onclick = () => { if (!entOk()) return; S.step = "pay"; drawLeft(); drawRight(); el.scrollTo?.(0, 0); });
    $("#smb-sum", bar) && ($("#smb-sum", bar).onclick = () => R.scrollIntoView({ behavior: "smooth" }));
    $("#smb-fin", bar) && ($("#smb-fin", bar).onclick = e => finish(true, e.currentTarget));
    $$("[data-pl]", R).forEach(b => b.onclick = () => add(line(b.dataset.pl)));
    $$("[data-m]", R).forEach(b => b.onclick = () => { const it = S.items.find(i => i.id === b.dataset.m); it.qty--; if (it.qty <= 0) S.items = S.items.filter(i => i !== it); drawRight(); drawList(); });
    $$("[data-rm]", R).forEach(b => b.onclick = () => { S.pays.splice(+b.dataset.rm, 1); if (!S.pays.some(x => x.method === "fiado")) S.cust = S.cust; drawPay(); drawRight(); });
    $("#sm-disc", R) && ($("#sm-disc", R).onchange = e => { S.disc = Math.min(sub(), parseMoney(e.target.value)); drawRight(); });
    $("#sm-next", R) && ($("#sm-next", R).onclick = () => { if (!entOk()) return; S.step = "pay"; drawLeft(); drawRight(); });
    $$("[data-ft]", R).forEach(b => b.onclick = () => { S.ent.on = b.dataset.ft === "ent"; if (S.ent.on) S.mesa = null; drawRight(); if (S.ent.on) setTimeout(() => $("#se-name", el)?.focus(), 30); });
    [["se-name", "name"], ["se-phone", "phone"], ["se-addr", "address"], ["se-ref", "ref"]].forEach(([id, k]) => { const i = $("#" + id, R); if (i) i.oninput = () => { S.ent[k] = i.value; }; });
    $("#se-fee", R) && ($("#se-fee", R).onchange = e => { S.ent.fee = Math.max(0, parseMoney(e.target.value) || 0); drawRight(); });
    $("#sm-fin", R) && ($("#sm-fin", R).onclick = e => finish(true, e.currentTarget));
    $("#sm-later", R) && ($("#sm-later", R).onclick = e => { if (entOk()) finish(false, e.currentTarget); });
    $("#sm-save", R) && ($("#sm-save", R).onclick = e => finish(false, e.currentTarget));
    $("#sm-mesa", R) && ($("#sm-mesa", R).onchange = e => { S.mesa = e.target.value ? +e.target.value : null; drawRight(); });
    $("#sm-cancel", R) && ($("#sm-cancel", R).onclick = async () => { if (!(await confirmSheet("Cancelar a conta?", "Os produtos voltam para o estoque e a conta some da lista.", "Cancelar conta", true))) return;
      try { await API.setStatus(edit.id, "cancelado"); toast("Conta cancelada"); sh.close(); if (AD.view === "vendas") renderView(); } catch (x) { toast(errMsg(x), true); } });
  }
  const finish = (payNow, btn) => busy(btn, async () => {
    const fi = S.pays.find(x => x.method === "fiado");
    if (payNow && fi && S.cust?.credit_limit && Number(S.cust.balance) + fi.amount > Number(S.cust.credit_limit)) {
      if (!(await confirmSheet("Passa do limite de fiado", `${S.cust.name} já deve ${money(S.cust.balance)} e o limite é ${money(S.cust.credit_limit)}. Lançar mesmo assim?`, "Lançar no fiado"))) return; }
    const pays = payNow ? S.pays.map(x => ({ method: x.method, amount: x.amount })) : [];
    const items = S.items.map(i => ({ product_id: i.id, qty: i.qty }));
    const label = S.cust?.name || (S.mesa ? "Mesa " + S.mesa : "Balcão");
    let r;
    if (edit) {
      const before = JSON.stringify((edit.order_items || []).map(i => [i.product_id, i.qty]).sort()), after = JSON.stringify(items.map(i => [i.product_id, i.qty]).sort());
      if (!items.length) throw new Error("CARRINHO_VAZIO");
      if (before !== after) await API.setOrderItems(edit.id, items);
      const patch = { table_no: S.mesa }; if (!edit.customer_id || S.cust) Object.assign(patch, { customer_name: label, customer_id: S.cust?.id || null });
      await API.updateOrder(edit.id, patch);
      if (!payNow) { toast(`${S.mesa ? "Mesa " + S.mesa : "Conta"} atualizada`); sh.close(); if (AD.view === "vendas") renderView(); return; }
      await API.payOrderSplit(edit.id, pays, S.cust?.id); await API.setStatus(edit.id, "entregue");
      r = { code: edit.code, total: total() };
    } else {
      const E = S.ent, ent = E.on;
      r = await API.placeOrder({ channel: "balcao", customer_name: ent ? (E.name || S.cust?.name || "").trim() : label, customer_id: S.cust?.id || null,
        customer_phone: (ent && E.phone.trim()) || S.cust?.phone || null, fulfillment: ent ? "entrega" : "balcao",
        address: ent ? E.address.trim() : null, address_ref: ent ? E.ref.trim() || null : null, delivery_fee: fee(),
        payment_method: pays[0]?.method || "dinheiro", payments: payNow ? pays : undefined, discount: S.disc, pay_now: payNow, items });
      if (!payNow) { await API.setStatus(r.id, "preparando"); if (!ent) await API.updateOrder(r.id, { table_no: S.mesa }); }
    }
    const ch = change();
    S.step = "done";
    $("#sm-sub", el).textContent = "Venda concluída";
    $("#sm-bar", el).hidden = true;
    const entDone = !edit && S.ent.on;
    $(".sale", el).innerHTML = `<div class="sale-ok">${ICON.checkBig}<h3>${entDone ? `Entrega nº ${r.code} registrada${payNow ? " e paga" : ""}` : payNow ? (edit ? `${S.mesa ? "Mesa " + S.mesa : "Conta"} paga e concluída` : `Venda nº ${r.code} registrada`) : `${S.mesa ? "Mesa " + S.mesa + " aberta" : "Conta aberta"}, aguardando pagamento`}</h3>
      ${entDone ? `<p class="muted">Ela já está em Pedidos › Em preparo. De lá você marca “Saiu para entrega” e conclui${payNow ? "" : ", recebendo o pagamento"}.</p>` : ""}
      <p class="muted">${money(r.total)}${payNow ? " · " + pays.map(x => METHOD_LABEL[x.method]).join(" + ") : ""}</p>${payNow && ch > 0 ? `<div class="diff ok" style="font-size:1.3rem">Troco: ${money(ch)}</div>` : ""}
      <div class="row" style="justify-content:center"><button class="btn primary" id="sm-again">${ICON.plus}Nova venda</button><button class="btn ghost" id="sm-print">${ICON.receipt}Imprimir cupom</button><button class="btn ghost" data-close>Fechar</button></div></div>`;
    $("#sm-again", el).onclick = () => { sh.close(); saleModal(); };
    const oid = edit?.id || r.id;
    $("#sm-print", el).onclick = async () => { try { const full = await API.order(oid); if (full) printReceipt(full); } catch (x) { toast(errMsg(x), true); } };
    $$("[data-close]", el).forEach(b => b.onclick = () => sh.close());
    if (AD.view === "vendas") renderView();
  });
  drawLeft(); drawRight();
}

function todaySales(orders) {
  let f = "todas";
  const sh = openSheet(`<div class="sheet-head"><div><h2>Vendas de hoje</h2><p class="faint" style="margin-top:2px">${fmtDateLong(new Date())}</p></div><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div id="ts-body"></div>`, { cls: "wide" });
  const draw = () => {
    const ok = orders.filter(validOrder), rev = sumBy(ok, orderRevenue);
    const tests = { todas: () => true, balcao: o => o.fulfillment === "balcao", retirada: o => o.fulfillment === "retirada", entrega: o => o.fulfillment === "entrega", areceber: o => o.payment_status === "pendente" && validOrder(o) };
    const list = orders.filter(tests[f]);
    const pm = {}; ok.filter(o => ["pago", "fiado"].includes(o.payment_status)).forEach(o => payParts(o).forEach(x => pm[x.method] = (pm[x.method] || 0) + Number(x.amount)));
    $("#ts-body", sh.el).innerHTML = `<div class="mini-stats"><div><span>Total vendido</span><b>${money(rev)}</b></div><div><span>Vendas</span><b class="num">${ok.length}</b></div>
        ${Object.entries(pm).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `<div><span>${METHOD_LABEL[k]}</span><b>${money(v)}</b></div>`).join("")}</div>
      <div class="pills">${[["todas", "Todas"], ["balcao", "Balcão"], ["retirada", "Retirada"], ["entrega", "Entrega"], ["areceber", "A receber"]].map(([k, l]) => `<button data-f="${k}" aria-pressed="${f === k}">${l}<span class="n num">${orders.filter(tests[k]).length}</span></button>`).join("")}</div>
      <div class="ts-list">${list.length ? list.map(o => `<button class="ts-row ${o.status === "cancelado" ? "canc" : ""}" data-o="${o.id}">
          <span class="t num">${fmtTime(o.created_at)}</span>
          <span class="who2"><b>${esc(o.customer_name)} <span class="faint num" style="font-weight:500">· nº ${o.code}</span></b><span class="faint">${(o.order_items || []).map(i => `${i.qty}× ${esc(i.name)}`).join(", ")}</span></span>
          ${typeChip(o)}<span class="pm">${payText(o)}<br>${payPill(o)}</span><b class="num val">${money(o.total)}</b></button>`).join("")
        : `<p class="empty-row">Nenhuma venda nesse filtro.</p>`}</div>`;
    $$("[data-f]", sh.el).forEach(b => b.onclick = () => { f = b.dataset.f; draw(); });
    $$("[data-o]", sh.el).forEach(b => b.onclick = () => orderDetail(orders.find(o => o.id === b.dataset.o)));
  };
  draw();
}

/* ================= PEDIDOS ================= */
async function vPedidos(el) {
  const today = startOfDay(new Date());
  const orders = await API.orders({ from: new Date(today - 2 * 864e5) });
  const tracked = o => o.channel === "app" || o.fulfillment === "entrega"; // pedidos do app e entregas lançadas no balcão
  const live = orders.filter(o => tracked(o) && ["novo", "preparando", "pronto", "saiu"].includes(o.status));
  const done = orders.filter(o => ["entregue", "cancelado"].includes(o.status) && new Date(o.created_at) >= today && tracked(o));
  const S = [
    ["novo", "Aguardando aceite", ICON.bell, live.filter(o => o.status === "novo"), "hot"],
    ["preparando", "Em preparo", ICON.flame, live.filter(o => o.status === "preparando"), ""],
    ["pronto", "Pronto para retirar", ICON.bag, live.filter(o => o.status === "pronto"), ""],
    ["saiu", "Saiu para entrega", ICON.bolt, live.filter(o => o.status === "saiu"), ""],
    ["fim", "Concluídos hoje", ICON.check, done, "muted-sec"],
  ].filter(x => x[3].length);
  const card = o => {
    const nx = nextStatus(o), mins = Math.max(1, Math.round((Date.now() - new Date(o.created_at)) / 6e4));
    const ago = mins < 60 ? `há ${mins} min` : `há ${Math.floor(mins / 60)} h`;
    const label = { preparando: "Aceitar", saiu: "Saiu para entrega", pronto: "Pronto", entregue: "Concluir" }[nx?.[0]];
    return `<article class="aw ${o.status === "cancelado" ? "canc" : ""}">
      <div class="aw-h"><div><b>Nº ${o.code} · ${esc(o.customer_name)}</b><span class="faint">${fmtTime(o.created_at)} · ${ago}</span></div>${typeChip(o)}</div>
      <div class="aw-items">${(o.order_items || []).map(i => `<span>${i.qty}× ${esc(i.name)}</span>`).join("")}</div>
      ${o.fulfillment === "entrega" && o.address ? `<div class="aw-addr">${ICON.pin}<span>${esc(o.address)}</span></div>` : ""}
      ${o.notes ? `<div class="aw-note">${esc(o.notes)}</div>` : ""}
      <div class="aw-f"><span><b class="num">${money(o.total)}</b><span class="faint"> · ${payText(o)}</span> ${o.payment_status !== "pendente" ? payPill(o) : ""}</span>
        <span class="row" style="gap:8px"><button class="btn sm ghost" data-see="${o.id}">Ver</button>${o.status === "cancelado" ? `<span class="st cancelado">Cancelado</span>` : nx ? `<button class="btn sm primary" data-adv="${o.id}">${label}</button>` : ""}</span></div>
    </article>`; };
  el.innerHTML = head("Pedidos", "Atualiza sozinho quando chega pedido novo", API.mode === "demo" ? `<button class="btn ghost" id="o-sim">Simular pedido do app</button>` : "") +
    (S.length ? S.map(([k, l, ic, list, cls]) => `<section class="await ${cls}"><div class="card-h"><h3>${ic}${l}</h3><span class="faint">${list.length} pedido${list.length > 1 ? "s" : ""}</span></div>
      <div class="await-grid">${list.map(card).join("")}</div></section>`).join("")
      : `<div class="card empty-row" style="padding:60px 20px"><h3>Nenhum pedido no momento</h3><p>Quando um cliente pedir pelo app, o pedido aparece aqui e o painel toca o aviso.</p></div>`);
  $$("[data-see]", el).forEach(b => b.onclick = () => orderDetail(orders.find(o => o.id === b.dataset.see)));
  $$("[data-adv]", el).forEach(b => b.onclick = () => { const o = orders.find(x => x.id === b.dataset.adv);
    if (o.status === "novo") return enqueueOrder(o.id, { sound: false });
    if (nextStatus(o)[0] === "entregue" && o.payment_status === "pendente") return paySheet(o, { thenStatus: "entregue" });
    busy(b, async () => { await API.setStatus(o.id, nextStatus(o)[0]); AD.newIds.delete(o.id); renderView(); refreshNav(); }); });
  $("#o-sim") && ($("#o-sim").onclick = async () => { const ps = (await API.products()).filter(p => p.is_active && (!p.track_stock || p.stock > 3) && !p.is_combo);
    const pick = ps.sort(() => Math.random() - .5).slice(0, 2); const names = ["Fernanda", "Gustavo", "Paula", "Diego", "Renata"];
    try { await API.placeOrder({ channel: "app", customer_name: names[Math.floor(Math.random() * names.length)], customer_phone: "(19) 99876-5432", fulfillment: "retirada", payment_method: "pix",
      notes: Math.random() < .5 ? "Sem pressa, retiro às 18h" : null, items: pick.map(p => ({ product_id: p.id, qty: 2 + Math.floor(Math.random() * 4) })) }); } catch (x) { toast(errMsg(x), true); } });
}
function nextStatus(o) {
  const ent = o.fulfillment === "entrega";
  if (o.status === "cancelado") return null;
  return { novo: ["preparando", "Aceitar"], preparando: ent ? ["saiu", "Saiu"] : ["pronto", "Pronto"], pronto: ["entregue", "Concluir"], saiu: ["entregue", "Concluir"] }[o.status];
}
function orderDetail(o) {
  if (!o) return;
  const nx = nextStatus(o), items = o.order_items || [];
  const msg = { novo: "recebemos seu pedido", preparando: "seu pedido está sendo preparado", pronto: "seu pedido está pronto para retirar", saiu: "seu pedido saiu para entrega", entregue: "obrigado pela compra" }[o.status] || "";
  const sh = openSheet(`<div class="sheet-head"><div><h2>Pedido #${o.code}</h2><p class="faint" style="margin-top:4px">${fmtDateLong(o.created_at)} às ${fmtTime(o.created_at)} · ${o.channel === "app" ? "App" : "Balcão"} · ${kindOf(o)}</p></div><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="row">${stPill(o.status)} ${payPill(o)}</div>
    <div class="box"><div class="who"><i>${initials(o.customer_name)}</i><div><b>${esc(o.customer_name)}</b><span class="faint" style="font-size:.85rem">${esc(o.customer_phone || "sem telefone")}</span></div></div>
      ${o.fulfillment === "entrega" ? `<div style="font-size:.9rem;display:flex;gap:8px">${ICON.pin}<div>${esc(o.address || "")}${o.address_ref ? `<div class="faint">${esc(o.address_ref)}</div>` : ""}
        ${o.lat ? `<a href="https://www.google.com/maps/search/?api=1&query=${o.lat},${o.lng}" target="_blank" rel="noopener">Abrir no mapa</a>` : ""} <span class="faint num">${o.distance_km ? String(o.distance_km).replace(".", ",") + " km" : ""}</span></div></div>` : ""}
      ${o.notes ? `<div style="background:var(--warn-soft);color:var(--warn);padding:8px 10px;border-radius:10px;font-size:.9rem">Obs.: ${esc(o.notes)}</div>` : ""}</div>
    <div class="box">${items.map(i => `<div class="calc-row"><span>${i.qty}× ${esc(i.name)}</span><b class="num">${money(i.total)}</b></div>`).join("")}
      ${Number(o.delivery_fee) ? `<div class="calc-row"><span>Entrega</span><b class="num">${money(o.delivery_fee)}</b></div>` : ""}${Number(o.discount) ? `<div class="calc-row"><span>Desconto</span><b class="num">−${money(o.discount)}</b></div>` : ""}
      <div class="calc-row total"><span>Total${o.payments?.length > 1 ? "" : " · " + METHOD_LABEL[o.payment_method]}${o.change_for ? " · troco p/ " + money(o.change_for) : ""}</span><b class="num">${money(o.total)}</b></div>
      ${o.payments?.length > 1 ? o.payments.map(x => `<div class="calc-row"><span>${METHOD_LABEL[x.method]}</span><b class="num">${money(x.amount)}</b></div>`).join("") : ""}</div>
    ${o.status !== "cancelado" ? `<div class="row">${nx ? `<button class="btn primary" id="od-next">${{ preparando: o.status === "novo" ? "Aceitar pedido" : "Começar preparo", saiu: "Saiu para entrega", pronto: "Pronto para retirar", entregue: "Concluir pedido" }[nx[0]]}</button>` : ""}
      ${o.payment_status === "pendente" ? `<button class="btn good" id="od-pay">Receber pagamento</button>` : ""}
      <button class="btn ghost" id="od-print">${ICON.receipt}Imprimir recibo</button><button class="btn ghost" id="od-view">Ver recibo</button>
      ${o.customer_phone ? `<a class="btn ghost" href="${waLink(o.customer_phone, `Oi ${o.customer_name}! Pedido #${o.code} da Bruno Salgados: ${msg}.`)}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
      <button class="btn ghost" id="od-cancel" style="color:var(--bad)">Cancelar pedido</button></div>` : ""}`);
  const after = () => { sh.close(); renderView(); refreshNav(); };
  $("#od-next", sh.el) && ($("#od-next", sh.el).onclick = e => { if (o.status === "novo") { sh.close(); return enqueueOrder(o.id, { sound: false }); }
    if (nx[0] === "entregue" && o.payment_status === "pendente") { sh.close(); return paySheet(o, { thenStatus: "entregue" }); }
    busy(e.currentTarget, async () => { await API.setStatus(o.id, nx[0]); AD.newIds.delete(o.id); after(); }); });
  $("#od-print", sh.el) && ($("#od-print", sh.el).onclick = () => printReceipt(o));
  $("#od-view", sh.el) && ($("#od-view", sh.el).onclick = () => previewReceipt(o));
  $("#od-pay", sh.el) && ($("#od-pay", sh.el).onclick = () => { sh.close(); paySheet(o); });
  $("#od-cancel", sh.el) && ($("#od-cancel", sh.el).onclick = async () => { sh.close();
    if (await confirmSheet(`Cancelar pedido #${o.code}?`, "Os itens voltam para o estoque. Se já foi pago, o valor sai do caixa como estorno.", "Cancelar pedido", true)) {
      try { await API.setStatus(o.id, "cancelado"); toast("Pedido cancelado"); renderView(); refreshNav(); } catch (x) { toast(errMsg(x), true); } } });
}

/* ================= CAIXA ================= */
async function vCaixa(el) {
  AD.ct ||= "hoje";
  const [sess, hist] = await Promise.all([API.cashCurrent(), API.cashSessions({ from: new Date(Date.now() - 60 * 864e5) })]);
  const tabs = `<div class="pills">${[["hoje", "Caixa de hoje"], ["hist", "Histórico"]].map(([k, l]) => `<button data-ct="${k}" aria-pressed="${AD.ct === k}">${l}</button>`).join("")}</div>`;
  const bind = () => $$("[data-ct]", el).forEach(b => b.onclick = () => { AD.ct = b.dataset.ct; renderView(); });
  if (AD.ct === "hist") {
    const closed = hist.filter(s => s.status === "fechado");
    el.innerHTML = head("Caixa", "Caixas fechados nos últimos 60 dias", tabs) + `<div class="card tight"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Dia</th><th class="hide-sm">Horário</th><th class="r">Vendido</th><th class="r hide-sm">Saídas</th><th class="r">Esperado</th><th class="r">Contado</th><th class="r">Diferença</th></tr></thead><tbody>
      ${closed.length ? closed.map(s => { const mv = s.cash_movements || []; const v = sumBy(mv.filter(m => ["venda", "recebimento_fiado"].includes(m.kind)), m => m.amount);
        const out = sumBy(mv.filter(m => ["sangria", "despesa", "estorno"].includes(m.kind)), m => m.amount); const d = Number(s.difference || 0);
        return `<tr class="click" data-sess="${s.id}"><td><b>${fmtDateLong(s.opened_at)}</b></td><td class="hide-sm faint num">${fmtTime(s.opened_at)}–${s.closed_at ? fmtTime(s.closed_at) : ""}</td><td class="r num">${money(v)}</td><td class="r num hide-sm">${money(out)}</td>
          <td class="r num">${money(s.expected_cash)}</td><td class="r num">${money(s.counted_cash)}</td><td class="r"><span class="pay ${d === 0 ? "pago" : d < 0 ? "pendente" : "estornado"}">${d === 0 ? "Bateu" : (d > 0 ? "+" : "") + money(d)}</span></td></tr>`; }).join("")
        : `<tr><td colspan="7" class="empty-row">Nenhum caixa fechado ainda.</td></tr>`}</tbody></table></div></div>`;
    bind(); $$("[data-sess]", el).forEach(r => r.onclick = () => cashReport(hist.find(s => s.id === r.dataset.sess))); return;
  }
  if (!sess) {
    el.innerHTML = head("Caixa", "Fechado", tabs) + `<div class="card open-box">${ICON.lock.replace('class="svg-i"', 'class="svg-i" style="width:44px;height:44px;color:var(--accent)"')}<h3 style="font-size:1.4rem">Abrir o caixa</h3><p class="muted">Conte o dinheiro que está na gaveta para começar o dia.</p>
      <div class="field" style="width:100%"><label for="cx-open">Troco inicial na gaveta</label><input class="input num" id="cx-open" inputmode="decimal" placeholder="0,00"></div>
      <div class="field" style="width:100%"><label for="cx-onote">Observação (opcional)</label><input class="input" id="cx-onote"></div>
      <button class="btn primary block" id="cx-go" style="min-height:54px">Abrir caixa</button></div>`;
    bind(); $("#cx-go").onclick = e => busy(e.currentTarget, async () => { await API.openCash(parseMoney($("#cx-open").value), $("#cx-onote").value.trim()); toast("Caixa aberto"); renderView(); });
    return;
  }
  const mv = sess.movements, by = k => sumBy(mv.filter(m => m.kind === k), m => m.amount);
  const cashIn = k => sumBy(mv.filter(m => m.method === "dinheiro" && m.kind === k), m => m.amount);
  const exp = n2(Number(sess.opening_amount) + sumBy(mv.filter(m => m.method === "dinheiro"), m => IN_KINDS.includes(m.kind) ? m.amount : -m.amount));
  const sales = by("venda") + by("recebimento_fiado"), outs = by("sangria") + by("despesa") + by("estorno");
  const methods = [["dinheiro", "Dinheiro"], ["pix", "Pix"], ["cartao", "Cartão"], ["mercadopago", "Mercado Pago"]].map(([k, l]) => [l, sumBy(mv.filter(m => ["venda", "recebimento_fiado"].includes(m.kind) && (k === "cartao" ? m.method.startsWith("cartao") : m.method === k)), m => m.amount)]).filter(r => r[1] > 0 || r[0] !== "Mercado Pago");
  const todayOrders = (await API.orders({ from: new Date(sess.opened_at) })).filter(validOrder);
  const fiado = sumBy(todayOrders.filter(o => o.payment_status === "fiado"), o => o.total);
  AD.cf ||= "tudo";
  el.innerHTML = head("Caixa", `Aberto ${fmtDateLong(sess.opened_at)} às ${fmtTime(sess.opened_at)}`, tabs) + `
  <section class="cx-top">
    <div class="drawer-card"><span class="l">Dinheiro na gaveta</span><span class="v">${money(exp)}</span><span class="s">Troco inicial ${money(sess.opening_amount)}</span></div>
    <div class="stat">${ICON.cart}<span class="v">${money(sales)}</span><span class="l">Total recebido</span><span class="d flat">${todayOrders.filter(o => o.payment_status === "pago").length} vendas pagas</span></div>
    <div class="stat">${ICON.minusC}<span class="v" style="color:var(--bad)">${money(outs)}</span><span class="l">Saídas</span><span class="d flat">retiradas e despesas</span></div>
    <div class="stat">${ICON.users}<span class="v">${money(fiado)}</span><span class="l">Vendido no fiado</span><span class="d flat">recebido de fiado ${money(by("recebimento_fiado"))}</span></div>
  </section>
  <div id="cx-qty"></div>
  <section class="cx-actions">
    <button class="cx-act" data-mv="sangria"><span class="ic">${ICON.minusC}</span><span>Retirada<small>Tirar dinheiro da gaveta</small></span></button>
    <button class="cx-act" data-mv="suprimento"><span class="ic">${ICON.plusC}</span><span>Reforço de troco<small>Colocar dinheiro</small></span></button>
    <button class="cx-act" data-mv="despesa"><span class="ic">${ICON.receipt}</span><span>Despesa<small>Óleo, gás, embalagem</small></span></button>
    <button class="cx-act main" id="cx-close"><span class="ic">${ICON.lock}</span><span>Fechar caixa<small>Conferir a gaveta</small></span></button>
  </section>
  <div class="card"><div class="card-h"><h3>${ICON.cash}Recebido por forma de pagamento</h3></div><div class="method-row">${methods.map(([l, v]) => `<div class="method"><span class="l">${l}</span><span class="v">${money(v)}</span><span class="bar"><i style="width:${sales ? (v / sales * 100).toFixed(1) : 0}%"></i></span></div>`).join("")}</div></div>
  <section class="cx-cols">
    <div class="card tight"><div class="card-h"><h3>${ICON.clockF}Movimentações</h3><div class="pills">${[["tudo", "Tudo"], ["in", "Entradas"], ["out", "Saídas"]].map(([k, l]) => `<button data-cf="${k}" aria-pressed="${AD.cf === k}">${l}</button>`).join("")}</div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Hora</th><th>Descrição</th><th class="hide-sm">Forma</th><th class="r">Valor</th></tr></thead><tbody id="cx-mv"></tbody></table></div></div>
    <div class="card"><div class="card-h"><h3>${ICON.receipt}Conferência da gaveta</h3></div>
      <div><div class="calc-row"><span>Troco inicial</span><b class="num">${money(sess.opening_amount)}</b></div>
      <div class="calc-row"><span>+ Vendas em dinheiro</span><b class="num">${money(cashIn("venda"))}</b></div>
      <div class="calc-row"><span>+ Fiado recebido em dinheiro</span><b class="num">${money(cashIn("recebimento_fiado"))}</b></div>
      <div class="calc-row"><span>+ Reforços de troco</span><b class="num">${money(cashIn("suprimento"))}</b></div>
      <div class="calc-row"><span>− Retiradas</span><b class="num">${money(cashIn("sangria"))}</b></div>
      <div class="calc-row"><span>− Despesas e estornos</span><b class="num">${money(cashIn("despesa") + cashIn("estorno"))}</b></div>
      <div class="calc-row total"><span>Deve ter na gaveta</span><b class="num">${money(exp)}</b></div></div></div>
  </section>`;
  bind();
  const drawMv = () => { const list = mv.filter(m => AD.cf === "tudo" || (AD.cf === "in") === IN_KINDS.includes(m.kind));
    $("#cx-mv").innerHTML = list.length ? list.map(m => `<tr><td class="faint num">${fmtTime(m.created_at)}</td><td><b>${esc(m.description || KIND_LABEL[m.kind])}</b><div class="sub">${KIND_LABEL[m.kind]}</div></td><td class="hide-sm">${METHOD_LABEL[m.method]}</td>
      <td class="r"><span class="amt ${IN_KINDS.includes(m.kind) ? "in" : "out"}">${IN_KINDS.includes(m.kind) ? "+" : "−"}${money(m.amount)}</span></td></tr>`).join("") : `<tr><td colspan="4" class="empty-row">Nenhum lançamento.</td></tr>`; };
  drawMv();
  soldQty(sess.opened_at).then(q => { const b = $("#cx-qty"); if (b) { b.innerHTML = qtyHTML(q, false); } }).catch(() => {});
  $$("[data-cf]", el).forEach(b => b.onclick = () => { AD.cf = b.dataset.cf; $$("[data-cf]", el).forEach(x => x.setAttribute("aria-pressed", x === b)); drawMv(); });
  $$("[data-mv]", el).forEach(b => b.onclick = () => moveSheet(b.dataset.mv));
  $("#cx-close").onclick = () => {
    const sh = openSheet(`<div class="sheet-head"><h2>Fechar caixa</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
      <div id="cc-qty"><p class="faint">Somando o que foi vendido…</p></div>
      <p class="muted">Conte o dinheiro da gaveta e digite o valor. O sistema mostra se sobrou ou faltou.</p>
      <div class="box"><div class="calc-row"><span>Esperado na gaveta</span><b class="num">${money(exp)}</b></div>
        ${methods.filter(m => m[0] !== "Dinheiro").map(([l, v]) => `<div class="calc-row"><span>${l}</span><b class="num">${money(v)}</b></div>`).join("")}</div>
      <div class="field"><label for="cc-v">Dinheiro contado</label><input class="input num" id="cc-v" inputmode="decimal" style="font-size:1.6rem;font-weight:800;height:60px;text-align:center"></div>
      <div id="cc-diff"></div>
      <div class="field"><label for="cc-n">Observação</label><textarea class="input" id="cc-n" placeholder="Ex.: faltou R$ 5 do troco do motoboy"></textarea></div>
      <button class="btn primary block" id="cc-go" style="min-height:52px">Fechar caixa</button>`);
    soldQty(sess.opened_at).then(q => { const box = $("#cc-qty", sh.el); if (!box) return; box.innerHTML = qtyHTML(q, false) + `<button class="btn ghost sm" id="cc-qprint" type="button">${ICON.receipt}Imprimir quantidades</button>`;
      $("#cc-qprint", box).onclick = () => printQty(q, "VENDAS DO DIA", `${fmtDateLong(sess.opened_at)} · desde ${fmtTime(sess.opened_at)}`); }).catch(() => { const box = $("#cc-qty", sh.el); if (box) box.innerHTML = ""; });
    const v = $("#cc-v", sh.el);
    v.oninput = () => { const d = n2(parseMoney(v.value) - exp); $("#cc-diff", sh.el).innerHTML = v.value ? `<div class="diff ${d === 0 ? "ok" : d < 0 ? "bad" : "over"}">${d === 0 ? "O caixa bateu certinho" : d < 0 ? "Faltando " + money(-d) : "Sobrando " + money(d)}</div>` : ""; };
    $("#cc-go", sh.el).onclick = e => busy(e.currentTarget, async () => { if (!v.value) { toast("Digite o valor contado.", true); return; }
      const r = await API.closeCash(parseMoney(v.value), $("#cc-n", sh.el).value.trim()); sh.close();
      toast(r.difference === 0 ? "Caixa fechado. Bateu certinho." : `Caixa fechado com diferença de ${money(r.difference)}`);
      const s2 = (await API.cashSessions({ from: new Date(sess.opened_at) })).find(x => x.id === sess.id); renderView(); if (s2) cashReport(s2); });
  };
}
/* quantidade vendida no período do caixa (por categoria e por produto) */
async function soldQty(from, to) {
  const [orders, prods, cats] = await Promise.all([API.orders({ from: new Date(from), to: to ? new Date(new Date(to).getTime() + 1000) : undefined }), API.products(), API.categories()]);
  const catOf = id => cats.find(c => c.id === prods.find(p => p.id === id)?.category_id)?.name || "Outros";
  const ok = orders.filter(validOrder), byProd = new Map(), byCat = new Map();
  ok.forEach(o => (o.order_items || []).forEach(i => { const k = i.name, c = catOf(i.product_id);
    const r = byProd.get(k) || { name: k, cat: c, qty: 0, total: 0 }; r.qty += i.qty; r.total += Number(i.total); byProd.set(k, r);
    byCat.set(c, (byCat.get(c) || 0) + i.qty); }));
  const prodList = [...byProd.values()].sort((a, b) => b.qty - a.qty);
  const total = sumBy(prodList, r => r.qty), drinks = sumBy(prodList.filter(r => /bebida/i.test(r.cat)), r => r.qty);
  return { total, salgados: total - drinks, drinks, byCat: [...byCat.entries()].sort((a, b) => b[1] - a[1]), prodList,
    pendentes: ok.filter(o => o.payment_status === "pendente").length, pedidos: ok.length };
}
function qtyHTML(q, open = true) {
  if (!q.total) return `<div class="box"><span class="lbl">Quantidade vendida</span><p class="muted">Nenhum produto vendido neste caixa.</p></div>`;
  return `<div class="box qty-box"><span class="lbl">Quantidade vendida</span>
    <div class="qty-big"><div><b class="num">${q.salgados}</b><span>${q.drinks ? "salgados e doces" : "itens vendidos"}</span></div>${q.drinks ? `<div><b class="num">${q.drinks}</b><span>bebidas</span></div>` : ""}<div><b class="num">${q.pedidos}</b><span>vendas</span></div></div>
    ${q.byCat.length > 1 ? `<div class="qty-cats">${q.byCat.map(([c, n]) => `<span class="chip">${esc(c)} <b class="num">${n}</b></span>`).join("")}</div>` : ""}
    <details class="qty-det" ${open ? "open" : ""}><summary>Quantidade por produto</summary>${q.prodList.map(r => `<div class="calc-row"><span>${esc(r.name)}</span><b class="num">${r.qty}</b></div>`).join("")}</details>
    ${q.pendentes ? `<p class="faint" style="font-size:.8rem">Inclui ${q.pendentes} conta${q.pendentes > 1 ? "s" : ""} ainda não paga${q.pendentes > 1 ? "s" : ""}.</p>` : ""}</div>`;
}
function printQty(q, title, sub) {
  const s = AD.s || {}, w = Number(s.receipt_width) === 58 ? 58 : 80, fam = RECEIPT_FONTS[s.receipt_font]?.[1] || RECEIPT_FONTS.mono[1];
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:${w}mm auto;margin:0}body{margin:0;font:${receiptFontPx(s, w)}px/1.35 ${fam};font-weight:${s.receipt_bold ? 700 : 400};color:#000}
    .rc{width:${w}mm;padding:3mm ${w === 58 ? 2 : 4}mm}.c{text-align:center}.b{font-weight:${s.receipt_bold ? 900 : 700}}.big{font-size:1.25em}.hr{border-top:1px dashed #000;margin:5px 0}.r{display:flex;justify-content:space-between;gap:8px}</style></head><body><div class="rc">
    <div class="c b big">${esc(s.receipt_title || s.store_name || "Bruno Salgados")}</div><div class="c b">${esc(title)}</div><div class="c">${esc(sub)}</div><div class="hr"></div>
    <div class="r b big"><span>${q.drinks ? "SALGADOS E DOCES" : "ITENS VENDIDOS"}</span><span>${q.salgados}</span></div>${q.drinks ? `<div class="r b"><span>BEBIDAS</span><span>${q.drinks}</span></div>` : ""}<div class="r"><span>Vendas</span><span>${q.pedidos}</span></div>
    ${q.byCat.length > 1 ? `<div class="hr"></div>${q.byCat.map(([c, n]) => `<div class="r"><span>${esc(c)}</span><span>${n}</span></div>`).join("")}` : ""}
    <div class="hr"></div>${q.prodList.map(r => `<div class="r"><span>${esc(r.name)}</span><span>${r.qty}</span></div>`).join("")}<div class="hr"></div></div></body></html>`;
  const f = document.createElement("iframe"); f.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden"; document.body.appendChild(f);
  const d = f.contentWindow.document; d.open(); d.write(html); d.close(); setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch {} setTimeout(() => f.remove(), 60000); }, 250);
}
async function cashReport(s) {
  const q = await soldQty(s.opened_at, s.closed_at).catch(() => null);
  const mv = (s.cash_movements || []).slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
  const sumK = (f) => sumBy(mv.filter(f), m => m.amount);
  const d = Number(s.difference || 0);
  openSheet(`<div class="sheet-head"><div><h2>Relatório de fechamento</h2><p class="faint" style="margin-top:4px">${fmtDateLong(s.opened_at)} · ${fmtTime(s.opened_at)} às ${s.closed_at ? fmtTime(s.closed_at) : "—"}</p></div><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="diff ${d === 0 ? "ok" : d < 0 ? "bad" : "over"}">${d === 0 ? "Caixa bateu certinho" : d < 0 ? "Faltou " + money(-d) : "Sobrou " + money(d)}</div>
    <div class="mini-stats"><div><span>Vendido</span><b>${money(sumK(m => ["venda", "recebimento_fiado"].includes(m.kind)))}</b></div><div><span>Saídas</span><b>${money(sumK(m => ["sangria", "despesa", "estorno"].includes(m.kind)))}</b></div>
      <div><span>Esperado</span><b>${money(s.expected_cash)}</b></div><div><span>Contado</span><b>${money(s.counted_cash)}</b></div></div>
    <div class="box">${[["dinheiro", "Dinheiro"], ["pix", "Pix"], ["cartao", "Cartão"], ["mercadopago", "Mercado Pago"]].map(([k, l]) => `<div class="calc-row"><span>${l}</span><b class="num">${money(sumK(m => ["venda", "recebimento_fiado"].includes(m.kind) && (k === "cartao" ? m.method.startsWith("cartao") : m.method === k)))}</b></div>`).join("")}
      <div class="calc-row"><span>Troco inicial</span><b class="num">${money(s.opening_amount)}</b></div></div>
    ${s.notes ? `<p class="muted">${esc(s.notes)}</p>` : ""}
    ${q ? qtyHTML(q) + `<button class="btn ghost" id="cr-qprint" style="align-self:flex-start">${ICON.receipt}Imprimir quantidades</button>` : ""}
    <div class="tl">${mv.map(m => `<div class="tl-i"><span class="h">${fmtTime(m.created_at)}</span><div style="min-width:0"><div style="font-weight:600">${esc(m.description || KIND_LABEL[m.kind])}</div><div class="faint" style="font-size:.8rem">${KIND_LABEL[m.kind]} · ${METHOD_LABEL[m.method]}</div></div>
      <span class="amt ${IN_KINDS.includes(m.kind) ? "in" : "out"}">${IN_KINDS.includes(m.kind) ? "+" : "−"}${money(m.amount)}</span></div>`).join("") || `<p class="muted">Sem lançamentos.</p>`}</div>`);
  const pb = $("#cr-qprint"); if (pb && q) pb.onclick = () => printQty(q, "VENDAS DO CAIXA", `${fmtDateLong(s.opened_at)} · ${fmtTime(s.opened_at)} às ${s.closed_at ? fmtTime(s.closed_at) : "agora"}`);
}

/* ================= CLIENTES ================= */
async function vClientes(el) {
  const [custs, orders] = await Promise.all([API.customers(), API.orders({ from: new Date(Date.now() - 365 * 864e5) })]);
  AD.cq ||= ""; AD.cfl ||= "todos";
  const stats = c => { const ph = onlyDigits(c.phone).slice(-9);
    const os = orders.filter(o => validOrder(o) && (o.customer_id === c.id || (ph.length >= 8 && onlyDigits(o.customer_phone).endsWith(ph)))).sort((a, b) => a.created_at.localeCompare(b.created_at));
    const gaps = os.slice(1).map((o, i) => (new Date(o.created_at) - new Date(os[i].created_at)) / 864e5);
    return { os, n: os.length, total: sumBy(os, o => o.total), last: os.at(-1)?.created_at, freq: gaps.length ? Math.max(1, Math.round(sumBy(gaps, g => g) / gaps.length)) : null }; };
  const rows = custs.map(c => ({ c, ...stats(c) }));
  const owed = custs.filter(c => c.balance > 0), monthFrom = new Date(Date.now() - 30 * 864e5);
  el.innerHTML = head("Clientes", "Cadastro, histórico de compras e fiado", `<label class="search-box">${ICON.search}<input id="cl-q" placeholder="Nome, telefone ou CPF" value="${esc(AD.cq)}" aria-label="Buscar cliente"></label><button class="btn primary" id="cl-new">${ICON.plus}Novo cliente</button>`) + `
    <div class="kpis"><div class="kpi"><span class="eyebrow">Clientes cadastrados</span><span class="v num">${custs.length}</span></div>
      <div class="kpi"><span class="eyebrow">Compraram nos últimos 30 dias</span><span class="v num">${rows.filter(r => r.last && new Date(r.last) >= monthFrom).length}</span></div>
      <div class="kpi"><span class="eyebrow">Fiado a receber</span><span class="v" style="color:var(--bad)">${money(sumBy(owed, c => c.balance))}</span><span class="s">${owed.length} cliente(s) devendo</span></div></div>
    <div class="tools"><div class="pills">${[["todos", "Todos"], ["devendo", "Devendo"], ["sumidos", "Sem comprar há 30 dias"]].map(([k, l]) => `<button data-cf="${k}" aria-pressed="${AD.cfl === k}">${l}</button>`).join("")}</div></div>
    <div class="card tight"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Cliente</th><th class="r">Pedidos</th><th class="r">Total gasto</th><th class="hide-sm">Última compra</th><th class="hide-sm">Frequência</th><th class="r">Fiado</th></tr></thead><tbody id="cl-body"></tbody></table></div></div>`;
  const draw = () => { const t = AD.cq.toLowerCase().trim(), d = onlyDigits(t);
    const list = rows.filter(r => (AD.cfl !== "devendo" || r.c.balance > 0) && (AD.cfl !== "sumidos" || !r.last || new Date(r.last) < monthFrom)
      && (!t || r.c.name.toLowerCase().includes(t) || (d.length > 2 && (onlyDigits(r.c.phone).includes(d) || onlyDigits(r.c.cpf).includes(d)))));
    $("#cl-body").innerHTML = list.length ? list.map(r => `<tr class="click" data-c="${r.c.id}"><td><div class="who"><i>${initials(r.c.name)}</i><div><b>${esc(r.c.name)}</b><span class="sub">${esc(r.c.phone || "sem telefone")}</span></div></div></td>
      <td class="r num">${r.n}</td><td class="r num"><b>${money(r.total)}</b></td><td class="hide-sm faint">${r.last ? fmtDate(r.last) : "—"}</td><td class="hide-sm faint">${r.freq ? `a cada ${r.freq} dia${r.freq > 1 ? "s" : ""}` : "—"}</td>
      <td class="r">${r.c.balance > 0 ? `<span class="pay pendente num">${money(r.c.balance)}</span>` : `<span class="pay pago">em dia</span>`}</td></tr>`).join("")
      : `<tr><td colspan="6" class="empty-row">${custs.length ? "Ninguém encontrado." : "Cadastre o primeiro cliente para usar o fiado e ver o histórico."}</td></tr>`;
    $$("[data-c]", el).forEach(r => r.onclick = () => customerDetail(rows.find(x => x.c.id === r.dataset.c))); };
  $("#cl-q").oninput = e => { AD.cq = e.target.value; draw(); };
  $$("[data-cf]", el).forEach(b => b.onclick = () => { AD.cfl = b.dataset.cf; $$("[data-cf]", el).forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  $("#cl-new").onclick = () => customerForm();
  draw();
}
async function customerDetail(r) {
  const c = r.c, led = await API.customerLedger(c.id);
  const msg = `Oi ${c.name.split(" ")[0]}! Aqui é da Bruno Salgados. Seu saldo em aberto é de ${money(c.balance)}.\n\nÚltimos lançamentos:\n` +
    led.slice(0, 8).map(l => `${fmtDate(l.created_at)} ${l.kind === "debito" ? "−" : "+"} ${money(l.amount)} ${l.description || ""}`).join("\n") + (AD.s?.pix_key ? `\n\nPix: ${AD.s.pix_key}` : "");
  const sh = openSheet(`<div class="sheet-head"><div class="who"><i>${initials(c.name)}</i><div><h2>${esc(c.name)}</h2><span class="faint" style="font-size:.86rem">${[c.phone, c.cpf && "CPF " + c.cpf, c.rg && "RG " + c.rg].filter(Boolean).map(esc).join(" · ")}</span></div></div><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="mini-stats"><div><span>Total gasto</span><b>${money(r.total)}</b></div><div><span>Pedidos</span><b class="num">${r.n}</b></div><div><span>Frequência</span><b>${r.freq ? `a cada ${r.freq} d` : "—"}</b></div>
      <div><span>Fiado</span><b style="color:${c.balance > 0 ? "var(--bad)" : "var(--good)"}">${c.balance > 0 ? money(c.balance) : "em dia"}</b></div></div>
    ${c.address || c.notes ? `<p class="muted" style="font-size:.9rem">${esc([c.address, c.notes].filter(Boolean).join(" · "))}</p>` : ""}
    <div class="row"><button class="btn good" id="cd-pay" ${c.balance <= 0 ? "disabled" : ""}>Receber fiado</button><button class="btn ghost" id="cd-debt">Lançar débito</button><button class="btn ghost" id="cd-edit">Editar cadastro</button>
      ${c.balance > 0 ? `<button class="btn ghost" id="cd-copy">Copiar cobrança</button>${c.phone ? `<a class="btn ghost" href="${waLink(c.phone, msg)}" target="_blank" rel="noopener">Cobrar no WhatsApp</a>` : ""}` : ""}</div>
    <div class="seg" role="group"><button data-t="h" aria-pressed="true">Histórico de pedidos</button><button data-t="f" aria-pressed="false">Extrato do fiado</button></div>
    <div id="cd-body"></div>`);
  const body = $("#cd-body", sh.el);
  const showT = t => { $$("[data-t]", sh.el).forEach(b => b.setAttribute("aria-pressed", b.dataset.t === t));
    body.innerHTML = t === "h" ? `<div class="tl">${r.os.length ? r.os.slice().reverse().map(o => `<div class="tl-i"><span class="h">${fmtDate(o.created_at)}</span><div style="min-width:0"><div style="font-weight:600">#${o.code} · ${(o.order_items || []).map(i => `${i.qty}× ${esc(i.name)}`).join(", ")}</div><div class="faint" style="font-size:.8rem">${METHOD_LABEL[o.payment_method]} · ${kindOf(o)}</div></div><b class="num">${money(o.total)}</b></div>`).join("") : `<p class="muted">Nenhum pedido ligado a este cliente.</p>`}</div>`
      : `<div class="tl">${led.length ? led.map(l => `<div class="tl-i"><span class="h">${fmtDate(l.created_at)}</span><div><div style="font-weight:600">${esc(l.description || "")}</div><div class="faint" style="font-size:.8rem">${{ debito: "Compra no fiado", pagamento: "Pagamento" + (l.method ? " · " + METHOD_LABEL[l.method] : ""), ajuste: "Ajuste" }[l.kind]}</div></div>
        <span class="amt ${l.kind === "debito" ? "out" : "in"}">${l.kind === "debito" ? "+" : "−"}${money(l.amount)}</span></div>`).join("") : `<p class="muted">Nenhum lançamento de fiado.</p>`}</div>`; };
  $$("[data-t]", sh.el).forEach(b => b.onclick = () => showT(b.dataset.t)); showT("h");
  $("#cd-edit", sh.el).onclick = () => { sh.close(); customerForm(c); };
  $("#cd-copy", sh.el) && ($("#cd-copy", sh.el).onclick = () => copyText(msg));
  $("#cd-pay", sh.el).onclick = () => { sh.close(); amountSheet(`Receber de ${c.name}`, c.balance, true, async (v, m, d) => { await API.receiveDebt(c.id, v, m, d); toast("Pagamento registrado no caixa"); }); };
  $("#cd-debt", sh.el).onclick = () => { sh.close(); amountSheet(`Lançar débito para ${c.name}`, null, false, async (v, _m, d) => { await API.addDebt(c.id, v, d || "Compra no fiado"); toast("Débito lançado"); }); };
}

/* ================= PRODUTOS ================= */
async function vProdutos(el) {
  const [prods, cats] = await Promise.all([API.products(), API.categories()]);
  AD.pc ??= ""; AD.pq ||= "";
  const cn = id => cats.find(c => c.id === id)?.name || "Sem categoria";
  el.innerHTML = head("Produtos", "Cardápio, preços, fotos e estoque. O que mudar aqui aparece no app na hora.",
    `<label class="search-box">${ICON.search}<input id="pr-q" placeholder="Código ou nome" value="${esc(AD.pq)}" aria-label="Buscar produto"></label><button class="btn ghost" id="pr-cats">Categorias</button><button class="btn primary" id="pr-new">${ICON.plus}Novo produto</button>`) + `
    <div class="pills"><button data-pc="" aria-pressed="${!AD.pc}">Todos<span class="n num">${prods.length}</span></button>${cats.map(c => `<button data-pc="${c.id}" aria-pressed="${AD.pc === c.id}">${esc(c.name)}<span class="n num">${prods.filter(p => p.category_id === c.id).length}</span></button>`).join("")}</div>
    <div class="prod-grid" id="pr-grid"></div>`;
  const set = async (id, v) => { try { await API.setStock(id, Math.max(0, v)); if (API.mode === "supabase") renderView(); else draw(); } catch (e) { toast(errMsg(e), true); } };
  const draw = async () => { const all = API.mode === "demo" ? await API.products() : prods; const t = AD.pq.toLowerCase().trim();
    const list = all.filter(p => (!AD.pc || p.category_id === AD.pc) && (!t || p.name.toLowerCase().includes(t) || (p.code || "").toLowerCase().startsWith(t)));
    $("#pr-grid").innerHTML = list.length ? list.map(p => `<article class="pc ${p.is_active ? "" : "hidden-p"}"><div class="ph-wrap">${productThumb(p)}<span class="code">${esc(p.code || "—")}</span>
        <span class="tags">${p.is_combo ? `<span class="tag-chip">Combo</span>` : ""}${p.is_featured ? `<span class="tag-chip">Destaque</span>` : ""}${p.track_stock && p.stock <= 0 ? `<span class="tag-chip bad">Esgotado</span>` : p.track_stock && p.stock <= p.low_stock_alert ? `<span class="tag-chip warn">Baixo</span>` : ""}</span></div>
      <div class="body"><div class="row1"><div style="min-width:0"><div class="nm">${esc(p.name)}</div><div class="cat">${esc(cn(p.category_id))} · ${esc(p.unit_label)}</div></div><span class="price">${money(p.price)}</span></div>
        <div class="foot">${p.track_stock ? `<div class="stock-ctl"><button data-sd="${p.id}" aria-label="Menos um">−</button><b class="num" data-sv="${p.id}" title="Toque para digitar">${p.stock}</b><button data-su="${p.id}" aria-label="Mais um">+</button></div>` : `<span class="faint" style="font-size:.82rem">Sem controle</span>`}
          <label class="mini-switch" title="Mostrar no app"><input type="checkbox" data-av="${p.id}" ${p.is_active ? "checked" : ""}>No app</label>
          <button class="btn sm ghost" data-ed="${p.id}">Editar</button></div></div></article>`).join("")
      : `<div class="card empty-row" style="grid-column:1/-1">Nenhum produto aqui. Toque em Novo produto para cadastrar.</div>`;
    const g = $("#pr-grid"), find = id => all.find(p => p.id === id);
    const bump = async (id, d) => { try { const v = await API.adjustStock(id, d); const el2 = $(`[data-sv="${id}"]`, g); if (el2) el2.textContent = v; const pr = find(id); if (pr) pr.stock = v; } catch (e) { toast(errMsg(e), true); } };
    $$("[data-su]", g).forEach(b => b.onclick = () => bump(b.dataset.su, 1));
    $$("[data-sd]", g).forEach(b => b.onclick = () => bump(b.dataset.sd, -1));
    $$("[data-sv]", g).forEach(b => b.onclick = () => amountStock(find(b.dataset.sv), set));
    $$("[data-av]", g).forEach(b => b.onchange = async () => { try { await API.saveProduct({ id: b.dataset.av, is_active: b.checked }); toast(b.checked ? "Produto visível no app" : "Produto escondido do app"); } catch (e) { b.checked = !b.checked; toast(errMsg(e), true); } });
    $$("[data-ed]", g).forEach(b => b.onclick = () => productForm(find(b.dataset.ed), cats)); };
  $$("[data-pc]", el).forEach(b => b.onclick = () => { AD.pc = b.dataset.pc; $$("[data-pc]", el).forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  $("#pr-q").oninput = e => { AD.pq = e.target.value; draw(); };
  $("#pr-new").onclick = () => productForm({}, cats);
  $("#pr-cats").onclick = () => categoriesSheet(cats);
  draw();
}
function categoriesSheet(cats) {
  const sh = openSheet(`<div class="sheet-head"><h2>Categorias</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <p class="muted">A ordem define como as categorias aparecem no app do cliente.</p>
    <div class="list">${cats.map(c => `<div class="row" style="flex-wrap:nowrap;padding:6px 0"><input class="input" data-cn="${c.id}" value="${esc(c.name)}" style="flex:1"><input class="input num" data-cs="${c.id}" value="${c.sort}" style="width:70px" aria-label="Ordem"><button class="btn sm ghost" data-cdel="${c.id}" style="color:var(--bad)">Excluir</button></div>`).join("")}</div>
    <div class="row"><input class="input" id="cat-new" placeholder="Nova categoria (ex.: Doces)" style="flex:1;min-width:160px"><button class="btn" id="cat-add">Adicionar</button></div>
    <button class="btn primary block" id="cat-save">Salvar</button>`);
  const el = sh.el;
  $("#cat-add", el).onclick = e => busy(e.currentTarget, async () => { const n = $("#cat-new", el).value.trim(); if (!n) return; await API.saveCategory({ name: n, sort: cats.length + 1 }); sh.close(); renderView(); categoriesSheet(await API.categories()); });
  $("#cat-save", el).onclick = e => busy(e.currentTarget, async () => { for (const c of cats) await API.saveCategory({ id: c.id, name: $(`[data-cn="${c.id}"]`, el).value.trim() || c.name, sort: Number($(`[data-cs="${c.id}"]`, el).value) || 0 }); toast("Categorias salvas"); sh.close(); renderView(); });
  $$("[data-cdel]", el).forEach(b => b.onclick = async () => { sh.close(); if (await confirmSheet("Excluir categoria?", "Os produtos dela ficam sem categoria, mas não são apagados.", "Excluir", true)) { await API.deleteCategory(b.dataset.cdel); renderView(); } });
}
function productForm(p, cats) {
  const isNew = !p.id; p = { track_stock: true, is_active: true, stock: 0, low_stock_alert: 5, unit_label: "unidade", ...p };
  let img = p.image_url || null;
  const sh = openSheet(`<div class="sheet-head"><h2>${isNew ? "Novo produto" : "Editar produto"}</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <form id="pf" style="display:flex;flex-direction:column;gap:12px">
    <div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div id="pf-img" style="width:96px;height:96px;border-radius:16px;overflow:hidden;flex:none;position:relative">${productThumb({ ...p, name: p.name || "Novo", image_url: img })}</div>
      <label class="drop" style="flex:1"><input id="pf-file" type="file" accept="image/*">Trocar foto<br><span class="faint" style="font-size:.8rem">Foto quadrada fica melhor no app.</span></label></div>
    <div class="grid2"><div class="field"><label for="pf-code">Código</label><input class="input" id="pf-code" value="${esc(p.code || "")}" placeholder="Automático"></div>
      <div class="field" style="grid-column:span 1"><label for="pf-name">Nome *</label><input class="input" id="pf-name" required value="${esc(p.name || "")}"></div></div>
    <div class="field"><label for="pf-desc">Descrição</label><textarea class="input" id="pf-desc">${esc(p.description || "")}</textarea></div>
    <div class="grid2"><div class="field"><label for="pf-price">Preço de venda *</label><input class="input num" id="pf-price" inputmode="decimal" required value="${moneyInput(p.price)}"></div>
      <div class="field"><label for="pf-cost">Custo (para o lucro)</label><input class="input num" id="pf-cost" inputmode="decimal" value="${moneyInput(p.cost)}"></div></div>
    <div class="grid2"><div class="field"><label for="pf-cat">Categoria</label><select class="input" id="pf-cat"><option value="">Sem categoria</option>${cats.map(c => `<option value="${c.id}" ${c.id === p.category_id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></div>
      <div class="field"><label for="pf-unit">Vendido por</label><input class="input" id="pf-unit" list="pf-units" value="${esc(p.unit_label)}"><datalist id="pf-units"><option value="unidade"><option value="cento"><option value="kit"><option value="combo"><option value="porção"></datalist></div></div>
    <label class="switch"><span><b>É combo ou kit</b><br><span class="faint" style="font-size:.85rem">Aparece com o que vem dentro</span></span><input type="checkbox" id="pf-combo" ${p.is_combo ? "checked" : ""}></label>
    <div class="field" id="pf-items-w" ${p.is_combo ? "" : "hidden"}><label for="pf-items">O que vem no combo/kit</label><input class="input" id="pf-items" value="${esc(p.combo_items || "")}" placeholder="Ex.: 25 coxinhas, 25 kibes, 1 refri 2L"></div>
    <label class="switch"><span><b>Controlar estoque</b><br><span class="faint" style="font-size:.85rem">Quando zera, o app mostra Esgotado na hora</span></span><input type="checkbox" id="pf-track" ${p.track_stock ? "checked" : ""}></label>
    <div class="grid2" id="pf-stock-w" ${p.track_stock ? "" : "hidden"}><div class="field"><label for="pf-stock">Estoque agora</label><input class="input num" id="pf-stock" type="number" min="0" value="${p.stock}"></div>
      <div class="field"><label for="pf-alert">Avisar quando ficar abaixo de</label><input class="input num" id="pf-alert" type="number" min="0" value="${p.low_stock_alert}"></div></div>
    <label class="switch"><span><b>Destaque na tela inicial</b></span><input type="checkbox" id="pf-feat" ${p.is_featured ? "checked" : ""}></label>
    <label class="switch"><span><b>Disponível no app</b></span><input type="checkbox" id="pf-active" ${p.is_active ? "checked" : ""}></label>
    <button class="btn primary block" id="pf-go" type="submit" style="min-height:50px">Salvar produto</button>
    ${isNew ? "" : `<button class="btn ghost block" type="button" id="pf-del" style="color:var(--bad)">Excluir produto</button>`}</form>`);
  const f = sh.el;
  $("#pf-combo", f).onchange = e => $("#pf-items-w", f).hidden = !e.target.checked;
  $("#pf-track", f).onchange = e => $("#pf-stock-w", f).hidden = !e.target.checked;
  $("#pf-file", f).onchange = async e => { const file = e.target.files[0]; if (!file) return;
    $("#pf-img", f).innerHTML = `<div class="ph" style="width:96px;height:96px;font-size:.8rem">Enviando…</div>`;
    try { img = await API.upload(await shrinkImage(file, 900)); $("#pf-img", f).innerHTML = `<img src="${esc(img)}" alt="" style="width:96px;height:96px;object-fit:cover">`; }
    catch (x) { toast(errMsg(x), true); } };
  $("#pf-del", f) && ($("#pf-del", f).onclick = async () => { sh.close();
    if (await confirmSheet(`Excluir ${p.name}?`, "O produto sai do cardápio e do sistema. Pedidos antigos continuam com o nome dele. Se só quer esconder, desligue “Disponível no app”.", "Excluir", true)) {
      try { await API.deleteProduct(p.id); toast("Produto excluído"); renderView(); } catch (x) { toast(errMsg(x), true); } } });
  $("#pf", f).onsubmit = e => { e.preventDefault(); busy($("#pf-go", f), async () => {
    const price = parseMoney($("#pf-price", f).value);
    await API.saveProduct({ id: p.id, code: $("#pf-code", f).value.trim() || null, name: $("#pf-name", f).value.trim(), description: $("#pf-desc", f).value.trim() || null, price, cost: parseMoney($("#pf-cost", f).value),
      category_id: $("#pf-cat", f).value || null, unit_label: $("#pf-unit", f).value.trim() || "unidade", is_combo: $("#pf-combo", f).checked, combo_items: $("#pf-items", f).value.trim() || null,
      track_stock: $("#pf-track", f).checked, ...(isNew || Number($("#pf-stock", f).value || 0) !== Number(p.stock) ? { stock: Number($("#pf-stock", f).value || 0) } : {}), low_stock_alert: Number($("#pf-alert", f).value || 0),
      is_featured: $("#pf-feat", f).checked, is_active: $("#pf-active", f).checked, image_url: img, sort: p.sort || 0 });
    toast("Produto salvo. Já aparece no app."); sh.close(); if (AD.view === "produtos") renderView(); }); };
}

/* ================= STORIES ================= */
async function vStories(el) {
  const all = await API.stories(); const now = new Date();
  const live = all.filter(s => new Date(s.expires_at) > now), old = all.filter(s => new Date(s.expires_at) <= now).slice(0, 12);
  el.innerHTML = head("Stories", "Fotos e vídeos curtos que aparecem no topo do app do cliente") + `<div class="st-grid">
    <div class="card"><div class="card-h"><h3>${ICON.story}Novo story</h3></div>
      <div class="phone" id="st-prev"><span class="pbars"><i></i></span><div class="pempty">A pré-visualização aparece aqui</div></div>
      <label class="drop"><input id="st-file" type="file" accept="image/*,video/mp4,video/webm,video/quicktime">Escolher foto ou vídeo<br><span class="faint" style="font-size:.8rem">Vídeo de até 15 segundos e 15 MB, em pé</span></label>
      <div class="field"><label for="st-cap">Legenda</label><input class="input" id="st-cap" maxlength="80" placeholder="Ex.: Coxinha saindo agora às 16h"></div>
      <div class="field"><label for="st-h">Fica no ar por</label><select class="input" id="st-h"><option value="6">6 horas</option><option value="12">12 horas</option><option value="24" selected>24 horas</option><option value="48">2 dias</option></select></div>
      ${AD.s?.wa_story_ask !== false ? `<label class="optin"><input type="checkbox" id="st-wa"><span>Também avisar os clientes no WhatsApp com esta imagem</span></label>` : ""}
      <button class="btn primary block" id="st-go">Publicar no app</button></div>
    <div style="display:flex;flex-direction:column;gap:18px;min-width:0">
      <div class="card"><div class="card-h"><h3>No ar agora</h3><span class="faint">${live.length}</span></div>${live.length ? `<div class="st-list">${live.map(s => stItem(s)).join("")}</div>` : `<p class="muted">Nenhum story no ar. Poste a fornada do dia.</p>`}</div>
      ${old.length ? `<div class="card"><div class="card-h"><h3>Expirados</h3></div><div class="st-list">${old.map(s => stItem(s, true)).join("")}</div></div>` : ""}</div></div>`;
  let file;
  const prev = () => { const p = $("#st-prev"); const cap = esc($("#st-cap").value);
    p.innerHTML = `<span class="pbars"><i></i></span>${file ? (file.type.startsWith("video") ? `<video src="${URL.createObjectURL(file)}" autoplay muted loop playsinline></video>` : `<img src="${URL.createObjectURL(file)}" alt="">`) : `<div class="pempty">A pré-visualização aparece aqui</div>`}${cap ? `<div class="pcap">${cap}</div>` : ""}`; };
  $("#st-file").onchange = async e => { file = e.target.files[0];
    if (file && file.type.startsWith("video")) {
      // vídeo curto e leve: economiza o espaço e o tráfego do plano grátis
      if (file.size > 15e6) { toast("Vídeo muito pesado. Use um de até 15 MB (grave em 720p).", true); file = null; e.target.value = ""; }
      else { const dur = await new Promise(r => { const v = document.createElement("video"); v.preload = "metadata"; v.onloadedmetadata = () => r(v.duration); v.onerror = () => r(0); v.src = URL.createObjectURL(file); });
        if (dur > 20) { toast(`Vídeo com ${Math.round(dur)} segundos. Use um de até 15 segundos.`, true); file = null; e.target.value = ""; } } }
    prev(); };
  $("#st-cap").oninput = prev;
  $("#st-go").onclick = e => busy(e.currentTarget, async () => { if (!file) { toast("Escolha uma foto ou vídeo.", true); return; }
    const isVid = file.type.startsWith("video");
    const url = await API.upload(isVid ? file : await shrinkImage(file, 1280));
    const cap = $("#st-cap").value.trim(), toWa = $("#st-wa")?.checked;
    await API.addStory({ image_url: url, caption: cap, hours: Number($("#st-h").value), media_type: isVid ? "video" : "image" });
    toast("Story publicado no app");
    if (toWa) { AD.msgPreset = { text: cap, image: isVid ? null : url, kind: "story" }; AD.mt = "promo"; go("mensagens"); } else renderView(); });
  $$("[data-del]", el).forEach(b => b.onclick = () => busy(b, async () => { await API.deleteStory(b.dataset.del); renderView(); }));
}
const stItem = (s, exp) => `<figure class="st-item ${exp ? "exp" : ""}" style="margin:0">${s.media_type === "video" ? `<video src="${esc(s.image_url)}" muted playsinline preload="metadata"></video>` : `<img src="${esc(s.image_url)}" alt="">`}
  <figcaption class="info"><b>${esc(s.caption || "Sem legenda")}</b><span>${exp ? "Expirou " : "No ar até "}${fmtDT(s.expires_at)}</span></figcaption><button class="btn sm danger del" data-del="${s.id}">Apagar</button></figure>`;

/* ================= CONFIGURAÇÕES ================= */
async function vAjustes(el) {
  const s = AD.s = await API.settings();
  AD.cfg = { receipt_font: "mono", receipt_font_size: 100, receipt_show_unit: true, receipt_show_fiscal: true, ...s }; AD.stab ||= "loja";
  const T = [["loja", "Loja"], ["entrega", "Entrega e frete"], ["pagamento", "Pagamentos"], ["recibo", "Recibo e avisos"], ["whatsapp", "WhatsApp"], ["divulgar", "Link do app"], ["conta", "Conta"]];
  el.innerHTML = head("Configurações", "Dados da loja, entrega, pagamentos e divulgação", `<button class="btn primary" id="aj-save">Salvar alterações</button>`) + `
    <div class="set-grid"><nav class="set-nav">${T.map(([k, l]) => `<button data-st="${k}" aria-current="${AD.stab === k}">${l}</button>`).join("")}</nav><div class="card" id="aj-body"></div></div>`;
  const C = AD.cfg;
  const f = (k, label, attrs = "", fmt) => `<div class="field"><label for="aj-${k}">${label}</label><input class="input" id="aj-${k}" data-k="${k}" ${fmt ? `data-m="1"` : ""} value="${esc(fmt ? moneyInput(C[k]) : C[k] ?? "")}" ${attrs}></div>`;
  const sw = (k, label, sub = "") => `<label class="switch"><span><b>${label}</b>${sub ? `<br><span class="faint" style="font-size:.85rem">${sub}</span>` : ""}</span><input type="checkbox" data-k="${k}" ${C[k] ? "checked" : ""}></label>`;
  const clientUrl = CLIENT_URL();
  const draw = () => {
    const b = $("#aj-body");
    b.innerHTML = {
      loja: `<div class="card-h"><h3>Loja</h3></div><div class="grid2">${f("store_name", "Nome")}${f("whatsapp", "WhatsApp da loja", 'inputmode="tel" placeholder="(00) 00000-0000"')}</div>${f("tagline", "Frase da loja")}
        <div class="grid2">${f("opening_hours", "Horário de funcionamento (texto do app)")}${f("prep_minutes", "Tempo de preparo (min)", 'type="number" min="5"')}</div>
        ${sw("is_open", "Loja aberta para pedidos", "Desligue para pausar o app")}${f("pause_message", "Mensagem quando estiver fechada")}
        <hr class="hr"><div class="card-h"><h3>Mesas</h3></div>
        <div class="grid2">${f("table_count", "Quantas mesas a loja tem", 'type="number" min="0" max="99"')}<div></div></div>
        <p class="faint" style="font-size:.85rem">Na nova venda você escolhe a mesa. Contas abertas aparecem em Vendas › Aguardando pagamento. Coloque 0 se não atende em mesas.</p>`,
      entrega: `<div class="card-h"><h3>Endereço de saída</h3></div><p class="muted" style="font-size:.9rem">O frete é calculado a partir deste ponto. Digite o endereço completo com cidade e toque em Localizar.</p>
        ${f("address", "Endereço completo")}<div class="row"><button class="btn" id="aj-geo" type="button">Localizar no mapa</button><span id="aj-geo-r" class="faint" style="font-size:.85rem">${C.lat != null ? `Localizado: ${Number(C.lat).toFixed(5)}, ${Number(C.lng).toFixed(5)}` : "Ainda não localizado: entregas ficam desligadas até localizar."}</span></div>
        <div class="grid2">${f("lat", "Latitude", 'inputmode="decimal"')}${f("lng", "Longitude", 'inputmode="decimal"')}</div><hr class="hr">
        <div class="card-h"><h3>Taxas</h3></div>${sw("delivery_enabled", "Fazer entregas")}${sw("pickup_enabled", "Permitir retirada na loja")}
        <div class="grid2">${f("delivery_base_fee", "Taxa mínima (R$)", 'inputmode="decimal"', 1)}${f("delivery_included_km", "Km incluídos na taxa", 'inputmode="decimal"')}</div>
        <div class="grid2">${f("delivery_per_km", "Valor por km a mais (R$)", 'inputmode="decimal"', 1)}${f("delivery_max_km", "Distância máxima (km)", 'inputmode="decimal"')}</div>
        <div class="grid2">${f("delivery_min_order", "Pedido mínimo p/ entrega (R$)", 'inputmode="decimal"', 1)}${f("free_delivery_over", "Frete grátis acima de (R$)", 'inputmode="decimal" placeholder="Sem frete grátis"', 1)}</div>
        <div class="box"><span class="lbl">Quanto o cliente paga de frete</span><div id="aj-sim"></div><span class="faint" style="font-size:.8rem">Distância medida pelas ruas, arredondada para cima de 50 em 50 centavos.</span></div>`,
      pagamento: `<div class="card-h"><h3>Formas de pagamento</h3></div>${sw("accept_pix", "Aceitar Pix")}<div class="grid2">${f("pix_key", "Chave Pix")}${f("pix_name", "Nome do recebedor")}</div>
        ${sw("accept_cash", "Aceitar dinheiro")}${sw("accept_card_on_delivery", "Aceitar cartão na entrega ou retirada")}<hr class="hr">
        <div class="card-h"><h3>Mercado Pago (pagamento online)</h3></div><p class="muted" style="font-size:.9rem">Espaço pronto para ligar o Mercado Pago. Falta colocar a chave pública aqui e o Access Token no servidor.</p>
        ${f("mp_public_key", "Chave pública (Public Key)", 'placeholder="APP_USR-…"')}${sw("mp_enabled", "Mostrar “Pagar online” no app", C.mp_public_key ? "" : "Ligue só depois de configurar o Mercado Pago")}`,
      recibo: `<div class="card-h"><h3>Aviso de pedido novo</h3></div>
        <p class="muted" style="font-size:.9rem">Quando chega um pedido pelo app, o painel toca este som e abre a janela para aceitar.</p>
        <div class="field"><label for="aj-snd">Som</label><div class="row" style="flex-wrap:nowrap"><select class="input" id="aj-snd" data-k="alert_sound" style="flex:1">${Object.entries(SOUNDS).map(([k, [l]]) => `<option value="${k}" ${C.alert_sound === k ? "selected" : ""}>${l}</option>`).join("")}</select>
          <button class="btn" type="button" id="aj-play">Ouvir</button></div></div>
        <div class="field"><label for="aj-vol">Volume</label><input type="range" id="aj-vol" min="0.1" max="1" step="0.05" value="${Number(C.alert_volume ?? .8)}" style="accent-color:var(--accent)"></div>
        ${sw("alert_repeat", "Tocar de novo até aceitar", "Repete a cada 5 segundos enquanto houver pedido esperando")}
        <hr class="hr"><div class="card-h"><h3>Recibo</h3></div>
        ${sw("receipt_auto", "Imprimir recibo automaticamente", "Ao aceitar o pedido, o recibo sai sozinho. Desligado, o painel pergunta se quer imprimir.")}
        <div class="grid2"><div class="field"><label for="aj-rw">Largura do papel</label><select class="input" id="aj-rw" data-k="receipt_width"><option value="80" ${Number(C.receipt_width) !== 58 ? "selected" : ""}>80 mm (mais comum)</option><option value="58" ${Number(C.receipt_width) === 58 ? "selected" : ""}>58 mm (bobina pequena)</option></select></div>
          <div class="field"><label for="aj-rc">Vias</label><select class="input" id="aj-rc" data-k="receipt_copies">${[1, 2, 3].map(n => `<option value="${n}" ${Number(C.receipt_copies) === n ? "selected" : ""}>${n} via${n > 1 ? "s" : ""}</option>`).join("")}</select></div></div>
        <div class="rc-set"><div class="rc-form">
          <div class="card-h" style="margin-top:6px"><h3>Letra do cupom</h3></div>
          <div class="field"><label for="aj-rf">Fonte</label><select class="input" id="aj-rf" data-k="receipt_font">${Object.entries(RECEIPT_FONTS).map(([k, [l]]) => `<option value="${k}" ${C.receipt_font === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="field"><label for="aj-rs">Tamanho da letra: <b id="aj-rs-v">${Number(C.receipt_font_size) || 100}%</b></label><input type="range" id="aj-rs" data-k="receipt_font_size" min="70" max="180" step="5" value="${Number(C.receipt_font_size) || 100}" style="accent-color:var(--accent)"></div>
          ${sw("receipt_bold", "Letra em negrito", "Ajuda quando a impressora imprime fraco ou apagado")}
          <div class="card-h" style="margin-top:6px"><h3>Dados impressos</h3></div>
          ${f("receipt_title", "Nome no topo do cupom", `placeholder="${esc(C.store_name || "Bruno Salgados")}"`)}
          <div class="field"><label for="aj-rh">Linhas abaixo do nome</label><textarea class="input" id="aj-rh" data-k="receipt_header" rows="4" placeholder="CNPJ 00.000.000/0001-00&#10;${esc(C.address || "Rua, número, bairro")}&#10;WhatsApp ${esc(C.whatsapp || "(19) 99999-0000")}">${esc(C.receipt_header || "")}</textarea>
            <span class="faint" style="font-size:.8rem">Uma informação por linha (CNPJ, endereço, telefone, Instagram…). Em branco, sai o endereço e o WhatsApp da loja.</span></div>
          ${f("receipt_footer", "Mensagem no fim do cupom")}
          ${sw("receipt_show_unit", "Mostrar o preço de cada unidade", "Desligado, cada item ocupa uma linha só")}
          ${sw("receipt_show_fiscal", "Mostrar “Não é documento fiscal”")}
        </div><div class="rc-live"><span class="lbl">Prévia do cupom</span><div class="rcpt-prev"><iframe title="Prévia do cupom" id="aj-rlive"></iframe></div></div></div>
        <div class="row"><button class="btn" type="button" id="aj-rprev">Ver cupom grande</button><button class="btn ghost" type="button" id="aj-rtest">Imprimir teste</button></div>
        <div class="box" style="font-size:.86rem;color:var(--fg-2)"><b style="color:var(--fg)">Sobre a impressora</b>
          <span>Funciona com impressora térmica (USB, rede ou Bluetooth) instalada neste computador e escolhida como padrão. Para o recibo sair sem a janela de confirmação do navegador, abra o painel no Google Chrome com a impressão silenciosa ligada (atalho com a opção --kiosk-printing).</span>
          <span>Maquininhas de cartão (Stone, PagSeguro, Cielo e outras) só imprimem pelo aplicativo delas; um site não consegue mandar o recibo para elas.</span></div>`,
      whatsapp: `<div class="card-h"><h3>Textos das mensagens</h3></div>
        <div class="field"><label for="aj-wpt">Promoções e novidades</label><textarea class="input" id="aj-wpt" data-k="wa_promo_text" rows="3">${esc(C.wa_promo_text || "")}</textarea><span class="faint" style="font-size:.8rem">Use {nome}, {loja}, {mensagem} (o que você escrever na hora) e {link} (o app).</span></div>
        <div class="field"><label for="aj-wdt">Cobrança de fiado</label><textarea class="input" id="aj-wdt" data-k="wa_debt_text" rows="3">${esc(C.wa_debt_text || "")}</textarea><span class="faint" style="font-size:.8rem">Use {nome}, {valor} (saldo do cliente), {pix} e {loja}.</span></div>
        ${sw("wa_story_ask", "Oferecer envio no WhatsApp ao postar story", "Depois de publicar um story, o painel pergunta se quer avisar os clientes")}
        <hr class="hr"><div class="card-h"><h3>Como as mensagens saem</h3></div>
        <div class="seg" role="group"><button type="button" data-wm="manual" aria-pressed="${C.wa_mode !== "api"}">Pelo meu WhatsApp</button><button type="button" data-wm="api" aria-pressed="${C.wa_mode === "api"}">Automático (API oficial)</button></div>
        ${C.wa_mode !== "api" ? `<p class="muted" style="font-size:.9rem">Funciona agora, sem custo: o painel monta a mensagem de cada cliente e abre o seu WhatsApp (ou WhatsApp Business) já com o texto. Você só aperta enviar, um por um.</p>`
        : `<p class="muted" style="font-size:.9rem">As mensagens saem sozinhas, para todos de uma vez, pelo WhatsApp Business Platform da Meta. Para ligar:</p>
          <ol class="steps"><li>Crie uma conta no Gerenciador de Negócios da Meta e ative o WhatsApp Business Platform com um número só para isso (ele deixa de funcionar no app comum).</li>
          <li>Cadastre dois modelos de mensagem e espere a Meta aprovar: um de <b>marketing</b> para promoções (com imagem no topo e as variáveis nome e mensagem) e um de <b>utilidade</b> para cobrança (nome, valor e Pix).</li>
          <li>Coloque abaixo o nome dos dois modelos e o ID do número.</li>
          <li>No Supabase, em Edge Functions › Secrets, adicione WA_TOKEN (token permanente) e WA_PHONE_ID. O envio já está programado na função whatsapp-send.</li></ol>
          <div class="grid2">${f("wa_phone_id", "ID do número (Phone number ID)")}${f("wa_promo_template", "Modelo de promoção")}</div>${f("wa_debt_template", "Modelo de cobrança")}
          <p class="faint" style="font-size:.82rem">A Meta cobra por mensagem entregue (marketing custa mais que utilidade) e só permite promoção para quem aceitou receber.</p>`}`,
      divulgar: `<div class="card-h"><h3>Link do app para os clientes</h3></div><p class="muted">Coloque no perfil do WhatsApp Business, no Instagram e no Google Meu Negócio. No celular, o cliente pode adicionar o app à tela inicial.</p>
        <code style="word-break:break-all;user-select:all;background:var(--surface-2);padding:12px;border-radius:12px">${esc(clientUrl)}</code><button class="btn" id="aj-copy" type="button">Copiar link</button>`,
      conta: `<div class="card-h"><h3>Acesso ao painel</h3></div><p class="muted">Você entra com <b>${esc(AD.user?.email || "")}</b>.</p>
        <div class="field"><label for="ac-mail">Vincular o seu e-mail profissional</label><div class="row" style="flex-wrap:nowrap"><input class="input" id="ac-mail" type="email" placeholder="voce@seunegocio.com.br" style="flex:1"><button class="btn" type="button" id="ac-mail-go">Vincular</button></div>
          <span class="faint" style="font-size:.8rem">Chega um link de confirmação no e-mail novo. Depois de confirmar, você passa a entrar com ele (e pode recuperar a senha por ele).</span></div>
        <hr class="hr"><div class="grid2"><div class="field"><label for="ac-p1">Nova senha</label><input class="input" id="ac-p1" type="password" autocomplete="new-password" minlength="8"></div>
          <div class="field"><label for="ac-p2">Repita a nova senha</label><input class="input" id="ac-p2" type="password" autocomplete="new-password"></div></div>
        <button class="btn" type="button" id="ac-pass-go" style="align-self:flex-start">Trocar senha</button>
        <p class="faint" style="font-size:.85rem">${API.mode === "demo" ? "Modo demonstração: nada disso é salvo." : "Conectado ao banco de dados da loja."}</p>
        <hr class="hr"><div class="card-h"><h3>Saúde do sistema</h3></div>
        ${(() => { const y = AD.sys || {}, ago = t => t ? fmtDT(t) : "ainda não rodou", ok = (t, d) => t && Date.now() - new Date(t) < d * 864e5;
          const row = (l, t, d, help) => `<div class="calc-row"><span>${l}<br><span class="faint" style="font-size:.8rem">${help}</span></span><b style="color:var(${ok(t, d) ? "--ok, #3fb950" : "--danger, #f85149"})">${ago(t)}</b></div>`;
          return row("Vigia automático", y.last_ping, 2, "Acessa o banco 1 vez por dia para o plano grátis nunca pausar") +
            row("Último backup", y.last_backup, 9, "Cópia criptografada toda semana no GitHub") +
            `<p class="faint" style="font-size:.8rem">Stories vencidos há mais de 2 dias são apagados sozinhos para economizar espaço.</p>`; })()}`
    }[AD.stab];
    $$("[data-k]", b).forEach(i => i.oninput = i.onchange = () => { const k = i.dataset.k; C[k] = i.type === "checkbox" ? i.checked : i.dataset.m ? (i.value.trim() === "" ? null : parseMoney(i.value)) : i.value; sim(); live(); });
    const live = () => { const fr = $("#aj-rlive", b); if (!fr) return; $("#aj-rs-v", b) && ($("#aj-rs-v", b).textContent = (Number(C.receipt_font_size) || 100) + "%");
      fr.srcdoc = receiptHTML(sample(), { ...AD.s, ...C, receipt_copies: 1 }); };
    const sim = () => { const box = $("#aj-sim", b); if (!box) return; const t = { delivery_base_fee: Number(C.delivery_base_fee || 0), delivery_included_km: Number(String(C.delivery_included_km).replace(",", ".")) || 0, delivery_per_km: Number(C.delivery_per_km || 0), delivery_max_km: Number(String(C.delivery_max_km).replace(",", ".")) || 0, free_delivery_over: null };
      box.innerHTML = [1, 3, 5, 8, 12].map(k => { const r = calcFee(t, k, 0); return `<div class="calc-row"><span>${k} km</span><b class="num">${r.ok ? money(r.fee) : "fora da área"}</b></div>`; }).join(""); };
    sim();
    $("#ac-mail-go", b) && ($("#ac-mail-go", b).onclick = e => busy(e.currentTarget, async () => { const m = $("#ac-mail", b).value.trim();
      if (!/^\S+@\S+\.\S+$/.test(m)) return toast("Digite um e-mail válido.", true); await API.changeEmail(m); toast("Enviamos um link de confirmação para " + m); }));
    $("#ac-pass-go", b) && ($("#ac-pass-go", b).onclick = e => busy(e.currentTarget, async () => { const a = $("#ac-p1", b).value, c = $("#ac-p2", b).value;
      if (a.length < 8) return toast("A senha precisa ter pelo menos 8 caracteres.", true); if (a !== c) return toast("As duas senhas não são iguais.", true);
      await API.changePassword(a); $("#ac-p1", b).value = $("#ac-p2", b).value = ""; toast("Senha trocada"); }));
    $$("[data-wm]", b).forEach(x => x.onclick = () => { C.wa_mode = x.dataset.wm; draw(); });
    $("#aj-play", b) && ($("#aj-play", b).onclick = () => playAlert(C.alert_sound, C.alert_volume));
    $("#aj-vol", b) && ($("#aj-vol", b).oninput = e => { C.alert_volume = Number(e.target.value); });
    $("#aj-vol", b) && ($("#aj-vol", b).onchange = () => playAlert(C.alert_sound, C.alert_volume));
    function sample() { return ({ code: 1234, created_at: new Date().toISOString(), fulfillment: "entrega", customer_name: "Maria Souza", customer_phone: "(19) 99999-0000", address: "Rua das Acácias, 120 · Jardim Primavera", address_ref: "Portão verde",
      order_items: [{ qty: 6, name: "Coxinha de frango", unit_price: 10, total: 60 }, { qty: 1, name: "Refrigerante lata", unit_price: 6, total: 6 }], subtotal: 66, delivery_fee: 7, discount: 0, total: 73, payment_method: "dinheiro", change_for: 100, payment_status: "pendente", notes: "Tocar a campainha" }); }
    live();
    const withCfg = fn => { const prev = AD.s; AD.s = { ...AD.s, ...C }; try { fn(); } finally { AD.s = prev; } };
    $("#aj-rprev", b) && ($("#aj-rprev", b).onclick = () => withCfg(() => previewReceipt(sample())));
    $("#aj-rtest", b) && ($("#aj-rtest", b).onclick = () => withCfg(() => printReceipt(sample())));
    $("#aj-copy", b) && ($("#aj-copy", b).onclick = () => copyText(clientUrl));
    $("#aj-geo", b) && ($("#aj-geo", b).onclick = e => busy(e.currentTarget, async () => {
      if (API.mode === "demo") { toast("Na demonstração a localização é simulada.", true); return; }
      const r = await geocodeFree(C.address || ""); C.lat = +r.lat.toFixed(6); C.lng = +r.lng.toFixed(6); draw(); $("#aj-geo-r").textContent = "Encontrado: " + r.label + ". Confira e salve."; }));
  };
  $$("[data-st]", el).forEach(b => b.onclick = () => { AD.stab = b.dataset.st; $$("[data-st]", el).forEach(x => x.setAttribute("aria-current", x === b)); draw(); });
  $("#aj-save").onclick = e => busy(e.currentTarget, async () => {
    const num = v => v === "" || v == null ? null : Number(String(v).replace(",", "."));
    const { id, updated_at, ...patch } = C;
    Object.assign(patch, { table_count: Math.max(0, Math.min(99, parseInt(C.table_count) || 0)), receipt_width: Number(C.receipt_width) || 80, receipt_copies: Number(C.receipt_copies) || 1,
      receipt_font_size: Math.max(70, Math.min(180, Number(C.receipt_font_size) || 100)), receipt_font: RECEIPT_FONTS[C.receipt_font] ? C.receipt_font : "mono",
      receipt_title: (C.receipt_title || "").trim() || null, receipt_header: (C.receipt_header || "").trim() || null, alert_volume: Number(C.alert_volume ?? .8), lat: num(C.lat), lng: num(C.lng), prep_minutes: Number(C.prep_minutes) || 30, delivery_included_km: num(C.delivery_included_km) ?? 0, delivery_max_km: num(C.delivery_max_km) ?? 10,
      delivery_base_fee: C.delivery_base_fee ?? 0, delivery_per_km: C.delivery_per_km ?? 0, delivery_min_order: C.delivery_min_order ?? 0, payment_provider: C.mp_public_key ? "mercadopago" : "none" });
    AD.s = await API.saveSettings(patch); toast("Configurações salvas. O app do cliente já foi atualizado."); renderView(); });
  draw();
}

/* ================= AJUDA ================= */
async function vAjuda(el) {
  const faq = [
    ["Como começo o dia?", "<ol><li>Vá em <b>Caixa</b> e toque em Abrir caixa, digitando o troco que está na gaveta.</li><li>Confira o estoque em <b>Produtos</b> e some a fornada do dia.</li><li>Se quiser, poste um story mostrando os salgados saindo.</li></ol>"],
    ["Como vendo no balcão?", "<p>Em <b>Vendas</b>, digite o código (ex.: 001) ou o nome do produto e aperte Enter. Escolha a forma de pagamento e toque em Finalizar venda. A venda entra no caixa e baixa o estoque sozinha.</p>"],
    ["Como lanço uma venda no fiado?", "<p>Em <b>Vendas</b>, escolha a forma de pagamento Fiado e busque o cliente pelo nome. O valor vai para a conta dele. Para receber depois, abra o cliente em <b>Clientes</b> e toque em Receber fiado.</p>"],
    ["Chegou um pedido pelo app. E agora?", "<p>O sino no topo avisa e o pedido aparece em <b>Pedidos</b>. Toque no pedido para ver itens e endereço, avance o status (Em preparo, Saiu, Concluído) e registre o pagamento quando receber.</p>"],
    ["Como fecho o caixa?", "<p>Em <b>Caixa</b>, toque em Fechar caixa, conte o dinheiro da gaveta e digite o valor. O sistema mostra se sobrou ou faltou e guarda o relatório no Histórico.</p>"],
    ["Como o frete é calculado?", "<p>Pela distância nas ruas entre a loja e o cliente: taxa mínima mais o valor por km que passar dos km incluídos. Ajuste os valores em <b>Configurações › Entrega e frete</b>.</p>"],
    ["Um salgado acabou. Como aviso o cliente?", "<p>Zere o estoque em <b>Produtos</b> ou desligue “No app”. O cardápio do cliente mostra Esgotado na hora e o item sai da sacola de quem ainda não finalizou.</p>"],
  ];
  el.innerHTML = head("Ajuda", "Como usar o painel no dia a dia") + `<div class="cols"><div class="card faq">${faq.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q}</summary>${a}</details>`).join("")}</div>
    <div class="card"><div class="card-h"><h3>${ICON.bulb}Atalhos</h3></div><div class="qa-grid">
      <button class="qa" data-go="vendas">${ICON.cart}<b>Nova venda</b><span>Balcão</span></button><button class="qa" data-go="caixa">${ICON.cash}<b>Caixa</b><span>Abrir ou fechar</span></button>
      <button class="qa" data-go="produtos">${ICON.cube}<b>Estoque</b><span>Ajustar quantidades</span></button><button class="qa" data-go="ajustes">${ICON.gear}<b>Configurações</b><span>Frete e pagamentos</span></button></div></div></div>`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
}


/* ======== componentes compartilhados ======== */
function barChart(canvas, labels, data, { money: isMoney = true, highlightLast = true } = {}) {
  if (!window.Chart) { canvas.parentElement.innerHTML = `<p class="muted">Gráfico indisponível sem conexão.</p>`; return; }
  const acc = cssVar("--accent"), soft = cssVar("--accent-soft"), fg2 = cssVar("--fg-2"), line = cssVar("--line");
  const c = new Chart(canvas, { type: "bar", data: { labels, datasets: [{ data, backgroundColor: data.map((_, i) => highlightLast && i === data.length - 1 ? acc : color_mix(acc, .55)),
      hoverBackgroundColor: acc, borderRadius: 4, borderSkipped: "bottom", maxBarThickness: 34, categoryPercentage: .8, barPercentage: .9 }] },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: cssVar("--fg"), titleColor: cssVar("--bg"), bodyColor: cssVar("--bg"), displayColors: false, padding: 10,
        callbacks: { label: x => isMoney ? money(x.raw) : `${x.raw}` } } },
      scales: { x: { grid: { display: false }, ticks: { color: fg2, maxRotation: 0, autoSkip: true, autoSkipPadding: 8, font: { size: 11 } }, border: { color: line } },
        y: { beginAtZero: true, grid: { color: line, drawTicks: false }, border: { display: false }, ticks: { color: fg2, padding: 8, font: { size: 11 }, maxTicksLimit: 5,
          callback: v => isMoney ? (v >= 1000 ? "R$ " + (v / 1000).toLocaleString("pt-BR") + " mil" : "R$ " + v) : v } } } } });
  AD.charts.push(c); return c;
}
function color_mix(hex, a) { const m = hex.replace("#", ""); if (m.length !== 6) return hex; const n = parseInt(m, 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
const barList = (rows, fmt = money) => { const max = Math.max(1, ...rows.map(r => r[1]));
  return rows.length ? `<div class="bar-list">${rows.map(([n, v, extra]) => `<div class="bar-row"><span class="nm" title="${esc(n)}">${esc(n)}</span><span class="track"><span class="fill" style="width:${(v / max * 100).toFixed(1)}%"></span></span><span class="num" style="font-weight:600">${fmt(v)}${extra ? `<span class="faint" style="font-weight:400"> · ${extra}</span>` : ""}</span></div>`).join("")}</div>`
    : `<p class="muted">Sem dados no período.</p>`; };
async function paySheet(o, { thenStatus } = {}) {
  let method = o.payment_method === "fiado" ? "dinheiro" : o.payment_method, cust = null;
  const custs = await API.customers();
  const sh = openSheet(`<div class="sheet-head"><div><h2>Receber pedido nº ${o.code}</h2>${thenStatus ? `<p class="faint" style="margin-top:2px">Registre o pagamento para concluir. Assim o caixa e os relatórios batem.</p>` : ""}</div><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="num" style="font-size:2rem;font-weight:800;font-family:var(--f-display)">${money(o.total)}</div>
    <div class="grid2" id="ps-m"></div><div id="ps-extra"></div>
    <button class="btn primary block" id="ps-go">Confirmar recebimento</button>`);
  const el = sh.el;
  const draw = () => {
    $("#ps-m", el).innerHTML = ["dinheiro", "pix", "cartao_debito", "cartao_credito", "fiado"].map(m => `<button class="btn ${method === m ? "primary" : "ghost"}" data-m="${m}">${METHOD_LABEL[m]}</button>`).join("");
    $$("[data-m]", el).forEach(b => b.onclick = () => { method = b.dataset.m; draw(); });
    $("#ps-extra", el).innerHTML = method === "dinheiro" ? `<div class="field"><label for="ps-rec">Valor recebido</label><input class="input" id="ps-rec" inputmode="decimal" placeholder="${moneyInput(o.change_for || o.total)}"></div><div id="ps-troco" class="muted"></div>`
      : method === "fiado" ? customerPicker(custs, c => { cust = c; }, o.customer_id) : "";
    if (method === "fiado") bindPicker(el, custs, c => cust = c);
    const rec = $("#ps-rec", el); if (rec) rec.oninput = () => { const v = parseMoney(rec.value); $("#ps-troco", el).innerHTML = v >= o.total ? `Troco: <b class="num">${money(v - o.total)}</b>` : ""; };
  };
  draw();
  $("#ps-go", el).onclick = e => busy(e.currentTarget, async () => {
    if (method === "fiado" && !cust && !o.customer_id) { toast("Escolha o cliente do fiado.", true); return; }
    await API.payOrder(o.id, method, cust?.id);
    if (thenStatus) await API.setStatus(o.id, thenStatus);
    toast(thenStatus ? "Pagamento registrado e pedido concluído" : "Pagamento registrado"); sh.close(); renderView(); refreshNav();
  });
}
function customerPicker(custs, _cb, preId) {
  const pre = custs.find(c => c.id === preId);
  return `<div class="field"><label for="cp-q">Cliente</label><input class="input" id="cp-q" placeholder="Digite o nome, telefone ou CPF" autocomplete="off" value="${esc(pre?.name || "")}">
    <div id="cp-sel" class="faint" style="font-size:.85rem">${pre ? `Selecionado: ${esc(pre.name)} · saldo ${money(pre.balance)}` : "Nenhum cliente escolhido"}</div><div id="cp-res"></div></div>`;
}
function bindPicker(el, custs, cb) {
  const q = $("#cp-q", el), res = $("#cp-res", el);
  q.oninput = () => { const t = q.value.toLowerCase().trim(), d = onlyDigits(t);
    const list = !t ? [] : custs.filter(c => c.name.toLowerCase().includes(t) || (d.length > 2 && (onlyDigits(c.phone).includes(d) || onlyDigits(c.cpf).includes(d)))).slice(0, 8);
    res.innerHTML = list.length ? `<div class="search-res">${list.map(c => `<button type="button" data-c="${c.id}"><span>${esc(c.name)}<br><span class="faint" style="font-size:.8rem">${esc(c.phone || "")}</span></span><span class="num ${c.balance > 0 ? "amt out" : "faint"}">${money(c.balance)}</span></button>`).join("")}</div>`
      : t ? `<p class="faint" style="font-size:.85rem;padding-top:6px">Nenhum cliente com esse nome. Cadastre em Clientes.</p>` : "";
    $$("[data-c]", res).forEach(b => b.onclick = () => { const c = custs.find(x => x.id === b.dataset.c); cb(c); q.value = c.name; res.innerHTML = "";
      $("#cp-sel", el).innerHTML = `Selecionado: <b>${esc(c.name)}</b> · saldo ${money(c.balance)}${c.credit_limit ? ` · limite ${money(c.credit_limit)}` : ""}`; }); };
}
function moveSheet(kind) {
  const t = { sangria: ["Retirada de dinheiro", "Dinheiro que sai da gaveta (depósito, pagamento ao dono)."], suprimento: ["Reforço de troco", "Dinheiro que entra na gaveta para troco."], despesa: ["Despesa", "Compra paga com o dinheiro do caixa (óleo, gás, embalagens)."] }[kind];
  const sh = openSheet(`<div class="sheet-head"><h2>${t[0]}</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div><p class="muted">${t[1]}</p>
    <div class="field"><label for="mv-v">Valor</label><input class="input num" id="mv-v" inputmode="decimal" style="font-size:1.3rem"></div>
    ${kind === "despesa" ? `<div class="field"><label for="mv-m">Pago com</label><select class="input" id="mv-m"><option value="dinheiro">Dinheiro da gaveta</option><option value="pix">Pix</option><option value="cartao_debito">Débito</option></select></div>` : ""}
    <div class="field"><label for="mv-d">Descrição</label><input class="input" id="mv-d" placeholder="${kind === "despesa" ? "Ex.: 2 galões de óleo" : kind === "sangria" ? "Ex.: depósito no banco" : "Ex.: moedas para troco"}"></div>
    <button class="btn primary block" id="mv-go">Lançar</button>`);
  $("#mv-go", sh.el).onclick = e => busy(e.currentTarget, async () => { const v = parseMoney($("#mv-v", sh.el).value); if (v <= 0) { toast("Digite o valor.", true); return; }
    await API.cashMove(kind, v, $("#mv-m", sh.el)?.value || "dinheiro", $("#mv-d", sh.el).value.trim() || t[0]); toast("Lançado no caixa"); sh.close(); renderView(); });
}
function customerForm(c = {}) {
  const sh = openSheet(`<div class="sheet-head"><h2>${c.id ? "Editar cliente" : "Novo cliente"}</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <form id="cf" style="display:flex;flex-direction:column;gap:12px">
    <div class="field"><label for="cf-name">Nome completo *</label><input class="input" id="cf-name" required value="${esc(c.name || "")}"></div>
    <div class="grid2"><div class="field"><label for="cf-phone">Telefone / WhatsApp</label><input class="input" id="cf-phone" inputmode="tel" value="${esc(c.phone || "")}"></div>
      <div class="field"><label for="cf-birth">Nascimento</label><input class="input" id="cf-birth" type="date" value="${esc(c.birth_date || "")}"></div></div>
    <div class="grid2"><div class="field"><label for="cf-cpf">CPF</label><input class="input" id="cf-cpf" inputmode="numeric" value="${esc(c.cpf || "")}"></div>
      <div class="field"><label for="cf-rg">RG (opcional)</label><input class="input" id="cf-rg" value="${esc(c.rg || "")}"></div></div>
    <div class="field"><label for="cf-addr">Endereço</label><input class="input" id="cf-addr" value="${esc(c.address || "")}"></div>
    <div class="field"><label for="cf-limit">Limite de fiado (R$)</label><input class="input num" id="cf-limit" inputmode="decimal" placeholder="Sem limite" value="${moneyInput(c.credit_limit)}"></div>
    <div class="field"><label for="cf-notes">Observações</label><textarea class="input" id="cf-notes" placeholder="Ex.: paga sempre no dia 5">${esc(c.notes || "")}</textarea></div>
    <label class="switch"><span><b>Aceita receber promoções no WhatsApp</b><br><span class="faint" style="font-size:.85rem">Marque só se o cliente concordou</span></span><input type="checkbox" id="cf-optin" ${c.whatsapp_optin ? "checked" : ""}></label>
    <p class="faint" style="font-size:.8rem">Documentos ficam visíveis só para o dono da loja.</p>
    <button class="btn primary block" id="cf-go" type="submit">Salvar cliente</button></form>`);
  $("#cf", sh.el).onsubmit = e => { e.preventDefault(); busy($("#cf-go", sh.el), async () => {
    const lim = $("#cf-limit", sh.el).value.trim();
    await API.saveCustomer({ id: c.id, name: $("#cf-name", sh.el).value.trim(), phone: $("#cf-phone", sh.el).value.trim() || null, birth_date: $("#cf-birth", sh.el).value || null,
      cpf: $("#cf-cpf", sh.el).value.trim() || null, rg: $("#cf-rg", sh.el).value.trim() || null, address: $("#cf-addr", sh.el).value.trim() || null,
      credit_limit: lim ? parseMoney(lim) : null, notes: $("#cf-notes", sh.el).value.trim() || null, whatsapp_optin: $("#cf-optin", sh.el).checked });
    toast("Cliente salvo"); sh.close(); if (AD.view === "clientes") renderView(); }); };
}
function amountSheet(title, def, withMethod, fn) {
  const sh = openSheet(`<div class="sheet-head"><h2>${esc(title)}</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="field"><label for="am-v">Valor</label><input class="input num" id="am-v" inputmode="decimal" style="font-size:1.3rem" value="${def ? moneyInput(def) : ""}"></div>
    ${withMethod ? `<div class="field"><label for="am-m">Forma</label><select class="input" id="am-m">${["dinheiro", "pix", "cartao_debito", "cartao_credito"].map(m => `<option value="${m}">${METHOD_LABEL[m]}</option>`).join("")}</select></div>` : ""}
    <div class="field"><label for="am-d">Descrição</label><input class="input" id="am-d" placeholder="${withMethod ? "Pagamento de fiado" : "Ex.: 10 coxinhas para a obra"}"></div>
    <button class="btn primary block" id="am-go">Confirmar</button>`);
  $("#am-go", sh.el).onclick = e => busy(e.currentTarget, async () => { const v = parseMoney($("#am-v", sh.el).value); if (v <= 0) { toast("Digite o valor.", true); return; }
    await fn(v, $("#am-m", sh.el)?.value, $("#am-d", sh.el).value.trim()); sh.close(); if (AD.view === "clientes") renderView(); });
}
function amountStock(p, set) {
  const sh = openSheet(`<div class="sheet-head"><h2>Estoque de ${esc(p.name)}</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="grid2"><div class="field"><label for="st-v">Quantidade disponível</label><input class="input num" id="st-v" type="number" min="0" value="${p.stock}" style="font-size:1.3rem"></div>
    <div class="field"><label for="st-add">Ou somar fornada</label><input class="input num" id="st-add" type="number" min="0" placeholder="Ex.: 50"></div></div>
    <button class="btn primary block" id="st-go">Salvar</button>`);
  $("#st-go", sh.el).onclick = async () => { const add = Number($("#st-add", sh.el).value || 0);
    try { if (add) { await API.adjustStock(p.id, add); if (AD.view === "produtos") renderView(); } else await set(p.id, Number($("#st-v", sh.el).value)); sh.close(); toast("Estoque atualizado"); } catch (e) { toast(errMsg(e), true); } };
}
function shrinkImage(file, max) {
  return new Promise(res => { const im = new Image(); const url = URL.createObjectURL(file);
    im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)); if (k === 1 && file.size < 400e3) { res(file); return; }
      const c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      c.toBlob(b => res(new File([b], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })), "image/jpeg", .85); URL.revokeObjectURL(url); };
    im.onerror = () => res(file); im.src = url; });
}
async function vRelatorios(el) {
  AD.rp ||= "30";
  const today = startOfDay(new Date()), tomorrow = new Date(today.getTime() + 864e5);
  let from, to = tomorrow;
  if (AD.rp === "custom" && AD.rFrom) { from = startOfDay(new Date(AD.rFrom + "T00:00")); to = new Date(startOfDay(new Date((AD.rTo || dayKey(today)) + "T00:00")).getTime() + 864e5); }
  else from = AD.rp === "hoje" ? today : new Date(today.getTime() - (Number(AD.rp) - 1) * 864e5);
  const span = to - from, pFrom = new Date(from - span);
  const [all, sess, custs] = await Promise.all([API.orders({ from: pFrom, to }), API.cashSessions({ from }), API.customers()]);
  const orders = all.filter(o => new Date(o.created_at) >= from), prev = all.filter(o => new Date(o.created_at) < from);
  const ok = orders.filter(o => validOrder(o) && ["pago", "fiado"].includes(o.payment_status));
  const rev = sumBy(ok, o => o.total), prevRev = sumBy(prev.filter(o => validOrder(o) && ["pago", "fiado"].includes(o.payment_status)), o => o.total);
  const profit = sumBy(ok, o => sumBy(o.order_items || [], i => (i.unit_price - (i.unit_cost || 0)) * i.qty) - Number(o.discount || 0));
  const canc = orders.filter(o => o.status === "cancelado");
  const mv = sess.flatMap(s => s.cash_movements || []).filter(m => new Date(m.created_at) >= from && new Date(m.created_at) < to);
  const desp = sumBy(mv.filter(m => m.kind === "despesa"), m => m.amount), sang = sumBy(mv.filter(m => m.kind === "sangria"), m => m.amount);
  const delta = prevRev ? (rev - prevRev) / prevRev * 100 : null;
  const days = []; for (let d = new Date(from); d < to; d = new Date(d.getTime() + 864e5)) days.push(new Date(d));
  const byDay = days.map(d => { const os = ok.filter(o => dayKey(o.created_at) === dayKey(d)); const m = k => sumBy(os, o => sumBy(payParts(o).filter(x => x.method === k), x => x.amount));
    return { d, n: os.length, rev: sumBy(os, o => o.total), din: m("dinheiro"), pix: m("pix"), card: m("cartao_debito") + m("cartao_credito") + m("mercadopago"), fiado: m("fiado"),
      lucro: sumBy(os, o => sumBy(o.order_items || [], i => (i.unit_price - (i.unit_cost || 0)) * i.qty) - Number(o.discount || 0)),
      desp: sumBy(mv.filter(x => x.kind === "despesa" && dayKey(x.created_at) === dayKey(d)), x => x.amount) }; });
  const pm = {}; ok.forEach(o => payParts(o).forEach(x => pm[x.method] = (pm[x.method] || 0) + Number(x.amount)));
  const top = {}; ok.forEach(o => (o.order_items || []).forEach(i => { top[i.name] ||= { q: 0, v: 0 }; top[i.name].q += i.qty; top[i.name].v += Number(i.total); }));
  const hours = Array.from({ length: 24 }, (_, hh) => ok.filter(o => new Date(o.created_at).getHours() === hh).length);
  const hFirst = Math.max(0, hours.findIndex(x => x > 0)), hLast = 23 - Math.max(0, [...hours].reverse().findIndex(x => x > 0));
  const ch = { app: sumBy(ok.filter(o => o.channel === "app"), o => o.total), bal: sumBy(ok.filter(o => o.channel === "balcao"), o => o.total) };
  const ful = { e: ok.filter(o => o.fulfillment === "entrega").length, r: ok.filter(o => o.fulfillment === "retirada").length, b: ok.filter(o => o.fulfillment === "balcao").length };
  const fees = sumBy(ok, o => o.delivery_fee);
  const label = AD.rp === "hoje" ? "Hoje" : AD.rp === "custom" ? `${fmtDate(from)} a ${fmtDate(to - 1)}` : `Últimos ${AD.rp} dias`;
  el.innerHTML = head("Relatórios", label, `<button class="btn ghost" id="rp-csv">Exportar planilha (CSV)</button>`) + `
    <div class="row"><div class="pills">${[["hoje", "Hoje"], ["7", "7 dias"], ["30", "30 dias"], ["60", "60 dias"], ["90", "90 dias"]].map(([k, l]) => `<button data-rp="${k}" aria-pressed="${AD.rp === k}">${l}</button>`).join("")}</div>
      <div class="row" style="gap:6px"><input class="input" type="date" id="rp-from" value="${AD.rFrom || ""}" aria-label="De" style="width:auto"><input class="input" type="date" id="rp-to" value="${AD.rTo || ""}" aria-label="Até" style="width:auto"><button class="btn" id="rp-go">Ver período</button></div></div>
    <div class="kpis">
      <div class="kpi hero"><span class="eyebrow">Faturamento</span><span class="v">${money(rev)}</span><span class="s">${delta == null ? "sem período anterior para comparar" : (delta >= 0 ? "▲ " : "▼ ") + Math.abs(delta).toFixed(0) + "% vs. período anterior"}</span></div>
      <div class="kpi"><span class="eyebrow">Lucro bruto estimado</span><span class="v">${money(profit)}</span><span class="s">preço − custo dos produtos${rev ? " · margem " + (profit / rev * 100).toFixed(0) + "%" : ""}</span></div>
      <div class="kpi"><span class="eyebrow">Pedidos</span><span class="v num">${ok.length}</span><span class="s">ticket médio ${money(ok.length ? rev / ok.length : 0)}</span></div>
      <div class="kpi"><span class="eyebrow">Despesas do caixa</span><span class="v" style="color:var(--bad)">${money(desp)}</span><span class="s">retiradas ${money(sang)}</span></div>
      <div class="kpi"><span class="eyebrow">Cancelados</span><span class="v num">${canc.length}</span><span class="s">${money(sumBy(canc, o => o.total))} cancelados</span></div>
      <div class="kpi"><span class="eyebrow">Fiado em aberto hoje</span><span class="v">${money(sumBy(custs.filter(c => c.balance > 0), c => c.balance))}</span><span class="s">vendido no fiado no período ${money(pm.fiado || 0)}</span></div>
    </div>
    <div class="card"><div class="card-h"><h3>Faturamento por dia</h3><span class="faint">Passe o dedo ou o mouse nas barras</span></div><div class="chart-box"><canvas id="rp-day" aria-label="Faturamento por dia"></canvas></div></div>
    <div class="cols"><div class="card"><h3>Mais vendidos</h3>${barList(Object.entries(top).sort((a, b) => b[1].q - a[1].q).slice(0, 10).map(([n, v]) => [n, v.q, money(v.v)]), v => v + " un.")}</div>
      <div class="card"><h3>Formas de pagamento</h3>${barList(Object.entries(pm).sort((a, b) => b[1] - a[1]).map(([k, v]) => [METHOD_LABEL[k], v, rev ? (v / rev * 100).toFixed(0) + "%" : ""]))}</div></div>
    <div class="cols"><div class="card"><h3>Horário de pico</h3><div class="chart-box sm"><canvas id="rp-hour" aria-label="Pedidos por hora do dia"></canvas></div></div>
      <div class="card"><h3>Canais</h3>${barList([["App", ch.app, ok.length ? ok.filter(o => o.channel === "app").length + " pedidos" : ""], ["Balcão", ch.bal, ok.filter(o => o.channel === "balcao").length + " pedidos"]])}
        <hr class="hr">${barList([["Entrega", ful.e], ["Retirada", ful.r], ["Balcão", ful.b]], v => v + " pedidos")}
        <p class="faint" style="font-size:.85rem">Taxas de entrega cobradas: <b class="num">${money(fees)}</b></p></div></div>
    <div class="card"><div class="card-h"><h3>Dia a dia</h3></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Dia</th><th class="r">Pedidos</th><th class="r">Faturamento</th><th class="r">Dinheiro</th><th class="r">Pix</th><th class="r">Cartão</th><th class="r">Fiado</th><th class="r">Lucro est.</th><th class="r">Despesas</th></tr></thead>
      <tbody>${byDay.slice().reverse().map(r => `<tr><td>${fmtDateLong(r.d)}</td><td class="r">${r.n}</td><td class="r"><b>${money(r.rev)}</b></td><td class="r">${money(r.din)}</td><td class="r">${money(r.pix)}</td><td class="r">${money(r.card)}</td><td class="r">${money(r.fiado)}</td><td class="r">${money(r.lucro)}</td><td class="r">${money(r.desp)}</td></tr>`).join("")}
      <tr style="background:var(--surface-2)"><td><b>Total</b></td><td class="r"><b>${ok.length}</b></td><td class="r"><b>${money(rev)}</b></td><td class="r">${money(pm.dinheiro || 0)}</td><td class="r">${money(pm.pix || 0)}</td><td class="r">${money((pm.cartao_debito || 0) + (pm.cartao_credito || 0) + (pm.mercadopago || 0))}</td><td class="r">${money(pm.fiado || 0)}</td><td class="r">${money(profit)}</td><td class="r">${money(desp)}</td></tr></tbody></table></div></div>`;
  barChart($("#rp-day"), byDay.map(r => days.length > 14 ? fmtDate(r.d) : r.d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" })), byDay.map(r => n2(r.rev)), { highlightLast: false });
  barChart($("#rp-hour"), hours.slice(hFirst, hLast + 1).map((_, i) => hFirst + i + "h"), hours.slice(hFirst, hLast + 1), { money: false, highlightLast: false });
  $$("[data-rp]", el).forEach(b => b.onclick = () => { AD.rp = b.dataset.rp; renderView(); });
  $("#rp-go").onclick = () => { AD.rFrom = $("#rp-from").value; AD.rTo = $("#rp-to").value; if (!AD.rFrom) return toast("Escolha a data inicial.", true); AD.rp = "custom"; renderView(); };
  $("#rp-csv").onclick = () => {
    const rows = [["Dia", "Pedidos", "Faturamento", "Dinheiro", "Pix", "Cartão", "Fiado", "Lucro estimado", "Despesas"], ...byDay.map(r => [dayKey(r.d), r.n, r.rev, r.din, r.pix, r.card, r.fiado, n2(r.lucro), r.desp].map(String))];
    const csv = rows.map(r => r.map(x => `"${String(x).replace(".", ",")}"`).join(";")).join("\n");
    try { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" })); a.download = `relatorio-bruno-salgados-${dayKey(from)}.csv`; a.click(); } catch {}
    copyText(csv);
  };
}
