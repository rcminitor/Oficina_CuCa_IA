"""Envio de mensagens pelo bot do Telegram (API oficial, sem biblioteca extra)."""
import json
import os
import urllib.parse
import urllib.request


def configurado() -> bool:
    return bool(os.environ.get("TELEGRAM_TOKEN") and os.environ.get("TELEGRAM_CHAT_ID"))


def enviar(texto: str, chat_id: str | None = None) -> None:
    """Envia `texto` ao chat do técnico (ou a `chat_id`). Sem configuração, só imprime."""
    if not configurado():
        print(f"[telegram desligado] {texto}")
        return
    url = f"https://api.telegram.org/bot{os.environ['TELEGRAM_TOKEN']}/sendMessage"
    dados = urllib.parse.urlencode({"chat_id": chat_id or os.environ["TELEGRAM_CHAT_ID"], "text": texto}).encode()
    with urllib.request.urlopen(url, data=dados, timeout=30) as r:
        resposta = json.loads(r.read().decode("utf-8"))
    if not resposta.get("ok"):
        raise RuntimeError(f"Telegram recusou a mensagem: {resposta}")
