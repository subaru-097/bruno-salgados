/* ================= roteamento ================= */
async function route() {
  const isAdmin = window.BS_APP === "admin" || (window.BS_APP !== "client" && location.hash.startsWith("#admin"));
  if (isAdmin) await startAdmin(); else await startClient();
}
const CLIENT_URL = () => window.BS_APP === "admin" ? location.origin + "/" : location.href.split("#")[0];
(async function boot() {
  try { await initApi(); } catch { return; }
  if (API.mode === "demo" && !window.BS_APP) {
    const bar = $("#demo-bar"); bar.hidden = false;
    const small = matchMedia("(max-width:600px)").matches;
    bar.innerHTML = `<span>${small ? "Apresentação · dados de exemplo" : "Versão de apresentação com dados de exemplo"}</span>
      <span class="demo-sw"><a href="#" data-sw="c">Cliente</a><a href="#admin" data-sw="a">Dono</a></span>`;
    const mark = () => $$("[data-sw]", bar).forEach(x => x.setAttribute("aria-current", (x.dataset.sw === "a") === location.hash.startsWith("#admin") ? "page" : "false"));
    mark(); window.addEventListener("hashchange", mark);
    $('[data-sw="a"]', bar).onclick = async e => { e.preventDefault(); if (!(await API.getUser())) await API.signIn(); location.hash = "#admin"; };
  }
  let last = location.hash.startsWith("#admin");
  window.addEventListener("hashchange", () => { const now = location.hash.startsWith("#admin"); if (now !== last) { last = now; route(); } });
  route();
})();
