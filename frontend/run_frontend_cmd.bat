@echo off
cd /d "%~dp0"

rem Install dependencies
npm install
if errorlevel 1 (
  echo npm install failed
  exit /b 1
)

rem Start Vite dev server
npm run dev
