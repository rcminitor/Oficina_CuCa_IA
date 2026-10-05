"""Para testar os comandos do Telegram no seu computador, sem endereço público.

Busca as mensagens do bot (getUpdates) e repassa para a API local, como o webhook faria.
Rodar em outro terminal, com a API ligada:  python bot_local.py
"""
import json
import os
import time
import urllib.request

TOKEN = os.environ["TELEGRAM_TOKEN"]
API_LOCAL = "http://localhost:8000/telegram/webhook"
ultimo = 0

print("Repassando mensagens do bot para a API local. Ctrl+C para parar.")
while True:
    url = f"https://api.telegram.org/bot{TOKEN}/getUpdates?timeout=30&offset={ultimo + 1}"
    with urllib.request.urlopen(url, timeout=40) as r:
        for update in json.loads(r.read().decode("utf-8"))["result"]:
            ultimo = update["update_id"]
            req = urllib.request.Request(
                API_LOCAL, data=json.dumps(update).encode(), method="POST",
                headers={"Content-Type": "application/json",
                         "X-Telegram-Bot-Api-Secret-Token": os.environ.get("TELEGRAM_SEGREDO_WEBHOOK", "")})
            urllib.request.urlopen(req, timeout=60).read()
    time.sleep(1)
