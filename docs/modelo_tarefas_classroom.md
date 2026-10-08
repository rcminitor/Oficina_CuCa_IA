# Entrega dos comprovantes no Google Classroom

Como organizar a turma para que o aluno entregue **tudo num lugar só** e você corrija rápido.

Site: https://rcminitor.github.io/Oficina_CuCa_IA/roteiro.html

## A ideia

- **Um documento por aluno:** o "Portfólio da Oficina Digital", com um espaço para cada comprovante.
- **Seis tarefas no Classroom**, uma para cada aviso de [`avisos_classroom.md`](avisos_classroom.md), mais uma **Tarefa 7 extra** (nuvem). Todas usam o mesmo portfólio.
- O aluno **cola prints e fotos dentro do portfólio** e entrega o portfólio de novo a cada tarefa. Você vê a evolução.

## Como montar (uma vez)

1. No Google Docs, crie o documento **"Portfólio da Oficina Digital"** com o texto da seção **Modelo do portfólio** abaixo.
2. No Classroom, crie a primeira tarefa e anexe o documento com a opção **"Fazer uma cópia para cada aluno"**.
3. Nas tarefas seguintes, **reutilize a mesma publicação** (Classroom → Reutilizar publicação) e **não crie uma cópia nova**: o aluno continua no mesmo documento.
4. Crie os tópicos: **1. Preparar**, **2. Estudar**, **3. Construir**, **4. Opcionais**, **5. Fechar**.
5. Em cada tarefa, copie o título e as instruções da seção **As seis tarefas**.

> Se o Classroom pedir um anexo novo a cada tarefa, peça ao aluno para **colar o link do portfólio** na entrega.

## As seis tarefas

Pontuação sugerida: **90 pontos** nas tarefas 1, 2, 3, 5 e 6, mais **10 pontos de bônus** na tarefa 4 (opcional). Total possível: 100. A **Tarefa 7** (nuvem) vale até **10 pontos extras**; a nota final **não passa de 100**.

### Tarefa 1: Preparar o ambiente (15 pontos)
**Tópico:** 1. Preparar

**Instruções para colar no Classroom:**
> Siga o Roteiro, passos 1 e 2. Instale o Antigravity, crie a pasta `oficina-digital` e confira o Python, o pip e o Git.
> No seu portfólio, preencha os itens 1 e 2: cole um print do Antigravity com a pasta aberta e um print do terminal com a versão do Python e o `Olá, oficina!`.
> Tape qualquer chave ou senha antes de tirar o print. Travou? Escreva onde no portfólio e me avise.

| Critério | Pontos |
|---|---|
| Print do Antigravity com a pasta e a resposta do Gemini | 7 |
| Print do terminal com Python, pip e `Olá, oficina!` | 8 |

### Tarefa 2: Estudar com o NotebookLM (15 pontos)
**Tópico:** 2. Estudar

> Faça as Etapas 2, 3 e 4 do Manual (NotebookLM, Skills e Obsidian). No portfólio, itens 3, 4 e 5: print do caderno com as fontes, print das respostas das Skills e print do grafo com 3 cores.

| Critério | Pontos |
|---|---|
| Caderno do NotebookLM com as fontes | 5 |
| Skills A e B com os 3 chamados de treino | 5 |
| Grafo do Obsidian com 3 cores e 5 bolinhas | 5 |

### Tarefa 3: Construir o núcleo (30 pontos)
**Tópico:** 3. Construir

> Siga o Tutorial, passos 2 a 7. No portfólio, itens 6 a 10: print do plano do Gemini, do site, da API com `Uvicorn running`, de um chamado com laudo e da automação.
> Lembrete: nunca cole chave no chat do assistente.

| Critério | Pontos |
|---|---|
| Plano do Gemini | 4 |
| Site aberto no navegador | 5 |
| API ligada (`Uvicorn running`) | 6 |
| Chamado com laudo (prioridade e causa) | 10 |
| Automação rodando | 5 |

### Tarefa 4: Partes opcionais (10 pontos, bônus)
**Tópico:** 4. Opcionais

