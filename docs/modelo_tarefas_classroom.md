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

**Regra principal:** o aluno **cria tudo sozinho, com o Gemini**. Ele não copia arquivos do projeto do professor nem de colegas. O projeto do professor serve só para mostrar como o resultado deve funcionar.

**Enunciado para colar no Classroom:**
> **Sua oficina na nuvem.** Até agora a sua API só funciona no seu computador. Nesta tarefa extra você a coloca na internet, para o site e o Telegram falarem com ela de qualquer lugar.
>
> **Você mesmo cria os arquivos, com o Gemini no Antigravity.** Não copie de ninguém. Leia o que o Gemini propõe antes de aceitar, como nas outras tarefas.
>
> **O que o seu projeto precisa ter no final**
> 1. Um arquivo **`render.yaml`**: diz ao Render como instalar e ligar a sua API (que programa roda, qual comando liga e quais variáveis a API precisa).
> 2. Uma **lista de pacotes enxuta** só para a nuvem (por exemplo, `requirements-render.txt`), com o mínimo para a API funcionar.
> 3. A API **lendo token, chave e número do chat de variáveis de ambiente**, nunca escritos no código.
> 4. O Telegram ligado à API por **webhook**: uma rota que recebe as mensagens do bot e um programa que avisa ao Telegram o endereço da sua API.
>
> **Como pedir ao Gemini** (troque as partes em MAIÚSCULAS pelo que é do seu projeto):
> - *Arquivo de publicação:* "Quero publicar a API da pasta `api` no Render, plano gratuito. Explique o que é um `render.yaml` com palavras simples e crie o meu, com o comando para instalar os pacotes e o comando para ligar a API. As chaves devem ser pedidas no painel do Render, nunca escritas no arquivo."
> - *Pacotes:* "Leia o meu `requirements.txt` e me mostre um `requirements-render.txt` só com o que a API precisa para funcionar. Explique o que você tirou e por quê."
> - *Telegram:* "Meu bot do Telegram hoje funciona só no meu computador. Quero que ele funcione com a API publicada. Explique o que é um webhook e me ajude a criar a rota e o programa que registra o endereço no Telegram. A senha do webhook só pode ter letras, números, `_` e `-`."
>
> **Passo a passo**
> 1. Crie os arquivos com o Gemini e envie as mudanças ao seu GitHub.
> 2. Crie a conta no Render entrando com o GitHub (plano gratuito) e publique o seu repositório.
> 3. Preencha as variáveis que o Render pedir (as suas chaves). Qualquer valor que você não tiver, pergunte ao Gemini o que é.
> 4. Espere ficar **Live** (2 a 5 minutos) e abra `https://SUA-API.onrender.com/docs`.
> 5. Abra um chamado pelo painel, usando `painel.html?api=https://SUA-API.onrender.com`.
> 6. Ligue o webhook e mande `/abertos` ao seu bot.
>
> **Cuidados**
> - A API gratuita dorme depois de uns 15 minutos parada. A primeira resposta pode levar até 1 minuto. Isso é normal.
> - **Nunca mostre token, chave ou senha** em prints, nem cole no chat do Gemini. Tape antes de colar no portfólio.
> - Travou? Escreva no portfólio **em qual passo** e o que apareceu na tela. Isso também vale pontos.
>
> **Entregue no portfólio (itens 14 a 18):** print do repositório com os seus arquivos de publicação, um parágrafo explicando o que faz o seu `render.yaml`, print do `/docs` com o endereço `onrender.com`, print de um chamado com laudo e print do Telegram.

| Critério | Pontos |
|---|---|
| Arquivos de publicação criados por você (`render.yaml` e pacotes) no seu GitHub, sem chave dentro | 2 |
| Explicação com as suas palavras do que faz o seu `render.yaml` (3 a 5 linhas) | 1 |
| API no ar: print do `/docs` com o endereço `onrender.com` | 2 |
| Chamado aberto pelo painel, com laudo | 2 |
| Telegram: aviso do chamado e resposta ao `/abertos` | 2 |
| Segurança: nenhum token, chave ou senha visível nos prints nem no repositório | 1 |

**Quem travar** ganha os pontos dos passos que fez e **metade dos pontos do passo em que travou**, se relatar com clareza onde parou e o que viu na tela.

**Dicas para o professor**
- **O que conferir na explicação do `render.yaml`:** se o aluno diz o que roda (a API), como liga (o comando) e que as chaves ficam no painel, ele entendeu. Texto idêntico ao do Gemini sem adaptação merece conversa.
- **Referência do resultado:** o seu projeto publicado mostra como deve ficar (`render.yaml` e a rota `/telegram/webhook`). Use só para conferir, não para distribuir.
- **Erros comuns que o Gemini pode cometer:** senha do webhook com `+`, `/` ou `=` (o Telegram recusa), comando de início sem `--host 0.0.0.0 --port $PORT`, chave escrita dentro do `render.yaml`.
- O plano gratuito do Render pode pedir verificação de conta ou cartão em alguns casos. Confira antes da aula e, se for o caso, deixe a tarefa só como demonstração.
- Se ficar pesado para a turma, peça só os passos 1 a 4 e deixe o Telegram para quem quiser.
- Chave de IA, token do bot e senha do banco nunca devem aparecer em print. Se aparecerem, peça para trocar e refazer o print.

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
14. Repositório com os meus arquivos de publicação (render.yaml e pacotes)
[cole o print aqui]
15. O que o meu render.yaml faz, com as minhas palavras (3 a 5 linhas)
[escreva aqui]
16. Página /docs da minha API com o endereço onrender.com
[cole o print aqui]
17. Chamado aberto pelo painel, com o laudo
[cole o print aqui]
18. Telegram: aviso do chamado e resposta ao /abertos
[cole o print aqui]
Nenhum token, chave ou senha aparece nos prints nem no repositório: [ ] sim

ONDE TRAVEI (opcional)
[escreva aqui ou grave um áudio de até 1 minuto]
```
