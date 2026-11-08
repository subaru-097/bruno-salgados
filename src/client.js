/* ======================= APP DO CLIENTE ======================= */
const CL = { s: null, cats: [], prods: [], stories: [], cart: store.get("cart", {}), cat: null, quote: null, addr: store.get("addr", {}), me: store.get("me", {}) };

function cartLines() {
  return Object.entries(CL.cart).map(([id, qty]) => ({ p: CL.prods.find(x => x.id === id), qty })).filter(l => l.p && l.p.is_active && l.qty > 0);
}
const cartSubtotal = () => cartLines().reduce((a, l) => a + l.p.price * l.qty, 0);
const cartCount = () => cartLines().reduce((a, l) => a + l.qty, 0);
const avail = p => p.is_active && (!p.track_stock || p.stock > 0);
function setQty(id, q) {
  const p = CL.prods.find(x => x.id === id); if (!p) return;
  if (p.track_stock && q > p.stock) { toast(`Só restam ${p.stock} de ${p.name}`, true); q = p.stock; }
  if (q <= 0) delete CL.cart[id]; else CL.cart[id] = q;
  store.set("cart", CL.cart); CL.quote = CL.quote && { ...CL.quote, stale: true };
  renderClientList(); renderHero(); renderCartBar(); bus.emit("cart");
}

async function startClient() {
  document.title = "Bruno Salgados";
  const root = $("#app");
  root.innerHTML = `<div class="c-wrap" id="c-wrap"><div class="empty">Carregando o cardápio…</div></div><div class="cartbar" id="cartbar" hidden></div>`;
  await loadClientData();
  renderClient();
  if (CL.live) return; CL.live = true;
  try { navigator.storage?.persist?.(); } catch {}
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); CL.install = e; renderClient(); });
  bus.on("products", debounce(async () => { const before = cartCount(); await loadClientData(); reconcileCart(before); renderClient(); }, 250));
  bus.on("settings", async () => { CL.s = await API.settings(); renderClient(); });
  bus.on("stories", async () => { CL.stories = (await API.stories()).filter(s => new Date(s.expires_at) > new Date()); renderClient(); });
  const last = store.get("lastOrder"); if (last && Date.now() - last.t < 6 * 36e5) renderClient();
}
function debounce(f, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; }
async function loadClientData() {
  const [s, cats, prods, stories] = await Promise.all([API.settings(), API.categories(), API.products(), API.stories()]);
  Object.assign(CL, { s, cats, prods: prods.filter(p => p.is_active), stories: stories.filter(x => new Date(x.expires_at) > new Date()) });
}
function reconcileCart() {
  let changed = false;
  for (const [id, q] of Object.entries(CL.cart)) {
    const p = CL.prods.find(x => x.id === id);
    if (!p || !avail(p)) { delete CL.cart[id]; changed = true; toast(`${p?.name || "Um item"} acabou e saiu da sacola`, true); }
    else if (p.track_stock && q > p.stock) { CL.cart[id] = p.stock; changed = true; toast(`${p.name}: só restam ${p.stock}. Ajustamos sua sacola.`, true); }
  }
  if (changed) { store.set("cart", CL.cart); bus.emit("cart"); }
}

const CAT_ICON = n => { n = (n || "").toLowerCase();
  return /frit/.test(n) ? ICON.grid : /assad|forno/.test(n) ? ICON.flame : /combo|kit/.test(n) ? ICON.pack : /bebid|suco|refri/.test(n) ? ICON.cup : ICON.grid; };
const heroList = () => { const f = CL.prods.filter(p => p.is_featured && avail(p));
  const pool = f.length ? f : CL.prods.filter(avail);
  return pool.filter(p => !p.is_combo).concat(pool.filter(p => p.is_combo)).slice(0, 3); };
const splitTitle = name => { const w = name.trim().split(/\s+/); if (w.length < 2) return `<em>${esc(name)}</em>`;
  return `${esc(w.slice(0, -1).join(" "))} <em>${esc(w[w.length - 1])}</em>`; };

