# Manual do Aluno: Oficina Digital

> Esta é a **versão em texto**. A versão completa, com imagens, botões de copiar e progresso, está no site:
> **https://rcminitor.github.io/Oficina_CuCa_IA/aluno.html**

Você é **técnico de bancada** em capacitação. Você **não baixa o projeto pronto**: cria a sua pasta, abre no Antigravity e **constrói o projeto com a ajuda do Gemini**. Só no final leva a pasta para o GitHub.

## As 6 etapas

| # | Etapa | O que você faz |
|---|---|---|
| 1 | **Sua pasta e o ajudante de código** (Antigravity) | Instala o Antigravity, cria a pasta `oficina-digital` em Documentos, abre a pasta e diz olá ao Gemini. |
| 2 | **Assistente que lê em voz alta** (NotebookLM) | Coloca os 4 documentos de estudo e as páginas do site como fonte e escuta o resumo em áudio. |
| 3 | **Bancada de Testes de IA** (Gemini) | Testa a Skill A (triagem) e a Skill B (busca no histórico) e responde ao Desafio de Decisão. |
| 4 | **Quadro de Fichas e Ligações** (Obsidian e Graphify) | Monta 3 notas ligadas e vê o grafo: azul é aparelho, laranja é sintoma, verde é peça. |
| 5 | **Construa o projeto** (Gemini e Tutorial) | Pede ao Gemini, parte por parte: site, API, triagem com grafo, automação em Python, agente CrewAI (no Google Colab) e Telegram. |
| 6 | **Arquivo Digital Central** (GitHub, no final) | Cria a conta e leva a pasta para o GitHub, com a ajuda do Gemini. |

O **Tutorial** (`tutorial.html`) tem os 10 passos da Etapa 5, com um **pedido pronto** para cada parte.

## Os documentos de estudo

Estão em [`docs/notebooklm/`](docs/notebooklm/):

1. [Especificação da oficina](docs/notebooklm/04_especificacao_da_oficina.md): o que você vai construir.
2. [Defeitos comuns](docs/notebooklm/01_guia_defeitos_comuns.md)
3. [Catálogo de peças](docs/notebooklm/02_catalogo_pecas.md)
4. [Histórico de serviços](docs/notebooklm/03_historico_ordens_servico.md)

Os pedidos das Skills A e B estão em [`docs/prompts_skills.md`](docs/prompts_skills.md).

## Como provar cada etapa

Sem relatório. Escolha **uma** forma:

- **Print da tela:** teclas `Windows + Shift + S`.
- **Foto do celular** da tela do computador.
- **Áudio de até 1 minuto** contando o que fez.

## Chaves e senhas

O projeto usa algumas informações secretas (chave do Gemini, token e Id do Telegram, login do GitHub). O **Guia das chaves** mostra onde achar cada uma, onde guardar e como pedir ajuda ao Gemini **sem mostrar o segredo**: https://rcminitor.github.io/Oficina_CuCa_IA/chaves.html

Se o computador **não tem o Python**, o Passo 1 do Tutorial confere e ensina a instalar (também o Git, para o final).

## Regras de segurança

1. Senha, token e chave são **seus**. Não escreva no chat do assistente, em conversa, em foto ou no GitHub.
2. Antes de aceitar uma mudança ou um comando do assistente, **leia**. Em dúvida, pergunte ao professor.
3. Antes de qualquer print, **tape o token**.
4. O assistente **pode errar**. Teste o que ele criar.
5. Antes de enviar a pasta ao GitHub, confira que **nenhum arquivo tem chave ou token**.

## Para o professor

O projeto de referência (gabarito) está nesta pasta: [`api/`](api/), [`site/`](site/) e o [`GUIA_DO_ALUNO.md`](GUIA_DO_ALUNO.md). O que o aluno constrói pode ficar diferente e estar certo. O que importa é cumprir a Especificação.
