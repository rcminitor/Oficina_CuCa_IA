"""Liga o bot do Telegram à API publicada no Render (rodar uma vez, depois do deploy).

    TELEGRAM_TOKEN=... TELEGRAM_SEGREDO_WEBHOOK=... python registrar_webhook.py https://oficina-digital-api.onrender.com
"""
import json
import os
import sys
import urllib.parse
import urllib.request

if len(sys.argv) != 2 or not sys.argv[1].startswith("https://"):
    sys.exit("Uso: python registrar_webhook.py https://SEU-SERVICO.onrender.com")

dados = urllib.parse.urlencode({
    "url": sys.argv[1].rstrip("/") + "/telegram/webhook",
    "secret_token": os.environ["TELEGRAM_SEGREDO_WEBHOOK"],
}).encode()
url = f"https://api.telegram.org/bot{os.environ['TELEGRAM_TOKEN']}/setWebhook"
with urllib.request.urlopen(urllib.request.Request(url, data=dados), timeout=30) as r:
    print(json.loads(r.read().decode("utf-8")))
