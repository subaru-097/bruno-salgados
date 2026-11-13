# Mudar para uma conta nova do Supabase (limpo) e colocar no ar

Tempo estimado: 30 a 40 minutos. Nada de vendas, pedidos, caixa ou clientes de teste vai junto:
só a estrutura do sistema e o cardápio (com estoque zerado).

## 1. Criar o projeto novo
1. Entre na conta nova em supabase.com › **New project**.
2. Nome `bruno-salgados`, região **South America (São Paulo)**, crie uma senha forte para o banco e guarde.
3. Espere o projeto ficar pronto (1 a 2 minutos).

## 2. Montar o banco (1 clique)
1. No projeto novo: **SQL Editor › New query**.
2. Cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Deve terminar sem erro. Isso cria tabelas, segurança, funções do caixa/pedidos/fiado, tempo real,
   a pasta de fotos (`media`) e o cardápio inicial.

## 3. Segurança do login (antes de criar o dono)
Em **Authentication › Sign In / Providers**:
- Desligue **Allow new users to sign up** (ninguém consegue criar conta sozinho).
- Em **Email**, ligue **Prevent use of leaked passwords** se o plano permitir.

## 4. Criar o acesso do dono
1. **Authentication › Users › Add user › Create new user**.
2. Use o e-mail profissional do Bruno e uma senha forte. Marque **Auto Confirm User**.
3. O **primeiro** login feito em `/admin` vira o dono automaticamente. Depois disso, mais ninguém vira dono.

## 5. Apontar o site para o projeto novo
1. No projeto novo: **Project Settings › API Keys** (ou **Connect**). Copie a **Project URL** e a **Publishable key**.
2. No arquivo `src/data.js`, troque as duas primeiras linhas:
   ```js
   const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
   const SUPABASE_KEY = "sb_publishable_...";
   ```
3. Rode `node build.js`, depois `git add -A`, `git commit -m "Supabase novo"` e `git push`. A hospedagem publica sozinha, e o vigia diário passa a acessar o projeto novo automaticamente.
4. No GitHub, atualize o segredo `SUPABASE_DB_URL` com a URI do projeto novo (passo 9).

## 6. WhatsApp automático (opcional)
Só se for usar a API oficial do WhatsApp (o envio manual pelo WhatsApp funciona sem isso):
```bash
npx supabase login
npx supabase functions deploy whatsapp-send --project-ref SEU-PROJETO
npx supabase secrets set WA_TOKEN=... WA_PHONE_ID=... --project-ref SEU-PROJETO
```

## 6b. Pagamento online (Mercado Pago)
1. Publique as funções: `npx supabase functions deploy mp-checkout --no-verify-jwt --project-ref SEU-PROJETO`
   e `npx supabase functions deploy mp-webhook --no-verify-jwt --project-ref SEU-PROJETO`.
2. Guarde o Access Token de produção no cofre (SQL Editor):
   `select vault.create_secret('APP_USR-...', 'mp_access_token');`
   (ou em Edge Functions › Secrets com o nome `MP_ACCESS_TOKEN`).
3. No painel: **Configurações › Pagamentos**, cole a Public Key e ligue "Mostrar Pagar online no app".
4. Se o domínio for diferente de `quiosdatata.online`, crie o segredo `SITE_URLS` com o endereço (ex.: `https://meudominio.com.br`).

## 7. Primeiro acesso na loja nova
1. Abra `/admin` e entre com o e-mail e a senha do passo 4.
2. **Configurações › Entrega e frete**: digite o endereço da loja e toque em **Localizar no mapa**, depois **Salvar**.
   Sem isso o app só aceita retirada.
