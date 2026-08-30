param(
  [Parameter(Mandatory = $true)]
  [string]$Prefix,

  [Parameter(Mandatory = $true)]
  [string]$HotelsJson,

  [Parameter(Mandatory = $true)]
  [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$generatedHotelsPath = Join-Path $root 'src\data\generatedHotels.ts'
$backupPath = Join-Path $env:TEMP "generatedHotels-$Prefix-export-backup.ts"

Copy-Item -LiteralPath $generatedHotelsPath -Destination $backupPath -Force

try {
  $hotels = Get-Content -LiteralPath (Join-Path $root $HotelsJson) -Raw | ConvertFrom-Json
  $json = $hotels | ConvertTo-Json -Depth 100
  $source = "// @ts-nocheck`nexport const generatedHotels: any[] = $json;`n"
  [System.IO.File]::WriteAllText($generatedHotelsPath, $source, [System.Text.UTF8Encoding]::new($false))

  $env:NODE_OPTIONS = '--max-old-space-size=4096'
  $env:DYNAMIC_RENDER_PREFIXES = $Prefix
  $env:ASTRO_OUT_DIR = $OutputDirectory

  Push-Location $root
  try {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
      throw "Dynamic export build failed with exit code $LASTEXITCODE."
    }
  }
  finally {
    Pop-Location
  }
}
finally {
  Copy-Item -LiteralPath $backupPath -Destination $generatedHotelsPath -Force
  Remove-Item -LiteralPath $backupPath -Force
}
