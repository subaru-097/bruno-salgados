/* ======================= MENSAGENS NO WHATSAPP ======================= */
VIEWS.splice(VIEWS.findIndex(v => v[0] === "stories") + 1, 0, ["mensagens", "WhatsApp", "wa"]);
ICON.wa = '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.2.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3z"/></svg>';

const firstName = n => { const w = String(n || "").trim().split(/\s+/); return /^(seu|sr\.?|dona|d\.|dr\.?|dra\.?)$/i.test(w[0]) && w[1] ? w[0] + " " + w[1] : w[0]; };
const fillMsg = (tpl, v) => String(tpl || "").replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m);
const phoneKey = p => onlyDigits(p).slice(-9);
const appLink = () => location.href.split("#")[0];

/* junta clientes cadastrados e quem comprou pelo app (um contato por telefone) */
async function loadContacts() {
  const [custs, orders] = await Promise.all([API.customers(), API.orders({ from: new Date(Date.now() - 365 * 864e5) })]);
  const map = new Map();
  for (const c of custs) { const k = phoneKey(c.phone); if (k.length < 8) continue;
    map.set(k, { key: k, name: c.name, phone: c.phone, customer_id: c.id, balance: Number(c.balance) || 0, optin: !!c.whatsapp_optin, source: "Cliente cadastrado", last: c.last_movement }); }
  for (const o of orders) { const k = phoneKey(o.customer_phone); if (k.length < 8 || !validOrder(o)) continue;
    const cur = map.get(k);
    if (cur) { cur.optin = cur.optin || !!o.marketing_optin; if (!cur.last || o.created_at > cur.last) cur.last = o.created_at; cur.orders = (cur.orders || 0) + 1; }
    else map.set(k, { key: k, name: o.customer_name, phone: o.customer_phone, customer_id: null, balance: 0, optin: !!o.marketing_optin, source: "Comprou pelo app", last: o.created_at, orders: 1 }); }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function vMensagens(el) {
  AD.mt ||= "promo";
  const s = AD.s = await API.settings();
  const contacts = await loadContacts();
  const api = s.wa_mode === "api";
  el.innerHTML = head("WhatsApp", "Mande promoções, novidades e cobranças para os seus clientes",
    `<div class="pills">${[["promo", "Promoções e novidades"], ["cobranca", "Cobranças"], ["hist", "Enviadas"]].map(([k, l]) => `<button data-mt="${k}" aria-pressed="${AD.mt === k}">${l}</button>`).join("")}</div>`) + `
    <div class="wa-mode ${api ? "on" : ""}">${ICON.wa}<div><b>${api ? "Envio automático ligado (API oficial do WhatsApp)" : "Envio pelo seu WhatsApp"}</b>
      <span>${api ? "As mensagens saem sozinhas para todos os selecionados." : "O painel prepara a mensagem de cada cliente e abre o seu WhatsApp, um por um: você só aperta enviar."}</span></div>
      <button class="btn sm ghost" data-cfg>${api ? "Configurar" : "Ligar envio automático"}</button></div>
    <div id="mg-body"></div>`;
  $$("[data-mt]", el).forEach(b => b.onclick = () => { AD.mt = b.dataset.mt; renderView(); });
  $("[data-cfg]", el).onclick = () => { AD.stab = "whatsapp"; go("ajustes"); };
  const body = $("#mg-body", el);
  if (AD.mt === "hist") return drawHistory(body);
  if (AD.mt === "promo") return drawPromo(body, contacts, s);
  return drawDebts(body, contacts, s);
}

function recipientPicker(list, { preselect, badge }) {
  const sel = new Set(list.filter(preselect).map(c => c.key));
  const wrap = h(`<div class="card tight rp"><div class="card-h"><h3>${ICON.users}Para quem</h3>
      <div class="tools"><label class="search-box">${ICON.search}<input placeholder="Buscar nome ou telefone" aria-label="Buscar contato"></label>
      <button class="btn sm ghost" data-all>Selecionar todos</button><button class="btn sm ghost" data-none>Limpar</button></div></div>
    <div class="rp-count"></div><div class="rp-list"></div></div>`);
  let q = "";
  const draw = () => { const t = q.toLowerCase(), d = onlyDigits(q);
    const vis = list.filter(c => !t || c.name.toLowerCase().includes(t) || (d.length > 2 && onlyDigits(c.phone).includes(d)));
    $(".rp-list", wrap).innerHTML = vis.length ? vis.map(c => `<label class="rp-row"><input type="checkbox" data-k="${c.key}" ${sel.has(c.key) ? "checked" : ""}>
      <span class="who"><i>${initials(c.name)}</i><span><b>${esc(c.name)}</b><span class="faint">${esc(c.phone)} · ${esc(c.source)}</span></span></span>${badge(c)}</label>`).join("")
      : `<p class="empty-row">Nenhum contato com telefone. Os clientes aparecem aqui quando compram pelo app ou quando você cadastra o telefone deles.</p>`;
    $(".rp-count", wrap).innerHTML = `<b class="num">${sel.size}</b> de ${list.length} selecionado${sel.size === 1 ? "" : "s"}`;
    $$("[data-k]", wrap).forEach(i => i.onchange = () => { i.checked ? sel.add(i.dataset.k) : sel.delete(i.dataset.k); $(".rp-count", wrap).innerHTML = `<b class="num">${sel.size}</b> de ${list.length} selecionado${sel.size === 1 ? "" : "s"}`; wrap.dispatchEvent(new Event("change")); }); };
  $("input", wrap).oninput = e => { q = e.target.value; draw(); };
  $("[data-all]", wrap).onclick = () => { list.forEach(c => sel.add(c.key)); draw(); wrap.dispatchEvent(new Event("change")); };
  $("[data-none]", wrap).onclick = () => { sel.clear(); draw(); wrap.dispatchEvent(new Event("change")); };
  draw();
  wrap.selected = () => list.filter(c => sel.has(c.key));
  return wrap;
}

function drawPromo(body, contacts, s, preset = AD.msgPreset) {
  AD.msgPreset = null;
  let img = preset?.image || null, imgFile = null;
  body.innerHTML = `<div class="mg-grid"><div class="card" id="mg-compose"><div class="card-h"><h3>${ICON.story}Mensagem</h3></div>
      <div class="field"><label for="mg-text">O que você quer contar</label><textarea class="input" id="mg-text" rows="3" placeholder="Ex.: Coxinha saindo quentinha agora! Hoje o cento sai por R$ 90.">${esc(preset?.text || "")}</textarea></div>
      <label class="drop"><input id="mg-file" type="file" accept="image/*">${ICON.story} Escolher imagem (opcional)</label>
      <div id="mg-img"></div>
      <div class="field"><label>Prévia para o cliente</label><div class="wa-bubble" id="mg-prev"></div></div>
      <p class="faint" style="font-size:.82rem">Modelo da mensagem em Configurações › WhatsApp. Você pode usar {nome}, {loja}, {mensagem} e {link}.</p></div>
    <div id="mg-rp"></div></div>
    <div class="mg-send"><span id="mg-sum" class="muted"></span><button class="btn primary big-btn" id="mg-go">${ICON.wa}Enviar</button></div>`;
  const rp = recipientPicker(contacts, { preselect: c => c.optin, badge: c => c.optin ? `<span class="pay pago">autorizou</span>` : `<span class="pay estornado" title="Não marcou que quer receber promoções">sem autorização</span>` });
  $("#mg-rp", body).appendChild(rp);
  const text = () => $("#mg-text", body).value.trim();
  const build = c => fillMsg(s.wa_promo_text || "{mensagem}", { nome: firstName(c.name), loja: s.store_name || "Bruno Salgados", mensagem: text(), link: appLink() });
  const prev = () => { $("#mg-prev", body).innerHTML = `${img ? `<img src="${esc(img)}" alt="">` : ""}<span>${esc(build({ name: "Maria" })).replace(/\n/g, "<br>")}</span>`;
    const n = rp.selected().length, sem = rp.selected().filter(c => !c.optin).length;
    $("#mg-sum", body).innerHTML = `${n} contato${n === 1 ? "" : "s"}${sem ? ` · <span style="color:var(--warn)">${sem} sem autorização</span>` : ""}`; };
  const showImg = () => { $("#mg-img", body).innerHTML = img ? `<div class="mg-thumb"><img src="${esc(img)}" alt=""><button class="btn sm ghost" id="mg-rmimg">Tirar imagem</button></div>` : "";
    $("#mg-rmimg", body) && ($("#mg-rmimg", body).onclick = () => { img = imgFile = null; showImg(); prev(); }); };
  $("#mg-text", body).oninput = prev; rp.addEventListener("change", prev);
  $("#mg-file", body).onchange = async e => { const f = e.target.files[0]; if (!f) return; imgFile = await shrinkImage(f, 1280); img = URL.createObjectURL(imgFile); showImg(); prev(); };
  showImg(); prev();
  $("#mg-go", body).onclick = e => busy(e.currentTarget, async () => {
    const list = rp.selected(); if (!text()) { toast("Escreva a mensagem.", true); return; } if (!list.length) { toast("Escolha pelo menos um contato.", true); return; }
    const sem = list.filter(c => !c.optin).length;
    if (sem && !(await confirmSheet("Alguns clientes não autorizaram", `${sem} dos selecionados não marcaram que querem receber promoções. Mandar para quem não pediu pode irritar o cliente e fazer o WhatsApp bloquear o seu número. Enviar mesmo assim?`, "Enviar mesmo assim"))) return;
    let url = img;
    if (imgFile && s.wa_mode === "api") url = await API.upload(imgFile);
    const kind = preset?.kind || "promo";
    if (s.wa_mode === "api") return sendApi(list, { kind, template: s.wa_promo_template, image_url: url && !url.startsWith("blob:") && !url.startsWith("data:") ? url : null, params: c => [firstName(c.name), text()] });
    sendManual(list.map(c => ({ ...c, text: build(c) })), { kind, imageFile: imgFile, imageUrl: img });
  });
}

function drawDebts(body, contacts, s) {
  const debtors = contacts.filter(c => c.balance > 0.009).sort((a, b) => b.balance - a.balance);
  const build = c => fillMsg(s.wa_debt_text, { nome: firstName(c.name), loja: s.store_name || "Bruno Salgados", valor: money(c.balance), pix: s.pix_key || "(chave Pix)", link: appLink() });
  body.innerHTML = `<div class="mg-grid"><div class="card"><div class="card-h"><h3>${ICON.receipt}Cobrança</h3><span class="pay pendente num">${money(sumBy(debtors, c => c.balance))} em aberto</span></div>
      <p class="muted" style="font-size:.9rem">Só aparecem os clientes com fiado em aberto. Cada um recebe a mensagem com o próprio saldo.</p>
      <div class="field"><label>Prévia</label><div class="wa-bubble" id="db-prev"></div></div>
      <p class="faint" style="font-size:.82rem">Edite o texto em Configurações › WhatsApp. Use {nome}, {valor}, {pix} e {loja}.</p></div>
    <div id="db-rp"></div></div>
    <div class="mg-send"><span id="db-sum" class="muted"></span><button class="btn primary big-btn" id="db-go">${ICON.wa}Enviar cobranças</button></div>`;
  const rp = recipientPicker(debtors, { preselect: () => true, badge: c => `<span class="pay pendente num">${money(c.balance)}</span>` });
  $("#db-rp", body).appendChild(rp);
  const prev = () => { const first = rp.selected()[0] || debtors[0] || { name: "Maria", balance: 25 };
    $("#db-prev", body).innerHTML = `<span>${esc(build(first)).replace(/\n/g, "<br>")}</span>`;
    const l = rp.selected(); $("#db-sum", body).textContent = `${l.length} cliente${l.length === 1 ? "" : "s"} · ${money(sumBy(l, c => c.balance))}`; };
  rp.addEventListener("change", prev); prev();
  $("#db-go", body).onclick = e => busy(e.currentTarget, async () => {
    const list = rp.selected(); if (!list.length) { toast("Escolha pelo menos um cliente.", true); return; }
    if (s.wa_mode === "api") return sendApi(list, { kind: "cobranca", template: s.wa_debt_template, params: c => [firstName(c.name), money(c.balance), s.pix_key || ""] });
    sendManual(list.map(c => ({ ...c, text: build(c) })), { kind: "cobranca" });
  });
}

/* envio automático pela API oficial */
async function sendApi(list, { kind, template, image_url, params }) {
  if (!template) throw new Error("MODELO_OBRIGATORIO");
  const r = await API.waSend({ kind, template, image_url, recipients: list.map(c => ({ phone: c.phone, name: c.name, params: params(c) })) });
  openSheet(`<div class="sheet-head"><h2>Envio concluído</h2><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="mini-stats"><div><span>Enviadas</span><b class="num" style="color:var(--good)">${r.sent}</b></div><div><span>Com erro</span><b class="num" style="color:${r.failed ? "var(--bad)" : "inherit"}">${r.failed}</b></div></div>
    ${r.failed ? `<div class="tl">${r.results.filter(x => !x.ok).map(x => `<div class="tl-i"><span class="h">${esc(x.phone)}</span><span class="faint">${esc(x.error || "")}</span><span></span></div>`).join("")}</div>` : ""}`);
}

/* envio pelo WhatsApp do dono: um por um, com o texto pronto */
function sendManual(list, { kind, imageFile, imageUrl }) {
  let i = 0; const sent = [];
  const canShare = imageFile && navigator.canShare?.({ files: [imageFile] });
  const sh = openSheet(`<div class="sheet-head"><div><h2>Enviando pelo WhatsApp</h2><p class="faint" id="sm-step" style="margin-top:2px"></p></div><button class="btn icon ghost" data-close aria-label="Fechar">✕</button></div>
    <div class="wa-prog"><i id="wa-bar"></i></div><div id="wa-cur"></div>`, { onClose: () => { if (sent.length) { API.logMessages(sent).catch(() => {}); toast(`${sent.length} mensage${sent.length === 1 ? "m" : "ns"} enviada${sent.length === 1 ? "" : "s"}`); if (AD.view === "mensagens") renderView(); } } });
  const draw = () => {
    $("#wa-bar", sh.el).style.width = (i / list.length * 100) + "%";
    if (i >= list.length) { $("#sm-step", sh.el).textContent = "Pronto";
      $("#wa-cur", sh.el).innerHTML = `<div class="inc-done">${ICON.checkBig}<h3>${sent.length} de ${list.length} enviadas</h3><button class="btn primary" data-close>Concluir</button></div>`;
      $$("[data-close]", sh.el).forEach(b => b.onclick = () => sh.close()); return; }
    const c = list[i];
    $("#sm-step", sh.el).textContent = `${i + 1} de ${list.length}`;
    $("#wa-cur", sh.el).innerHTML = `<div class="inc-cust"><div class="who"><i>${initials(c.name)}</i><div><b>${esc(c.name)}</b><span class="faint" style="font-size:.86rem">${esc(c.phone)}</span></div></div>${c.balance > 0 && kind === "cobranca" ? `<span class="pay pendente num">${money(c.balance)}</span>` : ""}</div>
      <div class="wa-bubble">${imageUrl ? `<img src="${esc(imageUrl)}" alt="">` : ""}<span>${esc(c.text).replace(/\n/g, "<br>")}</span></div>
      ${imageUrl ? `<p class="faint" style="font-size:.84rem">${canShare ? "Toque em Mandar com imagem para escolher a conversa no WhatsApp." : "O link do WhatsApp leva só o texto. Para mandar a foto, anexe no próprio WhatsApp ou envie pelo celular, que tem a opção de compartilhar a imagem."}</p>` : ""}
      <div class="inc-act"><button class="btn ghost" id="wa-skip">Pular</button>
        <a class="btn primary big-btn" id="wa-open" href="${waLink(c.phone, c.text)}" target="_blank" rel="noopener">${ICON.wa}Abrir no WhatsApp</a></div>
      ${canShare ? `<button class="btn ghost block" id="wa-share">Mandar com imagem (compartilhar)</button>` : ""}`;
    const next = ok => { if (ok) sent.push({ kind, channel: "manual", phone: c.phone, name: c.name, body: c.text }); i++; draw(); };
    $("#wa-open", sh.el).onclick = () => setTimeout(() => next(true), 300);
    $("#wa-skip", sh.el).onclick = () => next(false);
    $("#wa-share", sh.el) && ($("#wa-share", sh.el).onclick = async () => { try { await copyText(c.text); await navigator.share({ files: [imageFile], text: c.text }); next(true); } catch {} });
  };
  draw();
}

async function drawHistory(body) {
  const log = await API.messageLog();
  const K = { promo: "Promoção", cobranca: "Cobrança", story: "Story" };
  body.innerHTML = `<div class="card tight"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Quando</th><th>Tipo</th><th>Contato</th><th class="hide-sm">Mensagem</th><th>Como</th></tr></thead><tbody>
    ${log.length ? log.map(m => `<tr><td class="faint num">${fmtDT(m.created_at)}</td><td>${K[m.kind]}</td><td><b>${esc(m.name || "")}</b><div class="sub">${esc(m.phone)}</div></td><td class="hide-sm clip">${esc(m.body || "")}</td>
      <td>${m.status === "erro" ? `<span class="pay pendente" title="${esc(m.error || "")}">Erro</span>` : `<span class="pay pago">${m.channel === "api" ? "Automático" : "Pelo WhatsApp"}</span>`}</td></tr>`).join("")
      : `<tr><td colspan="5" class="empty-row">Nenhuma mensagem enviada ainda.</td></tr>`}</tbody></table></div></div>`;
}
