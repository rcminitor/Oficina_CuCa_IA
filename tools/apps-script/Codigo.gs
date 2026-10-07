/**
 * Oficina Digital — correção das respostas da Trilha.
 * Recebe as respostas do site, corrige com o Gemini e grava na planilha.
 *
 * Na planilha, use o menu "Oficina Digital → Configurar chave do Gemini".
 * Propriedades do script (guardadas pelo menu ou em Configurações do projeto):
 *   GEMINI_API_KEY  chave do Google AI Studio (obrigatória)
 *   MODELO          opcional, padrão "gemini-3.8-flash"
 *   MODELO_RESERVA  opcional, padrão "gemini-3.7-flash" (usado quando o principal está sobrecarregado)
 *   MODELO_LEVE     opcional, padrão "gemini-3.5-flash-lite" (última tentativa, mais rápido)
 *   LIMIAR_IA       opcional, padrão 70 (0–100). A partir dele o aluno vê o aviso.
 */

const GABARITO = {
  "m0q1": {
    "pergunta": "Dê dois exemplos de informação que você nunca publicaria e explique por quê.",
    "esperado": "Exemplos como senha, token, chave de API, telefone, endereço ou documento; explica que abrem acesso a contas/programas ou expõem a pessoa."
  },
  "m0q2": {
    "pergunta": "Por que um token deve ficar na lista “secreta”?",
    "esperado": "O token funciona como uma senha: quem tem o token pode usar o programa, o bot ou a conta no lugar da pessoa."
  },
  "m1q1": {
    "pergunta": "Escreva a sua pergunta no modelo “Como posso ajudar ___ a ___?”.",
    "esperado": "Resposta pessoal. Avaliar se segue o modelo, se nomeia uma pessoa ou grupo e um problema pequeno e concreto."
  },
  "m1q2": {
    "pergunta": "Como você vai saber que conseguiu ajudar?",
    "esperado": "Resposta pessoal. Espera-se um sinal observável de sucesso (algo que dá para ver, contar ou testar), ligado à pergunta."
  },
  "m2q1": {
    "pergunta": "Para que serve ligar uma nota a outra no Obsidian?",
    "esperado": "Mostrar como as ideias se relacionam; as ligações formam o grafo e ajudam a encontrar e explicar conexões."
  },
  "m2q2": {
    "pergunta": "Como você cria uma ligação entre duas notas?",
    "esperado": "Escrevendo o nome da nota entre colchetes duplos, como [[Nome da nota]]."
  },
  "m3q1": {
    "pergunta": "Cite duas coisas que não devem entrar como fonte e explique uma delas.",
    "esperado": "Trabalho de colega, livro inteiro sem licença, conversa privada, foto de pessoa, dado pessoal ou resposta pronta; explica um motivo (autoria, direito autoral, privacidade ou aprender de verdade)."
  },
  "m3q2": {
    "pergunta": "O que você anota no arquivo de fontes sobre cada fonte?",
    "esperado": "Título, autor ou site, link, data, duas ideias e por que confia ou duvida da fonte."
  },
  "m4q1": {
    "pergunta": "Por que é importante abrir a citação que o NotebookLM mostra?",
    "esperado": "Para conferir se o trecho da fonte realmente apoia a resposta; a IA pode errar ou exagerar."
  },
  "m4q2": {
    "pergunta": "O que você faz quando a fonte não responde à sua pergunta?",
    "esperado": "Registra que a fonte não respondeu, não inventa a resposta e procura outra fonte aprovada ou pede ajuda."
  },
  "m5q1": {
    "pergunta": "Qual é a diferença entre um caderno com fontes (NotebookLM ou Gemini Notebook) e um notebook de código?",
    "esperado": "O caderno com fontes serve para estudar e perguntar a partir de documentos; o notebook de código (.ipynb) tem texto e células que executam Python."
  },
  "m5q2": {
    "pergunta": "Por que uma resposta bonita da IA não prova que ela está correta?",
    "esperado": "A IA pode escrever bem e mesmo assim errar ou inventar; é preciso conferir na fonte ou testar."
  },
  "m6q1": {
    "pergunta": "Quais partes você completa para melhorar um prompt?",
    "esperado": "Objetivo, fonte, formato e regra de incerteza (o que fazer quando não souber)."
  },
  "m6q2": {
    "pergunta": "Como pedir ajuda à IA sem pedir a resposta final?",
    "esperado": "Pedir perguntas, pistas ou explicações passo a passo, uma de cada vez, e tentar primeiro; a IA age como tutora, não faz o trabalho."
  },
  "m7q1": {
    "pergunta": "Quando é melhor usar um prompt e quando é melhor usar uma skill?",
    "esperado": "Prompt para um pedido pontual; skill para uma rotina que se repete; os dois juntos quando a skill guarda o método e o prompt adapta o caso."
  },
  "m7q2": {
    "pergunta": "Dê um exemplo de algo que ainda precisa de uma pessoa, mesmo usando IA.",
    "esperado": "Conferir fontes, decidir, julgar se o resultado está certo, cuidar de segurança, privacidade ou ética; exemplo concreto."
  },
  "m8q1": {
    "pergunta": "Qual é a diferença entre Git e GitHub?",
    "esperado": "Git guarda a memória (o histórico) das mudanças no computador; GitHub hospeda e compartilha o repositório na internet."
  },
  "m8q2": {
    "pergunta": "O que é um commit e o que você confere antes de enviar uma mudança?",
    "esperado": "Commit é uma fotografia da mudança com uma legenda (mensagem); antes de enviar confere a lista de arquivos e não envia .env, token, banco local, foto ou dado pessoal."
  },
  "m9q1": {
    "pergunta": "Quais partes uma skill precisa ter?",
    "esperado": "Objetivo, quando usar, entradas, passos, limites, checagem e um exemplo (de outro assunto)."
  },
  "m9q2": {
    "pergunta": "Quando não vale a pena criar uma skill?",
    "esperado": "Quando a tarefa não se repete; nesse caso um prompt é suficiente."
  },
  "m10q1": {
    "pergunta": "Num grafo, o que são nós e o que são relações? Dê um exemplo.",
    "esperado": "Nós são as coisas (pessoas, objetos, ideias) e relações são as setas/ligações entre elas; exemplo coerente."
  },
  "m10q2": {
    "pergunta": "Por que desenhar o grafo antes de rodar o código?",
    "esperado": "Para entender e prever o resultado e depois comparar com o que o programa gerou."
  },
  "m11q1": {
    "pergunta": "Por que usar dois agentes, um pesquisador e um conferidor, e não só um?",
    "esperado": "Divide o trabalho e um confere o outro, o que ajuda a achar erros; cada agente tem tarefa, entrada, saída e limite."
  },
  "m11q2": {
    "pergunta": "Em que momento uma pessoa precisa conferir o trabalho dos agentes?",
    "esperado": "No resultado final e nos pontos de decisão; a pessoa verifica fontes e erros antes de usar ou publicar."
  },
  "m12q1": {
    "pergunta": "Quais comandos você planeja para o bot e o que cada um faz?",
    "esperado": "Inclui /start e /ajuda e pelo menos um comando do projeto, dizendo o que cada um faz, com dados fictícios."
  },
  "m12q2": {
    "pergunta": "Onde o token do bot deve ficar e por quê?",
    "esperado": "No arquivo .env, que não vai para o GitHub nem para o site, porque o token é uma senha."
  },
  "m13q1": {
    "pergunta": "Por que ligar só duas partes do sistema de cada vez?",
    "esperado": "Para saber exatamente onde está o erro quando algo falha; testar aos poucos evita se perder."
  },
  "m13q2": {
    "pergunta": "Descreva um erro que pode acontecer no sistema e quem deve perceber.",
    "esperado": "Resposta pessoal: um erro plausível (mensagem não chega, banco não salva, resposta errada) e quem deve notar (aluno, técnico, usuário, teste)."
  },
  "m14q1": {
    "pergunta": "Qual parte do projeto foi feita por você e qual é a prova?",
    "esperado": "Resposta pessoal: aponta uma parte concreta feita pelo aluno e uma evidência (commit, print, nota, áudio, teste)."
  },
  "m14q2": {
    "pergunta": "Conte um momento em que a IA errou e o que você fez.",
    "esperado": "Resposta pessoal: descreve um erro concreto da IA e a ação tomada (conferiu fonte, corrigiu, testou, pediu ajuda)."
  }
};

