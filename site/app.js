// Endereço da API. Em casa: http://localhost:8000 — depois do deploy: a URL do Render.
const API_URL = "http://localhost:8000";

const NOMES_STATUS = { aberto: "Aberto", em_andamento: "Em andamento", concluido: "Concluído" };

document.getElementById("form-chamado").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const saida = document.getElementById("resposta-chamado");
  const dados = Object.fromEntries(new FormData(evento.target));
  saida.textContent = "Enviando...";
  try {
    const r = await fetch(`${API_URL}/chamados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!r.ok) throw new Error(`erro ${r.status}`);
    const { id } = await r.json();
    saida.textContent = `✅ Chamado nº ${id} aberto! Guarde esse número para acompanhar.`;
    evento.target.reset();
  } catch (erro) {
    saida.textContent = `❌ Não foi possível enviar (${erro.message}). Tente de novo.`;
  }
});

document.getElementById("form-acompanhar").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const saida = document.getElementById("resposta-acompanhar");
  const id = new FormData(evento.target).get("id");
  try {
    const r = await fetch(`${API_URL}/chamados/${id}`);
    if (r.status === 404) { saida.textContent = "Chamado não encontrado."; return; }
    const c = await r.json();
    saida.textContent = `Chamado nº ${c.id} (${c.equipamento}): ${NOMES_STATUS[c.status]}` +
      (c.prioridade ? ` · prioridade ${c.prioridade}` : "");
  } catch (erro) {
    saida.textContent = `❌ Não foi possível consultar (${erro.message}).`;
  }
});
