// Painel de chamados: conversa com a API que o aluno criou (POST /chamados e GET /chamados/{n}).
(function () {
  "use strict";

  const CHAVE_API = "api_url";
  const CHAVE_ULTIMO = "ultimoChamadoId";
  const PADRAO = "http://localhost:8000";
  const STATUS = { aberto: "Aberto", em_andamento: "Em andamento", concluido: "Concluído" };

  const EXEMPLOS = {
    dell: { nome: "Lucas Mendes", contato: "lucas.mendes@email.com", equipamento: "Dell G15 5511",
            problema: "O notebook aquece muito e desliga sozinho depois de uns 10 minutos jogando. As ventoinhas aceleram no máximo." },
    nitro: { nome: "Fernanda Costa", contato: "fernanda.costa@email.com", equipamento: "Acer Nitro 5 AN515",
             problema: "Aparece tela azul de vez em quando e o Windows reinicia sozinho várias vezes ao dia." },
    desktop: { nome: "Rafael Silva", contato: "rafael.silva@email.com", equipamento: "Desktop Gamer Core i5",
               problema: "O computador reinicia sozinho sempre que a placa de vídeo trabalha pesado, em jogos ou renderização." },
  };

  const $ = (id) => document.getElementById(id);
  const lerLS = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const gravarLS = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue sem salvar */ } };
  const limpaUrl = (u) => (u || "").trim().replace(/\/+$/, "");

  let apiUrl = limpaUrl(lerLS(CHAVE_API)) || PADRAO;
  let ultimoId = lerLS(CHAVE_ULTIMO);
  let temporizadorLaudo = null;

  // ---------------------------------------------------------------- estado da API
  async function verificarApi() {
    const alvo = apiUrl; // se o endereço mudar durante a espera, este resultado fica velho
    const curta = alvo.replace(/^https?:\/\//, "");
    const controle = new AbortController();
    const prazo = setTimeout(() => controle.abort(), 4000);
    let estado = "offline";
    try {
      await fetch(alvo + "/docs", { method: "HEAD", mode: "no-cors", signal: controle.signal });
      estado = "online";
    } catch (e) { /* offline */ }
    clearTimeout(prazo);
    if (alvo !== apiUrl) return;
    $("ponto-api").dataset.estado = estado;
    $("texto-api").textContent = estado === "online" ? "Ligada em " + curta : "Desligada, ou fora do alcance: " + curta;
    $("ajuda-api").hidden = estado === "online";
  }

  function abrirDialogo() {
    $("input-url-api").value = apiUrl;
    const d = $("dlg-api");
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  function fecharDialogo() {
    const d = $("dlg-api");
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }
  function salvarApi(evento) {
    evento.preventDefault();
    apiUrl = limpaUrl($("input-url-api").value) || PADRAO;
    gravarLS(CHAVE_API, apiUrl);
    fecharDialogo();
    $("ponto-api").dataset.estado = "verificando";
    $("texto-api").textContent = "Verificando...";
    verificarApi();
  }

  // ---------------------------------------------------------------- abrir chamado
  function preencherExemplo(tipo) {
    const d = EXEMPLOS[tipo];
    if (!d) return;
    $("campo-nome").value = d.nome;
    $("campo-contato").value = d.contato;
    $("campo-equipamento").value = d.equipamento;
    $("campo-problema").value = d.problema;
    mostrar("resposta-chamado", "Exemplo carregado. Agora clique em Enviar chamado.", "ok");
  }

  function mostrar(id, texto, tipo) {
    const el = $(id);
    el.textContent = texto;
    el.className = "mensagem" + (tipo ? " " + tipo : "");
  }

  function validar(form) {
    let primeiro = null;
    for (const campo of form.elements) {
      if (!campo.name) continue;
      const invalido = !campo.checkValidity();
      campo.setAttribute("aria-invalid", invalido ? "true" : "false");
      if (invalido && !primeiro) primeiro = campo;
    }
    if (primeiro) primeiro.focus();
    return !primeiro;
  }

  async function enviarChamado(evento) {
    evento.preventDefault();
    const form = evento.target;
    if (!validar(form)) {
      mostrar("resposta-chamado", "Confira os campos em vermelho. O relato precisa de pelo menos 10 letras.", "erro");
      return;
    }
    const botao = $("btn-enviar");
    botao.disabled = true;
    mostrar("resposta-chamado", "Enviando o chamado...", "");
    try {
      const r = await fetch(apiUrl + "/chamados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!r.ok) throw new Error("a API respondeu com o código " + r.status);
      const resposta = await r.json();
      const id = resposta.id;
      ultimoId = String(id);
      gravarLS(CHAVE_ULTIMO, ultimoId);
      mostrarUltimo();
      $("campo-id-consulta").value = id;
      form.reset();
      mostrar("resposta-chamado", "Chamado nº " + id + " registrado. Anote o número.", "ok");
      const ver = document.createElement("button");
      ver.type = "button"; ver.className = "btn secundario"; ver.textContent = "Ver o laudo do chamado " + id;
      ver.addEventListener("click", () => carregarChamado(id));
      $("resposta-chamado").appendChild(document.createElement("br"));
      $("resposta-chamado").appendChild(ver);
    } catch (erro) {
      mostrar("resposta-chamado", "Não consegui enviar para " + apiUrl + ": " + erro.message + ". Veja se o terminal da API está ligado.", "erro");
    } finally {
      botao.disabled = false;
    }
  }

  // ---------------------------------------------------------------- acompanhar
  function mostrarUltimo() {
    if (!ultimoId) return;
    $("txt-ultimo-id").textContent = ultimoId;
    $("btn-ultimo").hidden = false;
  }

  async function carregarChamado(id, tentativa) {
    clearTimeout(temporizadorLaudo);
    tentativa = tentativa || 0;
    if (tentativa === 0) {
      mostrar("resposta-acompanhar", "Buscando o chamado...", "");
      $("resultado").hidden = true;
    }
    try {
      const r = await fetch(apiUrl + "/chamados/" + encodeURIComponent(id));
      if (r.status === 404) { mostrar("resposta-acompanhar", "Não achei o chamado nº " + id + ".", "erro"); return; }
      if (!r.ok) throw new Error("a API respondeu com o código " + r.status);
      const c = await r.json();
      mostrar("resposta-acompanhar", "", "");

      $("res-titulo").textContent = "Chamado nº " + c.id;
      $("res-status").textContent = STATUS[c.status] || c.status || "Sem status";
      const prioridade = (c.prioridade || "").toLowerCase();
      $("res-prioridade").textContent = prioridade ? "Prioridade " + prioridade : "Sem prioridade";
      $("res-prioridade").dataset.nivel = prioridade;
      $("res-equipamento").textContent = c.equipamento || "-";
      $("res-data").textContent = c.criado_em ? new Date(c.criado_em).toLocaleString("pt-BR") : "-";
      const laudo = $("res-laudo");
      if (c.diagnostico) {
        laudo.textContent = c.diagnostico;
      } else {
        laudo.textContent = "A triagem ainda está trabalhando. Esta tela confere de novo sozinha.";
        if (tentativa < 5) temporizadorLaudo = setTimeout(() => carregarChamado(id, tentativa + 1), 2500);
        else laudo.textContent = "O laudo não chegou. Veja o terminal da API e tente consultar de novo.";
      }
      $("resultado").hidden = false;
      if (tentativa === 0) $("resultado").scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (erro) {
      mostrar("resposta-acompanhar", "Não consegui carregar o chamado (" + erro.message + "). Veja se a API está ligada.", "erro");
    }
  }

  // ---------------------------------------------------------------- início
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-exemplo]").forEach((b) => b.addEventListener("click", () => preencherExemplo(b.dataset.exemplo)));
    $("form-chamado").addEventListener("submit", enviarChamado);
    $("form-acompanhar").addEventListener("submit", (e) => {
      e.preventDefault();
      const campo = $("campo-id-consulta");
      if (!campo.checkValidity()) { mostrar("resposta-acompanhar", "Digite o número do chamado.", "erro"); campo.focus(); return; }
      carregarChamado(campo.value);
    });
    $("btn-ultimo").addEventListener("click", () => { $("campo-id-consulta").value = ultimoId; carregarChamado(ultimoId); });
    $("btn-alterar-api").addEventListener("click", abrirDialogo);
    $("form-api").addEventListener("submit", salvarApi);
    $("btn-cancelar-api").addEventListener("click", fecharDialogo);
    if (ultimoId) { mostrarUltimo(); $("campo-id-consulta").value = ultimoId; }
    verificarApi();
    setInterval(verificarApi, 8000);
  });
})();
