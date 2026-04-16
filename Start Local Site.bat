@echo off
setlocal

cd /d "%~dp0"

set "PYTHON_CMD="

where py >nul 2>nul
if %errorlevel%==0 set "PYTHON_CMD=py"

if not defined PYTHON_CMD (
  where python >nul 2>nul
  if %errorlevel%==0 set "PYTHON_CMD=python"
)

if not defined PYTHON_CMD (
  echo Python was not found on this computer.
  echo.
  echo To use this launcher, install Python from https://www.python.org/downloads/
  echo and make sure the installer option to add Python to PATH is turned on.
  echo.
  pause
  exit /b 1
)

echo Starting local site at http://localhost:8000
start "" http://localhost:8000

%PYTHON_CMD% -m http.server 8000
