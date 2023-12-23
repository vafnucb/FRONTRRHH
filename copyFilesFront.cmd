@ECHO OFF

:: Solicitar elevación de privilegios
NET FILE 1>NUL 2>NUL
if '%errorlevel%' == '0' ( goto gotPrivileges ) else ( powershell -Command "Start-Process '%0' -Verb RunAs"; exit )
:gotPrivileges

:: Ejecuta el script .cmd con cmd.exe al principio
cmd.exe /c copyFilesFront.cmd

set rootpath=%~dp0
set destination="C:\inetpub\wwwroot\RRHH2"

git pull origin main

mkdir "%destination%\Static"
robocopy "%rootpath%\dist\static" "%destination%\Static" /E /COPYALL /is

robocopy "%rootpath%\dist\\" "%destination%\Views\Home\\" "index.html" /COPYALL /is

REM Crear el archivo Index.cshtml
echo @{    Layout = "";   } > "%destination%\Views\Home\Index.cshtml"
type "%destination%\Views\Home\index.html" >> "%destination%\Views\Home\Index.cshtml"

ECHO ON
exit /b