const ABA_RESPOSTAS = "Respostas";
const CABECALHO = [
  "Data", "Aluno", "Matrícula", "Missão", "Título", "Pergunta (id)", "Pergunta", "Resposta",
  "Nota", "Comentário", "Indício de IA (0-100)", "Motivo do indício", "Colou",
  "Tempo de leitura (s)", "Tempo mínimo (s)", "Leituras rápidas", "Saídas da página", "Tempo fora (s)",
  "Áudio ouvido (%)", "Caracteres digitados", "Inserções grandes", "Tempo escrevendo (s)",
  "Envio", "Status"
];
// Colunas (1 = A)
const COL = { MISSAO: 4, TITULO: 5, ID: 6, RESPOSTA: 8, NOTA: 9, COMENTARIO: 10, INDICIO: 11, MOTIVO: 12, COLOU: 13,
  DIGITADOS: 20, TEMPO_ESCRITA: 22, ENVIO: 23, STATUS: 24 };
const COMENTARIO_COLADA = "Resposta não aceita. Escreva com suas próprias palavras.";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Oficina Digital")
    .addItem("Configurar chave do Gemini", "pedirChave")
    .addItem("Ativar correção automática", "ativarCorrecaoAutomatica")
    .addItem("Corrigir a fila agora", "corrigirPendentes")
    .addItem("Testar a correção", "testarCorrecao")
    .addItem("Atualizar painel agora", "atualizarPainel")
    .addItem("Recriar abas Painel, Turma e Coladas", "configurar")
    .addToUi();
}

