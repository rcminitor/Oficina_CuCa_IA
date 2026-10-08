const botaoFonte = document.getElementById("alternar-fonte");

botaoFonte?.addEventListener("click", () => {
  document.body.classList.toggle("leitura-grande");
  botaoFonte.textContent = document.body.classList.contains("leitura-grande") ? "A− Letras normais" : "A+ Letras maiores";
});

document.querySelectorAll("[data-copiar]").forEach((botao) => {
  botao.addEventListener("click", async () => {
    const alvo = document.getElementById(botao.dataset.copiar);
    if (!alvo) return;
    await navigator.clipboard.writeText(alvo.innerText);
    const anterior = botao.textContent;
    botao.textContent = "Copiado";
    setTimeout(() => { botao.textContent = anterior; }, 1500);
  });
});

// Áudio de cada missão: resumo gerado no NotebookLM, em site/audio/missao-NN.m4a.
// O tocador só aparece quando o arquivo da missão já existe.
document.querySelectorAll("article.missao").forEach((missao) => {
  const numero = missao.id.replace("m", "").padStart(2, "0");
  const arquivo = `audio/missao-${numero}.m4a`;
  fetch(arquivo, { method: "HEAD" }).then((resposta) => {
    if (!resposta.ok) return;
    const caixa = document.createElement("div");
    caixa.className = "audio-missao";
    caixa.innerHTML = `<span>🎧 Ouça a missão (resumo do NotebookLM)</span>
      <audio controls preload="none" src="${arquivo}">Seu navegador não toca este áudio.</audio>`;
    const referencia = missao.querySelector(".faixa-missao") || missao.querySelector("h3");
    referencia.after(caixa);
  }).catch(() => {});
});
