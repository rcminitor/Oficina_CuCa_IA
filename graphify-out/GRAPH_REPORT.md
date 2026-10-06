# Graph Report - docs  (2026-10-05)

## Corpus Check
- Corpus is ~1,308 words - fits in a single context window. You may not need a graph.

## Summary
- 36 nodes · 66 edges · 6 communities
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Skills e histórico da oficina
- Tela azul, tela preta e RAM
- Não liga e fonte
- Superaquecimento e pasta térmica
- Bateria do MacBook
- Lentidão e SSD

## God Nodes (most connected - your core abstractions)
1. `Histórico de Ordens de Serviço da Oficina` - 9 edges
2. `Skill B — Busca de Solução no Grafo (GraphRAG)` - 8 edges
3. `Guia Ilustrado de Defeitos Comuns` - 7 edges
4. `Catálogo Simples de Peças e Funções` - 7 edges
5. `Desliga sozinho` - 7 edges
6. `Tela Azul (defeito)` - 6 edges
7. `Skill A — Triagem de Sintomas` - 5 edges
8. `NotebookLM` - 5 edges
9. `Dell G15` - 5 edges
10. `Não liga` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Skill A — Triagem de Sintomas` --references--> `Guia Ilustrado de Defeitos Comuns`  [INFERRED]
  prompts_skills.md → notebooklm/01_guia_defeitos_comuns.md
- `NotebookLM` --references--> `Catálogo Simples de Peças e Funções`  [EXTRACTED]
  prompts_skills.md → notebooklm/02_catalogo_pecas.md
- `Skill A — Triagem de Sintomas` --references--> `Desliga sozinho`  [EXTRACTED]
  prompts_skills.md → notebooklm/03_historico_ordens_servico.md
- `Skill B — Busca de Solução no Grafo (GraphRAG)` --references--> `Desliga sozinho`  [EXTRACTED]
  prompts_skills.md → notebooklm/03_historico_ordens_servico.md
- `Skill B — Busca de Solução no Grafo (GraphRAG)` --references--> `Pasta Térmica`  [EXTRACTED]
  prompts_skills.md → notebooklm/02_catalogo_pecas.md

## Hyperedges (group relationships)
- **Fluxo relato -> Skill A -> Skill B -> peça** — docs_prompts_skills_skill_a, docs_prompts_skills_skill_b, docs_notebooklm_03_historico_ordens_servico, docs_notebooklm_entidades_pasta_termica [EXTRACTED 0.95]
- **Dell G15 desliga sozinho -> Pasta Térmica (OS 101/108)** — docs_notebooklm_entidades_dell_g15, docs_notebooklm_entidades_desliga_sozinho, docs_notebooklm_entidades_pasta_termica, docs_notebooklm_entidades_defeito_superaquecimento [EXTRACTED 0.95]

## Communities (6 total, 0 thin omitted)

### Community 0 - "Skills e histórico da oficina"
Cohesion: 0.42
Nodes (9): Guia Ilustrado de Defeitos Comuns, Regras de segurança de bancada, Histórico de Ordens de Serviço da Oficina, Dell G15, Modelos de Prompts (Skills) — Bancada de Testes, GraphRAG, NotebookLM, Skill A — Triagem de Sintomas (+1 more)

### Community 1 - "Tela azul, tela preta e RAM"
Cohesion: 0.39
Nodes (8): Acer Nitro 5, Cabo Flat EDP Nitro 5, Tela Azul (defeito), Limpa Contato Isopropílico, Memória DDR4, Memória RAM, Tela azul, Tela preta

### Community 2 - "Não liga e fonte"
Cohesion: 0.33
Nodes (7): Carregador 130W, Falha de Boot, Desktop, Fonte ATX, MOSFET Canal N 30V, Não liga, Reinicia em jogos

### Community 3 - "Superaquecimento e pasta térmica"
Cohesion: 0.60
Nodes (6): Catálogo Simples de Peças e Funções, Cooler, Superaquecimento, Desliga sozinho, Pasta Térmica, Thermal Pads

### Community 4 - "Bateria do MacBook"
Cohesion: 0.67
Nodes (3): Bateria Original A1466, Bateria não carrega, MacBook Air

### Community 5 - "Lentidão e SSD"
Cohesion: 0.67
Nodes (3): Lentidão extrema, Notebook (genérico), SSD

## Knowledge Gaps
- **5 isolated node(s):** `GraphRAG`, `MOSFET Canal N 30V`, `Carregador 130W`, `Cabo Flat EDP Nitro 5`, `Bateria Original A1466`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 6 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Histórico de Ordens de Serviço da Oficina` connect `Skills e histórico da oficina` to `Tela azul, tela preta e RAM`, `Não liga e fonte`, `Superaquecimento e pasta térmica`, `Bateria do MacBook`, `Lentidão e SSD`?**
  _High betweenness centrality (0.411) - this node is a cross-community bridge._
- **Why does `Guia Ilustrado de Defeitos Comuns` connect `Skills e histórico da oficina` to `Tela azul, tela preta e RAM`, `Não liga e fonte`, `Superaquecimento e pasta térmica`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `Catálogo Simples de Peças e Funções` connect `Superaquecimento e pasta térmica` to `Skills e histórico da oficina`, `Tela azul, tela preta e RAM`, `Não liga e fonte`, `Lentidão e SSD`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Histórico de Ordens de Serviço da Oficina` (e.g. with `Guia Ilustrado de Defeitos Comuns` and `Catálogo Simples de Peças e Funções`) actually correct?**
  _`Histórico de Ordens de Serviço da Oficina` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Guia Ilustrado de Defeitos Comuns` (e.g. with `Histórico de Ordens de Serviço da Oficina` and `Skill A — Triagem de Sintomas`) actually correct?**
  _`Guia Ilustrado de Defeitos Comuns` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GraphRAG`, `MOSFET Canal N 30V`, `Carregador 130W` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._