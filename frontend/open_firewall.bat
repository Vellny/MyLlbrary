@echo off
echo =========================================
echo  MyLibrary – Open required ports
echo =========================================
echo.

:: Frontend (Vite) – port 5174
netsh advfirewall firewall add rule name="MyLibrary Frontend (Vite 5174)" dir=in action=allow protocol=TCP localport=5174

:: Laravel backend – port 8000
netsh advfirewall firewall add rule name="MyLibrary Backend (Laravel 8000)" dir=in action=allow protocol=TCP localport=8000

echo.
echo =========================================
echo  Done! Ports 5174 and 8000 are now open.
echo  Other devices on the network can access:
echo  http://<your-local-ip>:5174
echo =========================================
pause
