# Perguntas da Trilha: planilha de correção

Já está tudo instalado na conta **rcminitori@gmail.com**:

- Planilha: **Oficina Digital - Respostas da Trilha**
  (https://docs.google.com/spreadsheets/d/16fFmc2r7VQ3984CVNuQ4ZGZkdS-oZdfqN9ves6i3Cik/edit)
- Script: `tools/apps-script/Codigo.gs`, publicado como App da Web (endereço em `site/avaliacao-config.js`).

## Como funciona
1. O aluno envia as respostas; elas são gravadas na hora na aba **Respostas** com status `pendente`.
2. A cada 5 minutos, a correção automática chama o Gemini, dá nota de 0 a 10, comentário e indício de IA.
   Se o modelo principal estiver sobrecarregado, tenta o reserva e depois um modelo leve.
3. A página do aluno pergunta à planilha e mostra a nota quando ela sai.
4. Resposta colada: nota 0, comentário neutro, status `colada`, e aparece na aba **Coladas**.

## Menu "Oficina Digital" na planilha
- **Configurar chave do Gemini**: troca a chave (fica só nas propriedades do script).
- **Ativar correção automática**: cria o agendamento de 5 em 5 minutos (já ativo).
- **Corrigir a fila agora**: corrige na hora o que estiver pendente.
- **Testar a correção**: corrige uma resposta de exemplo.
- **Recriar abas Painel e Coladas**.

## Abas
- **Respostas**: uma linha por resposta, com nota, comentário, indício de IA e motivo, se colou, tempo de leitura,
  leituras rápidas, saídas da página, tempo fora, áudio ouvido, sinais de digitação, envio e status.
- **Painel**: nota média, leitura e indícios por aluno e missão.
- **Coladas**: só as respostas eliminadas por colagem.

## Mudar o código do script
Edite `tools/apps-script/Codigo.gs` e, na pasta `tools/apps-script`, rode `clasp push` e
`clasp update-deployment <ID do app>`; o endereço do site continua o mesmo.

## Cuidados
- O indício de IA é uma estimativa e erra. Use para conversar com o aluno, não como prova.
- Propriedades opcionais: `LIMIAR_IA` (padrão 70), `MODELO` (gemini-3.8-flash),
  `MODELO_RESERVA` (gemini-3.7-flash), `MODELO_LEVE` (gemini-3.5-flash-lite).
