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

  function atualizarLiberacao() {
    const respostasProntas = verificacaoCompleta();
    const liberado = respostasProntas && checkbox.checked;
    continuar.classList.toggle("bloqueada", !liberado);
    continuar.setAttribute("aria-disabled", liberado ? "false" : "true");
    estadoVerificacao.textContent = !respostasProntas
      ? "Responda às cinco perguntas para continuar."
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
    if (continuar.getAttribute("aria-disabled") !== "true") return;
    evento.preventDefault();
    verificacao.open = true;
    (campos.find((campo) => campo.value.trim().length < 3) || checkbox).focus();
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

  atualizarLiberacao();

  const rodape = document.querySelector("footer");
  if (rodape) rodape.before(secao);
  else document.body.append(secao);
})();
