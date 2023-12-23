@ECHO OFF

set rootpath=%~dp0
set destination="C:\Users\Juanpi\Desktop\PruebScripts"

mkdir "%destination%\Static"
robocopy "%rootpath%\dist\static" "%destination%\Static" /E /COPYALL /is

robocopy "%rootpath%\dist\\" "%destination%\Views\Home\\" "index.html" /COPYALL /is

REM Crear el archivo Index.cshtml
echo @{    Layout = "";   } > "%destination%\Views\Home\Index.cshtml"
type "%destination%\Views\Home\index.html" >> "%destination%\Views\Home\Index.cshtml"

ECHO ON
exit /b