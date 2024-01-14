@echo off

REM Archivo específico a excluir durante el merge (con ruta relativa)
set EXCLUDED_FILE=src\main.js

REM Deshabilitar la apertura de VIM durante el merge
set GIT_MERGE_AUTOEDIT=no

REM Realizar el merge, aceptando automáticamente los cambios locales excepto en src\main.js
git merge -X ours dev

REM Deshacer los cambios específicos en la rama de destino (main) si hay conflictos
git checkout --ours -- "%EXCLUDED_FILE%"

REM Commit de los cambios en la rama de destino (main)
git add .
git commit -m "Merge de dev en main, excluyendo cambios en %EXCLUDED_FILE%"

REM Eliminar la carpeta 'dist'
rmdir /s /q dist

REM Ejecutar el comando npm run build
npm run build

REM Añadir todos los cambios
git add .

REM Hacer el commit
git commit -m "Build Automático"

REM Realizar el push
git push