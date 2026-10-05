"""Módulo de Grafo de Conhecimento e GraphRAG da Oficina Digital.

Permite que a oficina acumule memória de longo prazo:
- Relaciona modelos de equipamentos, sintomas, causas raízes confirmadas e peças trocadas.
- Utiliza o Google Gemini com saídas estruturadas para extrair entidades e sintetizar diagnósticos.
"""
from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
import networkx as nx
from pydantic import BaseModel, Field


class ExtracaoHardware(BaseModel):
    marca: str = Field(description="Marca do equipamento (ex: Dell, Acer, Apple, Lenovo)")
    modelo: str = Field(description="Modelo ou série (ex: G15, Nitro 5, MacBook Air)")
    tipo: str = Field(description="notebook, desktop, all-in-one ou servidor")
    sintomas: List[str] = Field(description="Sintomas identificados")
    componentes_suspeitos: List[str] = Field(description="Componentes com provável falha")
    prioridade: str = Field(description="alta, media ou baixa")


class DiagnosticoGrafo(BaseModel):
    prioridade: str
    causa_provavel: str
    proximos_passos: str
    pecas_sugeridas: List[str]
    origem_memoria: str  # "grafo_historico" ou "conhecimento_geral"
    mensagem_cliente: str


class GrafoMemoriaOficina:
    def __init__(self):
        self.g = nx.DiGraph()
        self._carregar_historico_padrao()

    def _carregar_historico_padrao(self):
        """Popula o grafo com a base de conhecimento inicial da oficina."""
        casos = [
            ("Dell G15", "desliga sozinho", "pasta térmica de fábrica ressecada e aletas obstruídas", ["Pasta Térmica Alta Condutividade", "Thermal Pads"]),
            ("Dell G15", "não liga", "curto no circuito de charge (MOSFET de entrada)", ["MOSFET Canal N 30V", "Carregador 130W"]),
            ("Acer Nitro 5", "tela azul", "oxidação nos contatos da memória RAM", ["Limpa Contato Isopropílico", "Memória DDR4"]),
            ("Acer Nitro 5", "tela preta", "cabo flat da tela rompido ou desconectado na dobradiça", ["Cabo Flat EDP Nitro 5"]),
            ("MacBook Air", "bateria não carrega", "ciclos de bateria esgotados ou conector MagSafe oxidado", ["Bateria Original A1466"]),
            ("Desktop", "reinicia em jogos", "fonte genérica sem potência suficiente na linha 12V", ["Fonte ATX 600W 80 Plus"]),
            ("Notebook", "lentidão extrema", "HD mecânico antigo com setores defeituosos (bad blocks)", ["SSD NVMe 500GB / SATA"])
        ]
        for modelo, sintoma, causa, pecas in casos:
            self.adicionar_caso(modelo, sintoma, causa, pecas)

    def adicionar_caso(self, modelo: str, sintoma: str, causa: str, pecas: List[str]):
        """Insere nós e relações temporais/associativas no grafo."""
        self.g.add_node(modelo, tipo="Modelo")
        self.g.add_node(sintoma, tipo="Sintoma")
        self.g.add_node(causa, tipo="Causa")

        self.g.add_edge(modelo, sintoma, relacao="apresenta")
        self.g.add_edge(sintoma, causa, relacao="provocado_por")

        for peca in pecas:
            self.g.add_node(peca, tipo="Peca")
            self.g.add_edge(causa, peca, relacao="requer_peca")

    def buscar_antecedentes(self, modelo: str, sintomas: List[str]) -> List[Dict[str, Any]]:
        """Busca caminhos no grafo que combinam modelo e sintomas."""
        antecedentes = []
        for n_modelo in self.g.nodes:
            if modelo.lower() in n_modelo.lower() or n_modelo.lower() in modelo.lower():
                for viz_sintoma in self.g.neighbors(n_modelo):
                    for sintoma in sintomas:
                        if sintoma.lower() in viz_sintoma.lower() or viz_sintoma.lower() in sintoma.lower():
                            for causa in self.g.neighbors(viz_sintoma):
                                pecas = list(self.g.neighbors(causa))
                                antecedentes.append({
                                    "modelo_grafo": n_modelo,
                                    "sintoma_grafo": viz_sintoma,
                                    "causa_confirmada": causa,
                                    "pecas_utilizadas": pecas
                                })
        return antecedentes


