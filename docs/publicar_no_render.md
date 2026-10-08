# Publicar a API no Render

O site já vai para o GitHub Pages sozinho. Este guia coloca a **API** (chamados, IA e Telegram) na nuvem.

1. Crie conta em <https://render.com> e conecte o GitHub.
2. **New +** → **Blueprint** → escolha este repositório. O Render lê o `render.yaml`.
3. Crie um Postgres gratuito em <https://neon.tech> (ou <https://supabase.com>) e copie o endereço de conexão (`postgresql://...`).
4. Preencha as variáveis secretas: `GEMINI_API_KEY`, `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID` e `DATABASE_URL` (o endereço do passo anterior).
5. Aguarde o deploy. Anote a URL, por exemplo `https://oficina-digital-api.onrender.com` (abra `/docs` para conferir).
6. Invente uma senha para o webhook com **só letras, números, `_` e `-`** (o Telegram recusa `+`, `/`, `=` etc.), por exemplo no PowerShell: `-join ((48..57+65..90+97..122) | Get-Random -Count 40 | % {[char]$_})`. Coloque-a em `TELEGRAM_SEGREDO_WEBHOOK` na aba **Environment**, espere o deploy e registre o webhook, no seu computador:
   ```bash
   cd api
   export TELEGRAM_TOKEN=... TELEGRAM_SEGREDO_WEBHOOK=...
   python registrar_webhook.py https://oficina-digital-api.onrender.com
   ```
7. No site (`painel.html`), configure a URL da API para o endereço do Render.

## Banco de dados
- Sem `DATABASE_URL` a API usa SQLite (arquivo `chamados.db`), ideal para estudar no computador.
- Com `DATABASE_URL` usa Postgres: os chamados **não se perdem** quando a API reinicia ou faz deploy.
- Para levar chamados antigos do SQLite para o Postgres (uma vez, no seu computador):
  ```bash
  cd api
  pip install "psycopg[binary]"
  export DATABASE_URL=postgresql://...
  python migrar_para_postgres.py chamados.db
  ```
  Pode rodar de novo sem duplicar.

## Limites do plano gratuito
- A API **dorme** após ~15 min parada; o primeiro acesso leva cerca de 1 minuto.
- O plano gratuito do Neon também pausa o banco quando ocioso (acorda sozinho em instantes).
- Na nuvem **não é preciso** rodar `automacao_chamados.py` nem `bot_local.py`: a API já faz a triagem em segundo plano e recebe o Telegram por webhook.