/** Abre uma janela na planilha pedindo a chave; ela fica só nas propriedades do script. */
function pedirChave() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt("Chave do Gemini",
    "Cole aqui a chave criada no Google AI Studio. Ela fica guardada só neste script, não na planilha.",
    ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const chave = r.getResponseText().trim();
  if (chave.length < 20) { ui.alert("Essa chave parece incompleta. Tente de novo."); return; }
  PropertiesService.getScriptProperties().setProperty("GEMINI_API_KEY", chave);
  configurar();
  ativarCorrecaoAutomatica();
  testarCorrecao();
}

/** Corrige uma resposta de exemplo e mostra o resultado numa janela. */
function testarCorrecao() {
  const ui = SpreadsheetApp.getUi();
  try {
    const r = corrigirComGemini_({ titulo: "0. Proteja o que é secreto" }, [
      { id: "m0q2", texto: "porque o token é tipo uma senha, se alguem pegar consegue usar o bot no meu lugar", digitados: 85, tempoEscritaSeg: 40 }
    ], 240000, true);
    const c = r.m0q2;
    ui.alert("Correção funcionando ✅", "Nota de exemplo: " + c.nota + "/10\n" + c.comentario + "\nIndício de IA: " + c.indicio_ia, ui.ButtonSet.OK);
  } catch (erro) {
    ui.alert("A correção falhou", String(erro.message || erro), ui.ButtonSet.OK);
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.diagnostico === "1") {
    const props = PropertiesService.getScriptProperties();
    const info = { ok: true, temChave: !!props.getProperty("GEMINI_API_KEY"), modelo: props.getProperty("MODELO") || "gemini-3.8-flash" };
    const aba = abaRespostas_();
    const ult = aba.getLastRow();
    const status = ult < 2 ? [] : aba.getRange(2, COL.STATUS, ult - 1, 1).getValues().map((v) => v[0]);
    info.fila = { pendentes: status.filter((x) => x === "pendente").length, corrigidas: status.filter((x) => x === "corrigida").length, coladas: status.filter((x) => x === "colada").length };
    info.gatilho = ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === "corrigirPendentes");
    if (e.parameter.painel === "1") {
      try { atualizarPainel_(); info.painel = "ok"; } catch (erro) { info.painel = String(erro && erro.stack || erro); }
    }
    if (e.parameter.abas === "1") {
      const pl = SpreadsheetApp.getActiveSpreadsheet();
      info.abas = pl.getSheets().map((sh) => ({
        nome: sh.getName(), linhas: sh.getLastRow(), colunas: sh.getLastColumn(),
        formulaA: sh.getRange("A1:A3").getFormulas().map((r) => r[0]),
        amostra: sh.getLastRow() ? sh.getRange(1, 1, Math.min(6, sh.getLastRow()), Math.min(12, Math.max(1, sh.getLastColumn()))).getDisplayValues() : []
      }));
    }
    if (e.parameter.modelos !== "1") return json_(info);
    const chave = props.getProperty("GEMINI_API_KEY");
    const corpo = { contents: [{ role: "user", parts: [{ text: "Responda só: ok" }] }], generationConfig: { temperature: 0 } };
    info.modelos = [info.modelo, props.getProperty("MODELO_RESERVA") || "gemini-3.7-flash", props.getProperty("MODELO_LEVE") || "gemini-3.5-flash-lite"].map((m) => {
      const t = Date.now();
      try {
        const r = chamarModelo_(m, corpo, chave, m.indexOf("lite") < 0);
        return { modelo: m, codigo: r.getResponseCode(), ms: Date.now() - t, msg: r.getResponseCode() === 200 ? "ok" : r.getContentText().slice(0, 160) };
      } catch (erro) { return { modelo: m, ms: Date.now() - t, msg: String(erro.message || erro).slice(0, 160) }; }
    });
    return json_(info);
  }
  if (e && e.parameter && e.parameter.envio) return json_(consultarEnvio_(String(e.parameter.envio)));
  if (e && e.parameter && e.parameter.matricula) {
    const t = buscarNaTurma_(String(e.parameter.matricula));
    if (t === false) return json_({ ok: false, erro: "matricula", mensagem: "Matrícula não encontrada na turma. Confira o número ou fale com o professor." });
    return json_({ ok: true, nome: t && t.nome ? t.nome : "" });
  }
  return json_({ ok: true, servico: "Oficina Digital — avaliação" });
}

