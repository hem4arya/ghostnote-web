# PowerShell script to clean up old unused files and folders

Write-Host "🧹 Cleaning up old unused files and folders..." -ForegroundColor Green

# Remove old hook files that have been moved to features
$oldHooks = @(
    "src\hooks\useImageState.ts",
    "src\hooks\useResponsive.ts"
)

foreach ($hook in $oldHooks) {
    $fullPath = "d:\GITHUB\GN\ghostnote-web\$hook"
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "✅ Removed $hook" -ForegroundColor Yellow
    }
}

# Remove empty auth component files
$emptyAuthFiles = @(
    "src\components\auth\AuthForm.tsx",
    "src\components\auth\PrivateAccountSetup.tsx"
)

foreach ($file in $emptyAuthFiles) {
    $fullPath = "d:\GITHUB\GN\ghostnote-web\$file"
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "✅ Removed $file" -ForegroundColor Yellow
    }
}

# Remove empty directories
$emptyDirs = @(
    "src\shared\components",
    "src\shared\utils",
    "src\components\auth"
)

foreach ($dir in $emptyDirs) {
    $fullPath = "d:\GITHUB\GN\ghostnote-web\$dir"
    if (Test-Path $fullPath) {
        $itemCount = (Get-ChildItem $fullPath | Measure-Object).Count
        if ($itemCount -eq 0) {
            Remove-Item $fullPath -Force -Recurse
            Write-Host "✅ Removed empty directory $dir" -ForegroundColor Yellow
        }
    }
}

# Check if hooks directory is empty and remove if so
$hooksDir = "d:\GITHUB\GN\ghostnote-web\src\hooks"
if (Test-Path $hooksDir) {
    $hooksCount = (Get-ChildItem $hooksDir | Measure-Object).Count
    if ($hooksCount -eq 0) {
        Remove-Item $hooksDir -Force -Recurse
        Write-Host "✅ Removed empty hooks directory" -ForegroundColor Yellow
    }
}

# Check if shared directory has only the hooks subfolder with content
$sharedDir = "d:\GITHUB\GN\ghostnote-web\src\shared"
if (Test-Path $sharedDir) {
    $sharedItems = Get-ChildItem $sharedDir | Where-Object { $_.Name -ne "hooks" }
    if ($sharedItems.Count -eq 0) {
        $hooksInShared = Get-ChildItem "$sharedDir\hooks" -ErrorAction SilentlyContinue
        if ($hooksInShared) {
            Write-Host "✅ Shared directory cleaned - only contains hooks" -ForegroundColor Green
        }
    }
}

Write-Host "🎉 Cleanup completed!" -ForegroundColor Green
