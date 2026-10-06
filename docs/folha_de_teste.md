# Folha de teste: percorrer o roteiro como aluno

Objetivo: seguir o site **exatamente como o aluno**, em uma conta e um computador limpos, e anotar tudo que não bate com o texto.

Site: https://rcminitor.github.io/Oficina_CuCa_IA/roteiro.html

## Como testar

1. Use uma **conta Google nova ou de teste**, não a sua de trabalho.
2. Se puder, use um computador sem Python, Git ou Antigravity (ou uma conta de usuário nova no Windows).
3. Siga a ordem do Roteiro. **Não pule nem improvise.** Faça só o que o texto manda.
4. Em cada passo, marque o resultado e anote o que travou.
5. **Tape chaves e tokens** antes de tirar qualquer print.
6. Ao fim, apague a chave do Gemini e o bot de teste.

Legenda: **OK** = fez como o texto diz. **AJ** = precisou de ajuda ou adivinhou. **X** = não conseguiu.

## Dados do teste

| Item | Preencher |
|---|---|
| Quem testou | |
| Data | |
| Windows (versão) | |
| Já tinha Python / Git / Node? | |
| Com administrador? | sim / não |

## Os 13 passos

Em "O que não bateu", escreva: **a tela real** versus **o que o texto diz**. Se possível, cole um print (sem chaves).

| Nº | Passo | Onde | OK / AJ / X | Tempo real | O que não bateu |
|---|---|---|---|---|---|
| 1 | Antigravity, pasta e olá ao Gemini | Manual, Etapa 1 | | | |
| 2 | Python, pip e Git; teste `Olá, oficina!` | Tutorial, Passo 1 | | | |
| 3 | NotebookLM: caderno, fontes e áudio | Manual, Etapa 2 | | | |
| 4 | Skills A e B | Manual, Etapa 3 | | | |
| 5 | Obsidian: 3 notas e grafo com cores | Manual, Etapa 4 | | | |
| 6 | Conferir o assistente e pedir o plano | Tutorial, Passos 2 e 3 | | | |
| 7 | Criar o site | Tutorial, Passo 4 | | | |
| 8 | Criar a API e ligar | Tutorial, Passo 5 | | | |
| 9 | Triagem com o grafo; chamado de verdade | Tutorial, Passo 6 | | | |
| 10 | Automação de reserva | Tutorial, Passo 7 | | | |
| 11 | CrewAI no Colab (opcional) | Tutorial, Passo 8 | | | |
| 12 | Bot do Telegram (opcional) | Tutorial, Passo 9 | | | |
| 13 | Teste final e envio ao GitHub | Tutorial, Passo 10; Manual, Etapa 6 | | | |

## Rótulos de tela para conferir

O site cita nomes de botões e menus que **nunca foram vistos numa conta real**. Em cada linha, marque se o nome existe e, se não, o que está escrito na tela.

| Onde | O que o site diz | Existe? | Nome real |
|---|---|---|---|
| Antigravity | Página `antigravity.google/download`, opção "Windows (x64)" | | |
| Antigravity | Abrir pasta: "File → Open Folder" | | |
| Antigravity | Painel do assistente do lado direito | | |
| NotebookLM | "Novo caderno" | | |
| NotebookLM | "Adicionar fonte" e "Website" | | |
| NotebookLM | "Resumo em áudio" (Audio Overview) | | |
| Obsidian | "Create new vault" e ícone do grafo | | |
| Obsidian | "Grupos" no grafo | | |
| Colab | Ícone de chave "Secrets / Segredos" | | |
| Colab | "Adicionar novo segredo" e acesso do notebook | | |
| Colab | "Arquivo → Fazer download → .ipynb" | | |
| AI Studio | "Chaves de API" e "Criar chave de API" | | |
| Telegram | `@BotFather` com `/newbot` e `/mybots` | | |
| Telegram | `@userinfobot` com `/start` | | |
| GitHub | "Sign up" e "Create account" | | |
| Windows | PowerShell pela tecla Windows | | |
| Windows | "Aliases de execução de aplicativo" | | |

## Pontos de risco: observe com atenção

- [ ] **Passo 1:** o instalador do Python tinha a caixinha "Add python.exe to PATH"? O PowerShell reconheceu `python` depois de fechar e abrir?
- [ ] **Passo 1:** `.venv\Scripts\Activate.ps1` funcionou, ou deu erro de política de execução?
- [ ] **Passo 5:** o Gemini do Antigravity criou a API sem sugerir Node ou npm?
- [ ] **Passo 5:** o terminal mostrou `Uvicorn running on http://127.0.0.1:8000`?
- [ ] **Passo 6:** o laudo do Dell G15 saiu com prioridade e causa certas?
- [ ] **Passo 8:** o modelo `gemini/gemini-3.6-flash` existe e responde? Se não, qual nome funcionou?
- [ ] **Passo 8:** a instalação do CrewAI no Colab terminou? Quantos minutos levou? Pediu reinício?
- [ ] **Passo 8:** o código que o Gemini escreveu tinha `Agent`, `Task`, `Crew` e `Process.sequential`?
- [ ] **Passo 9:** os nomes das variáveis do `.env` que o Gemini escolheu batem com o `.env.example`?
- [ ] **Passo 9:** o aviso chegou no celular? O comando `/abertos` respondeu?
- [ ] **Passo 13:** o `.env` **não** apareceu no repositório do GitHub?
- [ ] O Gemini pediu em algum momento que você colasse uma chave ou senha no chat?

## Sobre o texto

| Pergunta | Resposta |
|---|---|
| Algum passo ficou longo demais para quem lê pouco? Qual? | |
| Alguma palavra difícil sem explicação? Qual? | |
| Algum "Deu certo se" não bateu com o que apareceu? | |
| Algum comprovante foi difícil de tirar? | |
| Faltou algum aviso de erro que você encontrou? Qual? | |

## Resultado

- Passos concluídos sem ajuda: ___ de 13
- Passos que precisaram de ajuda: ___
- Passos que travaram: ___
- Tempo total real: ___ (o Roteiro prevê cerca de 6 h)
- Os 3 maiores problemas, em ordem:
  1.
  2.
  3.

Devolva esta folha preenchida. Cada linha marcada **AJ** ou **X** vira uma correção no site.
