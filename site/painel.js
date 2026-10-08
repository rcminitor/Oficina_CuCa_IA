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

  const CHAMADOS_DEMO = new Map([
    [101, { numero: 101, equipamento: "Dell G15 5511", status: "em_andamento", prioridade: "alta", data: "2026-10-07T09:15:00-03:00",
      laudo: "Causa provável: superaquecimento por pasta térmica ressecada e saída de ar obstruída.\nPróximos passos: limpar as aletas, conferir as ventoinhas e substituir a pasta térmica." }],
    [102, { numero: 102, equipamento: "Acer Nitro 5 AN515", status: "aberto", prioridade: "media", data: "2026-10-07T10:40:00-03:00",
      laudo: "Causa provável: falha de memória ou de driver.\nPróximos passos: verificar os registros da tela azul, testar a memória RAM e atualizar os drivers." }],
    [103, { numero: 103, equipamento: "Desktop Gamer Core i5", status: "concluido", prioridade: "alta", data: "2026-10-07T11:20:00-03:00",
      laudo: "Causa encontrada no exemplo: fonte com potência insuficiente durante jogos.\nSolução simulada: testar outra fonte compatível e conferir os cabos de alimentação." }],
  ]);

  const $ = (id) => document.getElementById(id);
  const lerLS = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const gravarLS = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue sem salvar */ } };
  const limpaUrl = (u) => (u || "").trim().replace(/\/+$/, "");

  let apiUrl = limpaUrl(lerLS(CHAVE_API)) || PADRAO;
  let ultimoId = lerLS(CHAVE_ULTIMO);
  let temporizadorLaudo = null;
  let modoDemo = true;
  let proximoDemo = 104;

  // Link pronto: painel.html?api=https://minha-api.onrender.com guarda o endereço e já usa essa API.
  // O padrão continua sendo o localhost de cada aluno; o link só vale depois de a pessoa confirmar.
  function enderecoDoLink() {
    let u;
    try { u = new URL(new URLSearchParams(location.search).get("api") || ""); } catch (e) { return ""; }
    if (u.protocol !== "https:" && u.protocol !== "http:") return "";
    const endereco = limpaUrl(u.origin);
    if (endereco === apiUrl) return endereco;
    return confirm("Conectar este painel à API em " + endereco + "?\n\nOs chamados que você abrir aqui serão enviados para esse endereço. Só aceite se você confia nele.") ? endereco : "";
  }
  const doLink = enderecoDoLink();
  if (doLink) { apiUrl = doLink; gravarLS(CHAVE_API, apiUrl); modoDemo = false; }

  // ---------------------------------------------------------------- estado da API
  async function verificarApi() {
    const alvo = apiUrl; // se o endereço mudar durante a espera, este resultado fica velho
    const curta = alvo.replace(/^https?:\/\//, "");
    const remota = !/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(alvo);
    if (remota) $("texto-api").textContent = "Verificando " + curta + " (a API gratuita pode levar 1 minuto para acordar)...";
    const controle = new AbortController();
    const prazo = setTimeout(() => controle.abort(), remota ? 70000 : 4000);
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
    modoDemo = false;
    atualizarModo();
    $("ponto-api").dataset.estado = "verificando";
    $("texto-api").textContent = "Verificando...";
    verificarApi();
  }

  function atualizarModo() {
    $("estado-modo").textContent = modoDemo
      ? "Modo demonstração ativo"
      : "Usando a API configurada em " + apiUrl.replace(/^https?:\/\//, "");
    document.body.dataset.modoPainel = modoDemo ? "demo" : "api";
  }

  function ativarDemo(mostrarCaso) {
    modoDemo = true;
    atualizarModo();
    if (mostrarCaso) {
      $("campo-id-consulta").value = 101;
      carregarChamado(101);
      $("acompanhar").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function criarLaudoDemo(dados) {
    const texto = (dados.equipamento + " " + dados.problema).toLowerCase();
    if (texto.includes("desliga") || texto.includes("aquece")) {
      return { prioridade: "alta", laudo: "Causa provável: superaquecimento.\nPróximos passos: conferir ventoinhas, saídas de ar e pasta térmica." };
    }
    if (texto.includes("tela azul") || texto.includes("reinicia")) {
      return { prioridade: "media", laudo: "Causa provável: memória, driver ou alimentação.\nPróximos passos: consultar os registros e testar uma peça de cada vez." };
    }
    return { prioridade: "baixa", laudo: "O caso precisa de testes na bancada.\nPróximos passos: registrar os sintomas, reproduzir o defeito e testar com segurança." };
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
    if (modoDemo) {
      const dados = Object.fromEntries(new FormData(form));
      const triagem = criarLaudoDemo(dados);
      const id = proximoDemo++;
      CHAMADOS_DEMO.set(id, {
        numero: id,
        equipamento: dados.equipamento,
        status: "aberto",
        prioridade: triagem.prioridade,
        data: new Date().toISOString(),
        laudo: triagem.laudo,
      });
      ultimoId = String(id);
      $("campo-id-consulta").value = id;
      form.reset();
      mostrar("resposta-chamado", "Chamado fictício nº " + id + " criado no modo demonstração.", "ok");
      carregarChamado(id);
      return;
    }
    const botao = $("btn-enviar");
    botao.disabled = true;
    mostrar("resposta-chamado", "Enviando o chamado...", "");
    try {
      const r = await fetch(apiUrl + "/chamados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // envia os dois nomes: o gabarito usa "problema"; a Especificação, "relato"
        body: JSON.stringify((d => ({ ...d, relato: d.problema }))(Object.fromEntries(new FormData(form)))),
      });
      if (!r.ok) throw new Error("a API respondeu com o código " + r.status);
      const resposta = await r.json();
      const id = resposta.numero ?? resposta.id;
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

  function exibirChamado(c, id, tentativa) {
    mostrar("resposta-acompanhar", "", "");
    $("res-titulo").textContent = "Chamado nº " + (c.numero ?? c.id ?? id);
    $("res-status").textContent = STATUS[c.status] || c.status || "Sem status";
    const prioridade = (c.prioridade || "").toLowerCase();
    $("res-prioridade").textContent = prioridade ? "Prioridade " + prioridade : "Sem prioridade";
    $("res-prioridade").dataset.nivel = prioridade;
    $("res-equipamento").textContent = c.equipamento || "-";
    const quando = c.data ?? c.criado_em;
    $("res-data").textContent = quando ? new Date(quando).toLocaleString("pt-BR") : "-";
    const laudo = $("res-laudo");
    const texto = c.laudo ?? c.diagnostico;
    if (texto) {
      laudo.textContent = texto;
    } else {
      laudo.textContent = "A triagem ainda está trabalhando. Esta tela confere de novo sozinha.";
      if (tentativa < 5) temporizadorLaudo = setTimeout(() => carregarChamado(id, tentativa + 1), 2500);
      else laudo.textContent = "O laudo não chegou. Veja o terminal da API e tente consultar de novo.";
    }
    $("resultado").hidden = false;
    if (tentativa === 0) $("resultado").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function carregarChamado(id, tentativa) {
    clearTimeout(temporizadorLaudo);
    tentativa = tentativa || 0;
    if (tentativa === 0) {
      mostrar("resposta-acompanhar", "Buscando o chamado...", "");
      $("resultado").hidden = true;
    }
    if (modoDemo) {
      const chamado = CHAMADOS_DEMO.get(Number(id));
      if (!chamado) {
        mostrar("resposta-acompanhar", "Não achei o chamado fictício nº " + id + ". Use 101, 102 ou 103.", "erro");
        return;
      }
      exibirChamado(chamado, id, tentativa);
      return;
    }
    try {
      const r = await fetch(apiUrl + "/chamados/" + encodeURIComponent(id));
      if (r.status === 404) { mostrar("resposta-acompanhar", "Não achei o chamado nº " + id + ".", "erro"); return; }
      if (!r.ok) throw new Error("a API respondeu com o código " + r.status);
      exibirChamado(await r.json(), id, tentativa);
    } catch (erro) {
      mostrar("resposta-acompanhar", "Não consegui carregar o chamado (" + erro.message + "). Abra a Configuração avançada e confira a API.", "erro");
    }
  }

  // ---------------------------------------------------------------- início
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-exemplo]").forEach((b) => b.addEventListener("click", () => preencherExemplo(b.dataset.exemplo)));
    $("btn-demo").addEventListener("click", () => ativarDemo(true));
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
    $("configuracao-avancada").addEventListener("toggle", (e) => { if (e.target.open) verificarApi(); });
    atualizarModo();
  });
})();
