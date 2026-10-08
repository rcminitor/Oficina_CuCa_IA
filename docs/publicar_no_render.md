# Publicar a API no Render

O site já vai para o GitHub Pages sozinho. Este guia coloca a **API** (chamados, IA e Telegram) na nuvem.

1. Crie conta em <https://render.com> e conecte o GitHub.
2. **New +** → **Blueprint** → escolha este repositório. O Render lê o `render.yaml`.
3. Crie um Postgres gratuito em <https://neon.tech> (ou <https://supabase.com>) e copie o endereço de conexão (`postgresql://...`).
4. Preencha as variáveis secretas: `GEMINI_API_KEY`, `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID` e `DATABASE_URL` (o endereço do passo anterior). Se ainda não sabe o `TELEGRAM_CHAT_ID`, deixe para depois: o programa do passo 6 descobre o número.
5. Aguarde o deploy. Anote a URL, por exemplo `https://oficina-digital-api.onrender.com` (abra `/docs` para conferir).
6. Ligue o bot à API (no seu computador, na pasta `api`). O programa guia você e faz tudo sozinho:
   ```bash
   python configurar_telegram.py
   ```
   Ele pede o token do bot, descobre o seu `chat_id` (você manda `oi` ao bot), mostra o que conferir no Render, liga o bot à API e manda uma mensagem de teste. Depois, mande `/abertos` ao bot.
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

## Se o bot não responder
- Rode `python configurar_telegram.py` de novo: ele refaz a ligação e confere o `chat_id`.
- Confira no Render que `TELEGRAM_TOKEN` e `TELEGRAM_CHAT_ID` são os mesmos que o programa mostrou.
- Não existe mais senha do webhook para inventar: ela é calculada a partir do token. Se você trocar o token no BotFather (`/revoke`), atualize `TELEGRAM_TOKEN` no Render e rode o programa de novo.
