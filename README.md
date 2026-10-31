# Bruno Salgados

App de pedidos para o cliente e painel do dono (vendas, pedidos, caixa, fiado, produtos, stories, WhatsApp e relatórios).

- **Cliente:** `/` — cardápio, stories, sacola, frete por distância e acompanhamento do pedido. Sem login.
- **Dono:** `/#admin` — login com e-mail e senha. A primeira conta criada em "Primeiro acesso" vira a conta do dono.

## Como está montado
- Site estático, sem dependências: o build junta `src/` em um único `public/index.html`.
- Banco de dados, login e fotos: Supabase (projeto `bruno-salgados`, região São Paulo).
- `supabase/functions/whatsapp-send`: envio automático pela API oficial do WhatsApp (precisa dos segredos `WA_TOKEN` e `WA_PHONE_ID`).

## Rodar e publicar
```bash
node build.js          # gera public/index.html
npx serve public       # abre em http://localhost:3000
```
Na Vercel: importe o repositório. O `vercel.json` já define `node build.js` como build e `public` como pasta de saída. Não precisa de variáveis de ambiente (a chave do Supabase usada no navegador é a chave pública).

## Modo apresentação (ligado agora)
`MODO_APRESENTACAO = true` no começo de `src/data.js`: o site usa dados de exemplo, não grava no banco, e o painel do dono abre com um clique, sem e-mail e senha. A barra no topo troca entre **Cliente** e **Dono**.
Para ir para produção (banco real e login do dono), troque para `false`, rode `node build.js` e publique.

## Antes de ir para produção
1. Abra `/#admin` → **Primeiro acesso** e crie a conta do dono.
2. Em **Configurações › Entrega e frete**, digite o endereço completo da loja e toque em **Localizar no mapa** (sem isso o frete fica desligado).
3. Confira preços, fotos e estoque em **Produtos** e abra o caixa em **Caixa**.
