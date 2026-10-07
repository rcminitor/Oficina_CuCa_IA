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

  // ---------- Identificação do aluno ----------
  const secaoMissoes = document.querySelector(".missoes");
  if (!secaoMissoes) return;
  const ident = ler("oficina_aluno", { nome: "", matricula: "" });
  const painel = document.createElement("section");
  painel.className = "identificacao";
  painel.setAttribute("aria-labelledby", "titulo-identificacao");
  painel.innerHTML = `
    <h2 id="titulo-identificacao">Quem está estudando?</h2>
    <p>Cada missão termina com perguntas. Responda com suas palavras. Suas respostas, sua nota e o tempo de leitura de cada missão são enviados ao professor.</p>
    <div class="ident-campos">
      <label>Nome <input id="aluno-nome" autocomplete="name" value="${esc(ident.nome)}"></label>
      <label>Matrícula <input id="aluno-matricula" inputmode="numeric" value="${esc(ident.matricula)}"></label>
    </div>`;
  secaoMissoes.before(painel);
  const campoNome = painel.querySelector("#aluno-nome");
  const campoMatricula = painel.querySelector("#aluno-matricula");
  const salvarIdent = () => guardar("oficina_aluno", { nome: campoNome.value.trim(), matricula: campoMatricula.value.trim() });
  campoNome.addEventListener("input", salvarIdent);
  campoMatricula.addEventListener("input", salvarIdent);

  // ---------- Tempo de leitura por missão ----------
  const estado = {};          // por missão: tempo, saídas, tempo fora, leituras rápidas
  const visibilidade = {};    // fração visível de cada missão
  let missaoEmFoco = null;
  let foraDesde = null;

  const missoes = [...document.querySelectorAll("article.missao")].filter((m) => PERGUNTAS[m.id]);
  missoes.forEach((m) => {
    estado[m.id] = Object.assign({ tempo: 0, saidas: 0, tempoFora: 0, leiturasRapidas: 0 }, ler(`oficina_leitura_${m.id}`, {}));
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
        if (estado[m.id].tempo % 5 === 0) guardar(`oficina_leitura_${m.id}`, estado[m.id]);
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
      guardar(`oficina_leitura_${missaoEmFoco}`, estado[missaoEmFoco]);
    }
    foraDesde = null;
  };
  document.addEventListener("visibilitychange", () => (document.visibilityState === "hidden" ? saiu() : voltou()));
  window.addEventListener("blur", saiu);
  window.addEventListener("focus", voltou);

  // ---------- Perguntas ----------
  const INSERCAO_COLADA = new Set(["insertFromPaste", "insertFromDrop", "insertFromPasteAsQuotation", "insertFromYank"]);

  missoes.forEach((missao) => {
    const perguntas = PERGUNTAS[missao.id];
    const rascunho = ler(`oficina_resp_${missao.id}`, {});
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
      guardar(`oficina_resp_${missao.id}`, r);
    }

    const status = caixa.querySelector(".quiz-status");
    const botao = caixa.querySelector(".quiz-enviar");
    if (!URL_ENVIO) {
      status.textContent = "O envio das respostas ainda não foi ligado pelo professor.";
      botao.disabled = true;
    }
    const resultadoAnterior = ler(`oficina_nota_${missao.id}`, null);
    if (resultadoAnterior) mostrarResultado(resultadoAnterior, true);

    botao.addEventListener("click", async () => {
      status.className = "quiz-status";
      salvarIdent();
      const aluno = ler("oficina_aluno", {});
      if (!aluno.nome || !aluno.matricula) {
        status.textContent = "Antes de enviar, escreva seu nome e sua matrícula no quadro “Quem está estudando?”.";
        status.classList.add("alerta");
        campoNome.focus();
        return;
      }
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
        guardar(`oficina_leitura_${missao.id}`, e);
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
        if (!dados.ok) throw new Error(dados.erro || "erro");
        if (dados.pendente) {
          guardar(`oficina_pendente_${missao.id}`, dados.envioId);
          mostrarFila();
          acompanharFila(dados.envioId);
        } else {
          guardar(`oficina_nota_${missao.id}`, dados);
          mostrarResultado(dados, false);
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
            try { localStorage.removeItem(`oficina_pendente_${missao.id}`); } catch (_) {}
            guardar(`oficina_nota_${missao.id}`, dados);
            mostrarResultado(dados, false);
          }
        } catch (_) { /* tenta de novo na próxima volta */ }
      }, 30000);
    }
    const pendente = ler(`oficina_pendente_${missao.id}`, null);
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
})();
