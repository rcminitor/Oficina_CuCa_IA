# 🛠️ Manual do Aluno — Oficina Digital

> Você é **técnico de bancada em capacitação**.
> Aqui você aprende a usar 6 ferramentas de trabalho. Todas têm um nome de oficina.
> **Pouca leitura. Muito áudio, imagem e clique.**

**Legenda:** 🔘 Clique aqui · ⚠️ Cuidado · 💡 Dica · 🔊 Ouça aqui · 📲 No celular · 📸 Mande o comprovante

---

## 🧰 As 6 ferramentas

| # | Ferramenta | Nome na oficina | Serve para |
|---|---|---|---|
| 1 | GitHub | **Arquivo Digital Central** | Guardar as pastas do trabalho |
| 2 | NotebookLM | **Assistente que lê em voz alta** | Estudar ouvindo, sem ler muito |
| 3 | Gemini Notebook (Colab) | **Bancada de Testes de IA** | Testar perguntas antes de usar |
| 4 | Obsidian + Graphify | **Quadro de Fichas e Ligações** | Ligar defeito → peça que já deu certo |
| 5 | CrewAI | **Dupla de Especialistas** | Um atendente + um técnico (virtuais) |
| 6 | Telegram | **Rádio do Técnico** | Receber chamados no celular |

---

## 📸 Como provar que você fez cada etapa

Sem relatório. Escolha **uma** forma:

- 📸 **Print da tela** (tecla `Windows + Shift + S`)
- 📲 **Foto do celular** da tela do computador
- 🔊 **Áudio curto** (até 1 minuto) contando o que fez

---

# ETAPA 1 — Arquivo Digital Central (GitHub)

**GitHub** = uma **pasta compartilhada na internet**. Nada se perde.
Um **repositório** = uma pasta de trabalho dentro do GitHub.

### 1.1 Criar sua conta (grátis)
1. 🔘 Abra o navegador. Digite `github.com`.
2. 🔘 Clique em **Sign up** (canto de cima, à direita).
3. Preencha: **e-mail** → **senha** → **nome de usuário**.
4. ⚠️ Anote a senha em um caderno seu. **Não mande a senha para ninguém.**
5. Resolva o teste de "não sou robô". Clique em **Create account**.

### 1.2 Confirmar o e-mail
1. Abra o seu e-mail (Gmail, Outlook…).
2. Ache a mensagem do GitHub. 💡 Olhe também em **Spam**.
3. 🔘 Clique no botão **Verify email address**.

### 1.3 Pegar a pasta do projeto
**Jeito mais fácil (sem instalar nada):**
1. 🔘 Abra o endereço do projeto que o professor passou.
2. 🔘 Clique no botão verde **`<> Code`**.
3. 🔘 Clique em **Download ZIP**.
4. Na pasta **Downloads**: clique direito no ZIP → **Extrair tudo**.

**Ver o site online:** o professor passa o endereço terminado em `github.io`.

📸 **Comprovante:** print da sua página do GitHub com seu nome de usuário.

