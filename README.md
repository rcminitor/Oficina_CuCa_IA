# Oficina Digital

Site de assistência técnica de computadores: o cliente abre um chamado pelo site, uma equipe de agentes de IA (CrewAI) faz a triagem e o técnico recebe o aviso e gerencia os chamados pelo Telegram.

| Parte | Tecnologia | Onde roda |
|---|---|---|
| Site (`site/`) | HTML, CSS e JavaScript | GitHub Pages |
| API (`api/`) | Python + FastAPI + SQLite | Render (ou o seu PC) |
| Triagem | CrewAI (2 agentes) ou regras simples | dentro da API |
| Avisos e comandos | Bot do Telegram | dentro da API |

```bash
cd api
python -m venv .venv && .venv\Scripts\activate   # Windows
pip install -r requirements.txt
pytest                      # 5 testes
uvicorn main:app --reload   # http://localhost:8000/docs
```
Depois, abra `site/index.html` no navegador.
