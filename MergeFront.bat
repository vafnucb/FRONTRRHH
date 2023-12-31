﻿
@echo off

REM Archivo específico a excluir durante el merge (con ruta relativa)
set EXCLUDED_FILE=src\main.js

REM Realizar un stash de los cambios locales en la rama de destino (main)
git stash

REM Realizar el merge
git merge dev

REM Deshacer los cambios específicos en la rama de destino (main) si hay conflictos
git checkout --ours -- "%EXCLUDED_FILE%"

REM Commit de los cambios en la rama de destino (main)
git add "%EXCLUDED_FILE%"
git commit -m "Merge de dev en main, excluyendo cambios en %EXCLUDED_FILE%"

REM Aplicar los cambios locales nuevamente (sin aplicar los cambios del archivo específico)
git stash apply --index