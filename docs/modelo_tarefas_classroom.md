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

### Tarefa 7 (extra): Sua oficina na internet (até 10 pontos extras)
**Tópico:** 4. Opcionais

**Para quem é:** quem terminou as tarefas 1 a 6. **Não é obrigatória** e não prejudica quem não fizer.

**Como funciona:** o aluno **não recebe arquivos nem passo a passo técnico**. O enunciado diz o que a oficina precisa fazer no fim, e o **Antigravity (Gemini)** cria os arquivos e guia o aluno em cada clique. O aluno lê o que o Gemini propõe antes de aceitar.

**Enunciado para colar no Classroom:**
> **Sua oficina na internet**
>
> **A história.** Até agora a sua oficina só funciona no seu computador. Se você desliga a máquina, o cliente não consegue abrir chamado e o técnico não recebe aviso. Agora você vai colocar a oficina **na internet, de graça**.
>
> **O que a sua oficina precisa fazer no final**
> 1. Ter um **endereço na internet** (do tipo `https://nome.onrender.com`) onde a API responde, mesmo com o seu computador desligado.
> 2. Receber um **chamado pelo painel do site** e devolver o laudo.
> 3. Mandar **um aviso no Telegram** quando chega um chamado, e responder ao comando `/abertos` com a lista.
> 4. **Nenhuma chave, token ou senha escrita nos arquivos nem no GitHub.** As chaves ficam só no painel do serviço de publicação.
>
> **Como fazer.** Abra a pasta do seu projeto no Antigravity e cole o pedido abaixo no Gemini. Ele cria o que precisa e diz onde clicar, um passo de cada vez. Quando ele pedir uma chave, digite **no painel do site**, nunca no chat.
>
> ```text
> Você é meu professor de programação e eu sou iniciante. A minha oficina digital já funciona no meu computador (API na pasta api, site na pasta site, bot do Telegram). Quero colocá-la na internet de graça, no Render, e ligar o Telegram.
>
> Faça assim:
> 1. Explique em até 3 linhas o que vamos fazer.
> 2. Crie os arquivos que faltam e explique cada um em palavras simples.
> 3. Diga exatamente onde clicar no Render e no Telegram, UM passo por vez, e espere eu responder "feito" antes do próximo.
> 4. Nunca escreva token, chave ou senha nos arquivos nem me peça para colar no chat. A API deve ler tudo de variáveis de ambiente; eu digito os valores só no painel do Render.
> 5. Avise que o plano gratuito dorme e que a primeira resposta pode demorar até 1 minuto.
> 6. No fim, me ajude a testar: abrir um chamado pelo site e mandar /abertos ao bot.
> Se algo der erro, peça a mensagem do erro (sem senhas) e me explique a causa.
> ```
>
> **Cuidados**
> - **Nunca mostre token, chave ou senha** em print. Tape antes de colar no portfólio.
> - A API gratuita dorme depois de uns 15 minutos parada. Esperar até 1 minuto é normal.
> - Travou? Escreva no portfólio **em qual passo** e o que apareceu na tela. Isso também vale pontos.
>
> **Entregue no portfólio (itens 14 a 17):**
> 14. print da página `/docs` da sua API com o endereço da internet visível;
> 15. print de um chamado aberto pelo painel, com o laudo;
> 16. print do Telegram com o aviso do chamado e a resposta ao `/abertos`;
> 17. um parágrafo (3 a 5 linhas), **com as suas palavras**: o que você publicou e onde ficam as chaves.

| Critério | Pontos |
|---|---|
| API no ar: print do `/docs` com o endereço da internet | 3 |
| Chamado aberto pelo painel, com laudo | 2 |
| Telegram: aviso do chamado e resposta ao `/abertos` | 2 |
| Parágrafo com as próprias palavras (o que publicou e onde ficam as chaves) | 2 |
| Segurança: nenhum token, chave ou senha visível nos prints | 1 |

**Quem travar** ganha os pontos dos passos que fez e **metade dos pontos do passo em que travou**, se relatar com clareza onde parou e o que viu na tela.

**Dicas para o professor**
- Antes da aula, rode o pedido no Antigravity numa pasta de teste e veja se o Gemini conduz bem. Os nomes de botões do Render podem mudar.
- O plano gratuito do Render pode pedir verificação de conta ou cartão em alguns casos. Confira antes e, se for o caso, deixe a tarefa só como demonstração.
- Erros comuns do Gemini: senha do webhook com `+`, `/` ou `=` (o Telegram só aceita letras, números, `_` e `-`), comando de início sem `--host 0.0.0.0 --port $PORT` e chave escrita dentro de arquivo.
- Se ficar pesado, peça só a API no ar e o chamado com laudo, e deixe o Telegram para quem quiser.

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

TAREFA 7 (EXTRA): NA INTERNET
14. Página /docs da minha API com o endereço da internet
[cole o print aqui]
15. Chamado aberto pelo painel, com o laudo
[cole o print aqui]
16. Telegram: aviso do chamado e resposta ao /abertos
[cole o print aqui]
17. O que eu publiquei e onde ficam as chaves (3 a 5 linhas, com as minhas palavras)
[escreva aqui]
Nenhum token, chave ou senha aparece nos prints: [ ] sim

ONDE TRAVEI (opcional)
[escreva aqui ou grave um áudio de até 1 minuto]
```
