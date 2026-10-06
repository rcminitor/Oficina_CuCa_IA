"""Gera as ilustrações do Manual do Aluno em site/img/ (SVG original).

Uso (na raiz do projeto):  python tools/gerar_ilustracoes_manual.py
"""
from pathlib import Path

DESTINO = Path("site/img")
F = 'font-family="Inter,Segoe UI,Arial,sans-serif"'


def svg(w, h, rotulo, corpo, fundo="#eef0ff"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{rotulo}">'
            f'<rect width="{w}" height="{h}" rx="22" fill="{fundo}"/>{corpo}</svg>\n')


def grava(nome, conteudo):
    (DESTINO / f"{nome}.svg").write_text(conteudo, encoding="utf-8")


def pasta(x, y, cor, claro):
    return (f'<g transform="translate({x} {y})"><path d="M0 8 a6 6 0 0 1 6 -6 h22 l8 10 h34 a6 6 0 0 1 6 6 v52 a6 6 0 0 1 -6 6 h-64 a6 6 0 0 1 -6 -6z" fill="{cor}"/>'
            f'<rect x="0" y="22" width="76" height="44" rx="6" fill="{claro}"/></g>')


def folha(x, y, n):
    return (f'<g transform="translate({x} {y})"><rect x="0" y="20" width="84" height="108" rx="8" fill="#fffdf8" stroke="#c3c8f5" stroke-width="3"/>'
            '<g stroke="#c3c8f5" stroke-width="4" stroke-linecap="round"><line x1="14" y1="48" x2="70" y2="48"/><line x1="14" y1="66" x2="70" y2="66"/><line x1="14" y1="84" x2="52" y2="84"/></g>'
            f'<circle cx="42" cy="12" r="14" fill="#4338ca"/><text x="42" y="18" text-anchor="middle" {F} font-size="16" font-weight="700" fill="#fff">{n}</text></g>')


CHECK = 'fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"'
SOMBRA = '<ellipse cx="320" cy="182" rx="260" ry="9" fill="#312e81" opacity=".1"/>'


def capa():
    itens = [("GitHub", 108, True), ("NotebookLM", 164, True), ("Bancada de testes", 220, None), ("Obsidian", 276, False), ("Telegram", 332, False)]
    linhas = []
    for nome, y, feito in itens:
        if feito:
            linhas.append(f'<circle cx="236" cy="{y}" r="14" fill="#16a34a"/><path d="M229 {y} l5 5 l9 -10" {CHECK}/><text x="262" y="{y + 6}">{nome}</text>')
        elif feito is None:
            linhas.append(f'<circle cx="236" cy="{y}" r="14" fill="none" stroke="#4338ca" stroke-width="3.5"/><text x="262" y="{y + 6}">{nome}</text>')
        else:
            linhas.append(f'<circle cx="236" cy="{y}" r="14" fill="none" stroke="#a9aede" stroke-width="3.5"/><text x="262" y="{y + 6}" fill="#6b645a">{nome}</text>')
    corpo = (
        '<g fill="none" stroke="#c3c8f5" stroke-width="3" stroke-linecap="round"><path d="M24 60 H90 L116 86 H170"/><path d="M470 40 H540 L566 66 H616"/></g>'
        '<rect x="190" y="38" width="260" height="344" rx="22" fill="#312e81"/>'
        '<rect x="204" y="62" width="232" height="306" rx="12" fill="#fffdf8"/>'
        '<rect x="278" y="26" width="84" height="34" rx="12" fill="#4338ca"/><circle cx="320" cy="43" r="6" fill="#eef0ff"/>'
        f'<g {F} font-size="17" font-weight="600" fill="#1c1917">{"".join(linhas)}</g>'
        '<g transform="translate(520 300) rotate(35)"><rect x="-9" y="-70" width="18" height="120" rx="3" fill="#f59e0b"/>'
        '<polygon points="-9,50 9,50 0,72" fill="#fde7b0"/><rect x="-9" y="-70" width="18" height="18" rx="3" fill="#b45309"/></g>'
        '<path d="M66 330 v-30 a44 44 0 0 1 88 0 v30" fill="none" stroke="#4338ca" stroke-width="12" stroke-linecap="round"/>'
        '<rect x="46" y="318" width="28" height="48" rx="12" fill="#312e81"/><rect x="138" y="318" width="28" height="48" rx="12" fill="#312e81"/>'
        '<ellipse cx="320" cy="396" rx="270" ry="10" fill="#312e81" opacity=".12"/>')
    grava("manual-capa", svg(640, 420, "Prancheta com as cinco etapas do manual, duas já marcadas, e um fone de ouvido", corpo))


