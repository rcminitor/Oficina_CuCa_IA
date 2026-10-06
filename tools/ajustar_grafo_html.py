"""Ajusta o site/grafo.html gerado pelo Graphify para combinar com o resto do site.

O Graphify recria o arquivo em inglês e sem navegação. Rode este script depois de
cada geração: python tools/ajustar_grafo_html.py
É seguro rodar mais de uma vez.
"""
from pathlib import Path

ARQ = Path(__file__).resolve().parent.parent / "site" / "grafo.html"
MARCA = "<!-- ajuste-oficina -->"

BARRA = MARCA + """
<style>
  .voltar { position: fixed; top: 10px; left: 10px; z-index: 10; display: flex; gap: 6px; font-family: -apple-system, "Segoe UI", sans-serif; }
  .voltar a { background: #1a1a2e; color: #e0e0e0; border: 1px solid #3a3a5e; border-radius: 999px; padding: 8px 16px; font-size: 15px; text-decoration: none; }
  .voltar a:hover, .voltar a:focus { background: #2a2a4e; outline: 2px solid #4E79A7; }
  .so-leitor { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
<nav class="voltar" aria-label="Navegação"><a href="index.html">Início</a><a href="roteiro.html">Roteiro</a><a href="aluno.html">Manual</a></nav>
<h1 class="so-leitor">Grafo da oficina: aparelho, sintoma, causa e peça</h1>
"""

t = ARQ.read_text(encoding="utf8")
if MARCA in t:
    print("Já ajustado.")
else:
    t = t.replace('<html lang="en">', '<html lang="pt-BR">', 1)
    t = t.replace("<title>graphify - graphify-out/graph.html</title>", "<title>Oficina Digital — Grafo da oficina</title>", 1)
    t = t.replace("<body>", "<body>\n" + BARRA, 1)
    ARQ.write_text(t, encoding="utf8")
    print("Ajustado:", ARQ)
