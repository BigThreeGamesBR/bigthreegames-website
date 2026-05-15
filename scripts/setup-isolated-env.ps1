Param(
  [switch]$UseNpm
)

$ErrorActionPreference = 'Stop'

Write-Host 'Setting up isolated dependency environment...'

if ($UseNpm) {
  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw 'npm is not available in PATH. Install Node.js first.'
  }

  Write-Host 'Generating package-lock.json with exact top-level versions...'
  npm install --package-lock-only --save-exact --ignore-scripts

  powershell -ExecutionPolicy Bypass -File ./scripts/check-blocklist.ps1

  Write-Host 'Installing from lock file (deterministic)...'
  npm ci --no-audit --no-fund
  Write-Host 'Done.'
  exit 0
}

if (-not (Get-Command corepack -ErrorAction SilentlyContinue)) {
  throw 'corepack is not available in PATH. Install Node.js 20.3+ first.'
}

corepack enable
corepack prepare pnpm@10.11.0 --activate

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  throw 'pnpm was not activated by corepack.'
}

pnpm config set store-dir .pnpm-store --location project
pnpm config set shared-workspace-lockfile true --location project

if (-not (Test-Path ./pnpm-lock.yaml)) {
  Write-Host 'Creating initial lock file only...'
  pnpm install --lockfile-only
}

powershell -ExecutionPolicy Bypass -File ./scripts/check-blocklist.ps1

Write-Host 'Installing from lock file (deterministic)...'
pnpm install --frozen-lockfile

Write-Host 'Done.'
