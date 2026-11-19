# Usage: .\set-base-url.ps1 https://yourname.github.io/outlook-spinner-signature
param([Parameter(Mandatory=$true)][string]$BaseUrl)
$BaseUrl = $BaseUrl.TrimEnd('/')
$path = Join-Path $PSScriptRoot 'manifest.xml'
(Get-Content $path -Raw) -replace [regex]::Escape('https://YOUR-GITHUB-USERNAME.github.io/outlook-spinner-signature'), $BaseUrl |
  Set-Content $path -NoNewline -Encoding UTF8
Write-Host "manifest.xml now points to $BaseUrl"