/** O site pergunta aqui se a nota de um envio na fila já saiu. */
function consultarEnvio_(envioId) {
  const aba = abaRespostas_();
  const ultima = aba.getLastRow();
  if (ultima < 2) return { ok: false, erro: "Envio não encontrado." };
  const valores = aba.getRange(2, 1, ultima - 1, CABECALHO.length).getValues();
  const linhas = valores.filter((v) => v[COL.ENVIO - 1] === envioId);
  if (!linhas.length) return { ok: false, erro: "Envio não encontrado." };
  if (linhas.some((v) => v[COL.STATUS - 1] === "pendente")) return { ok: true, pendente: true, envioId: envioId };
  const limiar = Number(PropertiesService.getScriptProperties().getProperty("LIMIAR_IA") || 70);
  const resultados = linhas.map((v) => ({
    id: v[COL.ID - 1],
    nota: v[COL.NOTA - 1] === "" ? 0 : Number(v[COL.NOTA - 1]),
    comentario: v[COL.COMENTARIO - 1],
    aviso_ia: v[COL.INDICIO - 1] !== "" && Number(v[COL.INDICIO - 1]) >= limiar
  }));
  return respostaAluno_(envioId, resultados);
}

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    validar_(dados);
    const turma = buscarNaTurma_(dados.matricula);
    if (turma === false) return json_({ ok: false, erro: "matricula", mensagem: "Matrícula não encontrada na turma. Confira o número ou fale com o professor." });
    if (turma && turma.nome) dados.aluno = turma.nome;   // usa o nome oficial da turma
    if (!dentroDoLimite_(dados.matricula)) return json_({ ok: false, erro: "limite", mensagem: "Muitos envios seguidos. Espere alguns minutos e tente de novo." });
    const envioId = Utilities.getUuid();
    const linhaInicial = gravar_(dados, envioId);

    // A correção roda na fila (gatilho a cada 5 min). Só sem nenhuma resposta a corrigir é que já sai a nota.
    let resultados = null;
    if (dados.respostas.every((r) => r.colou)) resultados = corrigirEnvio_(dados, 0, false);
    if (resultados) {
      atualizarLinhas_(linhaInicial, resultados);
      return json_(respostaAluno_(envioId, resultados));
    }
    marcarColadas_(linhaInicial, dados);
    return json_({ ok: true, pendente: true, envioId: envioId });
  } catch (erro) {
    console.error(erro);
    return json_({ ok: false, erro: String(erro.message || erro) });
  }
}

/** Corrige um envio. Devolve null se o Gemini não respondeu dentro do tempo. */
function corrigirEnvio_(dados, limiteMs, usarModeloLeve) {
  const limiar = Number(PropertiesService.getScriptProperties().getProperty("LIMIAR_IA") || 70);
  const paraCorrigir = dados.respostas.filter((r) => !r.colou);
  const correcao = paraCorrigir.length ? corrigirComGemini_(dados, paraCorrigir, limiteMs, usarModeloLeve) : {};
  if (paraCorrigir.some((r) => !correcao[r.id])) return null;
  return dados.respostas.map((r) => {
    if (r.colou) {
      return { id: r.id, nota: 0, comentario: COMENTARIO_COLADA, indicio: null, motivo: "Resposta colada (eliminada).", aviso_ia: false, status: "colada" };
    }
    const c = correcao[r.id];
    let indicio = c.indicio_ia;
    let motivo = c.motivo_ia || "";
    // Sinal de comportamento: texto longo que quase não foi digitado no campo.
    if (r.texto.length > 80 && (r.digitados || 0) < r.texto.length * 0.4) {
      indicio = Math.max(indicio, 80);
      motivo = (motivo ? motivo + " " : "") + "Boa parte do texto entrou no campo sem digitação.";
    }
    return { id: r.id, nota: c.nota, comentario: c.comentario, indicio: indicio, motivo: motivo, aviso_ia: indicio >= limiar, status: "corrigida" };
  });
}

function respostaAluno_(envioId, resultados) {
  const notas = resultados.map((r) => r.nota);
  const notaMissao = Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10;
  return {
    ok: true, pendente: false, envioId: envioId, notaMissao: notaMissao,
    resultados: resultados.map((r) => ({ id: r.id, nota: r.nota, comentario: r.comentario, aviso_ia: r.aviso_ia }))
  };
}

function validar_(d) {
  if (!d || !Array.isArray(d.respostas) || !d.respostas.length) throw new Error("Envio sem respostas.");
  if (!d.aluno || !d.matricula) throw new Error("Falta nome ou matrícula.");
  if (d.respostas.length > 5) throw new Error("Respostas demais.");
  d.respostas.forEach((r) => {
    if (!GABARITO[r.id]) throw new Error("Pergunta desconhecida: " + r.id);
    r.texto = String(r.texto || "").slice(0, 1500);
  });
  d.aluno = String(d.aluno).slice(0, 120);
  d.matricula = String(d.matricula).slice(0, 40);
}

