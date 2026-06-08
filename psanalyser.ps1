$url  = "https://auldheating.com/"
$key  = "AIzaSyCVyI7wT3gDDMR3eFtw3ep6aDnmNEAxoXQ"
$base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
Write-Host "Fetching DESKTOP..."
$d = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=desktop&category=performance&key=$key"
Write-Host "Fetching MOBILE..."
$m = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=mobile&category=performance&key=$key"
$metrics = @('first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive')
Write-Host "Desktop Score: $($d.lighthouseResult.categories.performance.score * 100)"
Write-Host "Mobile Score:  $($m.lighthouseResult.categories.performance.score * 100)"
Write-Host ""
Write-Host "--- Desktop Core Web Vitals ---"
foreach ($k in $metrics) { $a=$d.lighthouseResult.audits.$k; if($a){ Write-Host "  $($a.id): $($a.displayValue) [score:$($a.score)]" } }
Write-Host ""
Write-Host "--- Mobile Core Web Vitals ---"
foreach ($k in $metrics) { $a=$m.lighthouseResult.audits.$k; if($a){ Write-Host "  $($a.id): $($a.displayValue) [score:$($a.score)]" } }
Write-Host ""
Write-Host "--- Desktop Diagnostics (failing audits) ---"
$d.lighthouseResult.audits.PSObject.Properties | Where-Object {
    $_.Value.score -ne $null -and $_.Value.score -lt 0.9 -and $_.Value.details.type -in @('table','opportunity')
} | ForEach-Object { $a=$_.Value; Write-Host "  [$([math]::Round($a.score,2))] $($a.id): $($a.displayValue)" }
Write-Host ""
Write-Host "--- Mobile Diagnostics (failing audits) ---"
$m.lighthouseResult.audits.PSObject.Properties | Where-Object {
    $_.Value.score -ne $null -and $_.Value.score -lt 0.9 -and $_.Value.details.type -in @('table','opportunity')
} | ForEach-Object { $a=$_.Value; Write-Host "  [$([math]::Round($a.score,2))] $($a.id): $($a.displayValue)" }
