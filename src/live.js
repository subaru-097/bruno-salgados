/* ======================= PEDIDO NOVO: SOM, ACEITE E RECIBO ======================= */
/* sons feitos no próprio navegador (sem arquivos) */
const SOUNDS = {
  caixa: ["Caixa registradora (cifrão)", (ctx, t, v) => {
    noise(ctx, t, .05, v * .5, 2500);
    [[2093, 0.05], [2637, 0.12], [3136, 0.12]].forEach(([f, d], i) => bell(ctx, f, t + .06 + i * .07, .9, v * .5));
  }],
  moedas: ["Moedas", (ctx, t, v) => { for (let i = 0; i < 7; i++) bell(ctx, 2400 + Math.random() * 1800, t + i * .06 + Math.random() * .03, .25, v * .35); }],
  campainha: ["Campainha (ding-dong)", (ctx, t, v) => { bell(ctx, 784, t, 1.2, v * .55); bell(ctx, 622, t + .45, 1.4, v * .55); }],
  sino: ["Sino", (ctx, t, v) => { bell(ctx, 1046, t, 1.8, v * .6); bell(ctx, 1568, t, 1.2, v * .25); }],
  bipe: ["Bipe duplo", (ctx, t, v) => { tone(ctx, 1000, t, .12, v * .35, "square"); tone(ctx, 1000, t + .2, .12, v * .35, "square"); }],
};
let actx;
const audio = () => { try { actx ||= new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume(); return actx; } catch { return null; } };
document.addEventListener("pointerdown", () => audio(), { once: true });
function tone(ctx, f, t, d, v, type = "sine") { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + d + .05); }
function bell(ctx, f, t, d, v) { [1, 2.76, 5.4].forEach((m, i) => tone(ctx, f * m, t, d / (i + 1), v / (i * 2 + 1))); }
function noise(ctx, t, d, v, hp) { const b = ctx.createBuffer(1, ctx.sampleRate * d, ctx.sampleRate), data = b.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = "highpass"; f.frequency.value = hp; s.buffer = b; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  s.connect(f).connect(g).connect(ctx.destination); s.start(t); }
function playAlert(kind, vol) {
  const ctx = audio(); if (!ctx) return; const s = AD.s || {};
  (SOUNDS[kind || s.alert_sound] || SOUNDS.caixa)[1](ctx, ctx.currentTime + .02, Math.max(0, Math.min(1, Number(vol ?? s.alert_volume ?? .8))));
}

