"""Copia os chamados do SQLite (chamados.db) para o Postgres (rodar uma vez).

    DATABASE_URL=postgresql://... python migrar_para_postgres.py [caminho/chamados.db]

Pode rodar de novo sem duplicar: chamados cujo id já existe no Postgres são ignorados.
"""
import os
import sqlite3
import sys
from pathlib import Path

if not os.environ.get("DATABASE_URL", "").startswith(("postgres://", "postgresql://")):
    sys.exit("Defina DATABASE_URL com o endereço do Postgres.")

import db  # noqa: E402  (precisa do DATABASE_URL já definido)

origem = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent / "chamados.db")
if not origem.exists():
    sys.exit(f"Não achei o banco SQLite em {origem}")

lite = sqlite3.connect(origem)
lite.row_factory = sqlite3.Row
linhas = [dict(l) for l in lite.execute("SELECT * FROM chamados ORDER BY id")]
db.criar_tabela()

campos = ("id", "nome", "contato", "equipamento", "problema", "status", "prioridade", "diagnostico", "criado_em")
con = db.conectar()
try:
    with con:
        for l in linhas:
            con.execute(f"INSERT INTO chamados ({', '.join(campos)}) VALUES ({', '.join(['%s'] * len(campos))}) "
                        "ON CONFLICT (id) DO NOTHING", [l[c] for c in campos])
        # a sequência do id precisa continuar depois do maior id copiado
        con.execute("SELECT setval(pg_get_serial_sequence('chamados', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM chamados")
finally:
    con.close()
print(f"{len(linhas)} chamado(s) lido(s) do SQLite e enviados ao Postgres.")
