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
    // Menu de abas: no celular ele desliza. Mostra a dica "›" enquanto houver abas escondidas.
    var abas = document.querySelector(".barra-topo .abas");
    if (abas) {
      var topo = abas.closest(".barra-topo");
      var dica = document.createElement("button");
      dica.type = "button";
      dica.className = "abas-dica";
      dica.setAttribute("aria-label", "Ver mais abas do menu");
      dica.textContent = "›";
      dica.addEventListener("click", function () { abas.scrollBy({ left: abas.clientWidth * 0.7, behavior: "smooth" }); });
      topo.appendChild(dica);
      var dicaEsq = document.createElement("button");
      dicaEsq.type = "button";
      dicaEsq.className = "abas-dica abas-dica--esq";
      dicaEsq.setAttribute("aria-label", "Ver abas anteriores do menu");
      dicaEsq.textContent = "‹";
      dicaEsq.addEventListener("click", function () { abas.scrollBy({ left: -abas.clientWidth * 0.7, behavior: "smooth" }); });
      topo.appendChild(dicaEsq);
      var atualizar = function () {
        var sobra = abas.scrollWidth - abas.clientWidth;
        var dir = sobra > 4 && abas.scrollLeft < sobra - 4;
        var esq = sobra > 4 && abas.scrollLeft > 4;
        abas.classList.toggle("tem-mais-dir", dir);
        abas.classList.toggle("tem-mais-esq", esq);
        topo.classList.toggle("mostra-dica", dir);
        topo.classList.toggle("mostra-dica-esq", esq);
      };
      var ativa = abas.querySelector("[aria-current]");
      if (ativa && abas.scrollWidth > abas.clientWidth) {
        abas.scrollLeft = Math.max(0, ativa.offsetLeft - abas.offsetLeft - (abas.clientWidth - ativa.offsetWidth) / 2);
      }
      abas.addEventListener("scroll", atualizar, { passive: true });
      window.addEventListener("resize", atualizar);
      atualizar();
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