function renderClient() {
  const s = CL.s, wrap = $("#c-wrap"); if (!wrap) return;
  const heroes = heroList(); CL.hi = Math.min(CL.hi || 0, Math.max(0, heroes.length - 1));
  const kit = CL.prods.find(p => p.is_combo && p.is_featured) || CL.prods.find(p => p.is_combo);
  const seen = store.get("seenStories", []);
  const last = store.get("lastOrder"); const hasLast = last && Date.now() - last.t < 6 * 36e5;
  const cats = CL.cats.filter(c => CL.prods.some(p => p.category_id === c.id && avail(p)));
  if (!CL.cat || !cats.some(c => c.id === CL.cat)) CL.cat = cats[0]?.id || null;
  wrap.innerHTML = `
  <header class="c-top">
    <a class="brand" href="#" aria-label="${esc(s.store_name)}">${LOGO}<div><div class="brand-name">${esc(s.store_name)}</div><div class="brand-sub">Delivery de salgados</div></div></a>
    <nav class="topnav" aria-label="Menu">
      <a class="tn on" href="#"><span>${ICON.home}</span><span class="lab">Cardápio</span></a>
      ${hasLast ? `<button class="tn" id="c-track">${ICON.orders}<span class="lab">Meu pedido</span><span class="pill num">#${last.code}</span></button>` : ""}
      ${CL.install ? `<button class="tn" id="c-install">${ICON.bag}<span class="lab">Instalar app</span></button>` : ""}
      <button class="tn round" id="c-theme" aria-label="${isDark() ? "Usar modo claro" : "Usar modo escuro"}">${isDark() ? ICON.sun : ICON.moon}</button>
    </nav>
  </header>
  ${CL.stories.length ? `<section class="stories" aria-label="Novidades do dia">${CL.stories.map((st, i) => `
    <button class="story" data-story="${i}"><span class="story-ring ${seen.includes(st.id) ? "seen" : ""}">${st.media_type === "video" ? `<video src="${esc(st.image_url)}#t=0.5" muted playsinline preload="metadata"></video>` : `<img src="${esc(st.image_url)}" alt="">`}</span><span>${esc(st.caption || "Novidade")}</span></button>`).join("")}</section>` : ""}
  ${!s.is_open ? `<div class="closed-note">${esc(s.pause_message || "Estamos fechados no momento.")} Você pode olhar o cardápio à vontade.</div>` : ""}
  <section class="bento">
    <div class="b-hero" id="hero"></div>
    <div class="b-side">
      <div class="b-tile"><div class="tl-h ifood-h">${ICON.bolt}<span>Entrega em parceria com</span><img class="ifood-logo" src="${PHOTOS.ifood}" alt="iFood"></div>${s.delivery_enabled
        ? `<strong>a partir de <em class="num">${money(s.delivery_base_fee)}</em></strong><div class="sub">${ICON.clock}<span>Até ${Number(s.delivery_max_km)} km · ${Number(s.prep_minutes)}–${Number(s.prep_minutes) + 20} min</span></div>`
        : `<strong>Só retirada hoje</strong><div class="sub">${ICON.pin}<span>${esc(s.address || "")}</span></div>`}</div>
      ${kit ? `<button class="b-tile" data-scroll="${kit.category_id}"><div class="tl-h">${ICON.gift}<span>Para festa</span></div><strong>${splitTitle(kit.name).replace(/<\/?em>/g, "")}</strong>
          <div class="sub"><span class="num">${money(kit.price)} · ver combos e kits</span></div><span class="chev">${ICON.chev}</span></button>`
        : `<div class="b-tile"><div class="tl-h">${ICON.pin}<span>Retirada</span></div><strong>Pronto em ${Number(s.prep_minutes)} min</strong><div class="sub">${esc(s.address || "")}</div></div>`}
    </div>
  </section>
  <div class="m-info">
    <span>${ICON.bolt}<span class="mi-t">${s.delivery_enabled ? `Entrega desde <b class="num">${money(s.delivery_base_fee)}</b><span class="mi-x"> · ${Number(s.prep_minutes)}–${Number(s.prep_minutes) + 20} min</span>` : "Só retirada hoje"}</span></span>
    ${kit ? `<button data-scroll="${kit.category_id}">${ICON.gift}Kits festa</button>` : ""}
  </div>
  <div class="filters ${CL.q ? "s-open" : ""}">
    <button class="s-btn" id="c-sbtn" aria-label="Pesquisar">${ICON.search}</button>
    <nav class="cats" aria-label="Categorias">${cats.map(c => `<button data-cat="${c.id}" aria-pressed="${CL.cat === c.id && !CL.q}">${CAT_ICON(c.name)}${esc(c.name)}</button>`).join("")}</nav>
    <label class="search">${ICON.search}<span class="sr">Pesquisar</span><input id="c-q" type="search" placeholder="Pesquisar salgados…" value="${esc(CL.q || "")}" autocomplete="off"></label>
  </div>
  <div id="c-list" style="display:flex;flex-direction:column;gap:34px"></div>
  <footer class="c-foot"><span>${esc(s.store_name)} · ${esc(s.address || "")} · ${esc(s.opening_hours || "")}</span>${window.BS_APP === "client" ? "" : `<a href="#admin">Área do dono</a>`}</footer>`;
  renderHero(); renderClientList(); renderCartBar();
  $("#c-theme").onclick = () => { themeToggle(); renderClient(); };
  $("#c-install") && ($("#c-install").onclick = async () => { CL.install.prompt(); try { await CL.install.userChoice; } catch {} CL.install = null; renderClient(); });
  $("#c-track") && ($("#c-track").onclick = () => openTracking(last.id));
  $$("[data-story]", wrap).forEach(b => b.onclick = () => openStories(+b.dataset.story));
  $("#c-sbtn").onclick = () => { const f = $(".filters", wrap); f.classList.toggle("s-open"); if (f.classList.contains("s-open")) $("#c-q").focus(); else if (CL.q) { CL.q = ""; $("#c-q").value = ""; renderClientList(); } };
  $("#c-q").oninput = e => { CL.q = e.target.value; $$("[data-cat]", wrap).forEach(x => x.setAttribute("aria-pressed", !CL.q && x.dataset.cat === CL.cat)); renderClientList(); };
  $$("[data-cat],[data-scroll]", wrap).forEach(b => b.onclick = () => {
    const id = b.dataset.cat || b.dataset.scroll; CL.cat = id;
    if (CL.q) { CL.q = ""; $("#c-q").value = ""; renderClientList(); }
    $$("[data-cat]", wrap).forEach(x => x.setAttribute("aria-pressed", x.dataset.cat === id));
    document.getElementById("sec-" + id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });
  clearInterval(CL.heroTimer);
  if (heroes.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    CL.heroTimer = setInterval(() => { if (document.hidden || $(".overlay") || !$("#hero")) return; CL.hi = (CL.hi + 1) % heroList().length; renderHero(); }, 7000);
}

function renderHero() {
  const el = $("#hero"); if (!el) return;
  const heroes = heroList(); const p = heroes[CL.hi || 0];
  if (!p) { el.innerHTML = `<div class="glow"></div><div class="copy"><span class="badge">${ICON.trend}Cardápio do dia</span><h1>${splitTitle(CL.s.tagline || CL.s.store_name)}</h1></div>`; return; }
  const q = CL.cart[p.id] || 0;
  el.innerHTML = `<div class="glow"></div><div class="photo">${productThumb(p)}</div>
    <div class="copy"><span class="badge">${ICON.trend}${p.is_combo ? "Ideal para festas" : CL.hi === 0 ? "O mais pedido da casa" : "Saindo quentinho"}</span>
      <h1>${splitTitle(p.name)}</h1>${p.description ? `<p class="desc">${esc(p.description)}</p>` : ""}
      <div class="buy"><span class="price num">${money(p.price)}</span>
        ${q ? `<div class="stepper" style="height:54px"><button data-hd aria-label="Tirar um" style="width:50px;height:54px">−</button><span class="num">${q}</span><button data-hi aria-label="Pôr mais um" style="width:50px;height:54px">+</button></div>`
          : `<button class="btn-add" data-hadd ${!CL.s.is_open ? "disabled" : ""}>${ICON.plus}${CL.s.is_open ? "Adicionar" : "Loja fechada"}</button>`}</div></div>
    ${heroes.length > 1 ? `<div class="dots" role="tablist" aria-label="Destaques">${heroes.map((h, i) => `<button role="tab" aria-label="${esc(h.name)}" aria-current="${i === (CL.hi || 0)}" data-dot="${i}"></button>`).join("")}</div>` : ""}`;
  $("[data-hadd]", el) && ($("[data-hadd]", el).onclick = () => { setQty(p.id, 1); renderHero(); });
  $("[data-hi]", el) && ($("[data-hi]", el).onclick = () => { setQty(p.id, q + 1); renderHero(); });
  $("[data-hd]", el) && ($("[data-hd]", el).onclick = () => { setQty(p.id, q - 1); renderHero(); });
  $$("[data-dot]", el).forEach(b => b.onclick = () => { CL.hi = +b.dataset.dot; renderHero(); });
}

function renderClientList() {
  const el = $("#c-list"); if (!el) return;
  const q = (CL.q || "").trim().toLowerCase();
  const match = p => !q || p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
  const groups = CL.cats.map(c => ({ c, items: CL.prods.filter(p => p.category_id === c.id && avail(p) && match(p)) })).filter(g => g.items.length);
  const loose = CL.prods.filter(p => !CL.cats.some(c => c.id === p.category_id) && avail(p) && match(p));
  if (loose.length) groups.push({ c: { id: "outros", name: "Outros" }, items: loose });
  CL.open ||= {};
  if (!groups.length) { el.innerHTML = q ? `<div class="empty-search"><h3>Nada com “${esc(CL.q)}”</h3><p>Tente outro nome, como coxinha ou kibe.</p></div>`
    : `<div class="empty-search"><h3>Cardápio em preparo</h3><p>Os salgados aparecem aqui assim que a loja cadastrar.</p></div>`; return; }
  const LIMIT = 4;
  el.innerHTML = groups.map(({ c, items }) => { const all = q || CL.open[c.id] || items.length <= LIMIT; const shown = all ? items : items.slice(0, LIMIT);
    return `<section class="sec" id="sec-${c.id}"><div class="sec-h"><h2>${esc(c.name)}</h2>${items.length > LIMIT && !q
      ? `<button class="see-all" data-open="${c.id}">${CL.open[c.id] ? "Ver menos" : `Ver todos (${items.length})`}${ICON.arrow}</button>` : ""}</div>
    <div class="plist">${shown.map(productCard).join("")}</div></section>`; }).join("");
  $$("[data-inc]", el).forEach(b => b.onclick = () => setQty(b.dataset.inc, (CL.cart[b.dataset.inc] || 0) + 1));
  $$("[data-dec]", el).forEach(b => b.onclick = () => setQty(b.dataset.dec, (CL.cart[b.dataset.dec] || 0) - 1));
  $$("[data-open]", el).forEach(b => b.onclick = () => { CL.open[b.dataset.open] = !CL.open[b.dataset.open]; renderClientList(); });
}
function productCard(p) {
  const q = CL.cart[p.id] || 0, ok = avail(p), low = p.track_stock && p.stock > 0 && p.stock <= p.low_stock_alert;
  const tag = !ok ? `<span class="tag-chip bad">Esgotado</span>` : low ? `<span class="tag-chip warn">Restam ${p.stock}</span>` : p.is_featured ? `<span class="tag-chip">Destaque</span>` : "";
  return `<article class="pcard ${ok ? "" : "off"} ${tag ? "has-tag" : ""}">
    <div class="pimg">${productThumb(p)}</div>
    <div class="info"><h3>${esc(p.name)}</h3>
      ${p.description ? `<p class="desc">${esc(p.description)}</p>` : ""}
      ${p.is_combo && p.combo_items ? `<p class="incl">Inclui: ${esc(p.combo_items)}</p>` : ""}
      <div class="foot"><span class="price num">${money(p.price)} <span class="unit">/ ${esc(p.unit_label)}</span></span>
        ${!ok || !CL.s.is_open ? "" : q
          ? `<div class="stepper"><button data-dec="${p.id}" aria-label="Tirar um">−</button><span class="num">${q}</span><button data-inc="${p.id}" aria-label="Pôr mais um">+</button></div>`
          : `<button class="addbtn" data-inc="${p.id}" aria-label="Adicionar ${esc(p.name)}">${ICON.plus}</button>`}</div></div>
    ${tag ? `<div class="tag">${tag}</div>` : ""}
  </article>`;
}

function renderCartBar() {
  const bar = $("#cartbar"); if (!bar) return;
  const n = cartCount();
  bar.hidden = !n;
  if (!n) return;
  bar.innerHTML = `<button id="open-cart"><span><span class="count num">${n}</span>Ver sacola</span><span class="num">${money(cartSubtotal())}</span></button>`;
  $("#open-cart").onclick = openCart;
}

/* ---------- sacola e finalização ---------- */
function openCart() {
  const s = CL.s;
  const st = { mode: s.delivery_enabled ? (CL.me.mode || "entrega") : "retirada", pay: null };
  if (!s.pickup_enabled) st.mode = "entrega";
  const pays = [s.accept_pix && ["pix", "Pix", "Copia a chave depois do pedido"], s.accept_cash && ["dinheiro", "Dinheiro", "Informe se precisa de troco"],
    s.accept_card_on_delivery && ["cartao", "Cartão", "Crédito ou débito na maquininha"], s.mp_enabled && ["mercadopago", "Pagar online", "Mercado Pago"]].filter(Boolean);
  st.pay = CL.me.pay && pays.some(p => p[0] === CL.me.pay) ? CL.me.pay : pays[0]?.[0];
  const sh = openSheet(`<div class="sheet-head"><h2>Sua sacola</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="box" id="ck-items"></div>
    ${s.delivery_enabled && s.pickup_enabled ? `<div class="seg" role="group" aria-label="Como receber"><button data-mode="entrega">Entregar</button><button data-mode="retirada">Retirar na loja</button></div>` : ""}
    <div id="ck-addr"></div>
    <div class="box">
      <div class="grid2"><div class="field"><label for="ck-name">Seu nome</label><input class="input" id="ck-name" autocomplete="name" value="${esc(CL.me.name || "")}"></div>
      <div class="field"><label for="ck-phone">WhatsApp</label><input class="input" id="ck-phone" inputmode="tel" autocomplete="tel" placeholder="(00) 00000-0000" value="${esc(CL.me.phone || "")}"></div></div>
    </div>
    ${CL.me.name ? `<p class="saved-note">${ICON.check}<span>Seus dados ficam salvos neste celular para a próxima compra.</span><button id="ck-forget">Apagar meus dados</button></p>` : ""}
    <label class="optin"><input type="checkbox" id="ck-optin" ${CL.me.optin === false ? "" : "checked"}><span>Quero receber promoções e novidades da loja no WhatsApp</span></label>
    <div class="box"><span class="lbl">Pagamento</span><div id="ck-pay" style="display:flex;flex-direction:column;gap:8px"></div><div id="ck-change"></div></div>
    <div class="field"><label for="ck-notes">Observações</label><textarea class="input" id="ck-notes" placeholder="Ex.: sem cebola, tocar a campainha"></textarea></div>
    <div class="box" id="ck-sum"></div>
    <button class="btn primary block" id="ck-go" style="min-height:52px;font-size:1.02rem">Fazer pedido</button>`,
    { onClose: () => { bus.h.cart = (bus.h.cart || []).filter(f => f !== onCart); } });
  const el = sh.el;
  function onCart() { if (!cartCount()) { sh.close(); return; } drawItems(); drawSum(); }
  bus.on("cart", onCart);

  function drawItems() {
    $("#ck-items", el).innerHTML = cartLines().map(l => `<div class="line-item">${productThumb(l.p)}<div class="grow"><div style="font-weight:600">${esc(l.p.name)}</div><div class="faint num" style="font-size:.84rem">${money(l.p.price)} cada</div></div>
      <div class="stepper" style="height:34px"><button data-d="${l.p.id}" aria-label="Tirar um">−</button><span class="num">${l.qty}</span><button data-i="${l.p.id}" aria-label="Pôr mais um">+</button></div>
      <div class="num" style="font-weight:700;min-width:74px;text-align:right">${money(l.p.price * l.qty)}</div></div>`).join("");
    $$("[data-i]", el).forEach(b => b.onclick = () => setQty(b.dataset.i, CL.cart[b.dataset.i] + 1));
    $$("[data-d]", el).forEach(b => b.onclick = () => setQty(b.dataset.d, CL.cart[b.dataset.d] - 1));
  }
  function drawMode() {
    $$("[data-mode]", el).forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === st.mode));
    const a = CL.addr;
    const saved = a.street && a.num && a.city && !st.editAddr;
    $("#ck-addr", el).innerHTML = st.mode === "retirada"
      ? `<div class="box"><div class="row" style="gap:10px">${ICON.pin}<div><div style="font-weight:600">Retire na loja</div><div class="muted" style="font-size:.88rem">${esc(s.address || "")}</div></div></div></div>`
      : saved ? `<div class="box"><div class="saved-addr">${ICON.pin}<div class="grow"><span class="lbl">Entregar em</span>
          <div style="font-weight:700">${esc(a.street)}, ${esc(a.num)}</div><div class="muted" style="font-size:.86rem">${esc([a.district, a.city + (a.uf ? "/" + a.uf : ""), a.ref].filter(Boolean).join(" · "))}</div></div>
          <button class="btn sm ghost" id="ad-edit">Trocar</button></div><div id="ad-quote"></div></div>`
      : `<div class="box"><span class="lbl">Endereço de entrega</span>
        <div class="grid2"><div class="field"><label for="ad-cep">CEP</label><input class="input" id="ad-cep" inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" value="${esc(a.cep || "")}"></div>
        <div class="field"><label for="ad-num">Número</label><input class="input" id="ad-num" inputmode="numeric" value="${esc(a.num || "")}"></div></div>
        <div class="field"><label for="ad-street">Rua</label><input class="input" id="ad-street" autocomplete="address-line1" value="${esc(a.street || "")}"></div>
        <div class="grid2"><div class="field"><label for="ad-district">Bairro</label><input class="input" id="ad-district" value="${esc(a.district || "")}"></div>
        <div class="field"><label for="ad-city">Cidade</label><input class="input" id="ad-city" value="${esc(a.city ? a.city + (a.uf ? " / " + a.uf : "") : "")}"></div></div>
        <div class="field"><label for="ad-ref">Complemento ou referência</label><input class="input" id="ad-ref" value="${esc(a.ref || "")}" placeholder="Apto, bloco, portão…"></div>
        <button class="btn" id="ad-calc">Calcular frete</button>
        <div id="ad-quote"></div></div>`;
    if (st.mode === "entrega" && saved) {
      $("#ad-edit", el).onclick = () => { st.editAddr = true; CL.quote = null; drawMode(); $("#ad-cep", el)?.focus(); };
      drawQuote();
      if (!CL.quote || CL.quote.stale) autoQuote();
    } else if (st.mode === "entrega") {
      const cep = $("#ad-cep", el);
      cep.oninput = async () => { const d = onlyDigits(cep.value); cep.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5, 8) : d;
        if (d.length === 8) { try { const r = await lookupCep(d); $("#ad-street", el).value = r.logradouro || ""; $("#ad-district", el).value = r.bairro || "";
          $("#ad-city", el).value = r.localidade + " / " + r.uf; CL.addr.uf = r.uf; $("#ad-num", el).focus(); } catch (e) { toast("CEP não encontrado. Preencha a rua à mão.", true); } } };
      $("#ad-calc", el).onclick = e => busy(e.currentTarget, calcQuote);
      $("#ad-num", el).onchange = () => $("#ad-street", el).value && calcQuote().catch(err => toast(errMsg(err), true));
      ["ad-street", "ad-cep", "ad-district", "ad-city", "ad-num"].forEach(id => $("#" + id, el).addEventListener("input", () => { CL.quote = null; delete CL.addr.lat; drawQuote(); drawSum(); }));
      drawQuote();
    }
    drawSum();
  }
  async function autoQuote() {
    const a = CL.addr; const box = $("#ad-quote", el);
    try {
      if (a.lat != null && s.lat != null) { box && (box.innerHTML = `<div class="freight" style="background:var(--surface-2);color:var(--fg-2)">Calculando o frete…</div>`);
        const q = await API.quote(a.lat, a.lng, a.route_km, cartSubtotal());
        CL.quote = { ...q, lat: a.lat, lng: a.lng, route_km: a.route_km }; drawQuote(); drawSum(); }
      else await calcQuote();
    } catch (e) { toast(errMsg(e), true); }
  }
  function readAddr() {
    if (!$("#ad-cep", el)) return CL.addr;
    const [city, uf] = $("#ad-city", el).value.split("/").map(x => x.trim());
    CL.addr = { cep: $("#ad-cep", el).value, num: $("#ad-num", el).value.trim(), street: $("#ad-street", el).value.trim(), district: $("#ad-district", el).value.trim(),
      city: city || "", uf: uf || CL.addr.uf || "", ref: $("#ad-ref", el).value.trim() };
    store.set("addr", CL.addr); return CL.addr;
  }
  async function calcQuote() {
    const a = readAddr();
    if (!a.street || !a.num || !a.city) { toast("Preencha CEP, rua, número e cidade.", true); return; }
    if (s.lat == null) { CL.quote = { ok: false, reason: "LOJA_SEM_LOCALIZACAO" }; drawQuote(); drawSum(); return; }
    $("#ad-quote", el).innerHTML = `<div class="freight" style="background:var(--surface-2);color:var(--fg-2)">Calculando a distância…</div>`;
    const geo = await geocode({ street: a.street, number: a.num, city: a.city, uf: a.uf, cep: a.cep, district: a.district });
    const km = await routeKm({ lat: s.lat, lng: s.lng }, geo);
    const q = await API.quote(geo.lat, geo.lng, n2(km), cartSubtotal());
    CL.quote = { ...q, lat: geo.lat, lng: geo.lng, route_km: n2(km), simulated: geo.simulated };
    if (q.ok) { Object.assign(CL.addr, { lat: geo.lat, lng: geo.lng, route_km: n2(km) }); store.set("addr", CL.addr); }
    drawQuote(); drawSum();
  }
  function drawQuote() {
    const box = $("#ad-quote", el); if (!box) return; const q = CL.quote;
    if (!q) { box.innerHTML = ""; return; }
    box.innerHTML = q.ok
      ? `<div class="freight"><span>${ICON.pin} ${String(q.distance_km).replace(".", ",")} km${q.simulated ? " (simulado)" : ""}</span><span class="num">${q.fee === 0 ? "Frete grátis" : money(q.fee)}</span></div>`
      : `<div class="freight bad">${esc(errMsg(q.reason))}${q.max_km ? ` Limite: ${Number(q.max_km)} km.` : ""}</div>`;
  }
  function drawPay() {
    $("#ck-pay", el).innerHTML = pays.length ? pays.map(([k, t, d]) => `<label class="li click" style="border:1px solid ${st.pay === k ? "var(--accent)" : "var(--line)"};border-radius:12px;padding:10px 12px">
      <input type="radio" name="ck-pay" value="${k}" ${st.pay === k ? "checked" : ""} style="accent-color:var(--accent)"><div class="grow"><div class="t">${t}</div><div class="d">${d}</div></div></label>`).join("")
      : `<p class="muted">A loja ainda não configurou formas de pagamento.</p>`;
    $$("[name=ck-pay]", el).forEach(r => r.onchange = () => { st.pay = r.value; drawPay(); });
    $("#ck-change", el).innerHTML = st.pay === "dinheiro" ? `<div class="field"><label for="ck-troco">Troco para quanto? (deixe vazio se não precisar)</label><input class="input" id="ck-troco" inputmode="decimal" placeholder="R$ 50,00"></div>`
      : st.pay === "cartao" ? `<div class="seg" role="group" aria-label="Tipo de cartão"><button data-card="cartao_debito" aria-pressed="${st.card !== "cartao_credito"}">Débito</button><button data-card="cartao_credito" aria-pressed="${st.card === "cartao_credito"}">Crédito</button></div>` : "";
    $$("[data-card]", el).forEach(b => b.onclick = () => { st.card = b.dataset.card; drawPay(); });
  }
  function drawSum() {
    const sub = cartSubtotal(); const q = CL.quote; const ent = st.mode === "entrega";
    const fee = ent && q?.ok ? q.fee : 0;
    const minOk = !ent || sub >= Number(s.delivery_min_order || 0);
    $("#ck-sum", el).innerHTML = `<div class="sumrow"><span class="muted">Subtotal</span><span class="num">${money(sub)}</span></div>
      <div class="sumrow"><span class="muted">Entrega</span><span class="num">${!ent ? "Retirada" : q?.ok ? (fee ? money(fee) : "Grátis") : "calcule o frete"}</span></div>
      ${!minOk ? `<div class="sumrow" style="color:var(--bad)"><span>Pedido mínimo para entrega</span><span class="num">${money(s.delivery_min_order)}</span></div>` : ""}
      <div class="sumrow total"><span>Total</span><span class="num">${money(sub + fee)}</span></div>`;
    const go = $("#ck-go", el);
    go.disabled = !s.is_open || !pays.length || (ent && !(q?.ok)) || !minOk;
    go.textContent = !s.is_open ? "Loja fechada agora" : ent && !q?.ok ? "Calcule o frete para continuar" : `Fazer pedido · ${money(sub + fee)}`;
  }
  $$("[data-mode]", el).forEach(b => b.onclick = () => { st.mode = b.dataset.mode; drawMode(); });
  $("#ck-forget", el) && ($("#ck-forget", el).onclick = async () => {
    if (!(await confirmSheet("Apagar seus dados?", "Nome, WhatsApp e endereço salvos neste celular serão apagados.", "Apagar", true))) return;
    CL.me = {}; CL.addr = {}; CL.quote = null; store.set("me", {}); store.set("addr", {}); sh.close(); openCart(); });
  $("#ck-go", el).onclick = e => busy(e.currentTarget, async () => {
    const name = $("#ck-name", el).value.trim(), phone = $("#ck-phone", el).value.trim();
    if (!name) { toast("Informe seu nome.", true); $("#ck-name", el).focus(); return; }
    if (onlyDigits(phone).length < 10) { toast("Informe um WhatsApp com DDD para avisarmos sobre o pedido.", true); $("#ck-phone", el).focus(); return; }
    const method = st.pay === "cartao" ? (st.card || "cartao_debito") : st.pay;
    const ent = st.mode === "entrega"; const a = ent ? readAddr() : null;
    if (ent && CL.quote?.stale) await calcQuote();
    CL.me = { name, phone, mode: st.mode, pay: st.pay }; store.set("me", CL.me);
    const payload = { channel: "app", customer_name: name, customer_phone: phone, fulfillment: st.mode, payment_method: method,
      change_for: method === "dinheiro" ? parseMoney($("#ck-troco", el)?.value) || null : null, notes: $("#ck-notes", el).value.trim() || null,
      items: cartLines().map(l => ({ product_id: l.p.id, qty: l.qty })) };
    if (ent) Object.assign(payload, { address: `${a.street}, ${a.num} · ${a.district} · ${a.city}${a.uf ? "/" + a.uf : ""} · CEP ${a.cep}`, address_ref: a.ref,
      lat: CL.quote.lat, lng: CL.quote.lng, distance_km: CL.quote.route_km });
    const r = await API.placeOrder(payload);
    const optin = $("#ck-optin", el)?.checked ?? false; CL.me.optin = optin; store.set("me", CL.me);
    try { await API.setOptin(r.id, phone, optin); } catch {}
    CL.cart = {}; store.set("cart", {}); CL.quote = null;
    store.set("lastOrder", { id: r.id, code: r.code, t: Date.now() });
    sh.close(); renderClient();
    if (method === "mercadopago") { try { location.href = await API.startOnlinePayment(r.id); return; } catch (err) { toast(err.message + " Pague na entrega.", true); } }
    openTracking(r.id, true);
  });
  ["ck-name", "ck-phone"].forEach(id => $("#" + id, el).addEventListener("change", () => { CL.me.name = $("#ck-name", el).value.trim(); CL.me.phone = $("#ck-phone", el).value.trim(); store.set("me", CL.me); }));
  drawItems(); drawMode(); drawPay();
}

/* ---------- acompanhar pedido ---------- */
function openTracking(id, fresh) {
  let timer;
  const sh = openSheet(`<div class="sheet-head"><h2>Seu pedido</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div><div id="tr-body"><div class="empty">Carregando…</div></div>`,
    { onClose: () => clearInterval(timer) });
  async function load() {
    const o = await API.orderPublic(id).catch(() => null); const body = $("#tr-body", sh.el); if (!body) return;
    if (!o) { body.innerHTML = `<div class="empty">Não encontramos esse pedido.</div>`; return; }
    const s = CL.s, ent = o.fulfillment === "entrega";
    const steps = [["novo", "Pedido enviado", o.status === "novo" ? "Aguardando a loja aceitar" : "A loja aceitou seu pedido"], ["preparando", "Aceito e em preparo", "Seus salgados estão na fritura"],
      ent ? ["saiu", "Saiu para entrega", "O entregador está a caminho"] : ["pronto", "Pronto para retirar", s.address || ""], ["entregue", ent ? "Entregue" : "Retirado", "Bom apetite!"]];
    const order = ["novo", "preparando", "pronto", "saiu", "entregue"]; const idx = order.indexOf(o.status);
    const stepIdx = k => order.indexOf(k);
    const txt = `Olá! Fiz o pedido #${o.code} pelo app:\n` + o.items.map(i => `${i.qty}x ${i.name}`).join("\n") + `\nTotal: ${money(o.total)}`;
    body.innerHTML = `<div class="row" style="justify-content:space-between"><span class="ord-code num" style="font-size:1.6rem">#${o.code}</span>
      <span class="chip ${o.status === "cancelado" ? "bad" : o.status === "entregue" ? "good" : "accent"}">${STATUS_LABEL[o.status]}</span></div>
      ${fresh ? `<p class="muted">Pedido enviado. Deixe esta tela aberta para acompanhar; ela atualiza sozinha.</p>` : ""}
      ${o.status === "cancelado" ? `<div class="closed-note">Este pedido foi cancelado pela loja. Fale com a gente se tiver dúvidas.</div>` : `<div class="track">${steps.map(([k, t, d]) => {
        const si = stepIdx(k), done = idx > si || (k === "entregue" && o.status === "entregue"), now = o.status === k || (k === "pronto" && o.status === "saiu" && !ent);
        return `<div class="tstep ${done ? "done" : ""} ${now ? "now" : ""}"><span class="b">${done ? ICON.check : ""}</span><div><div style="font-weight:600">${t}</div><div class="muted" style="font-size:.85rem">${esc(d)}</div></div></div>`; }).join("")}</div>`}
      ${o.payment_method === "pix" && o.payment_status === "pendente" && s.pix_key ? `<div class="box"><span class="lbl">Pague com Pix</span><div class="num" style="font-size:1.4rem;font-weight:800">${money(o.total)}</div>
        <div class="row" style="justify-content:space-between"><code style="font-size:.95rem;word-break:break-all;user-select:all">${esc(s.pix_key)}</code><button class="btn sm" id="tr-pix">Copiar chave</button></div>
        <span class="faint" style="font-size:.82rem">${esc(s.pix_name || "")} · Envie o comprovante pelo WhatsApp da loja</span></div>` : ""}
      <div class="box">${o.items.map(i => `<div class="sumrow"><span>${i.qty}× ${esc(i.name)}</span><span class="num">${money(i.total)}</span></div>`).join("")}
        ${Number(o.delivery_fee) ? `<div class="sumrow"><span class="muted">Entrega</span><span class="num">${money(o.delivery_fee)}</span></div>` : ""}
        <div class="sumrow total"><span>Total</span><span class="num">${money(o.total)}</span></div><span class="faint" style="font-size:.82rem">${METHOD_LABEL[o.payment_method]} · ${o.payment_status === "pago" ? "pago" : "a pagar"}</span></div>
      ${s.whatsapp ? `<a class="btn block" href="${waLink(s.whatsapp, txt)}" target="_blank" rel="noopener">Falar com a loja no WhatsApp</a>
        <p class="faint" style="font-size:.8rem;text-align:center">WhatsApp da loja: <span style="user-select:all">${esc(s.whatsapp)}</span></p>` : ""}`;
    $("#tr-pix", body) && ($("#tr-pix", body).onclick = () => copyText(s.pix_key));
    if (["entregue", "cancelado"].includes(o.status)) clearInterval(timer);
  }
  load(); timer = setInterval(load, 8000);
}

