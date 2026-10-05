// Endereço da API FastAPI da Oficina Digital (pode ser Local ou Nuvem/Render)
function obterApiUrl() {
  return localStorage.getItem("api_url") || "http://localhost:8000";
}

let API_URL = obterApiUrl();
let ultimoChamadoId = localStorage.getItem("ultimoChamadoId") || null;

const NOMES_STATUS = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  concluido: "Concluído"
};

// Casos de exemplo para agilizar os testes autônomos do aluno
const CASOS_EXEMPLO = {
  dell: {
    nome: "Lucas Mendes",
    contato: "lucas.mendes@email.com",
    equipamento: "Dell G15 5511",
    problema: "O notebook aquece excessivamente e desliga repentinamente após cerca de 10 minutos jogando. As ventoinhas parecem acelerar no máximo."
  },
  nitro: {
    nome: "Fernanda Costa",
    contato: "fernanda.costa@email.com",
    equipamento: "Acer Nitro 5 AN515",
    problema: "Apresenta tela azul aleatória com erro de memory management. O Windows reinicia sozinho várias vezes ao dia."
  },
  desktop: {
    nome: "Rafael Silva",
    contato: "rafael.silva@email.com",
    equipamento: "Desktop Gamer Core i5",
    problema: "Computador reinicia sozinho toda vez que a placa de vídeo entra em carga pesada de renderização 3D ou jogo pesado."
  }
};