function corrigirComGemini_(dados, respostas, limiteMs, usarModeloLeve) {
  const props = PropertiesService.getScriptProperties();
  const chave = props.getProperty("GEMINI_API_KEY");
  if (!chave) throw new Error("GEMINI_API_KEY não configurada.");
  const modelo = props.getProperty("MODELO") || "gemini-3.8-flash";

  const itens = respostas.map((r) => [
    "ID: " + r.id,
    "Pergunta: " + GABARITO[r.id].pergunta,
    "Ideias esperadas: " + GABARITO[r.id].esperado,
    "Resposta do aluno: \"\"\"" + r.texto + "\"\"\"",
    "Sinais de escrita: " + (r.digitados || 0) + " caracteres digitados para " + r.texto.length +
      " caracteres de resposta; " + (r.tempoEscritaSeg || 0) + " s escrevendo."
  ].join("\n")).join("\n\n");

  const prompt = [
    "Você corrige respostas curtas de adultos iniciantes num curso de tecnologia (Missão: " + dados.titulo + ").",
    "Para cada resposta:",
    "1. Dê uma nota inteira de 0 a 10 comparando com as ideias esperadas. Valorize a ideia certa dita com palavras simples;",
    "   não desconte erros de português. Respostas pessoais valem pela coerência e pelo detalhe concreto.",
    "2. Escreva um comentário de no máximo duas frases curtas, em português do Brasil, direto ao aluno,",
    "   dizendo o que acertou e uma pista do que falta. Não entregue a resposta completa.",
    "3. Estime de 0 a 100 o indício de que o texto foi gerado por IA, não escrito pelo aluno.",
    "   Sinais: linguagem genérica e polida demais para um iniciante, estrutura de lista ou tópicos,",
    "   conectivos típicos (\"Além disso\", \"Em suma\", \"É importante ressaltar\"), ausência total de marca pessoal,",
    "   texto muito maior do que a pergunta pede, poucos caracteres digitados para o tamanho do texto.",
    "   Texto simples, curto ou com erros de digitação indica escrita humana. Na dúvida, use valores baixos.",
    "4. Explique o indício em uma frase curta (para o professor).",
    "",
    itens
  ].join("\n");

  const corpo = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING" },
            nota: { type: "INTEGER" },
            comentario: { type: "STRING" },
            indicio_ia: { type: "INTEGER" },
            motivo_ia: { type: "STRING" }
          },
          required: ["id", "nota", "comentario", "indicio_ia", "motivo_ia"]
        }
      }
    }
  };

  // Modelo principal; se estiver sobrecarregado ou lento, o reserva e, por último, um modelo leve.
  const reserva = props.getProperty("MODELO_RESERVA") || "gemini-3.7-flash";
  const leve = props.getProperty("MODELO_LEVE") || "gemini-3.5-flash-lite";
  const inicio = Date.now();
  let resp = null, ultimoErro = "";
  const limite = limiteMs || 90000;
  const modelos = usarModeloLeve === false ? [modelo, reserva] : [modelo, reserva, leve];
  for (const m of modelos) {
    if (Date.now() - inicio > limite) break;
    resp = chamarModelo_(m, corpo, chave, true);
    if (resp.getResponseCode() === 400 && /thinking/i.test(resp.getContentText())) {
      resp = chamarModelo_(m, corpo, chave, false);
    }
    if (resp.getResponseCode() === 200) break;
    ultimoErro = "Gemini " + resp.getResponseCode() + " (" + m + "): " + resp.getContentText().slice(0, 300);
  }
  if (!resp || resp.getResponseCode() !== 200) throw new Error(ultimoErro || "Gemini sem resposta.");
  const texto = JSON.parse(resp.getContentText()).candidates[0].content.parts[0].text;
  const lista = JSON.parse(texto);
  const mapa = {};
  lista.forEach((c) => {
    mapa[c.id] = {
      nota: Math.max(0, Math.min(10, Math.round(c.nota))),
      comentario: String(c.comentario || "").slice(0, 400),
      indicio_ia: Math.max(0, Math.min(100, Math.round(c.indicio_ia))),
      motivo_ia: String(c.motivo_ia || "").slice(0, 300)
    };
  });
  return mapa;
}

function chamarModelo_(modelo, corpo, chave, pensarPouco) {
  const c = JSON.parse(JSON.stringify(corpo));
  if (pensarPouco) c.generationConfig.thinkingConfig = { thinkingLevel: "low" };
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(modelo) + ":generateContent";
  return UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: { "x-goog-api-key": chave },
    payload: JSON.stringify(c),
    muteHttpExceptions: true
  });
}

/** Grava o envio como "pendente" e devolve o número da primeira linha. */
function gravar_(d, envioId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const aba = abaRespostas_();
    const agora = new Date();
    const linhas = d.respostas.map((r) => [
      agora, d.aluno, d.matricula, d.missao, d.titulo || "", r.id, GABARITO[r.id].pergunta, r.texto,
      "", "", "", "", r.colou ? "SIM" : "", d.tempoLeituraSeg || 0, d.tempoMinimoSeg || 0, d.leiturasRapidas || 0,
      d.saidasDaPagina || 0, d.tempoForaSeg || 0, d.audioOuvidoPct || 0,
      r.digitados || 0, r.insercoesGrandes || 0, r.tempoEscritaSeg || 0, envioId, "pendente"
    ]);
    const inicio = aba.getLastRow() + 1;
    aba.getRange(inicio, 1, linhas.length, CABECALHO.length).setValues(linhas);
    SpreadsheetApp.flush();
    return inicio;
  } finally {
    lock.releaseLock();
  }
}

