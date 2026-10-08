// Avaliação das missões da Trilha: perguntas, tempo de leitura e envio à planilha do professor.
(() => {
  "use strict";
  const PERGUNTAS = window.OFICINA_PERGUNTAS || {};
  const URL_ENVIO = (window.OFICINA_AVALIACAO || {}).url || "";
  const PALAVRAS_POR_MINUTO = 200;   // leitura atenta
  const FRACAO_MINIMA = 0.5;         // abaixo de metade do tempo esperado = leitura muito rápida
  const AUDIO_SUFICIENTE = 0.8;      // ouvir 80% do áudio também conta como leitura

  const guardar = (chave, valor) => { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (_) {} };
  const ler = (chave, padrao) => { try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; } catch (_) { return padrao; } };
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Identificação do aluno (computador compartilhado) ----------
  const secaoMissoes = document.querySelector(".missoes");
  if (!secaoMissoes) return;
  const EXPIRA_MS = 4 * 60 * 60 * 1000;   // 4 horas sem uso: o próximo aluno começa do zero

  const limparDadosPessoais = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => (k.startsWith("oficina_") || k.startsWith("oficina-concluida-") || k.startsWith("oficina-verificacao-") || k.startsWith("oficina-coladas-") || k.startsWith("oficina-enviada-")) && k !== "oficina_tema")
        .forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
  };
  const ultimoUso = ler("oficina_ultimo_uso", 0);
  if (ultimoUso && Date.now() - ultimoUso > EXPIRA_MS) limparDadosPessoais();
  let ultimaMarca = 0;
  const marcarUso = () => { if (Date.now() - ultimaMarca > 60000) { ultimaMarca = Date.now(); guardar("oficina_ultimo_uso", ultimaMarca); } };
  ["pointerdown", "keydown", "scroll"].forEach((ev) => window.addEventListener(ev, marcarUso, { passive: true }));

  const ident = ler("oficina_aluno", {});
  const confirmado = !!(ident.confirmado && ident.nome && ident.matricula);
  const MAT = confirmado ? String(ident.matricula).replace(/[^0-9A-Za-z]/g, "") : "";
  const chave = (nome) => `oficina_${MAT}_${nome}`;
  if (confirmado) marcarUso();

  const painel = document.createElement("section");
  painel.className = "identificacao";
  painel.setAttribute("aria-labelledby", "titulo-identificacao");
  if (confirmado) {
    painel.innerHTML = `
      <h2 id="titulo-identificacao">Estudando como ${esc(ident.nome)}</h2>
      <p>Suas respostas, sua nota e o tempo de leitura de cada missão são enviados ao professor.</p>
      <div class="ident-acoes">
        <button type="button" class="ident-trocar">Não sou eu / Sair</button>
        <span class="ident-confirma" hidden>
          Isso apaga deste computador o que não foi enviado. Continuar?
          <button type="button" class="ident-sim">Sim, trocar de aluno</button>
          <button type="button" class="ident-nao">Cancelar</button>
        </span>
      </div>`;
    const trocar = painel.querySelector(".ident-trocar");
    const confirma = painel.querySelector(".ident-confirma");
    trocar.addEventListener("click", () => { confirma.hidden = false; trocar.hidden = true; painel.querySelector(".ident-sim").focus(); });
    painel.querySelector(".ident-nao").addEventListener("click", () => { confirma.hidden = true; trocar.hidden = false; trocar.focus(); });
    painel.querySelector(".ident-sim").addEventListener("click", () => { limparDadosPessoais(); location.reload(); });
  } else {
    painel.innerHTML = `
      <h2 id="titulo-identificacao">Quem está estudando?</h2>
      <p>Escreva seu nome completo para responder às perguntas das missões. Suas respostas, sua nota e o tempo de leitura de cada missão são enviados ao professor.</p>
      <form class="ident-campos" novalidate>
        <label>Seu nome completo <small>(ou sua matrícula)</small> <input id="aluno-quem" autocomplete="off" required></label>
        <button type="submit" class="ident-comecar">Começar</button>
      </form>
      <p class="ident-status" role="status" aria-live="polite"></p>`;
    const form = painel.querySelector("form");
    const st = painel.querySelector(".ident-status");
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const quem = painel.querySelector("#aluno-quem").value.trim();
      if (!quem) { st.textContent = "Escreva seu nome completo."; st.className = "ident-status alerta"; return; }
      let r = { ok: true, nome: quem, id: quem };
      if (URL_ENVIO) {
        st.textContent = "Procurando você na turma…"; st.className = "ident-status";
        try { r = await (await fetch(`${URL_ENVIO}?quem=${encodeURIComponent(quem)}`)).json(); }
        catch (_) { st.textContent = "Sem conexão. Tente de novo em instantes."; st.className = "ident-status alerta"; return; }
        if (!r.ok) { st.textContent = r.mensagem || "Não achei você na turma."; st.className = "ident-status alerta"; return; }
      }
      limparDadosPessoais();
      guardar("oficina_aluno", { nome: r.nome || quem, matricula: r.id, confirmado: true });
      guardar("oficina_ultimo_uso", Date.now());
      location.reload();
    });
  }
  // Guia "Como estudar" + identificação logo abaixo do título da página.
  const topo = document.querySelector(".trilha-topo") || secaoMissoes;
  const guia = document.createElement("section");
  guia.className = "guia-estudo";
  guia.setAttribute("aria-labelledby", "titulo-guia");
  guia.innerHTML = `
    <h2 id="titulo-guia">Como estudar nesta página</h2>
    <ol class="guia-passos">
      <li><strong>Diga quem você é.</strong> Escreva seu nome completo no quadro abaixo e clique em <em>Começar</em>.</li>
      <li><strong>Abra a sua missão.</strong> Faça uma de cada vez, na ordem. O botão abaixo leva você à próxima.</li>
      <li><strong>Leia com calma ou ouça o áudio.</strong> Leitura muito rápida não vale: o site pede para ler de novo.</li>
      <li><strong>Faça a atividade</strong> que está em <em>Faça</em> e guarde a prova pedida em <em>Mostre</em>.</li>
      <li><strong>Responda as 2 perguntas com suas palavras</strong> e clique em <em>Enviar respostas</em>. A nota aparece na própria missão em alguns minutos.</li>
    </ol>
    <p class="guia-progresso" aria-live="polite"></p>
    <a class="guia-proxima" href="#m0">Ir para a próxima missão →</a>`;
  topo.after(guia);
  guia.after(painel);

  // ---------- Tempo de leitura por missão ----------
  const estado = {};          // por missão: tempo, saídas, tempo fora, leituras rápidas
  const visibilidade = {};    // fração visível de cada missão
  let missaoEmFoco = null;
  let foraDesde = null;

  const missoes = [...document.querySelectorAll("article.missao")].filter((m) => PERGUNTAS[m.id]);
  missoes.forEach((m) => {
    estado[m.id] = Object.assign({ tempo: 0, saidas: 0, tempoFora: 0, leiturasRapidas: 0 }, confirmado ? ler(chave(`leitura_${m.id}`), {}) : {});
  });

  const palavrasDa = (missao) => {
    const copia = missao.cloneNode(true);
    copia.querySelectorAll(".quiz-missao, .audio-missao, .selo-ferr, details").forEach((n) => n.remove());
    return copia.innerText.split(/\s+/).filter(Boolean).length;
  };
  const tempoMinimo = (missao) => {
    const seg = (palavrasDa(missao) / PALAVRAS_POR_MINUTO) * 60 * FRACAO_MINIMA;
    return Math.round(Math.min(150, Math.max(20, seg)));
  };
  const audioDa = (missao) => missao.querySelector(".audio-missao audio");
  const audioOuvido = (missao) => {
    const a = audioDa(missao);
    if (!a || !a.duration || !isFinite(a.duration)) return 0;
    let total = 0;
    for (let i = 0; i < a.played.length; i++) total += a.played.end(i) - a.played.start(i);
    return Math.min(1, total / a.duration);
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { visibilidade[e.target.id] = e.intersectionRatio; });
  }, { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] });
  missoes.forEach((m) => observador.observe(m));

  setInterval(() => {
    const ativa = document.visibilityState === "visible" && document.hasFocus();
    let maior = null, fr = 0;
    for (const id in visibilidade) if (visibilidade[id] > fr) { fr = visibilidade[id]; maior = id; }
    if (maior) missaoEmFoco = maior;
    missoes.forEach((m) => {
      const tocando = audioDa(m) && !audioDa(m).paused;
      const naTela = (visibilidade[m.id] || 0) >= 0.3 || (m.id === maior && fr >= 0.15);
      if ((ativa && naTela) || tocando) {
        estado[m.id].tempo += 1;
        if (confirmado && estado[m.id].tempo % 5 === 0) guardar(chave(`leitura_${m.id}`), estado[m.id]);
      }
    });
  }, 1000);

  const saiu = () => {
    if (foraDesde) return;
    foraDesde = Date.now();
    if (missaoEmFoco && estado[missaoEmFoco]) estado[missaoEmFoco].saidas += 1;
  };
  const voltou = () => {
    if (!foraDesde) return;
    if (missaoEmFoco && estado[missaoEmFoco]) {
      estado[missaoEmFoco].tempoFora += Math.round((Date.now() - foraDesde) / 1000);
      if (confirmado) guardar(chave(`leitura_${missaoEmFoco}`), estado[missaoEmFoco]);
    }
    foraDesde = null;
  };
  document.addEventListener("visibilitychange", () => (document.visibilityState === "hidden" ? saiu() : voltou()));
  window.addEventListener("blur", saiu);
  window.addEventListener("focus", voltou);

  // ---------- Situação de cada missão e próxima missão ----------
  const situacaoDe = (id) => {
    if (!confirmado) return { tipo: "afazer", texto: "A fazer" };
    const nota = ler(chave(`nota_${id}`), null);
    if (nota && nota.notaMissao !== undefined && nota.notaMissao !== null) return { tipo: "feita", texto: `Enviada · ${String(nota.notaMissao).replace(".", ",")}/10` };
    if (ler(chave(`pendente_${id}`), null)) return { tipo: "fila", texto: "Enviada · nota na fila" };
    return { tipo: "afazer", texto: "A fazer" };
  };
  const atualizarSituacao = () => {
    let feitas = 0, proxima = null;
    missoes.forEach((m) => {
      const sit = situacaoDe(m.id);
      const etiqueta = m.querySelector(".situacao-missao");
      if (etiqueta) { etiqueta.textContent = sit.texto; etiqueta.className = `situacao-missao situacao-${sit.tipo}`; }
      if (sit.tipo === "afazer") { if (!proxima) proxima = m; } else feitas += 1;
    });
    const prog = guia.querySelector(".guia-progresso");
    const botaoProx = guia.querySelector(".guia-proxima");
    if (!confirmado) {
      prog.textContent = "";
      botaoProx.href = "#titulo-identificacao";
      botaoProx.textContent = "Começar: dizer quem eu sou →";
    } else if (proxima) {
      prog.innerHTML = `<strong>${feitas} de ${missoes.length}</strong> missões enviadas.`;
      botaoProx.href = `#${proxima.id}`;
      botaoProx.textContent = `Ir para a próxima missão: ${proxima.querySelector("h3").textContent.trim()} →`;
    } else {
      prog.innerHTML = `<strong>Parabéns!</strong> Você enviou as ${missoes.length} missões.`;
      botaoProx.href = "#m14";
      botaoProx.textContent = "Rever a última missão →";
    }
  };
  missoes.forEach((m) => {
    const titulo = m.querySelector("h3");
    const faixa = document.createElement("div");
    faixa.className = "faixa-missao";
    faixa.innerHTML = `<span class="situacao-missao"></span>
      <span class="passos-missao" aria-label="Passos da missão"><span>① Leia ou ouça</span><span>② Faça</span><span>③ Responda e envie</span></span>`;
    titulo.after(faixa);
  });

  // ---------- Perguntas ----------
  const INSERCAO_COLADA = new Set(["insertFromPaste", "insertFromDrop", "insertFromPasteAsQuotation", "insertFromYank"]);

  missoes.forEach((missao) => {
    const perguntas = PERGUNTAS[missao.id];
    const rascunho = confirmado ? ler(chave(`resp_${missao.id}`), {}) : {};
    const caixa = document.createElement("section");
    caixa.className = "quiz-missao";
    caixa.setAttribute("aria-label", "Perguntas da missão");
    caixa.innerHTML = `
      <h4>Responda com suas palavras</h4>
      ${perguntas.map((p, i) => `
        <div class="quiz-pergunta" data-id="${p.id}">
          <label for="${p.id}"><span class="quiz-n">${i + 1}</span> ${esc(p.texto)}</label>
          <textarea id="${p.id}" rows="4" maxlength="1500" spellcheck="true"></textarea>
          <div class="quiz-retorno" aria-live="polite"></div>
        </div>`).join("")}
      <button type="button" class="quiz-enviar">Enviar respostas</button>
      <p class="quiz-status" role="status" aria-live="polite"></p>`;
    const alvo = missao.querySelector(".checkpoint") || null;
    missao.insertBefore(caixa, alvo && alvo.parentElement === missao ? alvo : null);

    const sinais = {};
    perguntas.forEach((p) => {
      const campo = caixa.querySelector(`#${p.id}`);
      const salvo = rascunho[p.id] || {};
      campo.value = salvo.texto || "";
      sinais[p.id] = { colou: !!salvo.colou, digitados: salvo.digitados || 0, insercoesGrandes: salvo.insercoesGrandes || 0, inicio: null, tempoEscrita: salvo.tempoEscrita || 0, ultimo: null };
      const s = sinais[p.id];
      const marcarColagem = () => { s.colou = true; };
      campo.addEventListener("paste", marcarColagem);
      campo.addEventListener("drop", marcarColagem);
      campo.addEventListener("beforeinput", (e) => {
        if (INSERCAO_COLADA.has(e.inputType)) s.colou = true;
        else if ((e.inputType === "insertText" || e.inputType === "insertCompositionText" || e.inputType === "insertReplacementText") && e.data) {
          if (e.data.length > 40) s.insercoesGrandes += 1; else s.digitados += e.data.length;
        }
      });
      campo.addEventListener("input", () => {
        const agora = Date.now();
        if (s.ultimo && agora - s.ultimo < 60000) s.tempoEscrita += (agora - s.ultimo) / 1000;
        s.ultimo = agora;
        if (!campo.value.trim()) { s.colou = false; s.digitados = 0; s.insercoesGrandes = 0; }
        salvarRascunho();
      });
    });
    function salvarRascunho() {
      const r = {};
      perguntas.forEach((p) => {
        const s = sinais[p.id];
        r[p.id] = { texto: caixa.querySelector(`#${p.id}`).value, colou: s.colou, digitados: s.digitados, insercoesGrandes: s.insercoesGrandes, tempoEscrita: Math.round(s.tempoEscrita) };
      });
      if (confirmado) guardar(chave(`resp_${missao.id}`), r);
    }

    const status = caixa.querySelector(".quiz-status");
    const botao = caixa.querySelector(".quiz-enviar");
    if (!URL_ENVIO) {
      status.textContent = "O envio das respostas ainda não foi ligado pelo professor.";
      botao.disabled = true;
    } else if (!confirmado) {
      caixa.querySelectorAll("textarea").forEach((t) => { t.disabled = true; });
      botao.disabled = true;
      status.innerHTML = 'Para responder, escreva seu nome completo no quadro <a href="#titulo-identificacao">“Quem está estudando?”</a>.';
    }
    const resultadoAnterior = confirmado ? ler(chave(`nota_${missao.id}`), null) : null;
    if (resultadoAnterior) mostrarResultado(resultadoAnterior, true);

    botao.addEventListener("click", async () => {
      status.className = "quiz-status";
      if (!confirmado) return;
      const aluno = { nome: ident.nome, matricula: ident.matricula };
      const respostas = perguntas.map((p) => ({ id: p.id, pergunta: p.texto, texto: caixa.querySelector(`#${p.id}`).value.trim() }));
      const curta = respostas.find((r) => r.texto.length < 15);
      if (curta) {
        status.textContent = "Escreva um pouco mais em cada resposta. Uma ou duas frases com suas palavras bastam.";
        status.classList.add("alerta");
        caixa.querySelector(`#${curta.id}`).focus();
        return;
      }
      const e = estado[missao.id];
      const minimo = tempoMinimo(missao);
      const ouviu = audioOuvido(missao);
      if (e.tempo < minimo && ouviu < AUDIO_SUFICIENTE) {
        e.leiturasRapidas += 1;
        guardar(chave(`leitura_${missao.id}`), e);
        status.innerHTML = "<strong>Você passou pouco tempo nesta missão.</strong> Leia de novo com calma, ou ouça o áudio, e depois envie as respostas.";
        status.classList.add("alerta");
        missao.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      botao.disabled = true;
      status.textContent = "Enviando… isso pode levar até meio minuto.";
      const envio = {
        versao: 1,
        aluno: aluno.nome, matricula: aluno.matricula,
        missao: missao.id, titulo: missao.querySelector("h3").textContent.trim(),
        tempoLeituraSeg: e.tempo, tempoMinimoSeg: minimo, saidasDaPagina: e.saidas, tempoForaSeg: e.tempoFora,
        leiturasRapidas: e.leiturasRapidas, audioOuvidoPct: Math.round(ouviu * 100),
        respostas: respostas.map((r) => {
          const s = sinais[r.id];
          return Object.assign(r, { colou: s.colou, digitados: s.digitados, insercoesGrandes: s.insercoesGrandes, tempoEscritaSeg: Math.round(s.tempoEscrita) });
        })
      };
      try {
        const resp = await fetch(URL_ENVIO, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(envio) });
        const dados = await resp.json();
        if (!dados.ok && dados.mensagem) {
          status.textContent = dados.mensagem;
          status.classList.add("alerta");
          return;
        }
        if (!dados.ok) throw new Error(dados.erro || "erro");
        if (dados.pendente) {
          guardar(chave(`pendente_${missao.id}`), dados.envioId);
          mostrarFila();
          acompanharFila(dados.envioId);
          atualizarSituacao();
        } else {
          guardar(chave(`nota_${missao.id}`), dados);
          mostrarResultado(dados, false);
          atualizarSituacao();
        }
      } catch (_) {
        status.textContent = "Não foi possível enviar agora. Suas respostas continuam guardadas aqui. Tente de novo em instantes.";
        status.classList.add("alerta");
      } finally {
        botao.disabled = false;
      }
    });

    function mostrarFila() {
      status.className = "quiz-status ok";
      status.innerHTML = "<strong>Respostas enviadas ✅</strong> A correção está na fila. A nota aparece aqui em alguns minutos. Você já pode seguir para a próxima missão.";
    }
    function acompanharFila(envioId) {
      let voltas = 0;
      const timer = setInterval(async () => {
        voltas += 1;
        if (voltas > 40) { clearInterval(timer); return; }   // para de perguntar depois de ~20 min
        try {
          const r = await fetch(`${URL_ENVIO}?envio=${encodeURIComponent(envioId)}`);
          const dados = await r.json();
          if (dados.ok && !dados.pendente) {
            clearInterval(timer);
            try { localStorage.removeItem(chave(`pendente_${missao.id}`)); } catch (_) {}
            guardar(chave(`nota_${missao.id}`), dados);
            mostrarResultado(dados, false);
            atualizarSituacao();
          }
        } catch (_) { /* tenta de novo na próxima volta */ }
      }, 30000);
    }
    const pendente = confirmado ? ler(chave(`pendente_${missao.id}`), null) : null;
    if (pendente && URL_ENVIO) { mostrarFila(); acompanharFila(pendente); }

    function mostrarResultado(dados, antigo) {
      (dados.resultados || []).forEach((r) => {
        const alvoR = caixa.querySelector(`.quiz-pergunta[data-id="${r.id}"] .quiz-retorno`);
        if (!alvoR) return;
        const nota = r.nota === null || r.nota === undefined ? "—" : `${r.nota}/10`;
        alvoR.innerHTML = `<p class="quiz-nota"><strong>Nota: ${nota}</strong> ${esc(r.comentario || "")}</p>` +
          (r.aviso_ia ? `<p class="quiz-aviso-ia">Esta resposta tem características de texto gerado por IA. Reescreva com suas palavras, do seu jeito, e envie de novo.</p>` : "");
      });
      const media = dados.notaMissao === null || dados.notaMissao === undefined ? "—" : `${dados.notaMissao}/10`;
      status.className = "quiz-status ok";
      status.innerHTML = `<strong>Nota da missão: ${media}</strong>${antigo ? " (último envio)" : ""}. Você pode melhorar as respostas e enviar de novo.`;
    }
  });
  atualizarSituacao();
})();
