# PowerShell script to fix React 19 icon compatibility issues across all packages

# Define icon mappings
$iconMappings = @{
    '<Image ' = '<ImageSafe '
    '<Lock ' = '<LockIcon '
    '<ShoppingCart ' = '<ShoppingCartIcon '
    '<BookOpen ' = '<BookOpenIcon '
    '<Star ' = '<StarIcon '
    '<Share2 ' = '<Share2Icon '
    '<Bookmark ' = '<BookmarkIcon '
    '<Flag ' = '<FlagIcon '
    '<Save ' = '<SaveIcon '
    '<Shield ' = '<ShieldIcon '
}

# Get all TypeScript/TSX files in notes package
$notesFiles = Get-ChildItem -Path "packages\notes\src" -Recurse -Include "*.tsx", "*.ts"

foreach ($file in $notesFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Apply icon replacements
    foreach ($mapping in $iconMappings.GetEnumerator()) {
        if ($content -match [regex]::Escape($mapping.Key)) {
            $content = $content -replace [regex]::Escape($mapping.Key), $mapping.Value
            $modified = $true
        }
    }
    
    # Check if the file needs React 19 wrappers
    if ($content -match "from ['`"]lucide-react['`"]" -and $content -notmatch "React\.ElementType") {
        # Extract imported icons
        $lucideMatch = [regex]::Match($content, "import\s*\{\s*([^}]+)\s*\}\s*from\s*['`"]lucide-react['`"]")
        if ($lucideMatch.Success) {
            $icons = $lucideMatch.Groups[1].Value -split "," | ForEach-Object { $_.Trim() }
            
            # Generate wrappers
            $wrappers = @()
            foreach ($icon in $icons) {
                $wrapperName = switch ($icon) {
                    "Image" { "ImageSafe" }
                    "Lock" { "LockIcon" }
                    "ShoppingCart" { "ShoppingCartIcon" }
                    "BookOpen" { "BookOpenIcon" }
                    "Star" { "StarIcon" }
                    "Share2" { "Share2Icon" }
                    "Bookmark" { "BookmarkIcon" }
                    "Flag" { "FlagIcon" }
                    "Save" { "SaveIcon" }
                    "Shield" { "ShieldIcon" }
                    default { "${icon}Icon" }
                }
                $wrappers += "const $wrapperName = $icon as React.ElementType;"
            }
            
            if ($wrappers.Count -gt 0) {
                $wrapperBlock = "`n// React 19 compatibility wrappers`n" + ($wrappers -join "`n")
                $content = $content -replace "from ['`"]lucide-react['`"];", "from 'lucide-react';$wrapperBlock"
                $modified = $true
            }
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "React 19 icon compatibility fixes completed!"
