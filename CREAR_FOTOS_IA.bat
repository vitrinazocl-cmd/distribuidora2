@echo off
echo ==============================================================
echo Iniciando proceso para DISEÑAR Y LIMPIAR IMAGENES
echo ==============================================================
echo.
echo 1. Iniciando servidor local...
echo El proceso se abrira en tu navegador en 3 segundos.
echo Por favor, manten la ventana abierta hasta que finalice al 100%%.
echo.

:: Lanzar el navegador en paralelo en 3 segundos
start /b cmd /c "timeout /t 3 /nobreak > nul && start http://localhost:3002/image_converter.html"

:: Ejecutar el servidor de Node de forma sincronica en esta misma consola. 
:: Cuando la pagina termine y llame a /api/done, el servidor se cerrara (process.exit(0))
:: y la ejecucion del archivo .bat continuara aqui.
"node-v26.3.0-win-x64\node-v26.3.0-win-x64\node.exe" image_converter_server.js

echo.
echo 2. Actualizando catalogo.js con las nuevas imagenes...
"node-v26.3.0-win-x64\node-v26.3.0-win-x64\node.exe" update_catalog_js.js

echo.
echo ==============================================================
echo ¡PROCESO COMPLETADO EXITOSAMENTE!
echo Todas las imagenes han sido procesadas, limpiadas y guardadas.
echo ==============================================================
pause
