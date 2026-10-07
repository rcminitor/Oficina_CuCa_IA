(() => {
  "use strict";

  // Ordem em que o site conduz o aluno. Páginas de consulta (Sobre, Roteiro,
  // Consultar, Ferramentas) ficam fora da sequência e não mostram a barra.
  const paginas = [
    { arquivo: "comecar.html", nome: "Começar o curso", semBarra: true },
    { arquivo: "aluno.html", nome: "Ler o Manual" },
    { arquivo: "chaves.html", nome: "Preparar as chaves" },
    { arquivo: "tutorial.html", nome: "Seguir o Tutorial" },
    { arquivo: "grafo.html", nome: "Explorar o Grafo" },
    { arquivo: "painel.html", nome: "Testar o Painel" },
    { arquivo: "trilha.html", nome: "Ir além: a Trilha" }
  ];

  const arquivoAtual = location.pathname.split("/").pop() || "index.html";
  const indice = paginas.findIndex((pagina) => pagina.arquivo === arquivoAtual);
  if (indice < 0) return;

  const atual = paginas[indice];
  if (atual.semBarra) return; // a própria página já tem o botão "Continuar"
  const anterior = indice > 0 ? paginas[indice - 1] : null;
  const proxima = indice < paginas.length - 1 ? paginas[indice + 1] : paginas[0];
  const chave = `oficina-concluida-${atual.arquivo}`;
  const chaveVerificacao = `oficina-verificacao-${atual.arquivo}`;
  const secao = document.createElement("section");
  secao.className = "navegacao-etapa" + (arquivoAtual === "grafo.html" ? " navegacao-etapa--compacta" : "");
  secao.setAttribute("aria-labelledby", "titulo-navegacao-etapa");

  const textoContinuar = indice === paginas.length - 1
    ? "Concluir e voltar ao Início"
    : `Continuar: ${proxima.nome}`;

  secao.innerHTML = `
    <div class="navegacao-etapa__topo">
      <div>
        <p class="eyebrow">Caminho do aluno · Etapa ${indice + 1} de ${paginas.length}</p>
        <h2 id="titulo-navegacao-etapa">Você concluiu esta etapa?</h2>
      </div>
      <label class="marcar-conclusao">
        <input type="checkbox">
        <span>Sim, concluí</span>
      </label>
    </div>
    <div class="barra-caminho" role="progressbar" aria-label="Progresso no caminho do aluno" aria-valuemin="1" aria-valuemax="${paginas.length}" aria-valuenow="${indice + 1}">
      <span style="width: ${((indice + 1) / paginas.length) * 100}%"></span>
    </div>
    <details class="verificacao-etapa" open>
      <summary>Antes de avançar: explique o que você fez</summary>
      <p>Responda com frases curtas. Se respondeu em áudio, escreva onde guardou o áudio.</p>
      <div class="perguntas-verificacao">
        <label>1. O que você fez nesta etapa?<textarea data-resposta="fez" rows="2" placeholder="Eu fiz..."></textarea></label>
        <label>2. Qual ferramenta ou fonte usou? Por quê?<textarea data-resposta="escolha" rows="2" placeholder="Usei... porque..."></textarea></label>
        <label>3. O que deu errado ou foi difícil?<textarea data-resposta="dificuldade" rows="2" placeholder="Foi difícil... / Não tive erro, mas precisei..."></textarea></label>
        <label>4. Como resolveu ou conferiu?<textarea data-resposta="conferencia" rows="2" placeholder="Eu resolvi ou conferi..."></textarea></label>
        <label>5. Qual comprovante guardou?<textarea data-resposta="comprovante" rows="2" placeholder="Guardei um print, foto ou áudio de..."></textarea></label>
      </div>
      <div class="ident-verificacao"></div>
      <p class="estado-verificacao" role="status" aria-live="polite"></p>
    </details>
    <div class="acoes-etapa">
      ${anterior ? `<a class="acao-voltar" href="${anterior.arquivo}">Voltar: ${anterior.nome}</a>` : ""}
      <a class="acao-continuar" href="${proxima.arquivo}">${textoContinuar}</a>
    </div>`;

  const checkbox = secao.querySelector("input");
  const continuar = secao.querySelector(".acao-continuar");
  const verificacao = secao.querySelector(".verificacao-etapa");
  const campos = [...secao.querySelectorAll("[data-resposta]")];
  const estadoVerificacao = secao.querySelector(".estado-verificacao");
  let respostas = {};
  try {
    checkbox.checked = localStorage.getItem(chave) === "1";
    respostas = JSON.parse(localStorage.getItem(chaveVerificacao) || "{}");
  } catch (_) {
    checkbox.checked = false;
    respostas = {};
  }
  campos.forEach((campo) => { campo.value = respostas[campo.dataset.resposta] || ""; });

  function verificacaoCompleta() {
    return campos.every((campo) => campo.value.trim().length >= 3);
  }

  // ---------- Envio das respostas ao professor (planilha) ----------
  const lerJSON = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (_) { return padrao; } };
  const gravarJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} };
  const escapar = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const urlEnvio = () => (window.OFICINA_AVALIACAO || {}).url || "";
  if (!window.OFICINA_AVALIACAO) {
    const cfg = document.createElement("script");
    cfg.src = "avaliacao-config.js?v=2";
    cfg.onload = () => { desenharIdentidade(); atualizarLiberacao(); };
    document.head.append(cfg);
  }
  const aluno = () => { const a = lerJSON("oficina_aluno", {}); return a.confirmado && a.nome && a.matricula ? a : null; };
  const coladas = new Set(lerJSON(`oficina-coladas-${atual.arquivo}`, []));
  campos.forEach((campo) => {
    const marcar = () => { coladas.add(campo.dataset.resposta); gravarJSON(`oficina-coladas-${atual.arquivo}`, [...coladas]); };
    campo.addEventListener("paste", marcar);
    campo.addEventListener("drop", marcar);
    campo.addEventListener("input", () => {
      if (!campo.value.trim()) { coladas.delete(campo.dataset.resposta); gravarJSON(`oficina-coladas-${atual.arquivo}`, [...coladas]); }
    });
  });
  const caixaIdent = secao.querySelector(".ident-verificacao");
  function limparAluno() {
    try {
      Object.keys(localStorage)
        .filter((k) => (k.startsWith("oficina_") || k.startsWith("oficina-concluida-") || k.startsWith("oficina-verificacao-") || k.startsWith("oficina-coladas-") || k.startsWith("oficina-enviada-")) && k !== "oficina_tema")
        .forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
  }
  function desenharIdentidade() {
    if (!urlEnvio()) { caixaIdent.innerHTML = ""; return; }
    const a = aluno();
    if (a) {
      caixaIdent.innerHTML = `<p class="ident-linha">Suas respostas vão para o professor como <strong>${escapar(a.nome)}</strong>. <button type="button" class="ident-sair">Não sou eu</button></p>`;
      caixaIdent.querySelector(".ident-sair").addEventListener("click", () => { limparAluno(); location.reload(); });
      return;
    }
    caixaIdent.innerHTML = `
      <form class="ident-mini" novalidate>
        <p><strong>Quem é você?</strong> Suas respostas vão para o professor.</p>
        <label>Seu nome completo <small>(ou sua matrícula)</small> <input name="quem" autocomplete="off"></label>
        <button type="submit">Confirmar</button>
        <span class="ident-mini-status" role="status" aria-live="polite"></span>
      </form>`;
    const form = caixaIdent.querySelector("form");
    const st = caixaIdent.querySelector(".ident-mini-status");
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const quem = form.quem.value.trim();
      if (!quem) { st.textContent = "Escreva seu nome completo."; return; }
      st.textContent = "Procurando você na turma…";
      let r;
      try { r = await (await fetch(`${urlEnvio()}?quem=${encodeURIComponent(quem)}`)).json(); }
      catch (_) { st.textContent = "Sem conexão. Tente de novo em instantes."; return; }
      if (!r.ok) { st.textContent = r.mensagem || "Não achei você na turma."; return; }
      gravarJSON("oficina_aluno", { nome: r.nome || quem, matricula: r.id, confirmado: true });
      gravarJSON("oficina_ultimo_uso", Date.now());
      desenharIdentidade();
      atualizarLiberacao();
    });
  }
  function enviarVerificacao() {
    const a = aluno();
    if (!urlEnvio() || !a) return;
    const dados = {
      tipo: "verificacao", aluno: a.nome, matricula: a.matricula,
      pagina: atual.arquivo, titulo: atual.nome,
      respostas: Object.fromEntries(campos.map((c) => [c.dataset.resposta, c.value.trim()])),
      coladas: [...coladas]
    };
    const assinatura = JSON.stringify([a.matricula, dados.respostas, dados.coladas]);
    if (lerJSON(`oficina-enviada-${atual.arquivo}`, "") === assinatura) return;   // já enviado igual
    gravarJSON(`oficina-enviada-${atual.arquivo}`, assinatura);
    try {
      fetch(urlEnvio(), { method: "POST", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(dados) });
    } catch (_) { /* tenta de novo na próxima vez */ }
  }

  function atualizarLiberacao() {
    const respostasProntas = verificacaoCompleta();
    const identificado = !urlEnvio() || !!aluno();
    const liberado = respostasProntas && checkbox.checked && identificado;
    continuar.classList.toggle("bloqueada", !liberado);
    continuar.setAttribute("aria-disabled", liberado ? "false" : "true");
    estadoVerificacao.textContent = !respostasProntas
      ? "Responda às cinco perguntas para continuar."
      : !identificado
        ? "Agora escreva seu nome completo acima."
        : checkbox.checked
          ? "Verificação completa. Você pode avançar."
          : "Agora marque “Sim, concluí” para liberar o próximo passo.";
    verificacao.classList.toggle("completa", respostasProntas);
  }

  campos.forEach((campo) => campo.addEventListener("input", () => {
    respostas[campo.dataset.resposta] = campo.value;
    try { localStorage.setItem(chaveVerificacao, JSON.stringify(respostas)); } catch (_) { /* segue nesta visita */ }
    atualizarLiberacao();
  }));

  continuar.addEventListener("click", (evento) => {
    if (continuar.getAttribute("aria-disabled") !== "true") { enviarVerificacao(); return; }
    evento.preventDefault();
    verificacao.open = true;
    (campos.find((campo) => campo.value.trim().length < 3) || secao.querySelector(".ident-mini input") || checkbox).focus();
    verificacao.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  secao.classList.toggle("concluida", checkbox.checked);
  checkbox.addEventListener("change", () => {
    secao.classList.toggle("concluida", checkbox.checked);
    try {
      localStorage.setItem(chave, checkbox.checked ? "1" : "0");
    } catch (_) {
      /* O progresso continua funcionando nesta visita mesmo sem armazenamento. */
    }
    atualizarLiberacao();
  });

  desenharIdentidade();
  atualizarLiberacao();

  const rodape = document.querySelector("footer");
  if (rodape) rodape.before(secao);
  else document.body.append(secao);
})();
