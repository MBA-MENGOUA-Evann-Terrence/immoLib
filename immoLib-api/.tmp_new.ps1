$ErrorActionPreference = 'Stop'
$outPath = 'C:\Users\DELL\Desktop\NoSQL\REQUETES_AVANCEES.docx'
$txtPath = 'C:\Users\DELL\Desktop\NoSQL\immoLib-api\.tmp_ajout.txt'

$txt = [System.IO.File]::ReadAllText($txtPath, [System.Text.Encoding]::UTF8)
$lines = $txt -split "`r?`n"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$sel = $word.Selection

function Reset-Format($s) { $s.Font.Bold = $false; $s.Font.Size = 11; $s.Font.Name = 'Calibri' }
Reset-Format $sel

foreach ($line in $lines) {
  if ($line -eq '') { $sel.TypeParagraph(); continue }
  if ($line.StartsWith('##')) {
    $sel.Font.Bold = $true; $sel.Font.Size = 12
    $sel.TypeText($line.Substring(2).Trim())
    $sel.TypeParagraph(); Reset-Format $sel
  }
  elseif ($line.StartsWith('#')) {
    $sel.Font.Bold = $true; $sel.Font.Size = 15
    $sel.TypeText($line.Substring(1).Trim())
    $sel.TypeParagraph(); Reset-Format $sel
  }
  elseif ($line.StartsWith('$code ')) {
    $sel.Font.Name = 'Consolas'; $sel.Font.Size = 10
    $sel.TypeText($line.Substring(6))
    $sel.TypeParagraph(); Reset-Format $sel
  }
  else {
    $sel.TypeText($line)
    $sel.TypeParagraph()
  }
}

$doc.SaveAs2($outPath, 16)   # 16 = wdFormatDocumentDefault (.docx)
$doc.Close()
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($sel) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "OK: cree $outPath"
