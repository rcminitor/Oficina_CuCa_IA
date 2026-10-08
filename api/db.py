"""Banco de dados dos chamados de manutenção.

Sem DATABASE_URL usa SQLite (arquivo local, ótimo para estudar e testar).
Com DATABASE_URL (ex.: postgresql://usuario:senha@host/banco) usa Postgres, que não perde os dados
quando a API reinicia na nuvem.
"""
import os
import sqlite3
from datetime import datetime
from pathlib import Path

CAMINHO = os.environ.get("BANCO", str(Path(__file__).resolve().parent / "chamados.db"))
URL_POSTGRES = os.environ.get("DATABASE_URL", "")
POSTGRES = URL_POSTGRES.startswith(("postgres://", "postgresql://"))
STATUS = ("aberto", "em_andamento", "concluido")
P = "%s" if POSTGRES else "?"  # marcador de parâmetro de cada banco

COLUNAS = """
    nome        TEXT NOT NULL,
    contato     TEXT NOT NULL,
    equipamento TEXT NOT NULL,
    problema    TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'aberto',
    prioridade  TEXT,
    diagnostico TEXT,
    criado_em   TEXT NOT NULL"""
CHAVE = "id SERIAL PRIMARY KEY," if POSTGRES else "id INTEGER PRIMARY KEY AUTOINCREMENT,"


def conectar():
    if POSTGRES:
        import psycopg
        from psycopg.rows import dict_row
        return psycopg.connect(URL_POSTGRES, row_factory=dict_row)
    con = sqlite3.connect(CAMINHO)
    con.row_factory = sqlite3.Row
    return con


def executar(con, sql, params=()):
    return con.execute(sql, params)  # sqlite3 e psycopg 3 aceitam con.execute e devolvem um cursor


def criar_tabela():
    con = conectar()
    try:
        with con:
            executar(con, f"CREATE TABLE IF NOT EXISTS chamados ({CHAVE}{COLUNAS})")
    finally:
        con.close()


def inserir(nome, contato, equipamento, problema):
    agora = datetime.now().isoformat(timespec="seconds")
    con = conectar()
    try:
        with con:
            if POSTGRES:
                cur = executar(
                    con, f"INSERT INTO chamados (nome, contato, equipamento, problema, criado_em) "
                         f"VALUES ({P}, {P}, {P}, {P}, {P}) RETURNING id", (nome, contato, equipamento, problema, agora))
                return cur.fetchone()["id"]
            cur = executar(
                con, f"INSERT INTO chamados (nome, contato, equipamento, problema, criado_em) "
                     f"VALUES ({P}, {P}, {P}, {P}, {P})", (nome, contato, equipamento, problema, agora))
            return cur.lastrowid
    finally:
        con.close()


def buscar(id_):
    con = conectar()
    try:
        linha = executar(con, f"SELECT * FROM chamados WHERE id = {P}", (id_,)).fetchone()
        return dict(linha) if linha else None
    finally:
        con.close()


def listar(status=None):
    con = conectar()
    try:
        if status:
            linhas = executar(con, f"SELECT * FROM chamados WHERE status = {P} ORDER BY id", (status,)).fetchall()
        else:
            linhas = executar(con, "SELECT * FROM chamados ORDER BY id").fetchall()
        return [dict(l) for l in linhas]
    finally:
        con.close()


def atualizar(id_, **campos):
    permitidos = {"status", "prioridade", "diagnostico"}
    campos = {k: v for k, v in campos.items() if k in permitidos}
    if "status" in campos and campos["status"] not in STATUS:
        raise ValueError(f"status inválido: {campos['status']}")
    if not campos:
        return
    sets = ", ".join(f"{k} = {P}" for k in campos)
    con = conectar()
    try:
        with con:
            executar(con, f"UPDATE chamados SET {sets} WHERE id = {P}", (*campos.values(), id_))
    finally:
        con.close()