def etapa1():
    corpo = (SOMBRA +
             '<g fill="none" stroke="#a9aede" stroke-width="3" stroke-dasharray="6 6"><path d="M150 100 H250"/><path d="M390 100 H490"/></g>'
             '<path d="M245 78 a34 34 0 0 1 66 -10 a28 28 0 0 1 52 12 a24 24 0 0 1 -6 48 h-104 a24 24 0 0 1 -8 -50z" transform="translate(-6 -18)" fill="#4338ca"/>'
             '<path d="M286 98 h22 l8 8 h30 v34 h-60z" transform="translate(-26 -34)" fill="#fffdf8"/>'
             + pasta(60, 70, "#f59e0b", "#fbbf24") + pasta(504, 70, "#16a34a", "#4ade80") + pasta(284, 120, "#2563eb", "#60a5fa") +
             f'<text x="320" y="24" text-anchor="middle" {F} font-size="14" font-weight="700" fill="#4338ca" letter-spacing="1.2">ARQUIVO DIGITAL CENTRAL</text>')
    grava("etapa1-github", svg(640, 200, "Uma nuvem com pastas de trabalho compartilhadas", corpo))


def etapa2():
    corpo = (SOMBRA + folha(60, 40, 1) + folha(160, 56, 2) + folha(260, 40, 3) +
             '<g transform="translate(470 100)"><path d="M-62 40 v-20 a62 62 0 0 1 124 0 v20" fill="none" stroke="#4338ca" stroke-width="14" stroke-linecap="round"/>'
             '<rect x="-76" y="30" width="30" height="52" rx="13" fill="#312e81"/><rect x="46" y="30" width="30" height="52" rx="13" fill="#312e81"/></g>'
             '<g fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"><path d="M392 120 q-12 12 0 24"/><path d="M380 108 q-24 24 0 48"/><path d="M572 120 q12 12 0 24"/><path d="M584 108 q24 24 0 48"/></g>')
    grava("etapa2-audio", svg(640, 200, "Três documentos e um fone de ouvido com ondas de som", corpo))


def etapa3():
    corpo = (SOMBRA +
             '<rect x="30" y="64" width="134" height="72" rx="18" fill="#fffdf8" stroke="#c3c8f5" stroke-width="3"/>'
             f'<g {F} font-size="13" text-anchor="middle"><text x="97" y="92" font-weight="600" fill="#1c1917">Meu Dell G15</text><text x="97" y="110" font-weight="600" fill="#1c1917">desliga sozinho</text><text x="97" y="127" fill="#6b645a">relato do cliente</text></g>'
             '<path d="M170 100 h30" stroke="#4338ca" stroke-width="4" stroke-linecap="round"/><polygon points="198,92 212,100 198,108" fill="#4338ca"/>'
             '<rect x="218" y="46" width="176" height="108" rx="18" fill="#4338ca"/>'
             f'<g {F} text-anchor="middle" fill="#fff"><text x="306" y="76" font-size="20" font-weight="700">Skill A</text><text x="306" y="98" font-size="14" fill="#dfe3ff">Triagem de sintomas</text>'
             '<text x="306" y="122" font-size="12.5" font-weight="600">Modelo · Sintoma</text><text x="306" y="140" font-size="12.5" font-weight="600">Gravidade</text></g>'
             '<path d="M400 100 h24" stroke="#4338ca" stroke-width="4" stroke-linecap="round"/><polygon points="422,92 436,100 422,108" fill="#4338ca"/>'
             '<rect x="442" y="46" width="170" height="108" rx="18" fill="#15803d"/>'
             f'<g {F} text-anchor="middle" fill="#fff"><text x="527" y="76" font-size="20" font-weight="700">Skill B</text><text x="527" y="98" font-size="14" fill="#d9f7e3">Busca no histórico</text>'
             '<text x="527" y="122" font-size="12.5" font-weight="600">Peça provável</text><text x="527" y="140" font-size="12.5" font-weight="600">Tempo de bancada</text></g>')
    grava("etapa3-skills", svg(640, 200, "Um relato do cliente passa pela Skill A, de triagem, e depois pela Skill B, que indica a peça", corpo))


