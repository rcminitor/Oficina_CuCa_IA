// Página "Começar o curso": o aluno diz quem é antes de seguir.
(() => {
  "use strict";
  const caixa = document.getElementById("quem-sou");
  const continuar = document.getElementById("comecar-continuar");
  if (!caixa || !continuar) return;
  const url = (window.OFICINA_AVALIACAO || {}).url || "";
  const ler = (k, p) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : p; } catch (_) { return p; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} };
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const EXPIRA_MS = 4 * 60 * 60 * 1000;

  function limpar() {
    try {
      Object.keys(localStorage)
        .filter((k) => (k.startsWith("oficina_") || k.startsWith("oficina-concluida-") || k.startsWith("oficina-verificacao-") || k.startsWith("oficina-coladas-") || k.startsWith("oficina-enviada-")) && k !== "oficina_tema")
        .forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
  }
  const ultimo = ler("oficina_ultimo_uso", 0);
  if (ultimo && Date.now() - ultimo > EXPIRA_MS) limpar();
  const aluno = () => { const a = ler("oficina_aluno", {}); return a.confirmado && a.nome && a.matricula ? a : null; };

  function desenhar() {
    if (!url) { caixa.innerHTML = ""; return; }
    const a = aluno();
    if (a) {
      caixa.innerHTML = `<p class="quem-sou-ok">✅ Você está como <strong>${esc(a.nome)}</strong>. <button type="button" class="quem-sou-sair">Não sou eu</button></p>`;
      caixa.querySelector(".quem-sou-sair").addEventListener("click", () => { limpar(); desenhar(); });
      return;
    }
    caixa.innerHTML = `
      <form class="quem-sou-form" novalidate>
        <h3>Diga quem você é</h3>
        <p>Assim o professor recebe as suas respostas e notas.</p>
        <label>Seu nome completo <small>(ou sua matrícula, se souber)</small> <input name="quem" autocomplete="off"></label>
        <button type="submit">Confirmar</button>
        <p class="quem-sou-status" role="status" aria-live="polite"></p>
      </form>`;
    const form = caixa.querySelector("form");
    const st = caixa.querySelector(".quem-sou-status");
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const quem = form.quem.value.trim();
      if (!quem) { st.textContent = "Escreva seu nome completo."; return; }
      st.textContent = "Procurando você na turma…";
      let r;
      try { r = await (await fetch(`${url}?quem=${encodeURIComponent(quem)}`)).json(); }
      catch (_) { st.textContent = "Sem conexão com a internet. Tente de novo em instantes."; return; }
      if (!r.ok) { st.textContent = r.mensagem || "Não achei você na turma."; return; }
      limpar();
      guardar("oficina_aluno", { nome: r.nome || quem, matricula: r.id, confirmado: true });
      guardar("oficina_ultimo_uso", Date.now());
      desenhar();
    });
  }

  continuar.addEventListener("click", (ev) => {
    if (!url || aluno()) return;
    ev.preventDefault();
    desenhar();
    const st = caixa.querySelector(".quem-sou-status");
    if (st) st.textContent = "Antes de continuar, escreva seu nome completo.";
    caixa.scrollIntoView({ behavior: "smooth", block: "center" });
    const campo = caixa.querySelector("input");
    if (campo) campo.focus({ preventScroll: true });
  });
  desenhar();
})();
