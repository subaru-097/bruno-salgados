const fs = require("fs");
const r = f => fs.readFileSync(__dirname + "/src/" + f, "utf8");
const css = r("style.css");
const js = ["photos.js", "data.js", "ui.js", "client.js", "admin.js", "live.js", "msgs.js", "main.js"].map(r).join("\n");


const headBits = `<title>Bruno Salgados</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Peça salgados fresquinhos da Bruno Salgados para entrega ou retirada.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<style>${css}</style>`;
const bodyBits = `<div class="demo-bar" id="demo-bar" hidden></div>
<div id="app"></div>
<div id="toasts" aria-live="polite"></div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"></script>
<script>
${js}
</script>`;

fs.mkdirSync(__dirname + "/public", { recursive: true });
// versão completa para hospedar (Netlify, Vercel, GitHub Pages…)
const full = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#100D0B">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Bruno Salgados">
<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-192.png"><link rel="icon" href="icon-192.png">
<meta property="og:title" content="Bruno Salgados"><meta property="og:description" content="Peça salgados fresquinhos para entrega ou retirada.">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${headBits}
</head><body>
${bodyBits}
</body></html>`;

fs.writeFileSync(__dirname + "/public/index.html", full);
console.log("ok", (fs.statSync(__dirname + "/public/index.html").size / 1024).toFixed(0) + " KB");
