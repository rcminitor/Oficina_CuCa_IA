const botaoOuvir = document.getElementById("ouvir-pagina");
const botaoParar = document.getElementById("parar-audio");
const botaoFonte = document.getElementById("alternar-fonte");

function textoDaSecaoAtual() {
  const id = window.location.hash ? document.querySelector(window.location.hash) : null;
  const alvo = id || document.querySelector("main section");
  return alvo?.innerText || "";
}

botaoOuvir?.addEventListener("click", () => {
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(textoDaSecaoAtual());
  fala.lang = "pt-BR";
  fala.rate = 0.85;
  window.speechSynthesis.speak(fala);
});

botaoParar?.addEventListener("click", () => window.speechSynthesis.cancel());

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

document.querySelectorAll("article.missao").forEach((missao) => {
  const ouvir = document.createElement("button");
  ouvir.type = "button";
  ouvir.className = "ouvir-missao";
  ouvir.textContent = "🔊 Ouvir esta missão";
  ouvir.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(missao.innerText);
    fala.lang = "pt-BR";
    fala.rate = 0.85;
    window.speechSynthesis.speak(fala);
  });
  missao.insertBefore(ouvir, missao.children[1] || null);
});
