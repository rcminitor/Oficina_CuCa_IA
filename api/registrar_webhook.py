"""Liga o bot do Telegram à API publicada no Render (rodar uma vez, depois do deploy).

    TELEGRAM_TOKEN=... TELEGRAM_SEGREDO_WEBHOOK=... python registrar_webhook.py https://oficina-digital-api.onrender.com
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

if len(sys.argv) != 2 or not sys.argv[1].startswith("https://"):
    sys.exit("Uso: python registrar_webhook.py https://SEU-SERVICO.onrender.com")

segredo = os.environ.get("TELEGRAM_SEGREDO_WEBHOOK", "")
if not re.fullmatch(r"[A-Za-z0-9_-]{1,256}", segredo):
    sys.exit("TELEGRAM_SEGREDO_WEBHOOK deve ter só letras, números, _ e - (1 a 256 caracteres); "
             "o Telegram recusa o resto. Use a mesma senha no Render e aqui.")

dados = urllib.parse.urlencode({
    "url": sys.argv[1].rstrip("/") + "/telegram/webhook",
    "secret_token": segredo,
}).encode()
url = f"https://api.telegram.org/bot{os.environ['TELEGRAM_TOKEN']}/setWebhook"
try:
    with urllib.request.urlopen(urllib.request.Request(url, data=dados), timeout=30) as r:
        print(json.loads(r.read().decode("utf-8")))
except urllib.error.HTTPError as e:  # o Telegram explica o motivo no corpo da resposta
    sys.exit(f"Erro {e.code} do Telegram: {e.read().decode('utf-8', 'replace')}")
