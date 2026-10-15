@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-tests.ps1" -Visible
set "testExit=%ERRORLEVEL%"
echo.
if "%testExit%"=="0" (echo All tests passed.) else (echo Some tests failed. See the results above and the artifacts folder.)
echo.
pause
exit /b %testExit%