> Passos 8 (CrewAI no Colab) e 9 (Telegram). No portfólio, itens 11 e 12. Se travou, **escreva ou grave um áudio dizendo onde travou**: isso também vale pontos.
> Tape o token do bot em qualquer foto.

| Critério | Pontos |
|---|---|
| CrewAI: laudo dos dois agentes, **ou** relato de onde travou | 5 |
| Telegram: conversa com `/abertos`, **ou** relato de onde travou | 5 |

### Tarefa 5: Teste final (15 pontos)
**Tópico:** 5. Fechar

> Faça o teste de ponta a ponta do Passo 10 e confira o checklist "Antes de levar ao GitHub". No portfólio, item 13: print do site com um chamado e o laudo, e a caixinha de conferência.

| Critério | Pontos |
|---|---|
| Chamado e laudo no site | 8 |
| Checklist de segurança preenchido | 7 |

### Tarefa 6: GitHub (15 pontos)
**Tópico:** 5. Fechar

> Etapa 6 do Manual. Envie a pasta ao GitHub e cole no portfólio o **link do seu repositório** e um print mostrando as pastas. **Confirme que o arquivo `.env` não aparece.**

| Critério | Pontos |
|---|---|
| Repositório com as pastas do projeto | 8 |
| `.env` ausente do repositório | 7 |