/** Escreve nota, comentário, indício e status nas linhas de um envio. */
function atualizarLinhas_(linhaInicial, resultados) {
  const aba = abaRespostas_();
  resultados.forEach((r, i) => {
    const linha = linhaInicial + i;
    aba.getRange(linha, COL.NOTA, 1, 4).setValues([[r.nota, r.comentario, r.indicio === null ? "" : r.indicio, r.motivo]]);
    aba.getRange(linha, COL.STATUS).setValue(r.status);
  });
}

/** Já resolve as respostas coladas de um envio que foi para a fila. */
function marcarColadas_(linhaInicial, dados) {
  const aba = abaRespostas_();
  dados.respostas.forEach((r, i) => {
    if (!r.colou) return;
    aba.getRange(linhaInicial + i, COL.NOTA, 1, 4).setValues([[0, COMENTARIO_COLADA, "", "Resposta colada (eliminada)."]]);
    aba.getRange(linhaInicial + i, COL.STATUS).setValue("colada");
  });
}

/** Roda a cada 5 minutos (gatilho): corrige os envios que ficaram na fila. */
function corrigirPendentes() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    try { manutencao_(); } catch (erro) { console.warn("Manutenção: " + erro); }
    const aba = abaRespostas_();
    const ultima = aba.getLastRow();
    if (ultima < 2) return;
    const valores = aba.getRange(2, 1, ultima - 1, CABECALHO.length).getValues();
    const envios = {};
    valores.forEach((v, i) => {
      const status = v[COL.STATUS - 1];
      if (status !== "pendente" && status !== "colada") return;
      const id = v[COL.ENVIO - 1];
      if (!id) return;
      (envios[id] = envios[id] || []).push({ linha: i + 2, v: v });
    });
    const inicio = Date.now();
    let mudou = false;
    Object.keys(envios).forEach((envioId) => {
      const grupo = envios[envioId];
      if (!grupo.some((g) => g.v[COL.STATUS - 1] === "pendente")) return;
      if (Date.now() - inicio > 240000) return;   // respeita o limite de 6 min do Google
      const dados = {
        titulo: grupo[0].v[COL.TITULO - 1],
        respostas: grupo.map((g) => ({
          id: g.v[COL.ID - 1], texto: String(g.v[COL.RESPOSTA - 1]), colou: g.v[COL.COLOU - 1] === "SIM",
          digitados: Number(g.v[COL.DIGITADOS - 1]) || 0, tempoEscritaSeg: Number(g.v[COL.TEMPO_ESCRITA - 1]) || 0
        }))
      };
      try {
        const resultados = corrigirEnvio_(dados, 120000, true);
        if (resultados) { resultados.forEach((r, i) => atualizarLinhas_(grupo[i].linha, [r])); mudou = true; }
      } catch (erro) { console.warn("Fila: " + erro); }
    });
    // Só redesenha o painel quando chegou envio novo ou saiu nota.
    const props = PropertiesService.getScriptProperties();
    if (mudou || props.getProperty("PAINEL_LINHAS") !== String(ultima)) {
      try { atualizarPainel_(); props.setProperty("PAINEL_LINHAS", String(ultima)); } catch (erro) { console.warn("Painel: " + erro); }
    }
  } finally {
    lock.releaseLock();
  }
}

/** Cria (uma vez) o gatilho que corrige a fila a cada 5 minutos. */
function ativarCorrecaoAutomatica() {
  const existe = ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === "corrigirPendentes");
  if (!existe) ScriptApp.newTrigger("corrigirPendentes").timeBased().everyMinutes(5).create();
  try { SpreadsheetApp.getUi().alert("Correção automática ativada ✅", "A fila de respostas é corrigida a cada 5 minutos.", SpreadsheetApp.getUi().ButtonSet.OK); } catch (_) {}
}

function abaRespostas_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA_RESPOSTAS);
  if (!aba) {
    aba = planilha.insertSheet(ABA_RESPOSTAS);
    aba.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]).setFontWeight("bold");
    aba.setFrozenRows(1);
    aba.getRange("C:C").setNumberFormat("@");   // matrícula como texto (mantém zeros à esquerda)
  } else if (aba.getLastColumn() < CABECALHO.length) {
    aba.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]).setFontWeight("bold");
  }
  return aba;
}

const LIMITE_ENVIOS_POR_HORA = 30;

function normalizarMatricula_(m) {
  return String(m === null || m === undefined ? "" : m).replace(/[\s.\-\/]/g, "").toUpperCase();
}

