# Especificação da Oficina Digital: o que você vai construir

Este documento diz **o que o projeto deve fazer**. Você constrói cada parte com a ajuda do Gemini, dentro do Antigravity. O NotebookLM serve para estudar este texto em áudio.

Use frases curtas quando pedir ajuda. Peça sempre: **"explique em palavras simples"**.

---

## 1. Objetivo

Uma oficina de conserto de computadores de mentirinha.
O cliente abre um chamado no site. O sistema guarda o pedido, faz um laudo com IA e avisa o técnico no celular. O cliente acompanha o andamento no site.

Caminho de um chamado:
1. O cliente abre o chamado no **site**.
2. A **API** guarda o pedido e dá um número.
3. A **triagem** faz o laudo: prioridade, causa provável e próximos passos.
4. O técnico recebe o aviso no **Telegram**.
5. O cliente acompanha no site, digitando o número.

---

## 2. As partes do projeto

### 2.1 Site (HTML, CSS e JavaScript)
- Uma página só, com letra grande e fácil de ler.
- **Formulário "Abrir chamado"** com quatro campos: nome, contato (e-mail ou telefone), equipamento e relato do problema.
- **Botão "Enviar chamado"**. Ao enviar, mostra o número do chamado.
- **Área "Acompanhar"**: o cliente digita o número e vê o status, a prioridade e o laudo.
- O site conversa com a API no endereço `http://localhost:8000`.
- Mostra um aviso claro se a API estiver desligada.

### 2.2 API (Python com FastAPI)
- Programa que roda no computador e recebe os pedidos do site.
- Guarda os chamados num banco de dados **SQLite** (um arquivo).
- Duas rotas:
  - `POST /chamados`: cria um chamado e responde com o número e o status `aberto`.
  - `GET /chamados/{numero}`: devolve equipamento, status, prioridade, laudo e data. **Não devolve** nome nem contato.
- Regras dos campos: nome com pelo menos 2 letras; contato com pelo menos 5; equipamento com pelo menos 2; relato com pelo menos 10 e no máximo 1000.
- Status possíveis: `aberto`, `em_andamento`, `concluido`.
- Deve aceitar pedidos vindos do arquivo do site aberto no navegador (CORS liberado para uso local).

### 2.3 Triagem com Grafo de Conhecimento
- Depois de criar o chamado, o programa faz o laudo em segundo plano.
- O **grafo** é uma memória simples dos casos da oficina: **aparelho → sintoma → causa → peça**.
- Procura no grafo pelo aparelho e pelas palavras do relato.
- Se achar um caso: prioridade `alta` quando o relato tem "não liga" ou "desliga", senão `media`; causa provável e peças vêm do caso.
- Se não achar: prioridade `media`, causa "necessário teste detalhado na bancada".
- Funciona **sem internet e sem chave**.

Casos de exemplo do grafo (use exatamente estes sete):

| Aparelho | Sintoma | Causa provável | Peças |
|---|---|---|---|
| Dell G15 | desliga sozinho | pasta térmica de fábrica ressecada e aletas obstruídas | Pasta Térmica Alta Condutividade, Thermal Pads |
| Dell G15 | não liga | curto no circuito de carga (MOSFET de entrada) | MOSFET Canal N 30V, Carregador 130W |
| Acer Nitro 5 | tela azul | oxidação nos contatos da memória RAM | Limpa Contato Isopropílico, Memória DDR4 |
| Acer Nitro 5 | tela preta | cabo flat da tela rompido ou solto na dobradiça | Cabo Flat EDP Nitro 5 |
| MacBook Air | bateria não carrega | ciclos da bateria esgotados ou conector oxidado | Bateria Original A1466 |
| Desktop | reinicia em jogos | fonte genérica sem potência suficiente | Fonte ATX 600W 80 Plus |
| Notebook | lentidão extrema | HD mecânico antigo com setores ruins | SSD NVMe 500GB ou SATA |

### 2.4 Automação em Python
- Um segundo programa, de reserva.
- A cada 5 segundos procura chamados **sem laudo** e preenche o laudo.
- Se não houver nenhum, escreve: "Nenhum chamado pendente".
- Para parar: `Ctrl + C`.

### 2.5 Agente CrewAI (dupla de especialistas)
- Dois agentes de IA trabalhando juntos:
  - **Atendente de triagem:** entende o relato e diz a urgência.
  - **Técnico:** sugere a causa provável e os próximos passos.
- Usa o **Gemini** como modelo. A chave vem de uma **variável de ambiente** chamada `GEMINI_API_KEY`. A chave **nunca** fica escrita nos arquivos.
- É opcional: só liga se uma variável `MODELO_IA` estiver definida. Se faltar chave ou der erro, o programa volta para a triagem do grafo.

### 2.5.1 Como conseguir a chave do Gemini
- Entre no Google AI Studio (`aistudio.google.com`) com a sua conta Google.
- Crie uma chave de API.
- **Nunca cole a chave no chat do assistente.** Digite no terminal: `$env:GEMINI_API_KEY="sua-chave"`.

### 2.6 Bot do Telegram
- Avisa o técnico quando chega um chamado, com o laudo.
- Só aceita comandos do **chat do técnico**.
- Comandos:

| Comando | O que faz |
|---|---|
| `/abertos` | Lista os serviços na fila |
| `/ver 1` | Mostra o laudo do chamado 1 |
| `/andamento 1` | Marca o chamado 1 como em andamento |
| `/concluir 1` | Dá baixa: serviço entregue |

- Dados do bot (token, número do chat) ficam em **variáveis de ambiente**, nunca nos arquivos.
- Se o bot não estiver configurado, o programa só escreve o aviso na tela e continua funcionando.

---

## 3. Como saber que deu certo

- A API liga e mostra `Uvicorn running on http://127.0.0.1:8000`.
- No site, o chamado "Dell G15 desliga sozinho" volta com prioridade **ALTA** e a causa **pasta térmica ressecada**.
- Os testes automáticos passam.
- O aviso chega no Telegram (se o bot estiver ligado).

---

## 4. Regras de segurança

1. **Senha, token e chave são seus.** Não escreva no chat do assistente, em prints ou no GitHub.
2. Antes de aceitar uma mudança ou um comando proposto pelo assistente, **leia**. Em dúvida, pergunte ao professor.
3. Antes de enviar a pasta ao GitHub, confira que **nenhum arquivo tem chave ou token**.
4. O assistente pode errar. **Teste** o que ele criar.

---

## 5. Como pedir ajuda ao Gemini (modelo de pedido)

> Sou aluno iniciante e leio pouco. Explique em frases curtas e palavras simples.
> Quero criar [A PARTE QUE VOCÊ ESCOLHEU] da Oficina Digital.
> Antes de criar qualquer arquivo, me diga o plano em passos curtos.
> Depois de criar, me diga como testar e o que devo ver na tela.