/* ---------- stories ---------- */
function openStories(start) {
  let i = start, t0, raf, paused = false;
  const list = CL.stories;
  const v = h(`<div class="sv" role="dialog" aria-label="Stories"><div class="bars">${list.map(() => "<i><b></b></i>").join("")}</div><div class="sv-media"></div><div class="cap"></div>
    <button class="nav" style="left:0" aria-label="Anterior"></button><button class="nav" style="right:0" aria-label="Próximo"></button><button class="x" aria-label="Fechar">✕</button></div>`);
  document.body.appendChild(v);
  const close = () => { cancelAnimationFrame(raf); v.remove(); document.removeEventListener("keydown", key); renderClient(); };
  const key = e => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
  document.addEventListener("keydown", key);
  function show() {
    const st = list[i]; const isVid = st.media_type === "video";
    $(".sv-media", v).innerHTML = isVid ? `<video src="${esc(st.image_url)}" autoplay muted playsinline></video>` : `<img src="${esc(st.image_url)}" alt="">`;
    CL.vid = isVid ? $("video", v) : null; if (CL.vid) CL.vid.onended = () => go(1);
    $(".cap", v).textContent = st.caption || "";
    const seen = store.get("seenStories", []); if (!seen.includes(st.id)) store.set("seenStories", [...seen, st.id].slice(-50));
    $$(".bars b", v).forEach((b, k) => b.style.width = k < i ? "100%" : "0");
    t0 = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
  }
  function step(t) { if (paused) { t0 += 16; raf = requestAnimationFrame(step); return; }
    const p = CL.vid ? (CL.vid.duration ? Math.min(1, CL.vid.currentTime / CL.vid.duration) : 0) : Math.min(1, (t - t0) / 5000);
    if (CL.vid) { $$(".bars b", v)[i].style.width = p * 100 + "%"; raf = requestAnimationFrame(step); return; } $$(".bars b", v)[i].style.width = p * 100 + "%"; if (p >= 1) go(1); else raf = requestAnimationFrame(step); }
  function go(d) { i += d; if (i < 0) i = 0; if (i >= list.length) return close(); show(); }
  $$(".nav", v)[0].onclick = () => go(-1); $$(".nav", v)[1].onclick = () => go(1); $(".x", v).onclick = close;
  v.addEventListener("pointerdown", () => paused = true); v.addEventListener("pointerup", () => paused = false);
  show();
}
