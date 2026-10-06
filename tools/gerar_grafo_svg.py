"""Gera site/img/grafo-oficina.svg a partir do graph.json do Graphify.

Uso (na raiz do projeto, depois de rodar /graphify na pasta docs):
    python tools/gerar_grafo_svg.py
Organiza o grafo em três colunas: aparelho -> sintoma ou defeito -> peça.
"""
import html
import json
from pathlib import Path

ORIGEM = Path("graphify-out/graph.json")
DESTINO = Path("site/img/grafo-oficina.svg")
APAR = {"Dell G15", "Acer Nitro 5", "MacBook Air", "Desktop", "Notebook (genérico)"}
SINT = {"Desliga sozinho", "Tela azul", "Não liga", "Tela preta", "Lentidão extrema", "Reinicia em jogos",
        "Bateria não carrega", "Superaquecimento", "Falha de Boot", "Tela Azul (defeito)"}
PECA = {"Pasta Térmica", "Memória RAM", "SSD", "Fonte ATX", "Cooler", "MOSFET Canal N 30V", "Bateria Original A1466",
        "Cabo Flat EDP Nitro 5", "Carregador 130W", "Limpa Contato Isopropílico", "Memória DDR4", "Thermal Pads"}
W, H = 780, 640
CX = {"a": 118, "s": 372, "p": 648}
COR = {"a": "#2563eb", "s": "#b45309", "p": "#15803d"}
FONTE = 'font-family="Inter,Segoe UI,Arial,sans-serif"'


def tipo(rotulo):
    return "a" if rotulo in APAR else "s" if rotulo in SINT else "p" if rotulo in PECA else None


def main():
    g = json.loads(ORIGEM.read_text(encoding="utf-8"))
    lab = {n["id"]: n["label"] for n in g["nodes"]}
    col = {i: tipo(l) for i, l in lab.items() if tipo(l)}
    adj = {i: set() for i in col}
    for e in g["links"]:
        a, b = e["source"], e["target"]
        if a in col and b in col and col[a] != col[b]:
            adj[a].add(b)
            adj[b].add(a)
    ordem = {k: sorted((i for i in col if col[i] == k), key=lambda i: lab[i]) for k in "asp"}
    pos = {}

    def fixa(k):
        n = len(ordem[k])
        for j, i in enumerate(ordem[k]):
            pos[i] = j / max(n - 1, 1)

    for k in "asp":
        fixa(k)
    for _ in range(6):  # reduz cruzamento de linhas (baricentro)
        for k, vizinho in (("s", "a"), ("p", "s"), ("a", "s"), ("s", "p")):
            def bari(i):
                v = [pos[j] for j in adj[i] if col[j] == vizinho]
                return sum(v) / len(v) if v else pos[i]
            ordem[k] = sorted(ordem[k], key=bari)
            fixa(k)
    topo, base = 96, H - 40
    cy = {i: topo + (base - topo) * pos[i] for i in col}
    larg = {i: len(lab[i]) * 8.1 + 30 for i in col}
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Grafo da oficina em três colunas: aparelhos em azul, sintomas em laranja e peças em verde, ligados por linhas">',
         f'<rect width="{W}" height="{H}" rx="24" fill="#fffdf8"/>']
    for k, t in (("a", "APARELHO"), ("s", "SINTOMA OU DEFEITO"), ("p", "PEÇA")):
        s.append(f'<text x="{CX[k]}" y="52" text-anchor="middle" {FONTE} font-size="14" font-weight="700" letter-spacing="1.4" fill="{COR[k]}">{t}</text>')
    vistos = set()
    for a in col:
        for b in adj[a]:
            if (b, a) in vistos:
                continue
            vistos.add((a, b))
            esq, dir_ = (a, b) if "asp".index(col[a]) < "asp".index(col[b]) else (b, a)
            x1, x2 = CX[col[esq]] + larg[esq] / 2, CX[col[dir_]] - larg[dir_] / 2
            y1, y2, m = cy[esq], cy[dir_], (x1 + x2) / 2
            s.append(f'<path d="M{x1:.1f} {y1:.1f} C{m:.1f} {y1:.1f} {m:.1f} {y2:.1f} {x2:.1f} {y2:.1f}" fill="none" stroke="#c3bdae" stroke-width="2"/>')
    for i, k in col.items():
        s.append(f'<rect x="{CX[k] - larg[i] / 2:.1f}" y="{cy[i] - 16:.1f}" width="{larg[i]:.1f}" height="32" rx="16" fill="{COR[k]}"/>')
        s.append(f'<text x="{CX[k]}" y="{cy[i] + 5.5:.1f}" text-anchor="middle" {FONTE} font-size="{16 if k == "a" else 15}" font-weight="{700 if k == "a" else 600}" fill="#fff">{html.escape(lab[i])}</text>')
    s.append("</svg>")
    DESTINO.write_text("\n".join(s), encoding="utf-8")
    print(f"{DESTINO}: {len(col)} nós, {len(vistos)} ligações")


if __name__ == "__main__":
    main()
