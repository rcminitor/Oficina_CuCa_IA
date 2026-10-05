# Modelos de Prompts (Skills) — Bancada de Testes

Cada Skill é um texto pronto. Copie, troque a parte em MAIÚSCULAS e cole no Gemini ou no Colab.

## Skill A — Triagem de Sintomas

**Faz:** lê o relato do cliente e devolve só Modelo + Sintoma + Gravidade.

```text
Você é atendente de oficina de informática. Leia o relato do cliente.
Responda SOMENTE neste formato, uma linha cada:
Modelo: ...
Sintoma principal: ...
Gravidade: BAIXA, MÉDIA ou ALTA
Se faltar informação, escreva "não informado". Não invente.

Relato: """COLE O RELATO AQUI"""
```

**Exemplo de entrada:** "Meu Dell G15 tá esquentando demais e desliga quando eu jogo. Já faz uma semana."
**Saída esperada:**
```text
Modelo: Dell G15
Sintoma principal: desliga sozinho em jogo
Gravidade: ALTA
```

## Skill B — Busca de Solução no Grafo (GraphRAG)

**Faz:** consulta o histórico e indica a peça provável e o tempo de bancada.

```text
Você é técnico de bancada. Use APENAS o histórico abaixo.
Dado o modelo e o sintoma, diga:
Peça provável: ...
Tempo de bancada: ...
Casos parecidos: (número da ordem de serviço)
Se o histórico não tiver caso parecido, responda "sem histórico".

Modelo: COLE_AQUI
Sintoma: COLE_AQUI
Histórico: """COLE AQUI A TABELA DE docs/notebooklm/03_historico_ordens_servico.md"""
```

**Saída esperada para Dell G15 + desliga sozinho:**
```text
Peça provável: Pasta Térmica Alta Condutividade
Tempo de bancada: 35 a 40 min
Casos parecidos: OS 101, OS 108
```

## Usando as duas juntas
1. Cole o relato bruto na **Skill A**.
2. Pegue **Modelo** e **Sintoma** da resposta.
3. Cole na **Skill B**.

⚠️ Se a Skill A responder "não informado" no modelo, **pergunte ao cliente** antes de usar a B.

## Desafio de Decisão (resposta por áudio ou marcação)
- Em qual chamado usei a Skill A? Por quê?
- Em qual usei a Skill B? Por quê?
- Em qual precisei das duas juntas? Por quê?

## Pergunta-modelo para o NotebookLM
```text
Com base nos 3 documentos, liste os defeitos mais comuns e a peça de cada um. Use frases curtas.
```
