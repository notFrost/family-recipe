# Start the Next.js dev server in the background (truly detached).
# Kills any existing process on port 3000 first, then starts a fresh one.
# Waits up to 60 seconds for the server to respond, then returns.
# The server keeps running in the background after this script exits.

$PORT = 3000

# Kill anything already on port 3000
$existing = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
if ($existing) {
    $existingPids = $existing | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($epid in $existingPids) {
        Write-Output "Killing existing process on port $PORT (PID: $epid)"
        Stop-Process -Id $epid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Start next dev using cmd.exe with "start" command — this truly detaches
# "start /b" runs the command in the background without a new window
Write-Output "Starting next dev on port $PORT..."
cmd /c "start /b cmd /c npx next dev > .dev-server-out.log 2> .dev-server-err.log"

# Wait for the server to respond using a simple TCP connection test
# (more reliable than Invoke-WebRequest which can hang)
Write-Output "Waiting for server to be ready..."
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 1
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect("127.0.0.1", $PORT)
        if ($tcp.Connected) {
            $tcp.Close()
            $ready = $true
            break
        }
    } catch {
        # Not ready yet
    }
}

if ($ready) {
    Write-Output "Dev server is ready at http://localhost:$PORT (took $($i+1)s)"
    Write-Output "To stop it, run: powershell -File scripts/dev-kill.ps1"
} else {
    Write-Output "ERROR: Dev server did not become ready within 60 seconds."
    Write-Output "Check .dev-server-err.log for errors."
    exit 1
}
