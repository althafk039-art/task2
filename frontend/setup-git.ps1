<#
setup-git.ps1
Initialize a git repo in this folder, add a remote, commit, and push.
Run from the `frontend` directory in PowerShell:

  ./setup-git.ps1

The script will prompt for a remote URL (leave empty to skip adding a remote).
#>
Set-StrictMode -Version Latest
$here = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $here

if (Test-Path .git) {
    Write-Host "This folder already contains a .git directory. Exiting."
    exit 0
}

# Detect if we're inside another Git work tree (informational)
$root = $null
try {
    $root = git rev-parse --show-toplevel 2>$null
} catch {
}
if ($root) {
    Write-Host "This folder appears to be inside an existing Git repository at: $root"
    Write-Host "If you want this folder to be a separate repository, press Enter to continue or Ctrl+C to abort."
    Read-Host
}

$remote = Read-Host "Enter remote URL to add (leave empty to skip)"

git init

# Stage and commit (commit will be skipped if nothing to commit)
git add .
try {
    git commit -m "Initial commit from setup-git.ps1"
} catch {
    Write-Host "No changes to commit or commit failed. Continue..."
}

if ($remote -ne "") {
    git remote add origin $remote
    git branch -M main
    Write-Host "Pushing to origin/main (you may be prompted for credentials)..."
    git push -u origin main
}

Write-Host "setup-git completed. If push requires authentication, follow the prompts from Git."
