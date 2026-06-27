# Start the Next.js dev server in the background (detached).
# Kills any existing process on port 3000 first, then starts a fresh one.
# Waits up to 60 seconds for the server to respond, then returns.
# The server keeps running in the background after this script exits.

$PORT = 3000

# Kill anything already on port 3000 (cleanup orphaned processes)
$existing = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
if ($existing) {
    $existingPids = $existing | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $existingPids) {
        Write-Output "Killing existing process on port $PORT (PID: $pid)"
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

# Start next dev detached (output to log files, not the console)
Write-Output "Starting next dev on port $PORT..."
$process = Start-Process -FilePath "npx" -ArgumentList "next", "dev" -WorkingDirectory "." -WindowStyle Hidden -PassThru -RedirectStandardOutput ".dev-server-out.log" -RedirectStandardError ".dev-server-err.log"

Write-Output "Dev server started (PID: $($process.Id)). Waiting for it to be ready..."

# Wait for the server to respond (up to 60 seconds)
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 1
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$PORT" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -gt 0) {
            $ready = $true
            break
        }
    } catch {
        # Server not ready yet, keep waiting
    }
}

if ($ready) {
    Write-Output "Dev server is ready at http://localhost:$PORT (took $($i+1)s)"
    Write-Output "PID: $($process.Id)"
    Write-Output "To stop it, run: powershell -File scripts/dev-kill.ps1"
} else {
    Write-Output "ERROR: Dev server did not become ready within 60 seconds."
    Write-Output "Check .dev-server-err.log for errors."
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    exit 1
}