### 🎬 Vídeos em português (calmos, para iniciante)
> Procure no YouTube pelo **nome do canal + o título abaixo**. Confira a data: prefira vídeo recente.
- **Curso em Vídeo — Prof. Gustavo Guanabara** (grátis, sem digitar comandos):
  - [O que é GitHub? Pra que ele serve?](https://www.youtube.com/watch?v=hcZ0qtwvN1w) (37 min)
  - [Curso completo, 13 vídeos](https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
  - 💡 Os vídeos têm cerca de 6 anos: a tela do GitHub pode estar diferente.
- Busca geral: *"GitHub para iniciantes criar conta e repositório"*.

---

# ETAPA 2 — Assistente que lê em voz alta (NotebookLM)

O NotebookLM lê seus documentos e **explica em áudio**. Você estuda de fone de ouvido.

### 2.1 Entrar
1. 🔘 Abra `notebooklm.google.com`. Entre com a conta Google.
2. 🔘 Clique em **Novo caderno** (ou **Create new**).

### 2.2 Colocar os 3 documentos de bancada
Os arquivos estão na pasta `docs/notebooklm/` do projeto:

| Doc | Arquivo | O que tem |
|---|---|---|
| 1 | `01_guia_defeitos_comuns.md` | Superaquecimento, falha de boot, tela azul |
| 2 | `02_catalogo_pecas.md` | Pasta térmica, RAM, SSD, fonte ATX |
| 3 | `03_historico_ordens_servico.md` | Tabela de serviços já feitos |

1. 🔘 Clique em **Adicionar fonte** → **Enviar arquivo**.
2. Escolha os 3 arquivos, um por vez.

### 2.3 🔊 Ouvir o resumo em áudio
1. 🔘 No painel à direita, clique em **Resumo em áudio** (**Audio Overview**).
2. Espere. Leva alguns minutos.
3. 🔘 Clique em **Play**. Coloque o fone.
4. 💡 Para ouvir só o que importa, antes de gerar clique em **Personalizar** e escreva:
   `Explique devagar, com exemplos de bancada, para técnico iniciante.`

### 2.4 Perguntar por voz ou texto
Na caixa de conversa, pergunte (copie e cole):

```text
Meu cliente disse que o notebook desliga sozinho. Quais peças eu devo olhar primeiro? Responda em 5 linhas curtas.
```
*O que faz:* o assistente responde só com base nos seus 3 documentos.

⚠️ O NotebookLM pode errar. Confira a resposta com o **Documento 1** e **2**.

📸 **Comprovante:** print do caderno com os 3 documentos **ou** 🔊 áudio de 1 minuto: *"o que eu aprendi ouvindo"*.

---

# ETAPA 3 — Bancada de Testes de IA (Gemini Notebook)

Aqui você **testa** a IA antes de usar no trabalho de verdade.
Arquivo: `notebooks/laboratorio_gemini_graphify.ipynb`.

### 3.1 Abrir
1. 🔘 Abra `colab.research.google.com`.
2. 🔘 **Arquivo → Fazer upload do notebook**. Escolha o arquivo acima.
3. 🔘 Aperte o botão ▶️ de cada bloco, **de cima para baixo**.

💡 Sem chave do Gemini? Tudo bem. O projeto tem um modo local que funciona sem chave.

### 3.2 As 2 ferramentas de prompt (Skills)
Os textos prontos estão em `docs/prompts_skills.md`. Resumo:

| Skill | Nome na bancada | Entra | Sai |
|---|---|---|---|
| **A** | Triagem de Sintomas | Relato do cliente | Modelo + Sintoma + Gravidade |
| **B** | Busca no Grafo (GraphRAG) | Modelo + Sintoma | Peça provável + tempo de bancada |

**Skill A** — copie e cole:
```text
Você é atendente de oficina de informática. Leia o relato do cliente.
Responda SOMENTE neste formato, uma linha cada:
Modelo: ...
Sintoma principal: ...
Gravidade: BAIXA, MÉDIA ou ALTA
Se faltar informação, escreva "não informado". Não invente.

Relato: """COLE O RELATO AQUI"""
```
*O que faz:* transforma um relato bagunçado em 3 linhas.

**Skill B** — copie e cole:
```text
Você é técnico de bancada. Use APENAS o histórico abaixo.
Dado o modelo e o sintoma, diga:
Peça provável: ...
Tempo de bancada: ...
Casos parecidos: (número da ordem de serviço)
Se o histórico não tiver caso parecido, responda "sem histórico".

Modelo: COLE_AQUI
Sintoma: COLE_AQUI
Histórico: """COLE AQUI A TABELA DO DOCUMENTO 3"""
```
*O que faz:* busca no histórico da oficina e indica a peça.

### 3.2.1 🧠 Desafio de Decisão
Faça **3 chamados** de treino (use os da tabela do Documento 3). Depois responda **por áudio** ou marcando:

| Pergunta | Marque |
|---|---|
| Quando usei a **Skill A**? | ☐ Relato confuso ☐ Faltava modelo ☐ Precisava da gravidade |
| Quando usei a **Skill B**? | ☐ Já sabia o modelo e o sintoma ☐ Queria a peça ☐ Queria o tempo |
| Quando usei **as duas juntas**? | ☐ Relato bruto: A limpa, B busca a peça |
| Por quê? | ☐ B só funciona bem com a entrada limpa da A |

🔊 Áudio sugerido (1 min): *"No chamado __ usei A porque __. No chamado __ usei B porque __. Usei as duas no chamado __ porque __."*

📸 **Comprovante:** print dos blocos rodando **e** o áudio/marcações.

---

# ETAPA 4 — Quadro de Fichas e Ligações (Obsidian + Graphify)

O **Obsidian** guarda fichas (notas) e **desenha as ligações** entre elas.

### 4.1 Cores do quadro
| Cor | O que é | Exemplo |
|---|---|---|
| 🔵 Azul | **Aparelho** | Notebook Dell G15 |
| 🟠 Laranja | **Sintoma** | Desliga sozinho |
| 🟢 Verde | **Solução / Peça** | Troca de pasta térmica |

### 4.2 Passo a passo
1. 🔘 Baixe o Obsidian em `obsidian.md` (grátis). Instale.
2. 🔘 **Create new vault** → nome: `Oficina`.
3. Crie 3 notas. O texto `[[ ]]` cria a ligação:

**Nota `Notebook Dell G15`**
```text
Aparelho. Sintoma: [[Desliga sozinho]]
```
**Nota `Desliga sozinho`**
```text
Sintoma. Solução: [[Troca de pasta térmica]]
```
**Nota `Troca de pasta térmica`**
```text
Solução. Tempo de bancada: 40 minutos.
```
4. 🔘 Menu da esquerda → ícone de **grafo** (bolinhas ligadas). Você vê os 3 pontos ligados.
5. 🔘 No grafo, abra **Grupos** (engrenagem) e crie 3 grupos de cor:
   - `tag:#aparelho` → azul
   - `tag:#sintoma` → laranja
   - `tag:#solucao` → verde

   💡 Escreva `#aparelho`, `#sintoma` ou `#solucao` dentro de cada nota.

📸 **Comprovante:** print do grafo com 3 cores e pelo menos 5 bolinhas.

### 4.3 E o Graphify?
**Graphify** = o mesmo quadro, mas **montado pelo programa**.
Ele lê uma pasta (os seus documentos, por exemplo) e desenha o grafo sozinho. Você pode **fazer perguntas** ao grafo e **exportar para o Obsidian**.

Site oficial da ferramenta: [github.com/Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify). Instalação (professor): `pip install graphifyy` (com dois **y**).

Exemplo para a turma (o professor roda na pasta do projeto):
```text
/graphify docs/notebooklm --obsidian
/graphify query "qual peça resolve superaquecimento?"
```
*O que faz:* o primeiro comando monta o grafo dos 3 documentos e cria um cofre do Obsidian. O segundo pergunta ao grafo.

**O que você vai ver:** uma página com o grafo escuro e interativo.
- 🔘 Use a caixa **Search nodes** para achar uma bolinha.
- 🔘 Clique numa bolinha: o painel **Node info** mostra os detalhes.
- Na lista **Communities**, cada cor é um **grupo de assunto** que o Graphify descobriu sozinho. Marque ou desmarque para esconder um grupo.

💡 Atenção: as cores do Graphify **não** são as cores azul, laranja e verde da Etapa 4.2. Aquelas você escolhe **à mão no Obsidian**. No Graphify, a cor mostra o grupo.

⚠️ **Verdade sobre este projeto:** o arquivo `api/grafo_conhecimento.py` usa um grafo **simples em Python** (funciona sem internet), com a mesma ideia. O Graphify é a ferramenta que faz isso para uma pasta inteira.

---

# ETAPA 5 — Rádio do Técnico (Telegram + CrewAI)

**CrewAI** = a **dupla**: o *atendente* recebe o cliente; o *técnico* diagnostica.
**Telegram** = o rádio no seu celular.

### 5.1 Criar o bot — 4 comandos
📲 No Telegram, procure **`@BotFather`** (tem selo azul ✔️).

| # | Você envia | O que acontece |
|---|---|---|
| 1 | `/start` | O BotFather abre o menu |
| 2 | `/newbot` | Ele pede um nome |
| 3 | Nome da oficina (ex.: `Oficina do Carlos`) | Depois ele pede um usuário que termina em `bot` (ex.: `carlos_oficina_bot`) |
| 4 | — | Ele mostra o **token** (chave do bot) |

⚠️ **O token é a chave da sua oficina. Nunca mande para ninguém. Nunca publique no GitHub.**

Depois: procure `@userinfobot`, envie `/start` e anote o seu **Id** (número).
No terminal, antes de ligar a API, digite os dados do bot (o projeto **não lê** o arquivo `.env`): `$env:TELEGRAM_TOKEN="..."`, `$env:TELEGRAM_CHAT_ID="..."` e `$env:TELEGRAM_SEGREDO_WEBHOOK="uma-senha"`. O passo a passo está no [Tutorial](https://rcminitor.github.io/Oficina_CuCa_IA/tutorial.html#p8).

### 5.2 Comandos do dia a dia 📲
| Você envia | Resultado |
|---|---|
| `/abertos` | Lista os serviços na fila |
| `/ver 1` | Mostra o laudo da IA do chamado 1 |
| `/andamento 1` | Marca o chamado 1 como em andamento |
| `/concluir 1` | Dá baixa: serviço entregue |

### 5.3 Ligar tudo (peça ajuda ao professor na primeira vez)
O passo a passo completo, com comandos para copiar, está em [`GUIA_DO_ALUNO.md`](GUIA_DO_ALUNO.md).

📸 **Comprovante:** foto do celular com `/abertos` e a resposta do bot.

---

# ✅ Roteiro de 5 Etapas — Resumo

| Etapa | Ferramenta | Você faz | 📸 Comprovante |
|---|---|---|---|
| 1 | GitHub | Conta + e-mail + baixar a pasta | Print do perfil |
| 2 | NotebookLM | 3 documentos + áudio | Print ou áudio de 1 min |
| 3 | Gemini Notebook | Skills A e B + Desafio de Decisão | Print + áudio/marcações |
| 4 | Obsidian | Grafo azul/laranja/verde | Print do grafo |
| 5 | Telegram + CrewAI | Bot + `/abertos`, `/ver`, `/concluir` | Foto do celular |

---

# 📚 Estudo complementar

> Os links abaixo são **canais e termos de busca**. Eu não consigo abrir o YouTube daqui para confirmar cada vídeo.
> **Professor:** confira os canais antes de passar para a turma.

### 🔧 Bancada e hardware (YouTube, português)
- **MW Informática** — busque *"MW Informática pasta térmica"* e *"MW Informática notebook não liga"*.
- **Emerson BR** — busque *"Emerson BR manutenção notebook"*.
- Busca geral: *"como trocar pasta térmica notebook"*, *"tela azul Windows o que fazer"*, *"montar PC passo a passo"*.

### 🤖 Inteligência Artificial sem matemática
- Busque: *"o que é inteligência artificial explicado simples"*.
- Busque: *"como usar o ChatGPT ou Gemini para iniciantes"*.
- NotebookLM: busque *"NotebookLM tutorial português"*.

### 🌐 Sites
- `github.com` — o Arquivo Digital Central
- `notebooklm.google.com` — o Assistente de voz
- `colab.research.google.com` — a Bancada de Testes
- `obsidian.md` — o Quadro de Fichas
- `telegram.org` — o Rádio

---

## ⚠️ Regras de segurança da oficina
1. Senha e token são **seus**. Não mande em conversa, foto ou print.
2. Antes do print, **tape o token** com o dedo ou recorte a imagem.
3. A IA pode errar. **Sempre confira** com o catálogo e com a bancada.
4. Dado de cliente (nome, telefone) **não vai** para o GitHub.