/* ---------- recibo ---------- */
function receiptHTML(o, s = AD.s || {}) {
  const w = Number(s.receipt_width) === 58 ? 58 : 80, items = o.order_items || o.items || [];
  const line = (a, b, cls = "") => `<div class="r ${cls}"><span>${a}</span><span>${b}</span></div>`;
  const parts = payParts(o);
  const one = `<div class="rc">
    <div class="c b big">${esc(s.store_name || "Bruno Salgados")}</div>
    ${s.address ? `<div class="c sm">${esc(s.address)}</div>` : ""}${s.whatsapp ? `<div class="c sm">WhatsApp ${esc(s.whatsapp)}</div>` : ""}
    <div class="hr"></div>
    <div class="c b big">PEDIDO Nº ${o.code}</div>
    <div class="c sm">${new Date(o.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
    <div class="c b">${{ entrega: "ENTREGA", retirada: "RETIRADA NA LOJA", balcao: "BALCÃO" }[o.fulfillment] || ""}</div>
    <div class="hr"></div>
    <div><b>Cliente:</b> ${esc(o.customer_name)}</div>${o.customer_phone ? `<div><b>Telefone:</b> ${esc(o.customer_phone)}</div>` : ""}
    ${o.fulfillment === "entrega" ? `<div><b>Endereço:</b> ${esc(o.address || "")}</div>${o.address_ref ? `<div><b>Ref.:</b> ${esc(o.address_ref)}</div>` : ""}` : ""}
    <div class="hr"></div>
    ${items.map(i => `<div class="it"><div>${i.qty}x ${esc(i.name)}</div><div class="r sm"><span>${i.qty} x ${money(i.unit_price ?? i.total / i.qty)}</span><span>${money(i.total)}</span></div></div>`).join("")}
    <div class="hr"></div>
    ${line("Subtotal", money(o.subtotal))}${Number(o.delivery_fee) ? line("Taxa de entrega", money(o.delivery_fee)) : ""}${Number(o.discount) ? line("Desconto", "-" + money(o.discount)) : ""}
    ${line("TOTAL", money(o.total), "b big")}
    <div class="hr"></div>
    <div><b>Pagamento:</b></div>${parts.map(x => line(METHOD_LABEL[x.method] || x.method, money(x.amount))).join("")}
    ${o.change_for ? line("Troco para", money(o.change_for)) + line("Levar de troco", money(Math.max(0, o.change_for - o.total))) : ""}
    <div class="c b" style="margin-top:4px">${{ pago: "PAGO", fiado: "LANÇADO NO FIADO", pendente: "A RECEBER NA ENTREGA/RETIRADA", estornado: "ESTORNADO" }[o.payment_status] || ""}</div>
    ${o.notes ? `<div class="hr"></div><div><b>Obs.:</b> ${esc(o.notes)}</div>` : ""}
    ${o.stock_alerts?.length ? `<div class="hr"></div><div class="b">ATENÇÃO ESTOQUE:</div>${o.stock_alerts.map(a => `<div>${esc(a.name)}: ${a.stock <= 0 ? "ACABOU" : "restam " + a.stock}</div>`).join("")}` : ""}
    <div class="hr"></div>
    ${s.receipt_footer ? `<div class="c">${esc(s.receipt_footer)}</div>` : ""}<div class="c sm">Não é documento fiscal</div></div>`;
  const copies = Math.max(1, Math.min(3, Number(s.receipt_copies) || 1));
  return `<!doctype html><html><head><meta charset="utf-8"><title>Pedido ${o.code}</title><style>
    @page{size:${w}mm auto;margin:0}*{box-sizing:border-box}body{margin:0;font:${w === 58 ? 11 : 12.5}px/1.35 "Courier New",ui-monospace,monospace;color:#000;background:#fff}
    .rc{width:${w}mm;padding:3mm ${w === 58 ? 2 : 4}mm;page-break-after:always}.rc:last-child{page-break-after:auto}
    .c{text-align:center}.b{font-weight:700}.big{font-size:1.25em}.sm{font-size:.88em}.hr{border-top:1px dashed #000;margin:5px 0}
    .r{display:flex;justify-content:space-between;gap:8px}.it{margin-bottom:3px}</style></head><body>${Array(copies).fill(one).join("")}</body></html>`;
}
function printReceipt(o, { silentFail } = {}) {
  try {
    const f = document.createElement("iframe");
    f.setAttribute("aria-hidden", "true"); f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
    document.body.appendChild(f);
    const d = f.contentWindow.document; d.open(); d.write(receiptHTML(o)); d.close();
    setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { if (!silentFail) previewReceipt(o, true); } setTimeout(() => f.remove(), 60000); }, 250);
    return true;
  } catch { if (!silentFail) previewReceipt(o, true); return false; }
}
function previewReceipt(o, failed) {
  const sh = openSheet(`<div class="sheet-head"><h2>Recibo do pedido ${o.code}</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    ${failed ? `<p class="muted" style="font-size:.88rem">Este navegador não abriu a impressão. No painel publicado, com a impressora instalada no computador, o recibo sai direto.</p>` : ""}
    <div class="rcpt-prev"><iframe title="Recibo" id="rp-f"></iframe></div>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>Fechar</button><button class="btn primary" id="rp-print">Imprimir</button></div>`);
  const f = $("#rp-f", sh.el); f.srcdoc = receiptHTML(o);
  $("#rp-print", sh.el).onclick = () => printReceipt(o, { silentFail: true });
}

