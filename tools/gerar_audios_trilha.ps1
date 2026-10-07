# Gera um resumo em áudio do NotebookLM para cada missão da Trilha e baixa para site/audio/.
# Uso: powershell -File tools\gerar_audios_trilha.ps1 [-Fase fontes|gerar|baixar|tudo]
param([string]$Fase = "tudo")
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$NB = "2efd257b-33f5-4715-9c9c-7316abb378ad"
$raiz = Split-Path -Parent $PSScriptRoot
$fontes = Join-Path $raiz "docs\notebooklm\trilha"
$saida = Join-Path $raiz "site\audio"
$estado = Join-Path $fontes "ids.json"
New-Item -ItemType Directory -Force $saida | Out-Null
$ids = @{}
if (Test-Path $estado) { (Get-Content $estado -Raw | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $ids[$_.Name] = @{ source = $_.Value.source; artifact = $_.Value.artifact; task = $_.Value.task } } }
function Salvar { $ids | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 $estado }
$pedido = "Resumo curto em português do Brasil para adultos iniciantes. Explique esta missão com calma e linguagem simples: a meta, o que fazer e o que mostrar no final. Não faça o trabalho pelo aluno e não dê respostas prontas. Fale só desta missão."

if ($Fase -in "fontes","tudo") {
  foreach ($i in 0..14) {
    $n = "{0:D2}" -f $i
    if ($ids[$n].source) { continue }
    $r = notebooklm source add (Join-Path $fontes "missao-$n.md") -n $NB --json | Out-String | ConvertFrom-Json
    $ids[$n] = @{ source = $r.source.id; artifact = $null; task = $null }
    Salvar
    Write-Host "fonte $n -> $($r.source.id)"
  }
  foreach ($n in $ids.Keys) { notebooklm source wait $ids[$n].source -n $NB --timeout 300 | Out-Null }
  Write-Host "fontes prontas"
}

if ($Fase -in "gerar","tudo") {
  foreach ($i in 0..14) {
    $n = "{0:D2}" -f $i
    if ($ids[$n].artifact -or $ids[$n].task) { continue }
    $txt = notebooklm generate audio $pedido -n $NB -s $ids[$n].source --format brief --language pt_BR --retry 2 --json 2>&1 | Out-String
    Write-Host "gerar $n -> $txt"
    try { $r = $txt | ConvertFrom-Json } catch { Write-Host "FALHOU $n"; continue }
    $ids[$n].task = $r.task_id
    if ($r.artifact_id) { $ids[$n].artifact = $r.artifact_id }
    Salvar
    notebooklm artifact rename $ids[$n].task "Missão $n" -n $NB 2>&1 | Out-Null
  }
}

if ($Fase -in "baixar","tudo") {
  foreach ($i in 0..14) {
    $n = "{0:D2}" -f $i
    $arq = Join-Path $saida "missao-$n.m4a"
    if (Test-Path $arq) { continue }
    $art = if ($ids[$n].artifact) { $ids[$n].artifact } else { $ids[$n].task }
    if (-not $art) { Write-Host "sem artefato $n"; continue }
    notebooklm artifact wait $art -n $NB --timeout 900 --interval 10 | Out-Null
    notebooklm download audio $arq -n $NB -a $art --no-clobber 2>&1 | Out-String | Write-Host
  }
  Get-ChildItem $saida | Select-Object Name, Length | Format-Table | Out-String | Write-Host
}
