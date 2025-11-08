@echo off
echo ========================================
echo ChronoFlow - Quick Start
echo ========================================
echo.

echo Starting Flask backend...
start cmd /k "python app.py"

timeout /t 3 /nobreak > nul

echo.
echo Opening browser...
start http://localhost:8000

echo.
echo ========================================
echo Server is running!
echo Open index.html in a browser or use:
echo   python -m http.server 8000
echo ========================================
echo.
pause

