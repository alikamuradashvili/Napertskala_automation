param([switch]$Visible, [string]$BaseUrl = 'https://napertskala.ge', [string]$TestName)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$env:BASE_URL = $BaseUrl
$env:HEADLESS = if ($Visible) { '0' } else { '1' }
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { $null }
if (-not $nodePath) {
    $bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
    $installedNode = Join-Path $env:ProgramFiles 'nodejs\node.exe'
    foreach ($candidate in @($installedNode, $bundledNode)) {
        if (Test-Path -LiteralPath $candidate) { $nodePath = $candidate; break }
    }
}
if (-not $nodePath) {
    Write-Host 'Node.js was not found. Install Node.js 20 or newer, then run this launcher again.'
    exit 1
}
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules\selenium-webdriver'))) {
    Write-Host 'Test dependencies are missing. Run pnpm install or npm install in this folder first.'
    exit 1
}
Write-Host "Testing $BaseUrl"
Write-Host 'Reports and failure screenshots are saved in the artifacts folder.'
$testArguments = @('--test', '--test-concurrency=1')
if ($TestName) { $testArguments += "--test-name-pattern=$TestName" }
$testArguments += 'tests/site.test.js'
& $nodePath @testArguments
exit $LASTEXITCODE
