# Publicar a API no Render

O site já vai para o GitHub Pages sozinho. Este guia coloca a **API** (chamados, IA e Telegram) na nuvem.

1. Crie conta em <https://render.com> e conecte o GitHub.
2. **New +** → **Blueprint** → escolha este repositório. O Render lê o `render.yaml`.
3. Preencha as três variáveis secretas: `GEMINI_API_KEY`, `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID`.
4. Aguarde o deploy. Anote a URL, por exemplo `https://oficina-digital-api.onrender.com` (abra `/docs` para conferir).
5. Copie o valor de `TELEGRAM_SEGREDO_WEBHOOK` (aba **Environment**) e registre o webhook, no seu computador:
   ```bash
   cd api
   export TELEGRAM_TOKEN=... TELEGRAM_SEGREDO_WEBHOOK=...
   python registrar_webhook.py https://oficina-digital-api.onrender.com
   ```
6. No site (`painel.html`), configure a URL da API para o endereço do Render.

## Limites do plano gratuito
- A API **dorme** após ~15 min parada; o primeiro acesso leva cerca de 1 minuto.
- O banco SQLite **zera** a cada deploy/reinício. Para guardar os chamados, use `plan: starter` com o disco comentado no `render.yaml` e `BANCO=/var/data/chamados.db`.
- Na nuvem **não é preciso** rodar `automacao_chamados.py` nem `bot_local.py`: a API já faz a triagem em segundo plano e recebe o Telegram por webhook.
