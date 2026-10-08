"""Configura o bot do Telegram em 3 passos guiados (rodar uma vez, na pasta api/).

    python configurar_telegram.py

Faz sozinho: confere o token, descobre o seu chat_id, liga o bot à API publicada (webhook) e
manda uma mensagem de teste. Só usa a biblioteca padrão do Python; o token não é salvo em arquivo.
"""
import getpass
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

import telegram


def chamar(token: str, metodo: str, **params) -> dict:
    """Chama a API do Telegram e devolve o campo `result`; em erro, explica em português e sai."""
    url = f"https://api.telegram.org/bot{token}/{metodo}"
    try:
        dados = urllib.parse.urlencode(params).encode() if params else None
        with urllib.request.urlopen(urllib.request.Request(url, data=dados), timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))["result"]
    except urllib.error.HTTPError as e:
        corpo = e.read().decode("utf-8", "replace")
        if e.code in (401, 404):
            sair("O Telegram não aceitou o token. Copie de novo no @BotFather (/mybots, escolha o bot, API Token) "
                 "e confira se não ficou espaço no começo ou no fim.")
        sair(f"O Telegram recusou o pedido ({e.code}): {corpo}")
    except urllib.error.URLError as e:
        sair(f"Sem conexão com o Telegram: {e.reason}. Confira a internet e tente de novo.")


def sair(mensagem: str):
    print(f"\n✗ {mensagem}")
    sys.exit(1)


def escolher_chat(updates: list) -> int | None:
    """Pega o chat_id da última mensagem recebida em conversa privada (ou None)."""
    for u in reversed(updates):
        chat = (u.get("message") or {}).get("chat") or {}
        if chat.get("type") == "private" and "id" in chat:
            return chat["id"]
    return None


def esperar_enter(texto: str):
    input(f"\n{texto} ")


def acordar_api(url: str) -> None:
    """O plano gratuito do Render dorme; abre /docs até a API responder (até ~2 minutos)."""
    print("Acordando a API (no plano gratuito pode levar até 1 minuto)...")
    for _ in range(12):
        try:
            urllib.request.urlopen(url + "/docs", timeout=30).read()
            return
        except (urllib.error.URLError, TimeoutError):
            time.sleep(10)
    sair("A API não respondeu. Abra o endereço dela no navegador e veja se o Render mostra 'Live'.")


def main():
    print("=== Configurar o bot do Telegram ===")

    print("\nPasso 1 de 3 - O token do bot")
    token = getpass.getpass("Cole o token do bot (não aparece na tela) e aperte Enter: ").strip()
    bot = chamar(token, "getMe")
    print(f"✓ Bot encontrado: @{bot['username']}")

    print("\nPasso 2 de 3 - Descobrir o seu chat_id")
    chamar(token, "deleteWebhook")  # sem isso o Telegram não entrega as mensagens para esta leitura
    print(f"No Telegram, abra o bot @{bot['username']}, aperte Iniciar e mande a mensagem: oi")
    chat_id = None
    for _ in range(12):  # até ~2 minutos
        chat_id = escolher_chat(chamar(token, "getUpdates", timeout=10))
        if chat_id:
            break
        print("  ...esperando a sua mensagem")
    if not chat_id:
        sair(f"Não recebi nenhuma mensagem. Mande 'oi' para @{bot['username']} e rode o programa de novo.")
    print(f"✓ Seu chat_id é {chat_id}")

    print("\nAgora, no Render (serviço oficina-digital-api, página Environment), confira estas duas variáveis:")
    print("   TELEGRAM_TOKEN    = o mesmo token que você acabou de colar")
    print(f"   TELEGRAM_CHAT_ID  = {chat_id}")
    print("Salve e espere o serviço ficar 'Live'.")
    esperar_enter("Quando estiver Live, aperte Enter aqui:")

    print("\nPasso 3 de 3 - Ligar o bot à API")
    api = input("Endereço da API (ex.: https://oficina-digital-api.onrender.com): ").strip().rstrip("/")
    if not api.startswith("https://"):
        sair("O endereço precisa começar com https://")
    acordar_api(api)
    chamar(token, "setWebhook", url=f"{api}/telegram/webhook", secret_token=telegram.segredo_webhook(token))
    print("✓ Bot ligado à API")

    chamar(token, "sendMessage", chat_id=chat_id,
           text="✅ Oficina Digital conectada! Agora mande /abertos para testar.")
    print("\nPronto! O bot mandou uma mensagem para você no Telegram.")
    print("Teste final: responda a ele com  /abertos")
    print("Se ele não responder em 1 minuto, rode este programa de novo e confira o TELEGRAM_CHAT_ID no Render.")


if __name__ == "__main__":
    main()
