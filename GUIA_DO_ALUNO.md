# 🎓 Guia Técnico do Aluno: Oficina Digital
> **Objetivo:** colocar no ar, no seu computador, um sistema de assistência técnica inteligente:
> **Site ➔ API FastAPI ➔ Grafo de Conhecimento ➔ Bot do Telegram** (e, opcional, a Automação Python).

> 📘 **Prefere ver passo a passo, com botão de copiar?** Use o **[Tutorial no site](https://rcminitor.github.io/Oficina_CuCa_IA/tutorial.html)**. Este guia é a versão em texto, para consulta.

---

## 🗺️ Mapa da sua missão

Você completa **5 etapas**. Cada uma usa uma janela de terminal (PowerShell).

```
 [Etapa 1] Ligar a API ──▶ [Etapa 2] Notebook de testes
                                   │
 [Etapa 4] Automação ◀── [Etapa 3] Bot do Telegram
  (opcional)                       │
                                   ▼
                      [Etapa 5] Teste completo 🎉
```

| Terminal | Para que serve |
|---|---|
| **Terminal 1** | A API (o coração da oficina) |
| **Terminal 2** | A ponte do bot do Telegram |
| **Terminal 3** | A Automação (opcional) |

> ⚠️ **Variáveis valem só para a janela onde você as digitou.** Se fechar o terminal, digite de novo.
> O projeto **não lê o arquivo `.env`**. Use os comandos `$env:...` mostrados abaixo.

---

## 🚀 Etapa 1: Ligar a API

**Antes:** instale o Python 3.12 (python.org/downloads, marcando **Add python.exe to PATH**) e extraia o ZIP do projeto em `Downloads`.

1. Abra a pasta **`api`** dentro do projeto extraído.
2. Clique com o **botão direito num espaço vazio** → **Abrir no Terminal**. Esse é o **Terminal 1**.
3. Copie e cole:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn pytest httpx pydantic google-genai networkx matplotlib
pytest
```
*O que faz:* cria a "caixa" do projeto, instala as peças e roda os 5 testes.
**Deu certo se** aparecer `5 passed`.

> 💡 O `pip install` pode demorar alguns minutos. A opção completa é `pip install -r requirements.txt` (instala também o CrewAI, bem mais pesado).
> 🆘 Erro de "execução de scripts desabilitada"? Rode `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` e tente o `activate` de novo.

4. Ligue a API com o Grafo de Conhecimento (funciona sem internet e sem chave):

```powershell
$env:USAR_GRAFO="1"
uvicorn main:app --reload
```
**Deu certo se** aparecer:
```text
INFO: Uvicorn running on http://127.0.0.1:8000
```
5. **Abra o site:** na pasta `site`, dê **dois cliques** em `index.html`. No topo, a bolinha fica **verde** (`API Online`).

> 💡 **Deixe o Terminal 1 aberto.** Se fechar, a API desliga.

---

## 🧠 Etapa 2: O Laboratório Gemini Notebook

1. Abra o [Google Colab](https://colab.research.google.com/) → **Arquivo → Fazer upload do notebook**.
2. Escolha `notebooks/laboratorio_gemini_graphify.ipynb`. (No VS Code também abre.)
3. Aperte ▶️ em cada bloco, **de cima para baixo**:
   - **Passos 1 e 2:** o Gemini lê um relato confuso e extrai marca, modelo, sintomas e gravidade.
   - **Passo 3:** o grafo liga aparelhos a falhas e peças.
   - **Passo 4:** o GraphRAG consulta o histórico antes de responder.

> 💡 Sem chave do Gemini? Siga assim mesmo. Se um bloco travar ou pedir a chave, avise o professor.

---

## 📱 Etapa 3: Criar seu bot no Telegram

1. No Telegram, procure **`@BotFather`** → `/start` → `/newbot`.
2. Escolha um nome (ex.: `Oficina do Carlos`) e um usuário que termine em `bot` (ex.: `carlos_oficina_bot`).
3. O BotFather mostra o **token** (parece `7123456789:AAH...`).
4. Procure **`@userinfobot`** → `/start` e anote o seu **Id** (um número).
5. Abra a conversa com o **seu bot** e envie `/start`. Sem isso, ele não consegue falar com você.

> ⚠️ **O token é a chave da sua oficina.** Não mande para ninguém, não publique no GitHub e não tire print dele.

6. **No Terminal 1:** pare a API (`Ctrl + C`) e ligue de novo com os dados do bot (troque as partes em MAIÚSCULAS):

```powershell
$env:USAR_GRAFO="1"
$env:TELEGRAM_TOKEN="COLE_O_TOKEN_AQUI"
$env:TELEGRAM_CHAT_ID="COLE_SEU_ID_AQUI"
$env:TELEGRAM_SEGREDO_WEBHOOK="invente-uma-senha"
uvicorn main:app --reload
```

7. **Terminal 2:** abra outro terminal na pasta `api` (botão direito → **Abrir no Terminal**) e use a **mesma senha**:

```powershell
.venv\Scripts\activate
$env:TELEGRAM_TOKEN="COLE_O_TOKEN_AQUI"
$env:TELEGRAM_SEGREDO_WEBHOOK="invente-uma-senha"
python bot_local.py
```
**Deu certo se** aparecer `Repassando mensagens do bot para a API local`.

---

## 🤖 Etapa 4: A Automação Python (opcional)

A Automação é um **segundo robô**. Ele procura chamados que ainda **não têm laudo**.

Como a API **já gera o laudo na hora** em que o chamado chega, a Automação quase sempre mostra:
```text
☕ [Automação] Nenhum chamado pendente no momento.
```
**Isso é normal.** Ela serve de reserva, por exemplo se a IA falhar num chamado.

**Terminal 3** (pasta `api`):
```powershell
.venv\Scripts\activate
python automacao_chamados.py --continuo --intervalo 5
```
Para parar: `Ctrl + C`.

---

## 🎯 Etapa 5: O grande teste (você no controle)

1. **No site** (`site/index.html`), em *Abrir Novo Chamado*, clique no botão rápido **`🔥 Dell G15 desligando em jogos`**.
2. Clique em **`🚀 Enviar Chamado para Triagem IA`** e anote o **número** do chamado.
3. **📲 No Telegram**, o bot avisa com o laudo da IA, parecido com:
   ```text
   Prioridade: ALTA
   Causa provável: [Grafo da Oficina] pasta térmica de fábrica ressecada e aletas obstruídas | Peças: Pasta Térmica Alta Condutividade, Thermal Pads
   ```
   > Sem o bot ligado, o Terminal 1 mostra a mesma mensagem com a marca `[telegram desligado]`.
4. **📲 Teste os comandos** na conversa com o seu bot:

| Você envia | Resultado |
|---|---|
| `/abertos` | Lista os serviços na fila |
| `/ver 1` | Mostra o laudo da IA do chamado 1 |
| `/andamento 1` | Marca como em andamento |
| `/concluir 1` | Dá baixa: serviço entregue |

5. **De volta ao site**, em *Acompanhar Chamado*, digite o número e clique em **Consultar Status**. Você vê o painel com status, prioridade, causa e peças.

---

## 🆘 Dúvidas comuns

- **O site diz "API Offline":** o Terminal 1 fechou ou parou. Ligue de novo (Etapa 1, passo 4).
- **Porta 8000 em uso:** use `uvicorn main:app --reload --port 8001` e, no site, clique em **⚙️ Alterar** e digite `http://localhost:8001`.
- **Sem `(.venv)` no começo da linha:** rode `.venv\Scripts\activate`.
- **O bot do Telegram não responde:**
  - Os Terminais 1 e 2 estão abertos?
  - A **senha** (`TELEGRAM_SEGREDO_WEBHOOK`) é **igual** nos dois? Se for diferente, a API recusa.
  - O **Id** é o número do `@userinfobot`?
  - Você enviou `/start` ao **seu bot**?
- **Fechei o terminal:** as variáveis `$env:...` somem. Digite de novo.
- **Não tenho a chave do Gemini:** tudo bem. O Grafo de Conhecimento local funciona sem internet.
- **Chamado sem laudo:** espere 5 segundos e consulte de novo.
