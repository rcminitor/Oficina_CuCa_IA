(() => {
  "use strict";

  const paginas = [
    { arquivo: "index.html", nome: "Início" },
    { arquivo: "sobre.html", nome: "Conhecer o projeto" },
    { arquivo: "roteiro.html", nome: "Começar" },
    { arquivo: "trilha.html", nome: "Aprender" },
    { arquivo: "consultar.html", nome: "Escolher uma consulta" },
    { arquivo: "aluno.html", nome: "Ler o Manual" },
    { arquivo: "tutorial.html", nome: "Seguir o Tutorial" },
    { arquivo: "ferramentas.html", nome: "Escolher uma ferramenta" },
    { arquivo: "chaves.html", nome: "Preparar as chaves" },
    { arquivo: "grafo.html", nome: "Explorar o Grafo" },
    { arquivo: "painel.html", nome: "Testar o Painel" }
  ];

  const arquivoAtual = location.pathname.split("/").pop() || "index.html";
  const indice = paginas.findIndex((pagina) => pagina.arquivo === arquivoAtual);
  if (indice < 0) return;

  const atual = paginas[indice];
  const anterior = indice > 0 ? paginas[indice - 1] : null;
  const proxima = indice < paginas.length - 1 ? paginas[indice + 1] : paginas[0];
  const chave = `oficina-concluida-${atual.arquivo}`;
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
    <div class="acoes-etapa">
      ${anterior ? `<a class="acao-voltar" href="${anterior.arquivo}">Voltar: ${anterior.nome}</a>` : ""}
      <a class="acao-continuar" href="${proxima.arquivo}">${textoContinuar}</a>
    </div>`;

  const checkbox = secao.querySelector("input");
  try {
    checkbox.checked = localStorage.getItem(chave) === "1";
  } catch (_) {
    checkbox.checked = false;
  }
  secao.classList.toggle("concluida", checkbox.checked);
  checkbox.addEventListener("change", () => {
    secao.classList.toggle("concluida", checkbox.checked);
    try {
      localStorage.setItem(chave, checkbox.checked ? "1" : "0");
    } catch (_) {
      /* O progresso continua funcionando nesta visita mesmo sem armazenamento. */
    }
  });

  const rodape = document.querySelector("footer");
  if (rodape) rodape.before(secao);
  else document.body.append(secao);
})();
