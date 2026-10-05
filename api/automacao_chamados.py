"""Script de Automação com Python para a Oficina Digital.

Este script é o exemplo prático de automação que o aluno executará:
1. Conecta ao banco SQLite de chamados (`chamados.db`).
2. Varre chamados em aberto que ainda não possuem diagnóstico enriquecido.
3. Aciona o pipeline Gemini + Grafo de Conhecimento (GraphRAG).
4. Grava no banco a prioridade, a causa raiz e as peças sugeridas.
5. Notifica o canal do técnico via Telegram.

Como rodar:
    python automacao_chamados.py             # roda uma varredura única
    python automacao_chamados.py --continuo  # monitora em loop contínuo a cada N segundos
"""
import argparse
import sys
import time
from pathlib import Path

# Adiciona o diretório atual ao sys.path para importações locais
sys.path.append(str(Path(__file__).parent))

import db
import telegram
from grafo_conhecimento import analisar_com_grafo_e_gemini


def executar_ciclo_automacao():
    """Executa uma rodada da esteira automatizada."""
    print("⏳ [Automação] Buscando novos chamados pendentes...")
    chamados_abertos = db.listar("aberto")
    
    # Filtra chamados que ainda não têm diagnóstico preenchido
    pendentes = [c for c in chamados_abertos if not c.get("diagnostico")]

    if not pendentes:
        print("☕ [Automação] Nenhum chamado pendente no momento.")
        return

    print(f"🚀 [Automação] Processando {len(pendentes)} chamado(s)...")

    for c in pendentes:
        id_ = c["id"]
        print(f"\n────────────────────────────────────────")
        print(f"🔧 Chamado #{id_} | Cliente: {c['nome']} | Equipamento: {c['equipamento']}")
        print(f"📝 Problema relatado: {c['problema']}")

        # 1. Roda a inteligência (Gemini + Grafo de Conhecimento)
        diag = analisar_com_grafo_e_gemini(c)

        # 2. Formata texto do diagnóstico e peças para persistência
        pecas_str = ", ".join(diag.pecas_sugeridas) if diag.pecas_sugeridas else "Nenhuma indicada"
        texto_diagnostico = (
            f"Origem: {diag.origem_memoria.upper()}\n"
            f"Causa Provável: {diag.causa_provavel}\n"
            f"Próximos Passos: {diag.proximos_passos}\n"
            f"Peças Recomendadas: {pecas_str}"
        )

        # 3. Atualiza o banco de dados
        db.atualizar(id_, prioridade=diag.prioridade, diagnostico=texto_diagnostico)
        print(f"💾 [Banco] Chamado #{id_} atualizado! Prioridade: {diag.prioridade.upper()}")

        # 4. Dispara notificação enriquecida para o Telegram
        aviso_telegram = (
            f"🤖 *[Automação IA + Grafo]* Chamado #{id_}\n"
            f"👤 *Cliente:* {c['nome']}\n"
            f"💻 *Equipamento:* {c['equipamento']}\n"
            f"⚡ *Prioridade:* {diag.prioridade.upper()}\n"
            f"🧠 *Causa Provável:* {diag.causa_provavel}\n"
            f"📦 *Peças Recomendadas:* {pecas_str}\n"
            f"🛠️ *Passos:* {diag.proximos_passos}"
        )
        telegram.enviar(aviso_telegram)
        print(f"📲 [Telegram] Alerta enviado ao técnico.")


def main():
    parser = argparse.ArgumentParser(description="Automação Python da Oficina Digital")
    parser.add_argument("--continuo", action="store_true", help="Executa em loop a cada 10 segundos")
    parser.add_argument("--intervalo", type=int, default=10, help="Intervalo em segundos para o modo contínuo")
    args = parser.parse_args()

    db.criar_tabela()

    if args.continuo:
        print(f"🔄 Modo contínuo ativado (verificação a cada {args.intervalo}s). Pressione Ctrl+C para parar.")
        try:
            while True:
                executar_ciclo_automacao()
                time.sleep(args.intervalo)
        except KeyboardInterrupt:
            print("\n🛑 Automação interrompida pelo usuário.")
    else:
        executar_ciclo_automacao()


if __name__ == "__main__":
    main()