/* ---------- janela de pedido novo ---------- */
AD.queue = AD.queue || [];
let alertTimer = null;
function stopAlert() { clearInterval(alertTimer); alertTimer = null; }
function enqueueOrder(id, { sound = true } = {}) {
  if (!AD.queue.includes(id)) AD.queue.push(id);
  if (sound) { playAlert(); if (AD.s?.alert_repeat && !alertTimer) alertTimer = setInterval(() => { if (AD.queue.length) playAlert(); else stopAlert(); }, 5000); }
  if (!AD.incOpen) showIncoming(); else updateQueueBadge();
}
function updateQueueBadge() { const b = $("#inc-more"); if (b) { const n = AD.queue.length - 1; b.hidden = n <= 0; b.textContent = `+${n} na fila`; } }
async function showIncoming() {
  const id = AD.queue[0]; if (!id) { stopAlert(); AD.incOpen = false; return; }
  AD.incOpen = true;
  let o; try { o = await API.order(id); } catch { o = null; }
  if (!o || o.status !== "novo") { AD.queue.shift(); return showIncoming(); }
  const s = AD.s || {}, items = o.order_items || [];
  const sh = openSheet(`<div class="inc-top"><span class="inc-pulse">${ICON.bell}</span><div><span class="eyebrow" style="color:var(--accent)">Pedido novo pelo app</span><h2>Pedido nº ${o.code}</h2>
      <p class="faint">${fmtTime(o.created_at)} · ${kindOf(o)}${o.distance_km ? " · " + String(o.distance_km).replace(".", ",") + " km" : ""}</p></div>
      <span class="inc-more" id="inc-more" hidden></span><button class="btn icon ghost inc-x" id="inc-x" aria-label="Fechar e decidir depois" title="Fechar e decidir depois">✕</button></div>
    <div id="inc-body">
      <div class="inc-cust"><div class="who"><i>${initials(o.customer_name)}</i><div><b>${esc(o.customer_name)}</b><span class="faint" style="font-size:.86rem">${esc(o.customer_phone || "")}</span></div></div>${typeChip(o)}</div>
      ${o.fulfillment === "entrega" ? `<div class="inc-addr">${ICON.pin}<div>${esc(o.address || "")}${o.address_ref ? `<div class="faint">${esc(o.address_ref)}</div>` : ""}</div></div>` : ""}
      <div class="inc-items">${items.map(i => { const p = { name: i.name, image_url: null }; return `<div class="inc-it">${productThumb(p)}<span class="q num">${i.qty}×</span><span class="n">${esc(i.name)}</span><b class="num">${money(i.total)}</b></div>`; }).join("")}</div>
      ${o.notes ? `<div class="inc-note">Obs.: ${esc(o.notes)}</div>` : ""}
      <div class="inc-sum">${Number(o.delivery_fee) ? `<div class="calc-row"><span>Entrega</span><b class="num">${money(o.delivery_fee)}</b></div>` : ""}
        <div class="calc-row total"><span>Total · ${payText(o)}${o.change_for ? " · troco p/ " + money(o.change_for) : ""}</span><b class="num">${money(o.total)}</b></div></div>
      <div class="inc-act"><button class="btn ghost" id="inc-no">Recusar</button><button class="btn primary big-btn" id="inc-ok">${ICON.check}Aceitar pedido</button></div>
    </div>`, { cls: "incoming", onClose: () => { stopAlert(); AD.incOpen = false; } });
  updateQueueBadge();
  const body = $("#inc-body", sh.el);
  $("#inc-x", sh.el).onclick = () => { stopAlert(); AD.queue.shift(); sh.close(); toast(`Pedido nº ${o.code} continua em Pedidos › Aguardando aceite`);
    if (AD.view === "pedidos") renderView(); if (AD.queue.length) showIncoming(); };
  const next = () => { AD.queue.shift(); sh.close(); if (AD.queue.length) { if (AD.s?.alert_repeat) alertTimer ||= setInterval(() => AD.queue.length ? playAlert() : stopAlert(), 5000); showIncoming(); } };
  $("#inc-ok", sh.el).onclick = e => busy(e.currentTarget, async () => {
    await API.setStatus(o.id, "preparando"); stopAlert(); AD.newIds.delete(o.id);
    const prods = await API.products().catch(() => []);
    const low = [...new Set(items.map(i => i.product_id))].map(id => prods.find(p => p.id === id)).filter(p => p && p.track_stock && p.stock <= p.low_stock_alert);
    const accepted = { ...o, status: "preparando", stock_alerts: low.map(p => ({ name: p.name, stock: p.stock })) }, auto = !!AD.s?.receipt_auto;
    if (auto) printReceipt(accepted, { silentFail: true });
    body.innerHTML = `<div class="inc-done">${ICON.checkBig}<h3>Pedido aceito</h3>
      ${low.length ? `<div class="stock-alert"><b>${ICON.bell}Atenção ao estoque</b>${low.map(p => `<div class="sa-row"><span>${esc(p.name)}</span><span class="${p.stock <= 0 ? "pay pendente" : "pay fiado"}">${p.stock <= 0 ? "acabou" : `restam ${p.stock}`}</span>
        <button class="btn sm" data-restock="${p.id}">Repor</button></div>`).join("")}<span class="faint" style="font-size:.8rem">O que acabou some do cardápio do cliente até você repor.</span></div>` : ""}
      <p class="muted">${auto ? "O recibo foi enviado para a impressora." : "Quer imprimir o recibo?"}</p>
      <div class="row" style="justify-content:center">${auto ? `<button class="btn ghost" id="inc-print">Imprimir de novo</button>` : `<button class="btn ghost" id="inc-skip">Sem recibo</button><button class="btn primary" id="inc-print">${ICON.receipt}Imprimir recibo</button>`}
      ${o.customer_phone ? `<a class="btn ghost" href="${waLink(o.customer_phone, `Oi ${o.customer_name}! Seu pedido nº ${o.code} da ${s.store_name || "Bruno Salgados"} foi aceito e já está em preparo.`)}" target="_blank" rel="noopener">Avisar no WhatsApp</a>` : ""}</div>
      <button class="link-btn" id="inc-next" style="align-self:center">${AD.queue.length > 1 ? `Ver próximo pedido (${AD.queue.length - 1}) ${ICON.arrow}` : "Fechar"}</button></div>`;
    $("#inc-print", body).onclick = () => printReceipt(accepted);
    $$("[data-restock]", body).forEach(b => b.onclick = () => amountStock(prods.find(p => p.id === b.dataset.restock), async (id, v) => { await API.setStock(id, Math.max(0, v)); b.closest(".sa-row").querySelector("span:nth-child(2)").outerHTML = `<span class="pay pago">${v} em estoque</span>`; b.remove(); }));
    $("#inc-skip", body) && ($("#inc-skip", body).onclick = next);
    $("#inc-next", body).onclick = next;
    refreshNav(); if (["inicio", "pedidos", "vendas"].includes(AD.view)) renderView();
  });
  $("#inc-no", sh.el).onclick = () => {
    stopAlert();
    body.innerHTML = `<div class="inc-done"><h3>Recusar o pedido nº ${o.code}?</h3><p class="muted">O pedido é cancelado e os itens voltam para o estoque. Avise o cliente pelo WhatsApp.</p>
      <div class="field" style="width:100%;text-align:left"><label for="inc-why">Motivo (vai na mensagem)</label><input class="input" id="inc-why" placeholder="Ex.: acabou a coxinha, estamos sem entregador"></div>
      <div class="row" style="justify-content:center"><button class="btn ghost" id="inc-back">Voltar</button><button class="btn danger" id="inc-rej">Recusar pedido</button></div></div>`;
    $("#inc-back", body).onclick = () => { sh.close(); showIncoming(); };
    $("#inc-rej", body).onclick = e => busy(e.currentTarget, async () => {
      await API.setStatus(o.id, "cancelado"); const why = $("#inc-why", body).value.trim();
      body.innerHTML = `<div class="inc-done"><h3>Pedido recusado</h3>${o.customer_phone ? `<a class="btn primary" href="${waLink(o.customer_phone, `Oi ${o.customer_name}, infelizmente não conseguimos aceitar seu pedido nº ${o.code}${why ? ": " + why : ""}. Desculpe!`)}" target="_blank" rel="noopener">Avisar o cliente no WhatsApp</a>` : ""}
        <button class="link-btn" id="inc-next" style="align-self:center">${AD.queue.length > 1 ? `Ver próximo pedido (${AD.queue.length - 1})` : "Fechar"}</button></div>`;
      $("#inc-next", body).onclick = next; refreshNav(); if (["inicio", "pedidos", "vendas"].includes(AD.view)) renderView(); });
  };
}

