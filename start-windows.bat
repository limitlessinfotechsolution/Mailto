@echo off
echo Starting MailO Platform...
echo ==========================

REM Check if Docker is running
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b
)

echo Building and starting containers...
docker-compose up -d --build

echo.
echo Waiting for services to initialize...
timeout /t 10 /nobreak >nul

echo.
echo Launching Webmail Interface...
start http://localhost

echo.
echo MailO is running!
echo Frontend: http://localhost
echo Backend API: http://localhost:5000
echo MinIO Console: http://localhost:9001
echo.
pause