/** null = turma vazia (aceita todos); false = não está na turma; {nome} = encontrado. */
function buscarNaTurma_(matricula) {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Turma");
  if (!aba || aba.getLastRow() < 2) return null;
  const alvo = normalizarMatricula_(matricula);
  const linhas = aba.getRange(2, 1, aba.getLastRow() - 1, 2).getDisplayValues();
  const cadastradas = linhas.filter((l) => normalizarMatricula_(l[0]));
  if (!cadastradas.length) return null;
  const achou = cadastradas.find((l) => normalizarMatricula_(l[0]) === alvo);
  return achou ? { nome: String(achou[1] || "").trim() } : false;
}

/** Até LIMITE_ENVIOS_POR_HORA envios por matrícula por hora. */
function dentroDoLimite_(matricula) {
  const cache = CacheService.getScriptCache();
  const chave = "envios_" + normalizarMatricula_(matricula);
  const n = Number(cache.get(chave) || 0);
  if (n >= LIMITE_ENVIOS_POR_HORA) return false;
  cache.put(chave, String(n + 1), 3600);
  return true;
}

function abaTurma_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName("Turma");
  if (!aba) {
    aba = planilha.insertSheet("Turma");
    aba.getRange("A1:B1").setValues([["Matrícula", "Nome"]]).setFontWeight("bold");
    aba.setFrozenRows(1);
    aba.getRange("A2:A").setNumberFormat("@");
    aba.getRange("D1").setValue("Cole as matrículas na coluna A (e os nomes na B). Enquanto esta aba estiver vazia, qualquer matrícula é aceita. Com a lista preenchida, só essas matrículas conseguem enviar, e o nome oficial daqui é usado no registro.");
    aba.getRange("D1").setWrap(true);
    aba.setColumnWidth(4, 420);
  }
  return aba;
}

/** Monta o painel aluno × missão: última nota de cada missão, tentativas e alertas. */
function atualizarPainel_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const limiar = Number(PropertiesService.getScriptProperties().getProperty("LIMIAR_IA") || 70);
  const missoes = Object.keys(GABARITO).map((id) => id.replace(/q\d+$/, "")).filter((m, i, a) => a.indexOf(m) === i);
  const resp = abaRespostas_();
  const ult = resp.getLastRow();
  const valores = ult < 2 ? [] : resp.getRange(2, 1, ult - 1, CABECALHO.length).getValues();

  // Agrupa por aluno (matrícula) → missão → envios em ordem.
  const alunos = {};
  valores.forEach((v) => {
    const mat = normalizarMatricula_(v[2]);
    if (!mat || !v[COL.ENVIO - 1]) return;
    const a = alunos[mat] = alunos[mat] || { nome: v[1], matricula: String(v[2]), missoes: {} };
    a.nome = v[1];
    const m = a.missoes[v[COL.MISSAO - 1]] = a.missoes[v[COL.MISSAO - 1]] || { envios: [], linhas: {} };
    const env = v[COL.ENVIO - 1];
    if (m.envios.indexOf(env) < 0) m.envios.push(env);
    (m.linhas[env] = m.linhas[env] || []).push(v);
  });
  // Alunos da turma que ainda não enviaram nada.
  const turma = planilha.getSheetByName("Turma");
  if (turma && turma.getLastRow() >= 2) {
    turma.getRange(2, 1, turma.getLastRow() - 1, 2).getDisplayValues().forEach((l) => {
      const mat = normalizarMatricula_(l[0]);
      if (mat && !alunos[mat]) alunos[mat] = { nome: l[1] || "", matricula: l[0], missoes: {} };
      else if (mat) { alunos[mat].matricula = l[0]; if (l[1]) alunos[mat].nome = l[1]; }
    });
  }

  const COR = { boa: "#d1f2dc", media: "#fff1c2", baixa: "#fde0dc", fila: "#e5e7eb", alerta: "#f9c6c0", vazia: "#ffffff" };
  const linhas = [], cores = [], notasCel = [];
  Object.keys(alunos).sort((x, y) => String(alunos[x].nome).localeCompare(String(alunos[y].nome), "pt-BR")).forEach((mat) => {
    const a = alunos[mat];
    const linha = [a.nome, a.matricula, 0, ""], cor = ["#ffffff", "#ffffff", "#ffffff", "#ffffff"], nota = ["", "", "", ""];
    const finais = [];
    missoes.forEach((m) => {
      const info = a.missoes[m];
      if (!info) { linha.push(""); cor.push(COR.vazia); nota.push(""); return; }
      const ultimo = info.linhas[info.envios[info.envios.length - 1]];
      const tentativas = info.envios.length;
      if (ultimo.some((v) => v[COL.STATUS - 1] === "pendente")) {
        linha.push("na fila"); cor.push(COR.fila); nota.push(tentativas + " envio(s); correção na fila."); return;
      }
      const ns = ultimo.map((v) => Number(v[COL.NOTA - 1]) || 0);
      const media = Math.round((ns.reduce((x, y) => x + y, 0) / ns.length) * 10) / 10;
      const colou = ultimo.some((v) => v[COL.COLOU - 1] === "SIM");
      const ia = ultimo.some((v) => v[COL.INDICIO - 1] !== "" && Number(v[COL.INDICIO - 1]) >= limiar);
      const rapidas = Math.max.apply(null, ultimo.map((v) => Number(v[15]) || 0));
      finais.push(media);
      linha.push(media);
      cor.push(colou || ia ? COR.alerta : media >= 7 ? COR.boa : media >= 5 ? COR.media : COR.baixa);
      const avisos = [];
      if (colou) avisos.push("colou resposta");
      if (ia) avisos.push("indício de IA");
      if (rapidas) avisos.push(rapidas + " leitura(s) rápida(s)");
      nota.push("Último envio: " + media + "/10 · " + tentativas + " envio(s)" + (avisos.length ? "\n⚠ " + avisos.join(", ") : ""));
    });
    linha[2] = finais.length;
    linha[3] = finais.length ? Math.round((finais.reduce((x, y) => x + y, 0) / finais.length) * 10) / 10 : "";
    linhas.push(linha); cores.push(cor); notasCel.push(nota);
  });

  let painel = planilha.getSheetByName("Painel");
  if (!painel) painel = planilha.insertSheet("Painel", 0);
  painel.clear(); painel.clearNotes();
  const titulos = missoes.map((m) => {
    const t = GABARITO[m + "q1"] ? m.replace("m", "M") : m;
    return t;
  });
  painel.getRange(1, 1).setValue("Painel da turma: última nota de cada missão (passe o mouse na célula para ver tentativas e alertas)").setFontWeight("bold");
  painel.getRange(2, 1).setValue("Verde ≥ 7 · Amarelo 5 a 6,9 · Rosa < 5 · Vermelho = colou ou indício de IA · Cinza = correção na fila · Atualiza a cada 5 minutos.").setFontColor("#555555");
  const cab = ["Aluno", "Matrícula", "Missões feitas", "Média"].concat(titulos);
  painel.getRange(4, 1, 1, cab.length).setValues([cab]).setFontWeight("bold").setBackground("#eef0ff");
  if (linhas.length) {
    const r = painel.getRange(5, 1, linhas.length, cab.length);
    r.setValues(linhas); r.setBackgrounds(cores); r.setNotes(notasCel);
    painel.getRange(5, 5, linhas.length, missoes.length).setHorizontalAlignment("center");
  } else {
    painel.getRange(5, 1).setValue("Ainda não há respostas.");
  }
  painel.setFrozenRows(4); painel.setFrozenColumns(2);
  painel.setColumnWidth(1, 220);
  painel.getRange(4, 5, 1, missoes.length).setHorizontalAlignment("center");
}

