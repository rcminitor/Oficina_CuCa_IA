// Tema claro/escuro das páginas do aluno. Carregado no <head> para evitar piscada.
(function () {
  var raiz = document.documentElement;
  try { var salvo = localStorage.getItem("oficina_tema"); if (salvo) raiz.setAttribute("data-theme", salvo); } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () {
    // No celular, tabelas com cabeçalho viram cartões (rótulo + valor) em vez de colunas espremidas.
    var b = document.body;
    if (b.classList.contains("manual") && !b.classList.contains("painel")) {
      document.querySelectorAll("table:not(.empilha)").forEach(function (tab) {
        var cab = tab.rows[0];
        if (!cab || !Array.prototype.every.call(cab.cells, function (c) { return c.tagName === "TH"; })) return;
        var nomes = Array.prototype.map.call(cab.cells, function (c) { return c.textContent.trim(); });
        Array.prototype.forEach.call(tab.rows, function (lin, i) {
          if (i === 0) return;
          Array.prototype.forEach.call(lin.cells, function (c, j) { if (!c.hasAttribute("data-l") && nomes[j]) c.setAttribute("data-l", nomes[j]); });
        });
        tab.classList.add("empilha");
      });
    }
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