# Instância singleton do grafo
memoria_oficina = GrafoMemoriaOficina()


def analisar_com_grafo_e_gemini(chamado: dict) -> DiagnosticoGrafo:
    """Pipeline que integra Gemini + Grafo de Conhecimento (GraphRAG)."""
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        # Fallback offline pedagógico caso a chave ainda não tenha sido configurada
        return _fallback_offline(chamado)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        # 1. Extração estruturada de entidades com Gemini
        prompt_extracao = f"""
        Você é um assistente técnico de triagem de hardware.
        Extraia as entidades técnicas do chamado:
        Equipamento: {chamado.get('equipamento', '')}
        Relato: {chamado.get('problema', '')}
        """
        resp_extracao = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt_extracao,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ExtracaoHardware,
                temperature=0.1
            )
        )
        dados = ExtracaoHardware.model_validate_json(resp_extracao.text)

        # 2. Consulta de Antecedentes no Grafo de Conhecimento
        antecedentes = memoria_oficina.buscar_antecedentes(dados.modelo, dados.sintomas)

        contexto_grafo = ""
        origem = "conhecimento_geral"
        if antecedentes:
            origem = "grafo_historico"
            contexto_grafo = "HISTÓRICO DA BANCADA DA OFICINA (GRAFO DE CONHECIMENTO):\n"
            for a in antecedentes:
                contexto_grafo += (
                    f"- Modelo: {a['modelo_grafo']} | Sintoma: {a['sintoma_grafo']} "
                    f"-> Causa: {a['causa_confirmada']} | Peças: {', '.join(a['pecas_utilizadas'])}\n"
                )

        # 3. Síntese do Diagnóstico com GraphRAG
        prompt_sintese = f"""
        Você é o Especialista de Bancada da Oficina Digital.
        Com base no chamado e no histórico do Grafo de Conhecimento da oficina, forneça o diagnóstico final.

        CHAMADO:
        Cliente: {chamado.get('nome')}
        Equipamento: {chamado.get('equipamento')}
        Problema: {chamado.get('problema')}

        DADOS EXTRAÍDOS:
        Marca/Modelo: {dados.marca} {dados.modelo}
        Sintomas: {dados.sintomas}
        Componentes Suspeitos: {dados.componentes_suspeitos}
        Prioridade inicial: {dados.prioridade}

        {contexto_grafo}
        """

        resp_diag = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt_sintese,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=DiagnosticoGrafo,
                temperature=0.2
            )
        )
        return DiagnosticoGrafo.model_validate_json(resp_diag.text)

    except Exception as e:
        # Fallback gracioso em caso de erro na API externa
        print(f"[Aviso] Falha ao consultar Gemini API ({e}). Usando fallback do grafo.")
        return _fallback_offline(chamado)


def _fallback_offline(chamado: dict) -> DiagnosticoGrafo:
    """Gera resposta baseada nas regras locais do grafo mesmo sem conexão com a internet."""
    equipamento = chamado.get("equipamento", "")
    problema = chamado.get("problema", "")
    
    # Busca se há no grafo
    sintomas_palavras = [p for p in ["desliga", "não liga", "tela azul", "tela preta", "bateria", "lento", "reinicia"] if p in problema.lower()]
    antecedentes = memoria_oficina.buscar_antecedentes(equipamento, sintomas_palavras)
    
    if antecedentes:
        a = antecedentes[0]
        return DiagnosticoGrafo(
            prioridade="alta" if "não liga" in problema.lower() or "desliga" in problema.lower() else "media",
            causa_provavel=f"[Grafo da Oficina] {a['causa_confirmada']}",
            proximos_passos=f"Testar na bancada o circuito relacionado a {a['sintoma_grafo']}.",
            pecas_sugeridas=a['pecas_utilizadas'],
            origem_memoria="grafo_historico",
            mensagem_cliente=f"Olá {chamado.get('nome')}, seu {equipamento} já foi recebido e nossos técnicos iniciarão os testes."
        )

    return DiagnosticoGrafo(
        prioridade="media",
        causa_provavel="Necessário teste detalhado de hardware e software na bancada.",
        proximos_passos="Avaliar alimentação, memória e temperaturas sob estresse.",
        pecas_sugeridas=["A definir pós-teste"],
        origem_memoria="conhecimento_geral",
        mensagem_cliente=f"Olá {chamado.get('nome')}, chamado registrado com sucesso!"
    )
