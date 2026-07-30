@echo off
setlocal enabledelayedexpansion

REM Script de revalidación para DerechoArtificial.com (Windows)
REM Uso: scripts\revalidate-home.bat [opciones]

REM Configuración
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

REM Variables de entorno
if not defined REVALIDATE_SECRET (
    echo ❌ Error: REVALIDATE_SECRET no está configurado
    echo 💡 Solución: set REVALIDATE_SECRET=tu_token_secreto
    echo 💡 O configura en .env.local o secrets de CI/CD
    exit /b 1
)

set "BASE_URL=https://www.derechoartificial.com"
if defined BASE_URL_OVERRIDE set "BASE_URL=%BASE_URL_OVERRIDE%"

set "API_ENDPOINT=%BASE_URL%/api/revalidate"

REM Función de ayuda
if "%1"=="-h" goto :show_help
if "%1"=="--help" goto :show_help
if "%1"=="/h" goto :show_help
if "%1"=="/help" goto :show_help

REM Parsear argumentos
set "paths="
set "tags="
set "verbose=false"
set "all=false"

:parse_args
if "%1"=="" goto :validate_config
if "%1"=="-p" goto :set_paths
if "%1"=="--paths" goto :set_paths
if "%1"=="-t" goto :set_tags
if "%1"=="--tags" goto :set_tags
if "%1"=="-a" goto :set_all
if "%1"=="--all" goto :set_all
if "%1"=="-v" goto :set_verbose
if "%1"=="--verbose" goto :set_verbose

echo ❌ Opción desconocida: %1
goto :show_help

:set_paths
set "paths=%2"
shift
shift
goto :parse_args

:set_tags
set "tags=%2"
shift
shift
goto :parse_args

:set_all
set "all=true"
shift
goto :parse_args

:set_verbose
set "verbose=true"
shift
goto :parse_args

:validate_config
REM Verificar si curl está disponible
curl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: curl no está instalado
    exit /b 1
)

goto :revalidate

:show_help
echo.
echo Script de Revalidación - DerechoArtificial.com
echo.
echo Uso: %0 [opciones]
echo.
echo Opciones:
echo   -h, --help          Muestra esta ayuda
echo   -p, --paths         Rutas específicas a revalidar (separadas por comas)
echo   -t, --tags          Tags específicos a revalidar (separados por comas)
echo   -a, --all           Revalida todas las rutas y tags por defecto
echo   -v, --verbose       Modo verbose
echo.
echo Variables de entorno:
echo   REVALIDATE_SECRET    Token secreto para autenticación (requerido)
echo   BASE_URL           URL base del sitio (default: https://www.derechoartificial.com)
echo.
echo Ejemplos:
echo   # Revalidar todo
echo   set REVALIDATE_SECRET=tu_secreto ^&^& %0 --all
echo.
echo   # Revalidar rutas específicas
echo   set REVALIDATE_SECRET=tu_secreto ^&^& %0 --paths "/firma-scarpa,/actualidad-ia"
echo.
echo   # Revalidar tags específicos
echo   set REVALIDATE_SECRET=tu_secreto ^&^& %0 --tags "firma-scarpa-posts,actualidad-posts"
echo.
exit /b 0

:revalidate
echo 🔄 Iniciando revalidación...
echo 🌐 Endpoint: %API_ENDPOINT%

if "%verbose%"=="true" (
    echo 📂 Paths: %paths:'todos por defecto'%
    echo 🏷️ Tags: %tags:'todos por defecto'%
)

REM Construir el payload JSON
set "payload={}"
if not "%paths%"=="" (
    set "payload={"paths": ["%paths:~=-","%"]}"
)
if not "%tags%"=="" (
    if "%payload%"=="{}" (
        set "payload={"tags": ["%tags:~=-","%"]}"
    ) else (
        set "payload=%payload:~0,-1%, "tags": ["%tags:~=-","%"]}"
    )
)

if "%verbose%"=="true" (
    echo 📦 Payload: %payload%
)

REM Crear archivo temporal para el payload
echo %payload% > "%TEMP%\revalidate_payload.json"

REM Ejecutar la petición
curl -s -w "%%{http_code}" -o "%TEMP%\revalidate_response.json" ^
    -X POST ^
    -H "Content-Type: application/json" ^
    -H "x-revalidate-secret: %REVALIDATE_SECRET%" ^
    -d @"%TEMP%\revalidate_payload.json" ^
    "%API_ENDPOINT%"

REM Leer el código HTTP
set /p response_code=<"%TEMP%\revalidate_http_code.txt"

REM Leer el cuerpo de la respuesta
if exist "%TEMP%\revalidate_response.json" (
    set /p response_body=<"%TEMP%\revalidate_response.json"
) else (
    set "response_body="
)

echo 📊 Código HTTP: %response_code%

REM Procesar respuesta
if "%response_code%"=="200" (
    echo ✅ Revalidación exitosa
    if "%verbose%"=="true" (
        echo %response_body%
    )
) else if "%response_code%"=="401" (
    echo ❌ Error: Token inválido
    echo 💡 Verifica que REVALIDATE_SECRET sea correcto
    exit /b 1
) else if "%response_code%"=="500" (
    echo ❌ Error interno del servidor
    if "%verbose%"=="true" (
        echo %response_body%
    )
    exit /b 1
) else (
    echo ❌ Error inesperado: %response_code%
    if "%verbose%"=="true" (
        echo %response_body%
    )
    exit /b 1
)

REM Limpiar archivos temporales
if exist "%TEMP%\revalidate_payload.json" del "%TEMP%\revalidate_payload.json"
if exist "%TEMP%\revalidate_response.json" del "%TEMP%\revalidate_response.json"
if exist "%TEMP%\revalidate_http_code.txt" del "%TEMP%\revalidate_http_code.txt"

echo.
echo 🎉 Proceso de revalidación completado
