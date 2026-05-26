@echo off

:: Set PowerShell execution policy for this process only
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force"

:: Install dependencies
npm install

:: Start Vite dev server
npm run dev
