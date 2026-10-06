# Oficina Digital 🛠️

Sistema inteligente e didático de assistência técnica de computadores: o cliente abre chamados pelo site (ou GitHub Pages), a IA com Google Gemini e Grafo de Conhecimento (Graphify / GraphRAG) diagnostica falhas com base no histórico da oficina, e o técnico recebe alertas em tempo real e gerencia a bancada via Bot do Telegram.

| Parte | Tecnologia | Onde roda |
|---|---|---|
| Site (`site/`) | HTML, CSS e JavaScript | GitHub Pages |
| API (`api/`) | Python + FastAPI + SQLite | Render (ou o seu PC) |
| Triagem | CrewAI (2 agentes) ou regras simples | dentro da API |
| Avisos e comandos | Bot do Telegram | dentro da API |
| Memória e Grafo | Gemini 2.5 + Grafo de Conhecimento (Graphify) | `api/grafo_conhecimento.py` |
| Automação Python | Pipeline autônomo de chamados | `api/automacao_chamados.py` |
| Laboratório do Aluno | Jupyter Notebook / Google Colab | `notebooks/laboratorio_gemini_graphify.ipynb` |

> 📘 **Alunos adultos / iniciantes:** comece pelo [Manual do Aluno](MANUAL_DO_ALUNO.md) (linguagem simples, áudio e prints). Documentos do NotebookLM em `docs/notebooklm/` e prompts em [`docs/prompts_skills.md`](docs/prompts_skills.md).

## 🚀 Como Rodar o Projeto (Guia do Aluno na pasta `Downloads`)

Como cada aluno desenvolverá a sua própria cópia do projeto, o fluxo padrão é baixar o código diretamente para a pasta **`Downloads`** da sua máquina:

### 1. Entrar na pasta do projeto no Terminal / PowerShell
Abra o **PowerShell** ou **Terminal** e navegue até a pasta do projeto em Downloads:

**No Windows (PowerShell):**
```powershell
cd "$env:USERPROFILE\Downloads\oficina-digital"
```

**No Linux / Mac:**
```bash
cd ~/Downloads/oficina-digital
```

---

### 2. Configurar o Ambiente Virtual e Dependências
Dentro da pasta `oficina-digital`:

```bash
cd api
python -m venv .venv

# Ativar ambiente virtual:
.venv\Scripts\activate       # No Windows
# source .venv/bin/activate  # No Linux/Mac

# Instalar pacotes
pip install -r requirements.txt
```

---

### 3. Rodar os Testes e Subir a API
```bash
pytest                      # Executa os 5 testes automatizados
uvicorn main:app --reload   # Inicia a API em http://localhost:8000
```
Em seguida, abra o arquivo `site/painel.html` com dois cliques no navegador para visualizar o site de atendimento.

---

### 4. 🧠 Laboratório Interativo: Gemini Notebook (Colab / Jupyter)
Cada aluno tem seu próprio notebook guiado em:
`notebooks/laboratorio_gemini_graphify.ipynb`

Para abrir localmente no VS Code ou Jupyter:
```bash
code .                      # Abre a pasta no VS Code
# ou:
jupyter notebook notebooks/laboratorio_gemini_graphify.ipynb
```
*Dica:* O notebook também pode ser arrastado e aberto diretamente no [Google Colab](https://colab.research.google.com/).

---

### 5. 🤖 Automação em Python com o Grafo de Conhecimento
Em um novo terminal (com a venv ativada), execute a automação em segundo plano:
```bash
python api/automacao_chamados.py --continuo --intervalo 5
```
A automação varre o banco `api/chamados.db`, consulta os sintomas no Grafo de Conhecimento, gera o diagnóstico enriquecido com Gemini e notifica o Telegram automaticamente!

