# Bruno Salgados

App de pedidos para o cliente e painel do dono (vendas, pedidos, caixa, fiado, produtos, stories, WhatsApp e relatórios).

- **Cliente:** `/` — cardápio, stories, sacola, frete por distância e acompanhamento do pedido. Sem login.
- **Dono:** `/admin` — painel com login. As duas páginas usam o mesmo banco e se atualizam em tempo real.

## Como está montado
- Site estático, sem dependências: o build junta `src/` em um único `public/index.html`.
- Banco de dados, login e fotos: Supabase (projeto `bruno-salgados`, região São Paulo).
- `supabase/schema.sql`: o banco inteiro (estrutura, segurança, funções e cardápio inicial) para recriar em outra conta.
- `supabase/functions/whatsapp-send`: envio automático pela API oficial do WhatsApp (precisa dos segredos `WA_TOKEN` e `WA_PHONE_ID`).

## Rodar e publicar
```bash
node build.js          # gera public/index.html, public/admin.html e public/img/
npx serve public       # abre em http://localhost:3000
```
Hospedagem recomendada (grátis e permite uso comercial): **Cloudflare Pages** ou **Netlify**. Build `node build.js`, pasta `public`. As proteções de segurança vão no `public/_headers`, gerado pelo build. O `vercel.json` continua valendo se usar a Vercel. Não precisa de variáveis de ambiente (a chave do Supabase usada no navegador é a chave pública).

## Acesso do dono
O login do dono é criado no Supabase (Authentication › Users). Nunca escreva senhas neste repositório. Troque a senha e vincule o e-mail profissional em **Configurações › Conta**.

## Antes de começar a vender
1. Em **Configurações › Entrega e frete**, digite o endereço completo da loja e toque em **Localizar no mapa** (sem isso o frete fica desligado).
2. Em **Configurações › Loja**, informe quantas mesas a loja tem.
3. Confira preços, fotos e estoque em **Produtos** e abra o caixa em **Caixa**.

## Mudar de conta do Supabase / domínio
Passo a passo completo em [`MIGRACAO.md`](MIGRACAO.md).

## Plano grátis sem susto
- `.github/workflows/manter-ativo.yml`: acessa o banco todo dia para o Supabase grátis nunca pausar.
- `.github/workflows/backup.yml`: backup criptografado toda segunda, no ramo `backups` (guarda os 8 últimos).
- O painel apaga sozinho os stories vencidos e limita vídeos a 15 MB e 15 segundos.
- Status de tudo em **Configurações › Conta › Saúde do sistema**. Configuração em [`MIGRACAO.md`](MIGRACAO.md).
