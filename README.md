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

> **Alunos adultos / iniciantes:** comece pelo [Roteiro](https://rcminitor.github.io/Oficina_CuCa_IA/roteiro.html), que junta os 13 passos na ordem. O aluno cria a própria pasta, abre no Antigravity e **constrói o projeto com o Gemini**, guiado pelo [Manual](https://rcminitor.github.io/Oficina_CuCa_IA/aluno.html), pelo [Tutorial](https://rcminitor.github.io/Oficina_CuCa_IA/tutorial.html) e pelo NotebookLM; só no final leva a pasta ao GitHub. As chaves e senhas estão no [Guia das chaves](https://rcminitor.github.io/Oficina_CuCa_IA/chaves.html). Versão em texto: [MANUAL_DO_ALUNO.md](MANUAL_DO_ALUNO.md). Documentos de estudo em `docs/notebooklm/` e prompts em [`docs/prompts_skills.md`](docs/prompts_skills.md). O projeto desta pasta (`api/`, `site/`) é o **gabarito do professor**.

## Material do professor

| Arquivo | Para que serve |
|---|---|
| [`docs/folha_de_teste.docx`](docs/folha_de_teste.docx) | Percorrer o Roteiro como aluno e anotar o que não bate com as telas reais. Abra no Word ou no Google Docs e preencha no computador. Fonte: [`.md`](docs/folha_de_teste.md); para atualizar o `.docx`, rode `python tools/gerar_folha_docx.py`. |
| [`docs/avisos_classroom.md`](docs/avisos_classroom.md) | Seis avisos prontos para o Google Classroom. |
| [`docs/modelo_tarefas_classroom.md`](docs/modelo_tarefas_classroom.md) | Seis tarefas do Classroom com rubrica e o modelo do portfólio onde o aluno cola os comprovantes. |
| [`GUIA_DO_ALUNO.md`](GUIA_DO_ALUNO.md) | Como rodar o projeto de referência (gabarito). |

> **Diferença importante:** o gabarito lê as chaves das **variáveis de ambiente** (`$env:...`). O aluno, no Tutorial, guarda as chaves num arquivo `.env` que o próprio projeto dele lê com `python-dotenv`.

## Como rodar o projeto de referência (gabarito)

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

