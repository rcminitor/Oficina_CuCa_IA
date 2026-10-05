"""Equipe de agentes (CrewAI) que faz a triagem e o pré-diagnóstico de um chamado.

Sem a variável MODELO_IA, usa uma triagem simples por palavras-chave — assim o projeto
funciona em sala mesmo sem chave de IA.
"""
import os

from pydantic import BaseModel


class Diagnostico(BaseModel):
    prioridade: str          # "alta", "media" ou "baixa"
    causa_provavel: str
    proximos_passos: str
    mensagem_cliente: str


def analisar(chamado: dict) -> Diagnostico:
    if os.environ.get("MODELO_IA"):
        return analisar_com_crewai(chamado)
    return triagem_simples(chamado)


def analisar_com_crewai(chamado: dict) -> Diagnostico:
    from crewai import LLM, Agent, Crew, Process, Task  # importado só quando a IA está ligada

    llm = LLM(model=os.environ["MODELO_IA"])  # ex.: "gemini/gemini-2.0-flash" ou "ollama/llama3.1"

    atendente = Agent(
        role="Atendente de triagem de uma assistência técnica de computadores",
        goal="Entender o relato do cliente e classificar a urgência do chamado",
        backstory="Você atende clientes leigos há anos e sabe transformar relatos confusos em informações claras.",
        llm=llm, allow_delegation=False)
    tecnico = Agent(
        role="Técnico de manutenção de computadores",
        goal="Indicar a causa provável do defeito e os primeiros testes a fazer na bancada",
        backstory="Técnico experiente em hardware, sistemas operacionais e redes. É prudente: "
                  "não afirma um defeito sem teste, fala em causas prováveis.",
        llm=llm, allow_delegation=False)

    triagem = Task(
        description=("Chamado de {nome}. Equipamento: {equipamento}. Relato: {problema}.\n"
                     "Resuma o problema em linguagem técnica e classifique a prioridade "
                     "(alta = perda de dados ou trabalho parado; media = funciona com falhas; baixa = estético ou lentidão leve)."),
        expected_output="Resumo técnico do problema e a prioridade (alta, media ou baixa) com justificativa.",
        agent=atendente)
    diagnostico = Task(
        description=("Com base na triagem, indique a causa provável, os próximos passos na bancada "
                     "e uma mensagem curta e educada para o cliente, sem prometer prazo nem preço."),
        expected_output="Prioridade, causa provável, próximos passos e mensagem ao cliente.",
        agent=tecnico, context=[triagem], output_pydantic=Diagnostico)

    equipe = Crew(agents=[atendente, tecnico], tasks=[triagem, diagnostico], process=Process.sequential)
    resultado = equipe.kickoff(inputs={k: chamado[k] for k in ("nome", "equipamento", "problema")})
    return resultado.pydantic


PALAVRAS_ALTA = ("não liga", "nao liga", "queimou", "fumaça", "perdi", "arquivos sumiram", "tela azul", "vírus", "virus")
PALAVRAS_MEDIA = ("travando", "trava", "reinicia", "barulho", "esquentando", "superaquec", "internet", "wi-fi", "wifi")


def triagem_simples(chamado: dict) -> Diagnostico:
    texto = chamado["problema"].lower()
    if any(p in texto for p in PALAVRAS_ALTA):
        prioridade = "alta"
    elif any(p in texto for p in PALAVRAS_MEDIA):
        prioridade = "media"
    else:
        prioridade = "baixa"
    return Diagnostico(
        prioridade=prioridade,
        causa_provavel="Triagem automática por palavras-chave (sem IA): avaliar na bancada.",
        proximos_passos="Conferir alimentação, memória, armazenamento e sistema operacional.",
        mensagem_cliente=f"Olá, {chamado['nome']}! Recebemos seu chamado e um técnico vai avaliar o equipamento.")
