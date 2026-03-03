@echo off
title RUESAINTPHANTOM - Demarrage du site
cd /d "%~dp0"

echo.
echo Suppression du cache (.next)...
if exist .next rmdir /s /q .next
echo OK.
echo.

echo Demarrage du site sur http://localhost:3000
echo.
echo Ouvre ton navigateur sur: http://localhost:3000
echo Pour arreter: ferme cette fenetre ou appuie sur Ctrl+C
echo.

npm run dev

pause