/* ======================= ANIMAÇÃO DE APROXIMAÇÃO (efeito dock) ======================= */
/* Mesmo princípio da Floating Dock: cada item mede a distância do mouse ao próprio centro;
   até 150 px ele cresce, o mais perto cresce mais, e o tamanho segue uma mola (massa 0,1, rigidez 150, amortecimento 12). */
const MAG = { items: [], raf: 0, x: -1e4, y: -1e4, on: false };
function magSpring(it, target, dt) { const k = 150, c = 12, m = .1; const f = -k * (it.v - target) - c * it.vel; it.vel += f / m * dt; it.v += it.vel * dt; }
function magTick(t) {
  const dt = Math.min(.032, (t - (MAG.last || t)) / 1000) || .016; MAG.last = t; let moving = false;
  for (const it of MAG.items) {
    if (!it.el.isConnected) continue;
    const r = it.el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const d = it.axis === "y" ? Math.abs(MAG.y - cy) + (MAG.x < r.left - 40 || MAG.x > r.right + 40 ? 1e4 : 0) : Math.hypot(MAG.x - cx, MAG.y - cy);
    const p = Math.max(0, 1 - d / it.range), target = p * p * (3 - 2 * p);
    // passo fixo pequeno para a mola ficar estável
    for (let s = 0; s < 4; s++) magSpring(it, target, dt / 4);
    if (Math.abs(it.v - target) > .001 || Math.abs(it.vel) > .001) moving = true;
    it.apply(Math.max(0, it.v));
  }
  MAG.raf = moving || MAG.on ? requestAnimationFrame(magTick) : 0;
}
function magnify(root) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  MAG.items = MAG.items.filter(i => i.el.isConnected);
  const add = (el, axis, range, apply) => { if (el._mag) return; el._mag = 1; MAG.items.push({ el, axis, range, apply, v: 0, vel: 0 }); };
  $$(".qa, .stat, .cx-act, .pc, .sale-cta, .sale-today, .method, .kpi", root).forEach(el => { el.classList.add("mag");
    add(el, "xy", 220, v => { el.style.transform = v > .002 ? `translateY(${(-v * 4).toFixed(2)}px) scale(${(1 + v * .035).toFixed(4)})` : ""; el.style.zIndex = v > .3 ? 2 : ""; }); });
  if (!MAG.bound) { MAG.bound = true;
    document.addEventListener("pointermove", e => { if (e.pointerType === "touch") return; MAG.x = e.clientX; MAG.y = e.clientY; MAG.on = true; if (!MAG.raf) MAG.raf = requestAnimationFrame(magTick); }, { passive: true });
    document.addEventListener("pointerleave", () => { MAG.x = MAG.y = -1e4; MAG.on = false; });
    document.documentElement.addEventListener("mouseleave", () => { MAG.x = MAG.y = -1e4; MAG.on = false; if (!MAG.raf) MAG.raf = requestAnimationFrame(magTick); });
  }
}
