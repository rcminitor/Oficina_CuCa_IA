"""Testes da API (rodam sem IA e sem Telegram). Rodar:  pytest   (dentro da pasta api/)"""
import os

os.environ["BANCO"] = "teste.db"
os.environ["TELEGRAM_CHAT_ID"] = "123"
os.environ["TELEGRAM_SEGREDO_WEBHOOK"] = "segredo"
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


def test_webhook_exige_segredo():
    upd = {"message": {"chat": {"id": 123}, "text": "/abertos"}}
    assert cliente.post("/telegram/webhook", json=upd).status_code == 403
    ok = cliente.post("/telegram/webhook", json=upd, headers={"X-Telegram-Bot-Api-Secret-Token": "segredo"})
    assert ok.status_code == 200
