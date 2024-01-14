@echo off

REM Archivo específico a excluir durante el merge (con ruta relativa)
set EXCLUDED_FILE=src\main.js

REM Realizar un stash de los cambios locales en la rama de destino (main)
git stash

REM Realizar el merge con estrategia "ours" para rechazar los cambios de dev en src\main.js
git merge -s ours dev --no-commit
git checkout -- "%EXCLUDED_FILE%"

REM Commit del merge
git add .
git commit -m "Merge de dev en main, excluyendo cambios en %EXCLUDED_FILE%"

REM Aplicar los cambios locales nuevamente (sin aplicar los cambios del archivo específico)
git stash apply --index

@REM REM Eliminar la carpeta 'dist'
@REM rmdir /s /q dist

@REM REM Ejecutar el comando npm run build
@REM npm run build

@REM REM Añadir todos los cambios
@REM git add .

@REM REM Hacer el commit
@REM git commit -m "Build Automático"

@REM REM Realizar el push
@REM git push