function preencherExemplo(tipo) {
  const dados = CASOS_EXEMPLO[tipo];
  if (!dados) return;

  document.getElementById("campo-nome").value = dados.nome;
  document.getElementById("campo-contato").value = dados.contato;
  document.getElementById("campo-equipamento").value = dados.equipamento;
  document.getElementById("campo-problema").value = dados.problema;

  const saida = document.getElementById("resposta-chamado");
  saida.innerHTML = `<span style="color:var(--cor-primaria)">✨ Exemplo carregado! Clique em <strong>"🚀 Enviar Chamado para Triagem IA"</strong> abaixo para testar.</span>`;
  saida.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Configuração do Servidor / API (Local vs Nuvem)
function abrirConfigApi() {
  const modal = document.getElementById("modal-config-api");
  const input = document.getElementById("input-url-api");
  if (input) input.value = API_URL;
  if (modal) modal.style.display = "flex";
}

function fecharConfigApi() {
  const modal = document.getElementById("modal-config-api");
  if (modal) modal.style.display = "none";
}

function definirModoApi(modo) {
  const input = document.getElementById("input-url-api");
  if (modo === "local") {
    input.value = "http://localhost:8000";
  } else {
    if (!input.value || input.value === "http://localhost:8000") {
      input.value = "https://oficina-digital-api.onrender.com";
    }
  }
}

function salvarConfigApi() {
  const input = document.getElementById("input-url-api");
  let url = (input.value || "").trim().replace(/\/+$/, "");
  if (!url) url = "http://localhost:8000";

  API_URL = url;
  localStorage.setItem("api_url", url);
  fecharConfigApi();
  verificarApi();
}

// Copiar comando para área de transferência
async function copiarComando(idElemento, botao) {
  const el = document.getElementById(idElemento);
  if (!el) return;
  const texto = el.innerText || el.textContent;

  try {
    await navigator.clipboard.writeText(texto.trim());
    const original = botao.innerHTML;
    botao.innerHTML = "✅ Copiado!";
    botao.style.background = "var(--cor-sucesso)";
    botao.style.color = "#fff";
    setTimeout(() => {
      botao.innerHTML = original;
      botao.style.background = "";
      botao.style.color = "";
    }, 2000);
  } catch (err) {
    alert("Copie manualmente:\n" + texto);
  }
}

// Expansão/colapso de passos do roteiro
function alternarPasso(num) {
  const corpo = document.getElementById(`corpo-passo-${num}`);
  if (corpo) {
    corpo.classList.toggle("oculto");
  }
}

// Gerenciamento do progresso autônomo do aluno
function atualizarProgresso() {
  const total = 5;
  let concluidos = 0;
  for (let i = 1; i <= total; i++) {
    const ck = document.getElementById(`check-passo-${i}`);
    const item = document.getElementById(`item-passo-${i}`);
    if (ck && ck.checked) {
      concluidos++;
      if (item) item.classList.add("concluido");
      localStorage.setItem(`passo_${i}_ok`, "true");
    } else {
      if (item) item.classList.remove("concluido");
      localStorage.removeItem(`passo_${i}_ok`);
    }
  }

  const pct = Math.round((concluidos / total) * 100);
  const barra = document.getElementById("barra-progresso");
  const txt = document.getElementById("texto-progresso");

  if (barra) barra.style.width = `${pct}%`;
  if (txt) {
    txt.textContent = pct === 100 ? "🎉 Missão 100% Concluída!" : `${pct}% Concluído`;
  }
}

function carregarProgressoSalvo() {
  for (let i = 1; i <= 5; i++) {
    if (localStorage.getItem(`passo_${i}_ok`) === "true") {
      const ck = document.getElementById(`check-passo-${i}`);
      if (ck) ck.checked = true;
    }
  }
  atualizarProgresso();
}

// Monitora se a API está online
async function verificarApi() {
  const ponto = document.getElementById("ponto-status");
  const texto = document.getElementById("texto-status");
  const urlCurta = API_URL.replace(/^https?:\/\//, "");

  try {
    const res = await fetch(`${API_URL}/docs`, { method: "HEAD", mode: "no-cors" });
    ponto.className = "ponto-status online";
    texto.textContent = `API Online (${urlCurta})`;

  } catch (e) {
    ponto.className = "ponto-status offline";
    texto.textContent = `API Offline (${urlCurta})`;
  }
}

// Submissão do formulário de chamado
document.getElementById("form-chamado").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const saida = document.getElementById("resposta-chamado");
  const botao = document.getElementById("btn-enviar");
  const dados = Object.fromEntries(new FormData(evento.target));

  botao.disabled = true;
  saida.textContent = "⏳ Enviando chamado para a API e acionando IA...";

  try {
    const r = await fetch(`${API_URL}/chamados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!r.ok) throw new Error(`Status HTTP ${r.status}`);
    const resposta = await r.json();
    const id = resposta.id;

    ultimoChamadoId = id;
    localStorage.setItem("ultimoChamadoId", id);
    atualizarBotaoUltimo(id);

    saida.innerHTML = `
      <div style="background:var(--destaque); padding:1rem; border-radius:6px; border-left:4px solid var(--cor-sucesso);">
        ✅ <strong>Chamado nº ${id} registrado com sucesso!</strong><br>
        A IA está analisando os sintomas e consultando o Grafo de Conhecimento.<br>
        <button type="button" class="btn-secundario" style="margin-top:0.5rem;" onclick="carregarChamado(${id})">
          Ver Diagnóstico da IA do Chamado #${id} ➔
        </button>
      </div>
    `;

    document.getElementById("campo-id-consulta").value = id;
    evento.target.reset();
  } catch (erro) {
    saida.innerHTML = `❌ <strong>Falha na comunicação com a API em ${API_URL}:</strong> ${erro.message}. Verifique se o terminal da API está rodando ou clique em ⚙️ Alterar no topo.`;
  } finally {
    botao.disabled = false;
  }
});

// Consulta de chamado
document.getElementById("form-acompanhar").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = new FormData(evento.target).get("id");
  await carregarChamado(id);
});

async function carregarChamado(id) {
  const saida = document.getElementById("resposta-acompanhar");
  const painel = document.getElementById("resultado-detalhes");

  saida.textContent = "🔍 Buscando informações do chamado...";
  painel.style.display = "none";

  try {
    const r = await fetch(`${API_URL}/chamados/${id}`);
    if (r.status === 404) {
      saida.textContent = `❌ Chamado nº ${id} não foi encontrado no banco de dados.`;
      return;
    }
    if (!r.ok) throw new Error(`Status ${r.status}`);

    const c = await r.json();
    saida.textContent = "";

    document.getElementById("diag-titulo").textContent = `Chamado #${c.id}`;
    document.getElementById("diag-status").textContent = NOMES_STATUS[c.status] || c.status;

    const prioridade = c.prioridade || "indefinida";
    const elPrioridade = document.getElementById("diag-prioridade");
    elPrioridade.textContent = `Prioridade: ${prioridade.toUpperCase()}`;
    elPrioridade.className = `badge-prioridade ${prioridade.toLowerCase()}`;

    document.getElementById("diag-equipamento").textContent = c.equipamento;
    document.getElementById("diag-data").textContent = c.criado_em ? new Date(c.criado_em).toLocaleString("pt-BR") : "---";

    const diagTexto = document.getElementById("diag-texto");
    if (c.diagnostico) {
      diagTexto.textContent = c.diagnostico;
    } else {
      diagTexto.innerHTML = `<em>A IA ainda está processando a triagem em segundo plano...</em>\n<button type="button" class="btn-link" onclick="carregarChamado(${c.id})">🔄 Atualizar agora</button>`;
    }

    painel.style.display = "block";
    painel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (erro) {
    saida.textContent = `❌ Não foi possível carregar o chamado (${erro.message}). Verifique a API.`;
  }
}

function atualizarBotaoUltimo(id) {
  if (!id) return;
  const btn = document.getElementById("btn-ultimo");
  const txt = document.getElementById("txt-ultimo-id");
  txt.textContent = id;
  btn.style.display = "inline-block";
}

function consultarUltimo() {
  if (ultimoChamadoId) {
    document.getElementById("campo-id-consulta").value = ultimoChamadoId;
    carregarChamado(ultimoChamadoId);
  }
}

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  carregarProgressoSalvo();
  verificarApi();
  setInterval(verificarApi, 8000);

  if (ultimoChamadoId) {
    atualizarBotaoUltimo(ultimoChamadoId);
    document.getElementById("campo-id-consulta").value = ultimoChamadoId;
  }
});
