/* ================= helpers de interface ================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

const ICON = {
  plus: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  trend: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
  bolt: '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 14h7l-1.5 8L20 9.5h-7L13.5 2z"/></svg>',
  gift: '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h15A1.5 1.5 0 0 1 21 8.5V11H3V8.5zM4 12.5h7.2V21H5.5A1.5 1.5 0 0 1 4 19.5v-7zm8.8 0H20v7a1.5 1.5 0 0 1-1.5 1.5h-5.7v-8.5z"/><path d="M12 7c-1.2-2.6-3-4-4.6-3.5-1.4.5-1.3 2.6.4 3.5M12 7c1.2-2.6 3-4 4.6-3.5 1.4.5 1.3 2.6-.4 3.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  grid: '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
  flame: '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 3.2 4.5 5.5 4.5 10.2A4.5 4.5 0 0 1 12 22a6 6 0 0 1-6-6c0-3.1 2-5 3.2-6.6.3 1.6.9 2.7 2 3.2C11.6 9.8 11.3 5.5 12 2z"/></svg>',
  pack: '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2zm0 2.3 6.4 3.2L12 10.7 5.6 7.5 12 4.3z"/></svg>',
  cup: '<svg class="svg-i" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 2h-3l-.6 3H6.5a.5.5 0 0 0-.5.6L7.6 21a1.1 1.1 0 0 0 1.1 1h6.6a1.1 1.1 0 0 0 1.1-1L18 5.6a.5.5 0 0 0-.5-.6h-4.6l.4-2h1.2V2z"/></svg>',
  search: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
  arrow: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chev: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  sun: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  logo: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3c-4 5-6.5 8.6-6.5 11.5a6.5 6.5 0 0 0 13 0C18.5 11.6 16 8 12 3z"/><path d="M9 15.5c.6 1.2 1.7 2 3 2" stroke-linecap="round"/></svg>',
  bag: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  home: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  orders: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  cash: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/></svg>',
  pos: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v6H4z"/><path d="M6 10v10h12V10"/><path d="M9 14h6M9 17h3"/></svg>',
  people: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></svg>',
  box: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
  story: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" stroke-dasharray="4 2.2"/><circle cx="12" cy="12" r="4.5"/></svg>',
  chart: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  gear: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  check: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M5 12l5 5 9-10"/></svg>',
  pin: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  clock: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  moon: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  out: '<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>'
};

function toast(msg, bad) {
  const box = $("#toasts"); const t = h(`<div class="toast ${bad ? "bad" : ""}" role="status">${esc(msg)}</div>`);
  box.appendChild(t); setTimeout(() => t.remove(), bad ? 4500 : 2800);
}
function openSheet(html, { onClose, cls = "" } = {}) {
  const ov = h(`<div class="overlay"><div class="sheet ${cls}" role="dialog" aria-modal="true">${html}</div></div>`);
  const close = () => { ov.remove(); document.removeEventListener("keydown", key); onClose?.(); };
  const key = e => { if (e.key === "Escape") close(); };
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", key);
  document.body.appendChild(ov);
  $$("[data-close]", ov).forEach(b => b.addEventListener("click", close));
  const first = $("input,select,textarea", ov); if (first && matchMedia("(min-width:720px)").matches) setTimeout(() => first.focus(), 50);
  return { el: $(".sheet", ov), close };
}
function confirmSheet(title, text, okLabel = "Confirmar", danger) {
  return new Promise(res => {
    let done = false;
    const s = openSheet(`<div class="sheet-head"><h2>${esc(title)}</h2></div><p class="muted">${esc(text)}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>Voltar</button><button class="btn ${danger ? "danger" : "primary"}" id="cf-ok">${esc(okLabel)}</button></div>`,
      { onClose: () => { if (!done) res(false); } });
    $("#cf-ok", s.el).onclick = () => { done = true; s.close(); res(true); };
  });
}
async function busy(btn, fn) {
  const old = btn.innerHTML; btn.disabled = true; btn.innerHTML = "Aguarde…";
  try { return await fn(); } catch (e) { console.error(e); toast(errMsg(e), true); } finally { btn.disabled = false; btn.innerHTML = old; }
}
const LOGO = `<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB04A"/><stop offset="1" stop-color="#E86A00"/></linearGradient></defs>
<path d="M24 2C15 13 7 22.5 7 30.5a17 17 0 0 0 34 0C41 22.5 33 13 24 2z" fill="url(#lg-a)"/><path d="M24 18c-4.6 5.3-8 9.6-8 13.4a8 8 0 0 0 16 0c0-3.8-3.4-8.1-8-13.4z" fill="#1A0F06" opacity=".9"/>
<path d="M24 25.5c-2 2.4-3.4 4.3-3.4 6a3.4 3.4 0 0 0 6.8 0c0-1.7-1.4-3.6-3.4-6z" fill="#FF9A2A"/></svg>`;
const productThumb = (p, cls = "") => { const src = photoFor(p);
  return src ? `<img class="${cls}" src="${esc(src)}" alt="${esc(p.name)}" loading="lazy">`
    : `<div class="ph ${cls}" aria-hidden="true">${ICON.logo}</div>`; };
const parseMoney = v => Number(String(v ?? "").replace(/\s|R\$/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".")) || 0;
const moneyInput = v => v == null || v === "" ? "" : Number(v).toFixed(2).replace(".", ",");
const waLink = (phone, text) => { let d = onlyDigits(phone); if (d && d.length <= 11) d = "55" + d; return `https://wa.me/${d}?text=${encodeURIComponent(text)}`; };
async function copyText(t) { try { await navigator.clipboard.writeText(t); toast("Copiado"); } catch { toast("Selecione e copie o texto manualmente", true); } }

const isDark = () => document.documentElement.dataset.theme !== "light";
function themeToggle() {
  const dark = document.documentElement.dataset.theme !== "light";
  document.documentElement.dataset.theme = dark ? "light" : "dark";
  store.set("theme", document.documentElement.dataset.theme);
  bus.emit("theme");
}
(function () { const t = store.get("theme"); if (t) document.documentElement.dataset.theme = t; })();