3. **Configurações › Loja**: WhatsApp, chave Pix, horário e número de mesas.
4. **Produtos**: confira preços, coloque as fotos e lance o estoque do dia.
5. **Caixa**: abra o caixa com o troco inicial.
6. Faça um pedido de teste pelo celular e cancele em seguida (o estoque e o caixa voltam sozinhos).
7. Para zerar também o número do pedido depois do teste, rode no SQL Editor:
   ```sql
   delete from public.orders;  -- apaga o pedido de teste
   delete from public.cash_movements; delete from public.cash_sessions;
   select setval('public.order_code_seq', 1, false);
   ```
   (Só faça isso antes do primeiro pedido real.)

## 8. Hospedagem grátis + domínio próprio
O plano grátis da Vercel (Hobby) é só para uso pessoal, e loja vendendo é uso comercial.
Por isso a recomendação é a **Cloudflare Pages**: grátis, permite uso comercial e o tráfego é ilimitado.
1. Crie a conta em dash.cloudflare.com › **Workers & Pages › Create › Pages › Connect to Git** e escolha o repositório.
2. Configure: Production branch `main`, Build command `node build.js`, Build output directory `public`. Clique em **Save and Deploy**.
3. Em **Custom domains › Set up a domain**, digite o domínio (ex.: `brunosalgados.com.br`) e siga as instruções
   (a Cloudflare mostra exatamente o que mudar no Registro.br).
4. No Supabase: **Authentication › URL Configuration** › coloque o domínio em **Site URL**.
5. Quando o site novo estiver no ar, apague o projeto na Vercel.

A Netlify também serve (arquivo `netlify.toml` já está pronto). A diferença é o limite de tráfego, menor no plano grátis.

## 9. Plano grátis sem susto (vigia, backup e faxina)
**Vigia (já funciona sozinho).** Todo dia às 08:17 o GitHub acessa o banco (`.github/workflows/manter-ativo.yml`).
Isso conta como uso, então o Supabase grátis nunca chega a 7 dias parado. Não precisa configurar nada.
Se der erro, o GitHub manda um e-mail, e o painel mostra o aviso **"O vigia automático parou"**.

**Backup semanal (configure uma vez, 5 minutos).** No GitHub: repositório › **Settings › Secrets and variables › Actions › New repository secret**:
- `SUPABASE_DB_URL`: no Supabase, botão **Connect** › **Session pooler** › copie a URI e troque `[YOUR-PASSWORD]` pela senha do banco.
- `BACKUP_SENHA`: invente uma senha forte só para os backups e **guarde num lugar seguro**. Sem ela, ninguém (nem você) abre o backup.

Depois: aba **Actions › Backup semanal › Run workflow** para testar. O arquivo aparece no ramo `backups`, criptografado.

**Restaurar um backup** (num projeto onde o `schema.sql` já rodou):
```bash
./scripts/restaurar-backup.sh backup-AAAA-MM-DD.sql.gz.gpg "URI-do-session-pooler"
```

**Faxina dos stories (automática).** Ao abrir o painel, os stories vencidos há mais de 2 dias são apagados do armazenamento.
Os vídeos ficam limitados a 15 MB e 15 segundos. Assim o 1 GB grátis dura muito.

Tudo isso aparece em **Configurações › Conta › Saúde do sistema** (data do último sinal e do último backup).

**Recomendado:** deixe o repositório do GitHub **privado** (Settings › General › Danger Zone › Change visibility).
Continua grátis e funciona com a Cloudflare.

## 10. O projeto antigo
Quando tudo estiver funcionando no novo, o projeto antigo pode ser pausado ou apagado.
Nada dele é necessário.

## Observações
- O plano Pro do Supabase (US$ 25/mês) só passa a valer a pena se a loja crescer muito (mais de 500 MB de dados ou 5 GB de tráfego por mês).
- O cálculo de endereço usa serviços públicos gratuitos (ViaCEP, OpenStreetMap). Com muito movimento,
  dá para trocar por Google Maps ou Mapbox sem mexer no resto.
- Pagamento online (Mercado Pago, Asaas, InfinitePay ou Stripe): o banco já aceita o campo da plataforma.
  Falta só criar a função de cobrança quando a plataforma for escolhida.
