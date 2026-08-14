$ErrorActionPreference = "Continue"

$CredentialDir = "C:\$([char]0xB0B4)$([char]0xBB38)$([char]0xC11C)\$([char]0xC560)$([char]0xB4DC)$([char]0xBC84)$([char]0xCF54)$([char]0xB354)"
$Credentials = @(
  (Join-Path $CredentialDir "codex-503811-a0ac868a328d.json")
)

$Locations = @(
  "us-central1",
  "asia-northeast3",
  "asia-northeast1",
  "us-east5"
)

$StartIndex = [int]($env:RESUME_START_INDEX)
if (-not $StartIndex) {
  $StartIndex = 3831
}

$EndIndex = [int]($env:RESUME_END_INDEX)
if (-not $EndIndex) {
  $EndIndex = 3999
}

$Success = 0
$Failed = @()

foreach ($Index in $StartIndex..$EndIndex) {
  $Done = $false

  foreach ($Credential in $Credentials) {
    foreach ($Location in $Locations) {
      $env:GENAI_PROVIDER = "vertex"
      $env:GOOGLE_APPLICATION_CREDENTIALS = $Credential
      $env:GEMINI_MODEL = "gemini-2.5-flash"
      $env:VERTEX_LOCATION = $Location
      $env:GEMINI_START_INDEX = [string]$Index
      $env:GEMINI_LIMIT = "1"
      $env:GEMINI_DELAY_MS = "1000"

      npm.cmd run generate:hotel-content *> $null

      if ($LASTEXITCODE -eq 0) {
        $VerifyScript = "import fs from 'fs'; const h=JSON.parse(fs.readFileSync('src/data/generatedHotels.ts','utf8').match(/= ([\s\S]*);\s*$/)[1]); const x=h[$Index]; process.exit(x?.analysis?.blogReview ? 0 : 1);"
        node --input-type=module -e $VerifyScript *> $null
        if ($LASTEXITCODE -eq 0) {
          Write-Host "OK $Index $Location"
          $Success += 1
          $Done = $true
          Start-Sleep -Seconds 35
          break
        }
        Write-Host "EMPTY $Index $Location"
        Start-Sleep -Seconds 12
      }

      Start-Sleep -Seconds 12
    }

    if ($Done) {
      break
    }
  }

  if (-not $Done) {
    Write-Host "FAIL $Index"
    $Failed += $Index
    Start-Sleep -Seconds 90
  }
}

Write-Host "SUMMARY success=$Success failed=$($Failed -join ',')"
