"""Envio de mensagens pelo bot do Telegram (API oficial, sem biblioteca extra)."""
import hashlib
import json
import os
import urllib.parse
import urllib.request


def segredo_webhook(token: str) -> str:
    """Senha do webhook derivada do token do bot: ninguém precisa inventar, copiar nem conferir.

    O resultado tem só 0-9 e a-f, que o Telegram aceita. Quem tem o token chega ao mesmo valor.
    """
    return hashlib.sha256(f"oficina-digital-webhook:{token}".encode()).hexdigest()


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
