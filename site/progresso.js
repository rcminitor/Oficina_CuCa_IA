(() => {
  "use strict";

  const etapas = [
    { arquivo: "index.html", nome: "Conhecer a oficina", descricao: "Entender o projeto e escolher por onde começar.", comprovante: "Explique com sua voz o que a oficina faz." },
    { arquivo: "aluno.html", nome: "Fazer o Manual", descricao: "Preparar as ferramentas e praticar as primeiras atividades.", comprovante: "Guarde o print, a foto ou o áudio pedido no Manual." },
    { arquivo: "chaves.html", nome: "Proteger as chaves", descricao: "Aprender o que pode ser mostrado e o que precisa ficar secreto.", comprovante: "Guarde a lista do que é público e do que é secreto." },
    { arquivo: "tutorial.html", nome: "Construir o projeto", descricao: "Seguir o Tutorial e criar cada parte com o Gemini.", comprovante: "Guarde um print da parte funcionando e explique o que você fez." },
    { arquivo: "grafo.html", nome: "Explorar o grafo", descricao: "Reconhecer as ligações entre aparelhos, sintomas e peças.", comprovante: "Guarde um print do grafo e explique uma ligação." },
    { arquivo: "painel.html", nome: "Testar o Painel", descricao: "Abrir um chamado e acompanhar o laudo.", comprovante: "Guarde um print do chamado completo." },
    { arquivo: "trilha.html", nome: "Fazer a Trilha", descricao: "Cumprir as missões e explicar suas escolhas.", comprovante: "Guarde os comprovantes pedidos nas missões." }
  ];

  const ler = (chave) => { try { return localStorage.getItem(chave) === "1"; } catch (_) { return false; } };
  const salvar = (chave, valor) => { try { localStorage.setItem(chave, valor ? "1" : "0"); } catch (_) { /* mantém apenas nesta visita */ } };
  const chaveEtapa = (arquivo) => `oficina-concluida-${arquivo}`;
  const chaveComprovante = (arquivo) => `oficina-comprovante-${arquivo}`;
  const lista = document.getElementById("lista-progresso");

  function desenhar() {
    lista.innerHTML = "";
    etapas.forEach((etapa, indice) => {
      const concluida = ler(chaveEtapa(etapa.arquivo));
      const comprovante = ler(chaveComprovante(etapa.arquivo));
      const artigo = document.createElement("article");
      artigo.className = `cartao-progresso${concluida ? " concluida" : ""}${concluida && comprovante ? " completa" : ""}`;
      artigo.innerHTML = `
        <span class="numero-etapa" aria-hidden="true">${indice + 1}</span>
        <div class="texto-etapa"><h3>${etapa.nome}</h3><p>${etapa.descricao}</p></div>
        <span class="estado-etapa">${concluida ? (comprovante ? "Completa" : "Falta o comprovante") : "Ainda não feita"}</span>
        <div class="marcacoes-etapa">
          <label><input class="marcar-etapa" type="checkbox" ${concluida ? "checked" : ""}> Etapa concluída</label>
          <label title="${etapa.comprovante}"><input class="marcar-comprovante" type="checkbox" ${comprovante ? "checked" : ""}> Comprovante guardado</label>
        </div>
        <a class="abrir-etapa" href="${etapa.arquivo}">Abrir esta etapa →</a>`;
      artigo.querySelector(".marcar-etapa").addEventListener("change", (evento) => {
        salvar(chaveEtapa(etapa.arquivo), evento.target.checked);
        desenhar();
      });
      artigo.querySelector(".marcar-comprovante").addEventListener("change", (evento) => {
        salvar(chaveComprovante(etapa.arquivo), evento.target.checked);
        desenhar();
      });
      lista.append(artigo);
    });
    atualizarResumo();
  }

  function atualizarResumo() {
    const concluidas = etapas.filter((etapa) => ler(chaveEtapa(etapa.arquivo))).length;
    const comprovadas = etapas.filter((etapa) => ler(chaveComprovante(etapa.arquivo))).length;
    const porcentagem = Math.round((concluidas / etapas.length) * 100);
    const proxima = etapas.find((etapa) => !ler(chaveEtapa(etapa.arquivo))) || etapas.find((etapa) => !ler(chaveComprovante(etapa.arquivo)));
    document.getElementById("total-concluido").textContent = concluidas;
    document.getElementById("total-etapas").textContent = etapas.length;
    document.getElementById("porcentagem").textContent = porcentagem + "%";
    document.getElementById("barra-geral").style.width = porcentagem + "%";
    const anel = document.getElementById("anel-progresso");
    anel.style.setProperty("--progresso", porcentagem + "%");
    anel.setAttribute("aria-valuemax", etapas.length);
    anel.setAttribute("aria-valuenow", concluidas);
    document.getElementById("mensagem-progresso").textContent = concluidas === etapas.length && comprovadas === etapas.length
      ? "Parabéns! Todas as etapas e todos os comprovantes estão completos."
      : `${etapas.length - concluidas} etapa(s) e ${etapas.length - comprovadas} comprovante(s) ainda faltam.`;
    const continuar = document.getElementById("continuar-curso");
    continuar.href = proxima ? proxima.arquivo : "index.html";
    continuar.textContent = proxima ? `Continuar: ${proxima.nome}` : "Voltar ao Início";
  }

  desenhar();
})();
