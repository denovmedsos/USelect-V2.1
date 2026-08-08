@echo off
setlocal

title RAW Selector Launcher

echo.
echo ==========================================
echo        RAW SELECTOR - LOCAL SERVER
echo ==========================================
echo.

set "PORT=8765"
set "HTML=%~dp0RAW Selector.html"

if not exist "%HTML%" (
    echo ERROR:
    echo File RAW Selector.html tidak ditemukan.
    echo.
    pause
    exit /b
)

echo Memulai server lokal...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
"$htmlPath = '%HTML%'; ^
$port = %PORT%; ^
$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback,$port); ^
$listener.Start(); ^
Write-Host 'Server aktif di http://127.0.0.1:'$port'/'; ^
Start-Process 'msedge.exe' ('http://127.0.0.1:' + $port + '/'); ^
try { ^
    while ($true) { ^
        $client = $listener.AcceptTcpClient(); ^
        $stream = $client.GetStream(); ^
        $reader = New-Object System.IO.StreamReader($stream); ^
        $request = $reader.ReadLine(); ^
        while (($line = $reader.ReadLine()) -ne '') {} ^
        if ($request -match '^GET /[^ ]* HTTP') { ^
            $bytes = [System.IO.File]::ReadAllBytes($htmlPath); ^
            $header = 'HTTP/1.1 200 OK' + [char]13 + [char]10 + 'Content-Type: text/html; charset=utf-8' + [char]13 + [char]10 + 'Content-Length: ' + $bytes.Length + [char]13 + [char]10 + 'Connection: close' + [char]13 + [char]10 + [char]13 + [char]10; ^
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header); ^
            $stream.Write($headerBytes,0,$headerBytes.Length); ^
            $stream.Write($bytes,0,$bytes.Length); ^
        } else { ^
            $message = '404 Not Found'; ^
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($message); ^
            $header = 'HTTP/1.1 404 Not Found' + [char]13 + [char]10 + 'Content-Length: ' + $bytes.Length + [char]13 + [char]10 + 'Connection: close' + [char]13 + [char]10 + [char]13 + [char]10; ^
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header); ^
            $stream.Write($headerBytes,0,$headerBytes.Length); ^
            $stream.Write($bytes,0,$bytes.Length); ^
        } ^
        $stream.Close(); ^
        $client.Close(); ^
    } ^
} finally { ^
    $listener.Stop(); ^
}"