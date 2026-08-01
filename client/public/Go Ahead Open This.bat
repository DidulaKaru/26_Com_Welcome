<# :
@echo off
chcp 65001 >nul
cls
title SECURE_UPLINK_ESTABLISHED
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Command -ScriptBlock ([ScriptBlock]::Create((Get-Content -LiteralPath '%~f0' -Raw -Encoding UTF8)))"
exit /b
#>

# --- PowerShell Script Section Begins Here ---

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Typing ($str, $color, $speed=40) {
    foreach ($char in $str.ToCharArray()) {
        Write-Host -NoNewline -ForegroundColor $color $char
        Start-Sleep -Milliseconds $speed
    }
    Write-Host ""
}

Clear-Host
Write-Host ""
Start-Sleep -Seconds 1

# The Handshake Sequence
Write-Host "INCOMING CONNECTION DETECTED..." -ForegroundColor DarkGray
Start-Sleep -Milliseconds 800
Write-Host "EVALUATING ORIGIN..." -ForegroundColor DarkGray
Start-Sleep -Seconds 1

Write-Typing "STATUS: EXTERNAL HANDSHAKE ACCEPTED." "Green" 30
Write-Typing "DUAL-AUTHORIZATION CONFIRMED." "Green" 30
[console]::beep(600, 200)
[console]::beep(800, 200)
[console]::beep(1000, 400)
Start-Sleep -Milliseconds 500

Write-Host ""
Write-Host "MERGING HARDWARE PROTOCOLS WITH LOGIC ARCHITECTURE... " -NoNewline -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "SUCCESS" -ForegroundColor Green
[console]::beep(1200, 300)

Write-Host "UPLINKING TO SECURE SERVER... " -NoNewline -ForegroundColor Yellow
Start-Sleep -Seconds 1
Write-Host "ESTABLISHED" -ForegroundColor Green
[console]::beep(1200, 300)
Start-Sleep -Seconds 1
Clear-Host

# --- THE VERSE (Confirmation) ---

Write-Host ""
Start-Sleep -Seconds 1

# The Gilgamesh Quote (Slightly faster now, like a victory chant)
Write-Typing '"Two men will not die;' "Cyan" 60
Start-Sleep -Milliseconds 300
Write-Typing ' the grappled boat will not sink;' "Cyan" 60
Start-Sleep -Milliseconds 300
Write-Typing ' A three-ply towrope will not break.' "Cyan" 60
Start-Sleep -Milliseconds 300
Write-Typing ' If two assist one another, how can they fail?"' "Cyan" 70
Start-Sleep -Seconds 1

Write-Host ""
Write-Typing "You stopped running in parallel and finally crossed the streams." "White" 50
Start-Sleep -Seconds 1

Write-Host ""
Write-Typing "The 77th Lord commends your persistence." "Magenta" 60
Write-Typing "The Architect commends your logic." "Blue" 60
Start-Sleep -Seconds 1

Write-Host ""
Write-Typing "You have proven that power without syntax is blind." "DarkGray" 50
Write-Typing "And code without current is dead." "DarkGray" 50
Start-Sleep -Seconds 1

Write-Typing "Together, the system is yours." "Green" 60
Start-Sleep -Seconds 2
Clear-Host

# --- THE REVEAL ---

Write-Host ""
Write-Host "======================================================" -ForegroundColor DarkGray
Write-Host "              INCOMING SECURE TRANSMISSION            " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor DarkGray
Write-Host ""
Start-Sleep -Seconds 1

Write-Typing "Your final fragment awaits at the nexus of power and processing." "White" 50
Start-Sleep -Seconds 1
Write-Host ""

[console]::beep(800, 200)
[console]::beep(1000, 200)
[console]::beep(1200, 600)
Write-Typing "PROCEED TO THE HIGH PERFORMANCE COMPUTING LAB." "Red" 80
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "======================================================" -ForegroundColor DarkGray
Write-Host ""
Write-Typing "We will be waiting." "DarkGray" 90
Start-Sleep -Seconds 2

# Blinking exit prompt
Write-Host ""
Write-Host "PRESS ANY KEY TO CLOSE CONNECTION... " -NoNewline -ForegroundColor Green
while ($true) {
    if ([console]::KeyAvailable) {
        $key = [console]::ReadKey($true)
        break
    }
    Start-Sleep -Milliseconds 500
}