function atualizarPainel() { atualizarPainel_(); }

/** Separador de argumentos das fórmulas conforme o idioma da planilha (pt_BR usa ";"). */
function sep_() {
  const local = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetLocale() || "";
  return /^(en|ja|zh|ko|th|he|hi)/.test(local) ? "," : ";";
}

/** Cria ou recria as abas Respostas, Painel e Coladas. */
function configurar() {
  abaRespostas_();
  abaTurma_();
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const S = sep_();
  atualizarPainel_();
  let coladas = planilha.getSheetByName("Coladas");
  if (!coladas) coladas = planilha.insertSheet("Coladas");
  coladas.clear();
  coladas.getRange("A1").setFormula("=QUERY(Respostas!A:X" + S + " \"select A, B, C, D, F, H where M = 'SIM'\"" + S + " 1)");
  ["Página1", "Sheet1", "Planilha1"].forEach((nome) => {
    const aba = planilha.getSheetByName(nome);
    if (aba && aba.getLastRow() === 0 && planilha.getSheets().length > 1) planilha.deleteSheet(aba);
  });
}

/** Ajustes que rodam sozinhos uma vez (chamado pela correção automática). */
function manutencao_() {
  const props = PropertiesService.getScriptProperties();
  // Linhas de teste da instalação somem 20 minutos depois.
  const resp = abaRespostas_();
  const limite = Date.now() - 20 * 60 * 1000;
  for (let linha = resp.getLastRow(); linha >= 2; linha--) {
    const v = resp.getRange(linha, 1, 1, 2).getValues()[0];
    if (v[1] === "TESTE (Claude)" && v[0] instanceof Date && v[0].getTime() < limite) resp.deleteRow(linha);
  }
  if (props.getProperty("VERSAO_ABAS") === "5") return;
  abaRespostas_().getRange("C2:C").setNumberFormat("@");
  // Apaga as linhas de teste criadas na instalação.
  const aba = abaRespostas_();
  for (let linha = aba.getLastRow(); linha >= 2; linha--) {
    if (aba.getRange(linha, 2).getValue() === "TESTE (Claude)") aba.deleteRow(linha);
  }
  configurar();
  props.setProperty("VERSAO_ABAS", "5");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
