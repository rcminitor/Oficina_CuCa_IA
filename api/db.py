"""Banco de dados (SQLite) dos chamados de manutenção."""
import os
import sqlite3
from datetime import datetime

CAMINHO = os.environ.get("BANCO", "chamados.db")
STATUS = ("aberto", "em_andamento", "concluido")


def conectar():
    con = sqlite3.connect(CAMINHO)
    con.row_factory = sqlite3.Row
    return con


def criar_tabela():
    with conectar() as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS chamados (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                nome        TEXT NOT NULL,
                contato     TEXT NOT NULL,
                equipamento TEXT NOT NULL,
                problema    TEXT NOT NULL,
                status      TEXT NOT NULL DEFAULT 'aberto',
                prioridade  TEXT,
                diagnostico TEXT,
                criado_em   TEXT NOT NULL
            )""")


def inserir(nome, contato, equipamento, problema):
    with conectar() as con:
        cur = con.execute(
            "INSERT INTO chamados (nome, contato, equipamento, problema, criado_em) VALUES (?, ?, ?, ?, ?)",
            (nome, contato, equipamento, problema, datetime.now().isoformat(timespec="seconds")))
        return cur.lastrowid


def buscar(id_):
    with conectar() as con:
        linha = con.execute("SELECT * FROM chamados WHERE id = ?", (id_,)).fetchone()
        return dict(linha) if linha else None


def listar(status=None):
    with conectar() as con:
        if status:
            linhas = con.execute("SELECT * FROM chamados WHERE status = ? ORDER BY id", (status,)).fetchall()
        else:
            linhas = con.execute("SELECT * FROM chamados ORDER BY id").fetchall()
        return [dict(l) for l in linhas]


def atualizar(id_, **campos):
    permitidos = {"status", "prioridade", "diagnostico"}
    campos = {k: v for k, v in campos.items() if k in permitidos}
    if "status" in campos and campos["status"] not in STATUS:
        raise ValueError(f"status inválido: {campos['status']}")
    if not campos:
        return
    sets = ", ".join(f"{k} = ?" for k in campos)
    with conectar() as con:
        con.execute(f"UPDATE chamados SET {sets} WHERE id = ?", (*campos.values(), id_))