def etapa4():
    corpo = (SOMBRA +
             '<g stroke="#a9aede" stroke-width="4" stroke-linecap="round"><line x1="120" y1="86" x2="320" y2="86"/><line x1="320" y1="86" x2="520" y2="86"/>'
             '<line x1="120" y1="86" x2="220" y2="142"/><line x1="220" y1="142" x2="420" y2="142"/></g>'
             f'<g {F} font-size="15" font-weight="700" fill="#fff" text-anchor="middle">'
             '<rect x="60" y="68" width="120" height="36" rx="18" fill="#2563eb"/><text x="120" y="92">Dell G15</text>'
             '<rect x="240" y="68" width="160" height="36" rx="18" fill="#b45309"/><text x="320" y="92">Desliga sozinho</text>'
             '<rect x="440" y="68" width="160" height="36" rx="18" fill="#15803d"/><text x="520" y="92">Pasta térmica</text>'
             '<rect x="160" y="124" width="120" height="36" rx="18" fill="#2563eb"/><text x="220" y="148">Acer Nitro</text>'
             '<rect x="360" y="124" width="120" height="36" rx="18" fill="#b45309"/><text x="420" y="148">Tela azul</text></g>'
             f'<g {F} font-size="13" font-weight="600" fill="#3f3a34"><circle cx="40" cy="26" r="7" fill="#2563eb"/><text x="54" y="31">Aparelho</text>'
             '<circle cx="140" cy="26" r="7" fill="#b45309"/><text x="154" y="31">Sintoma</text><circle cx="232" cy="26" r="7" fill="#15803d"/><text x="246" y="31">Peça</text></g>')
    grava("etapa4-obsidian", svg(640, 200, "Quadro com ligações entre aparelho em azul, sintoma em laranja e peça em verde", corpo))


def etapa5():
    corpo = (SOMBRA +
             '<rect x="244" y="14" width="152" height="172" rx="22" fill="#1c1917"/><rect x="254" y="32" width="132" height="142" rx="12" fill="#ffffff"/><rect x="298" y="21" width="44" height="5" rx="2.5" fill="#44403c"/>'
             f'<g {F} font-size="12.5" font-weight="600">'
             '<rect x="300" y="42" width="78" height="24" rx="12" fill="#4338ca"/><text x="339" y="58" text-anchor="middle" fill="#fff">/abertos</text>'
             '<rect x="262" y="72" width="104" height="38" rx="12" fill="#eceaff"/><text x="270" y="88" fill="#1c1917" font-weight="700">#1 Dell G15</text><text x="270" y="103" fill="#1c1917" font-weight="500">Prioridade ALTA</text>'
             '<rect x="304" y="118" width="74" height="24" rx="12" fill="#4338ca"/><text x="341" y="134" text-anchor="middle" fill="#fff">/ver 1</text>'
             '<rect x="296" y="148" width="82" height="24" rx="12" fill="#16a34a"/><text x="337" y="164" text-anchor="middle" fill="#fff">/concluir 1</text></g>'
             '<g transform="translate(130 100)"><circle r="44" fill="#4338ca"/><path d="M-22 0 l44 -18 l-16 36 l-12 -10 l-6 14 l-4 -16z" fill="#fff"/></g>'
             '<path d="M182 100 H236" fill="none" stroke="#a9aede" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 9"/>'
             '<g transform="translate(520 118)"><rect x="-34" y="-20" width="68" height="62" rx="10" fill="#312e81"/><circle cx="-12" cy="10" r="14" fill="#6d74e8"/>'
             '<rect x="8" y="-6" width="18" height="6" rx="3" fill="#6d74e8"/><rect x="8" y="6" width="18" height="6" rx="3" fill="#6d74e8"/>'
             '<line x1="18" y1="-20" x2="40" y2="-70" stroke="#312e81" stroke-width="5" stroke-linecap="round"/></g>'
             '<g fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"><path d="M566 56 q12 -8 24 0"/><path d="M558 42 q20 -16 40 0"/></g>')
    grava("etapa5-telegram", svg(640, 200, "Celular com o bot do Telegram e um rádio do técnico", corpo))


if __name__ == "__main__":
    DESTINO.mkdir(parents=True, exist_ok=True)
    for fn in (capa, etapa1, etapa2, etapa3, etapa4, etapa5):
        fn()
    print("ilustrações geradas em", DESTINO)
