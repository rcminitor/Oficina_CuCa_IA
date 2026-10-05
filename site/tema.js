// Tema claro/escuro das páginas do aluno. Carregado no <head> para evitar piscada.
(function () {
  var raiz = document.documentElement;
  try { var salvo = localStorage.getItem("oficina_tema"); if (salvo) raiz.setAttribute("data-theme", salvo); } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () {
    var botao = document.getElementById("tema-btn");
    if (!botao) return;
    botao.addEventListener("click", function () {
      var atual = raiz.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var novo = atual === "dark" ? "light" : "dark";
      raiz.setAttribute("data-theme", novo);
      try { localStorage.setItem("oficina_tema", novo); } catch (e) {}
    });
  });
})();