> **Se o `.env` aparecer no repositório:** a nota da segurança é zero até a chave ser trocada. Peça ao aluno para criar outra chave (veja o [Guia das chaves](https://rcminitor.github.io/Oficina_CuCa_IA/chaves.html)) e entregar de novo.

### Tarefa 7 (extra): Publique a sua oficina na nuvem (até 10 pontos extras)
**Tópico:** 4. Opcionais

**Para quem é:** quem terminou as tarefas 1 a 6 e quer ver a oficina funcionando na internet, sem o computador ligado. **Não é obrigatória** e não prejudica ninguém que não fizer.

**Enunciado para colar no Classroom:**
> **Sua oficina na nuvem.** Até agora a sua API só funciona no seu computador. Nesta tarefa extra você a coloca na internet, para o site e o Telegram falarem com ela de qualquer lugar.
>
> **O que fazer**
> 1. **Prepare o repositório.** Confira que o seu projeto do GitHub (Tarefa 6) tem a pasta `api` com o `main.py`. Copie para ele, do projeto do professor, os arquivos `render.yaml`, `api/requirements-render.txt` e `api/configurar_telegram.py` (o Gemini no Antigravity ajuda a copiar). Envie as mudanças ao GitHub.
> 2. **Crie a conta no Render** (render.com) entrando com o GitHub. Escolha o plano **gratuito**.
> 3. **Publique.** No Render, clique em **New +**, depois **Blueprint**, e escolha o seu repositório. Quando o Render pedir os valores, preencha: `GEMINI_API_KEY` (a sua chave), `TELEGRAM_TOKEN` (o token do seu bot) e `TELEGRAM_CHAT_ID` (o seu número do @userinfobot). Se pedir `DATABASE_URL`, escreva `nenhum` (a API usa o banco simples).
> 4. **Espere ficar "Live"** (cerca de 2 a 5 minutos). Abra o endereço que o Render mostra (`https://....onrender.com/docs`). Tire um print da página com o endereço visível.
> 5. **Abra um chamado** pelo painel do site, trocando o endereço da API pelo seu: `painel.html?api=https://SUA-API.onrender.com`. Tire um print do chamado com o laudo.
> 6. **Ligue o Telegram.** No computador, na pasta `api`, rode `python configurar_telegram.py` e siga as instruções na tela. Depois mande `/abertos` ao seu bot e tire um print da conversa, com o aviso do chamado e a resposta.
>
> **Cuidados**
> - A API gratuita dorme depois de uns 15 minutos parada. A primeira resposta pode levar até 1 minuto. Isso é normal.
> - **Nunca mostre o token, a chave ou a senha** em nenhum print. Tape antes de colar no portfólio.
> - Travou? Escreva no portfólio **em qual passo** e o que apareceu na tela. Isso também vale pontos.
>
> **Entregue no portfólio (itens 14 a 16):** print do `/docs` com o endereço `onrender.com`, print do chamado com o laudo, e print do Telegram.

| Critério | Pontos |
|---|---|
| API no ar: print do `/docs` com o endereço `onrender.com` | 3 |
| Chamado aberto pelo painel com laudo | 3 |
| Telegram: aviso do chamado e resposta ao `/abertos` | 3 |
| Segurança: nenhum token, chave ou senha visível nos prints | 1 |

**Alternativa que também vale pontos:** quem **não conseguir** completar um passo ganha a pontuação dos passos que fez e ganha **metade dos pontos do passo em que travou** se relatar, com clareza, onde parou e o que viu na tela.

**Dicas para o professor**
- O plano gratuito do Render pode pedir verificação de conta ou cartão em alguns casos. Confira antes da aula e, se for o caso, deixe a tarefa só como demonstração.
- O aluno com o projeto muito diferente do gabarito pode não conseguir publicar sem ajuda. Nesse caso, valorize o relato.
- Chave de IA, token do bot e `DATABASE_URL` nunca devem aparecer em print. Se aparecerem, peça para trocar e refazer o print, como nas outras tarefas.
- Se ficar pesado para a turma, peça só os passos 1 a 4 (API no ar) e deixe o Telegram para quem quiser.

## Regras de correção

- **Comprovante vale mais que perfeição.** O aluno que mostrar onde travou, de forma honesta, ganha pontos.
- **Nenhum aluno deve ser penalizado** por limite de conta, cota esgotada ou máquina da escola sem permissão. Registre e ajude.
- **Chave visível em print:** peça para trocar a chave e refazer o print. Não exponha a turma.
- **Projeto diferente do gabarito:** vale se cumprir a Especificação.

## Modelo do portfólio

Cole este texto num Google Docs novo e deixe o título como **Portfólio da Oficina Digital**.

```
PORTFÓLIO DA OFICINA DIGITAL
Nome: ____________________
Meu repositório no GitHub (só no final): ____________________

LEMBRETE: tape chaves, tokens e senhas antes de colar qualquer print.

TAREFA 1: PREPARAR
1. Antigravity com a pasta oficina-digital e a resposta do Gemini
[cole o print aqui]
2. Terminal com Python, pip e "Olá, oficina!"
[cole o print aqui]

TAREFA 2: ESTUDAR
3. Caderno do NotebookLM com as fontes
[cole o print aqui]
4. Respostas das Skills A e B nos 3 chamados de treino
[cole os prints aqui]
5. Grafo do Obsidian com 3 cores
[cole o print aqui]

TAREFA 3: CONSTRUIR
6. Plano do Gemini
[cole o print aqui]
7. Site aberto no navegador
[cole o print aqui]
8. API ligada (Uvicorn running)
[cole o print aqui]
9. Chamado com laudo no site
[cole o print aqui]
10. Automação rodando
[cole o print aqui]

TAREFA 4: OPCIONAIS
11. CrewAI no Colab (laudo dos dois agentes) OU onde travei
[cole o print ou escreva aqui]
12. Telegram (conversa com o bot) OU onde travei
[cole a foto ou escreva aqui]

TAREFA 5: TESTE FINAL
13. Site com um chamado e o laudo
[cole o print aqui]
Conferi antes do GitHub:
[ ] Nenhum arquivo tem chave ou token escrito
[ ] O .gitignore tem as linhas .env e .venv
[ ] O notebook do Colab não mostra a chave

TAREFA 6: GITHUB
Link do meu repositório: ____________________
Print do repositório com as pastas
[cole o print aqui]
O arquivo .env NÃO aparece no repositório: [ ] sim

TAREFA 7 (EXTRA): NUVEM
14. Página /docs da minha API com o endereço onrender.com
[cole o print aqui]
15. Chamado aberto pelo painel, com o laudo
[cole o print aqui]
16. Telegram: aviso do chamado e resposta ao /abertos
[cole o print aqui]
Nenhum token, chave ou senha aparece nos prints: [ ] sim

ONDE TRAVEI (opcional)
[escreva aqui ou grave um áudio de até 1 minuto]
```
