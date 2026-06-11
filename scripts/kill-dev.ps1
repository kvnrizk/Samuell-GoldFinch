# Stop Next.js dev servers stuck on common ports (Windows).
$ports = 3000, 3001, 3002
$pids = Get-NetTCPConnection -LocalPort $ports -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

if (-not $pids) {
  Write-Host 'No listeners on ports 3000-3002.'
  exit 0
}

foreach ($processId in $pids) {
  Write-Host "Stopping PID $processId ..."
  Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2
Write-Host 'Done. Run: npm run dev:clean'
