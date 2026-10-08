"""Testes da API (rodam sem IA e sem Telegram). Rodar:  pytest   (dentro da pasta api/)"""
import os

os.environ["BANCO"] = "teste.db"
os.environ["TELEGRAM_CHAT_ID"] = "123"
os.environ.pop("MODELO_IA", None)
os.environ.pop("TELEGRAM_TOKEN", None)
if os.path.exists("teste.db"):
    os.remove("teste.db")

from fastapi.testclient import TestClient  # noqa: E402

import db  # noqa: E402
from main import app, responder  # noqa: E402

cliente = TestClient(app)
CHAMADO = {"nome": "Ana", "contato": "ana@email.com", "equipamento": "Notebook Dell",
           "problema": "O notebook não liga desde ontem"}


def test_abrir_e_consultar_chamado():
    r = cliente.post("/chamados", json=CHAMADO)
    assert r.status_code == 201
    id_ = r.json()["id"]
    c = cliente.get(f"/chamados/{id_}").json()
    assert c["status"] == "aberto"
    assert c["prioridade"] == "alta"          # "não liga" -> alta, pela triagem simples
    assert "contato" not in c                 # dado pessoal não é exposto


def test_validacao_rejeita_relato_curto():
    assert cliente.post("/chamados", json={**CHAMADO, "problema": "ruim"}).status_code == 422


def test_chamado_inexistente():
    assert cliente.get("/chamados/9999").status_code == 404


def test_comandos_do_tecnico():
    id_ = cliente.post("/chamados", json=CHAMADO).json()["id"]
    assert f"#{id_}" in responder("/abertos")
    assert "em_andamento" in responder(f"/andamento {id_}")
    assert "concluido" in responder(f"/concluir {id_}")
    assert db.buscar(id_)["status"] == "concluido"


def test_segredo_do_webhook_e_derivado_do_token_e_aceito_pelo_telegram():
    import re

    import telegram
    seg = telegram.segredo_webhook("123456:ABC")
    assert re.fullmatch(r"[A-Za-z0-9_-]{1,256}", seg)           # o Telegram só aceita estes caracteres
    assert seg == telegram.segredo_webhook("123456:ABC")        # sempre o mesmo para o mesmo token
    assert seg != telegram.segredo_webhook("123456:XYZ")


def test_webhook_exige_segredo(monkeypatch):
    import telegram
    monkeypatch.setenv("TELEGRAM_TOKEN", "123456:ABC")
    monkeypatch.setattr(telegram, "enviar", lambda *a, **k: None)   # não fala com o Telegram de verdade
    upd = {"message": {"chat": {"id": 123}, "text": "/abertos"}}
    assert cliente.post("/telegram/webhook", json=upd).status_code == 403
    errado = {"X-Telegram-Bot-Api-Secret-Token": "segredo-errado"}
    assert cliente.post("/telegram/webhook", json=upd, headers=errado).status_code == 403
    certo = {"X-Telegram-Bot-Api-Secret-Token": telegram.segredo_webhook("123456:ABC")}
    assert cliente.post("/telegram/webhook", json=upd, headers=certo).status_code == 200


def test_webhook_fechado_sem_token(monkeypatch):
    monkeypatch.delenv("TELEGRAM_TOKEN", raising=False)
    upd = {"message": {"chat": {"id": 123}, "text": "/abertos"}}
    assert cliente.post("/telegram/webhook", json=upd, headers={"X-Telegram-Bot-Api-Secret-Token": ""}).status_code == 403


def test_configurar_telegram_acha_o_chat_privado():
    import configurar_telegram
    grupo = {"message": {"chat": {"id": -5, "type": "group"}}}
    eu = {"message": {"chat": {"id": 93372553, "type": "private"}}}
    assert configurar_telegram.escolher_chat([eu, grupo]) == 93372553
    assert configurar_telegram.escolher_chat([grupo]) is None
    assert configurar_telegram.escolher_chat([]) is None
