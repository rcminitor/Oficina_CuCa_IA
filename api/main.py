"""API da Oficina Digital: recebe chamados do site, aciona a equipe de IA e avisa o técnico no Telegram.

Rodar:  uvicorn main:app --reload      (dentro da pasta api/)
Docs:   http://localhost:8000/docs
"""
import os

from fastapi import BackgroundTasks, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import db
import equipe_ia
import telegram

app = FastAPI(title="Oficina Digital")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("ORIGENS_PERMITIDAS", "*").split(","),  # ex.: https://SEU_USUARIO.github.io
    allow_methods=["GET", "POST"], allow_headers=["*"])
db.criar_tabela()


class NovoChamado(BaseModel):
    nome: str = Field(min_length=2, max_length=80)
    contato: str = Field(min_length=5, max_length=80)        # e-mail ou telefone
    equipamento: str = Field(min_length=2, max_length=80)
    problema: str = Field(min_length=10, max_length=1000)


def processar(id_: int) -> None:
    """Roda depois da resposta ao cliente: IA + aviso ao técnico (pode levar alguns segundos)."""
    chamado = db.buscar(id_)
    try:
        d = equipe_ia.analisar(chamado)
        db.atualizar(id_, prioridade=d.prioridade, diagnostico=f"{d.causa_provavel}\n{d.proximos_passos}")
        resumo = f"Prioridade: {d.prioridade.upper()}\nCausa provável: {d.causa_provavel}\nPróximos passos: {d.proximos_passos}"
    except Exception as e:  # a IA falhou: o chamado continua aberto, sem diagnóstico
        resumo = f"(falha na triagem automática: {e})"
    telegram.enviar(f"🔧 Chamado #{id_} — {chamado['nome']}\n{chamado['equipamento']}: {chamado['problema']}\n\n{resumo}")


@app.post("/chamados", status_code=201)
def abrir_chamado(dados: NovoChamado, tarefas: BackgroundTasks):
    id_ = db.inserir(dados.nome, dados.contato, dados.equipamento, dados.problema)
    tarefas.add_task(processar, id_)
    return {"id": id_, "status": "aberto"}


@app.get("/chamados/{id_}")
def consultar(id_: int):
    chamado = db.buscar(id_)
    if not chamado:
        raise HTTPException(404, "Chamado não encontrado")
    # o cliente vê o andamento e o diagnóstico, não os dados de contato
    return {k: chamado[k] for k in ("id", "equipamento", "status", "prioridade", "diagnostico", "criado_em")}


# --- comandos do técnico no Telegram ------------------------------------------------------------

AJUDA = "Comandos: /abertos · /ver ID · /andamento ID · /concluir ID"


@app.post("/telegram/webhook")
def webhook(update: dict, x_telegram_bot_api_secret_token: str | None = Header(default=None)):
    if x_telegram_bot_api_secret_token != os.environ.get("TELEGRAM_SEGREDO_WEBHOOK"):
        raise HTTPException(403, "origem não autorizada")
    msg = update.get("message") or {}
    chat_id = str(msg.get("chat", {}).get("id", ""))
    if chat_id != os.environ.get("TELEGRAM_CHAT_ID"):  # só o técnico manda comandos
        return {"ok": True}
    telegram.enviar(responder(msg.get("text", "").strip()), chat_id)
    return {"ok": True}


def responder(texto: str) -> str:
    partes = texto.split()
    if not partes:
        return AJUDA
    comando, arg = partes[0].lower(), (partes[1] if len(partes) > 1 else "")
    if comando == "/abertos":
        abertos = db.listar("aberto") + db.listar("em_andamento")
        return "\n".join(f"#{c['id']} [{c['prioridade'] or '?'}] {c['equipamento']} — {c['status']}" for c in abertos) or "Nenhum chamado aberto 🎉"
    if comando in ("/ver", "/andamento", "/concluir"):
        if not arg.isdigit() or not db.buscar(int(arg)):
            return "Informe um número de chamado válido. " + AJUDA
        if comando == "/ver":
            c = db.buscar(int(arg))
            return f"#{c['id']} {c['nome']} ({c['contato']})\n{c['equipamento']}: {c['problema']}\nStatus: {c['status']}\n{c['diagnostico'] or ''}"
        novo = "em_andamento" if comando == "/andamento" else "concluido"
        db.atualizar(int(arg), status=novo)
        return f"Chamado #{arg} → {novo}"
    return AJUDA
