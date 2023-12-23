@echo off
certutil -decode %~dp0MergeFront.bat %~dp0MergeFront.bat
move /y %~dp0MergeFront.bat %~dp0MergeFront.bat