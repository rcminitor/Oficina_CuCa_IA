"""Gera site/manual.css (estilo ampliado do Manual do Aluno, sem emojis).

Uso (na raiz do projeto):  python tools/gerar_manual_css.py
Os ícones dos avisos são máscaras SVG embutidas, que herdam a cor do tema.
"""
from pathlib import Path
from urllib.parse import quote

ICONES = {
    "alert": "<path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'/><line x1='12' y1='9' x2='12' y2='13'/><line x1='12' y1='17' x2='12.01' y2='17'/>",
    "info": "<circle cx='12' cy='12' r='10'/><line x1='12' y1='16' x2='12' y2='12'/><line x1='12' y1='8' x2='12.01' y2='8'/>",
    "camera": "<path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/>",
    "check": "<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/>",
    "copy": "<rect x='9' y='9' width='13' height='13' rx='2'/><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/>",
    "ext": "<path d='M7 17L17 7'/><polyline points='7 7 17 7 17 17'/>",
}


def mascara(nome):
    svg = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' "
           f"stroke-linecap='round' stroke-linejoin='round'>{ICONES[nome]}</svg>")
    url = f'url("data:image/svg+xml,{quote(svg)}")'
    return f"-webkit-mask: {url} center / contain no-repeat; mask: {url} center / contain no-repeat;"


CSS = """/* Manual do Aluno: mesmo conceito da página inicial (letra maior, imagens, sem emojis). */
.manual { font-size: 1.2rem; }
.manual .topo-in, .manual .abas, .manual main { max-width: 1060px; }
.manual main { padding-top: 0; }
.manual .hero-home { padding-top: 3rem; }
.manual .hero-home h1 { font-size: clamp(2.3rem, 5vw, 3.4rem); }
.manual .hero-home img { border-radius: 24px; }

.manual .progresso { padding: 1.3rem 1.5rem; border-radius: var(--r-lg); box-shadow: var(--sombra); margin: 2rem 0 1rem; }
.manual .progresso strong { font-size: 1.2rem; }
.manual .barra { height: 14px; margin-top: .7rem; }

.manual h2.titulo-sec { font-size: clamp(1.6rem, 3.2vw, 2.1rem); margin: 3rem 0 1rem; }
.percurso { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: .9rem; }
.percurso a { display: flex; flex-direction: column; gap: .35rem; height: 100%; text-decoration: none; color: var(--texto); background: var(--surface); border: 1px solid var(--borda); border-radius: var(--r-lg); padding: 1.2rem 1.1rem; box-shadow: var(--sombra); transition: transform .15s, border-color .15s; }
.percurso a:hover { transform: translateY(-3px); border-color: var(--acento); }
.percurso .n { width: 40px; height: 40px; border-radius: 999px; background: var(--acento); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 1.1rem; margin-bottom: .4rem; }
:root[data-theme="dark"] .percurso .n { background: #6d74e8; }
.percurso strong { font-family: var(--font-serif); font-size: 1.15rem; line-height: 1.25; }
.percurso span.f { color: var(--suave); font-size: .98rem; }

.como-usar { margin: 1rem 0 0; padding-top: .9rem; border-top: 1px solid var(--borda); font-size: 1.05rem; line-height: 1.55; color: var(--leve); }
.sub-sec { color: var(--suave); font-size: 1.15rem; margin: -.4rem 0 1.4rem; max-width: 46rem; }
.provas { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; }
.prova-card { background: var(--surface); border: 1px solid var(--borda); border-radius: var(--r-lg); padding: 1.3rem; box-shadow: var(--sombra); }
.prova-card .ico { width: 52px; height: 52px; border-radius: 14px; background: var(--verde-sup); color: var(--verde); display: grid; place-items: center; font-size: 1.7rem; margin-bottom: .8rem; }
.prova-card h3 { margin: 0 0 .3rem; font-size: 1.2rem; }
.prova-card p { margin: 0; color: var(--suave); font-size: 1.02rem; line-height: 1.5; }

.manual .etapa > summary { font-size: 1.45rem; padding: 1.2rem 1.4rem; gap: 1.1rem; }
.manual .num { width: 46px; height: 46px; font-size: 1.15rem; }
.manual .corpo { font-size: 1.15rem; padding: 0 1.6rem 1.7rem; }
.manual .corpo h3 { font-size: 1.25rem; margin-top: 1.8rem; }
.manual .corpo li { margin: .7rem 0; }
.manual .arte { display: block; width: 100%; height: auto; border-radius: 18px; margin: 1.4rem 0 .6rem; }
.manual pre { font-size: 1.02rem; }

.manual .aviso, .manual .dica, .manual .prova, .manual .ok, .manual .erro { display: grid; grid-template-columns: 1.7rem 1fr; gap: .9rem; align-items: start; padding: 1rem 1.2rem; }
.manual .aviso::before, .manual .dica::before, .manual .prova::before, .manual .ok::before, .manual .erro::before { content: ""; width: 1.6rem; height: 1.6rem; margin-top: .1rem; background: currentColor; }
.manual .cb { min-width: 0; }
.manual .aviso::before { color: var(--laranja); @@alert@@ }
.manual .dica::before { color: var(--acento); @@info@@ }
.manual .prova::before { color: var(--verde); @@camera@@ }
.manual .ok::before { color: var(--verde); @@check@@ }
.manual .erro::before { color: var(--vermelho); @@alert@@ }

.manual .copiar { font-size: 1.05rem; }
.manual .copiar::before { content: ""; width: 1.1em; height: 1.1em; background: currentColor; @@copy@@ }
.manual .btn-doc { display: inline-flex; align-items: center; gap: .5rem; padding: .6rem 1.2rem; }
.manual .btn-doc::after { content: ""; width: 1em; height: 1em; background: currentColor; @@ext@@ }

@media (max-width: 960px) { .percurso { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) {
  .manual { font-size: 1.1rem; }
  .percurso { grid-template-columns: 1fr; }
  .manual .corpo { padding: 0 1.1rem 1.4rem; }
  .manual .etapa > summary { font-size: 1.25rem; padding: 1rem; }
}
"""

if __name__ == "__main__":
    css = CSS
    for nome in ICONES:
        css = css.replace(f"@@{nome}@@", mascara(nome))
    Path("site/manual.css").write_text(css, encoding="utf-8")
    print("site/manual.css gerado")
