# Kill the Next.js dev server running on port 3000.
$PORT = 3000

$connections = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
if (-not $connections) {
    Write-Output "No process found on port $PORT."
    exit 0
}

$pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $pids) {
    Write-Output "Killing process on port $PORT (PID: $pid)"
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

# Also kill any orphaned npx/node processes that were spawning next dev
# (the Start-Process parent may have child processes)
Get-CimInstance Win32_Process | Where-Object {
    $_.CommandLine -match 'next dev' -and $_.Name -match 'node'
} | ForEach-Object {
    Write-Output "Killing orphaned next dev process (PID: $($_.ProcessId))"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 1
Write-Output "Dev server stopped."
