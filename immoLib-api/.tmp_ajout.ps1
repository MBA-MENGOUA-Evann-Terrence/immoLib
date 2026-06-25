$ErrorActionPreference = 'Stop'
$docPath = 'C:\Users\DELL\Desktop\NoSQL\REQUETES.docx'
$txtPath = 'C:\Users\DELL\Desktop\NoSQL\immoLib-api\.tmp_ajout.txt'

$txt = [System.IO.File]::ReadAllText($txtPath, [System.Text.Encoding]::UTF8)
$lines = $txt -split "`r?`n"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($docPath)
$sel = $word.Selection
$sel.EndKey(6) | Out-Null   # 6 = wdStory (fin du document)
$sel.TypeParagraph()

function Reset-Format($s) { $s.Font.Bold = $false; $s.Font.Size = 11; $s.Font.Name = 'Calibri' }

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

$doc.Save()
$doc.Close()
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($sel) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host 'OK: explications ajoutees a REQUETES.docx'
