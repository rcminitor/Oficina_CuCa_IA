# 🎓 Guia Autoguiado do Aluno: Oficina Digital
> **Objetivo:** Você vai colocar no ar, sozinho e no seu próprio computador, um sistema completo de assistência técnica inteligente integrando:
> **Site Web ➔ API FastAPI ➔ Gemini Notebook ➔ Grafo de Conhecimento (Graphify) ➔ Automação Python ➔ Bot do Telegram**.

---

## 🗺️ Mapa da Sua Missão

Você completará **5 etapas simples**. Não precisa esperar pelo professor — basta seguir os passos abaixo copiando e colando os comandos.

```
 [Etapa 1] Iniciar a API em Downloads ──▶ [Etapa 2] Abrir o Gemini Notebook
                                                          │
 [Etapa 4] Automação em Python ◀─── [Etapa 3] Criar Bot no Telegram
       │
       ▼
 [Etapa 5] Fazer o Teste Completo no Site & Celular 🎉
```

---

## 🚀 Etapa 1: Iniciar o Projeto na Sua Pasta Downloads (2 minutos)

1. Abra o **PowerShell** no seu computador.
2. Copie e cole os comandos abaixo (eles entram na sua pasta Downloads, criam o ambiente e iniciam o servidor):

```powershell
cd "$env:USERPROFILE\Downloads\oficina-digital\api"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

3. **Como saber que deu certo?**
   O terminal vai mostrar:
   ```text
   INFO: Uvicorn running on http://127.0.0.1:8000
   ```
4. **Abra o site no navegador:**
   - Vá na pasta `Downloads/oficina-digital/site` e dê **dois cliques** no arquivo `index.html`.
   - No topo da página você verá uma bolinha verde: **`🟢 API Online (localhost:8000)`**.

> 💡 **Deixe este terminal aberto!** Ele é o "coração" do servidor que processa os chamados.

---

## 🧠 Etapa 2: O Laboratório Gemini Notebook (5 minutos)

Agora você vai entender como a Inteligência Artificial e a Memória da Oficina funcionam por dentro.

1. Abra o arquivo do laboratório no **VS Code**:
   - Pressione `Ctrl + O` e abra: `Downloads/oficina-digital/notebooks/laboratorio_gemini_graphify.ipynb`
   - *(Ou se preferir usar no navegador, abra o [Google Colab](https://colab.research.google.com/) e faça o upload desse arquivo).*
2. Execute as células em ordem:
   - **Passo 1 & 2:** Veja como o **Google Gemini** lê um relato confuso do cliente e extrai com precisão cirúrgica a marca, modelo, sintomas e gravidade usando **Pydantic**.
   - **Passo 3:** Veja como o **Grafo de Conhecimento (ideia do Graphify)** conecta computadores a falhas crônicas de bancada e peças necessárias.
   - **Passo 4:** Veja o **GraphRAG**: a IA consulta o histórico da oficina antes de dar a resposta, acertando o defeito exato!

---

## 📱 Etapa 3: Criar seu Bot no Telegram (3 minutos)

Você será o técnico da oficina e vai receber os chamados diretamente no seu celular.

1. Abra o aplicativo do **Telegram** (no celular ou PC).
2. Pesquise por **`@BotFather`** e clique em Iniciar.
3. Envie o comando:
   ```text
   /newbot
   ```
4. Escolha um nome para a sua oficina (ex: `Oficina do Carlos`) e um usuário que termine com `bot` (ex: `carlos_oficina_bot`).
5. O BotFather vai te dar uma chave chamada **HTTP API Token** (parece com `7123456789:AAH...`). Guarde ela!
6. Agora pesquise por **`@userinfobot`** no Telegram, dê `/start` e copie o número do seu **Id** (ex: `123456789`).
7. **Configurar no projeto:**
   - Na pasta `Downloads/oficina-digital/api`, faça uma cópia do arquivo `.env.example` e renomeie para `.env`.
   - Abra o `.env` e cole suas informações:
     ```env
     TELEGRAM_TOKEN=cole_aqui_o_token_do_botfather
     TELEGRAM_CHAT_ID=cole_aqui_o_seu_id_do_userinfobot
     GEMINI_API_KEY=sua_chave_opcional_aqui
     USAR_GRAFO=1
     ```
8. **Ligar o repassador de comandos do bot:**
   Abra um **segundo terminal** no PowerShell e execute:
   ```powershell
   cd "$env:USERPROFILE\Downloads\oficina-digital\api"
   .venv\Scripts\activate
   python bot_local.py
   ```

---

## 🤖 Etapa 4: Ligar a Automação em Python (1 minuto)

Agora vamos ligar o "robô" de triagem autônoma da oficina.

Abra um **terceiro terminal** no PowerShell e execute:
```powershell
cd "$env:USERPROFILE\Downloads\oficina-digital\api"
.venv\Scripts\activate
python automacao_chamados.py --continuo --intervalo 5
```
> O terminal ficará monitorando o banco de dados em tempo real:
> `⏳ [Automação] Buscando novos chamados pendentes...`

---

## 🎯 Etapa 5: O Grande Teste ao Vivo (Você no Controle!)

Agora veja a mágica acontecer de ponta a ponta:

1. **No Site ([site/index.html](file:///c:/Users/rcmin/Projetos/oficina-digital/site/index.html)):**
   - Na seção *"Abrir Novo Chamado"*, clique no botão rápido:
     **`🔥 Dell G15 desligando em jogos`**
   - O formulário será preenchido automaticamente.
   - Clique no botão azul: **`🚀 Enviar Chamado para Triagem IA`**.
2. **Olhe o terminal da Automação (Etapa 4):**
   - O script vai detectar o chamado novo!
   - A IA vai consultar o **Grafo de Conhecimento**.
   - O terminal vai imprimir:
     ```text
     💾 [Banco] Chamado #1 atualizado! Prioridade: ALTA
     🧠 Causa Provável: [Grafo da Oficina] pasta térmica de fábrica ressecada e aletas obstruídas
     📦 Peças Recomendadas: Pasta Térmica Alta Condutividade, Thermal Pads
     ```
3. **Olhe o seu Telegram (no celular ou PC):**
   - Você recebeu o chamado com a notificação da IA!
   - Digite no chat do seu bot:
     ```text
     /abertos
     ```
   - O bot responde com a lista de chamados!
   - Digite:
     ```text
     /ver 1
     ```
   - O bot mostra o diagnóstico técnico e os dados do cliente!
   - Digite:
     ```text
     /andamento 1
     ```
4. **De volta ao Site:**
   - Na seção *"Acompanhar Chamado"*, digite o número `1` e clique em **Consultar Status**.
   - Você verá o **Painel de Diagnóstico Inteligente** com o status `EM ANDAMENTO`, prioridade `ALTA`, causa do problema e peças recomendadas!

---

## 🆘 Resolução de Dúvidas Comuns (FAQ)

- **O site diz que a API está Offline:**
  - Verifique se você executou `uvicorn main:app --reload` no Terminal 1 e se ele continua aberto sem erros.
- **Não tenho a chave do Google Gemini agora:**
  - Não tem problema! O projeto possui o Grafo de Conhecimento local embutido que funciona 100% offline para os testes de aula.
- **O bot do Telegram não me responde:**
  - Verifique se você iniciou uma conversa com seu bot no Telegram (clicando em "Começar" ou enviando `/start`) antes de rodar o `python bot_local.py`.
