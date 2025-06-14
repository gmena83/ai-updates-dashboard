import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, CheckCircle, AlertCircle, Code, Copy, ExternalLink } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useToast } from '@/hooks/use-toast';

const GoogleSheetsConfig = () => {
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [scriptUrl, setScriptUrl] = useState('');
  const [sheetName, setSheetName] = useState('Hoja 1');
  const { isConnected, isConnecting, connect, disconnect, checkConnection } = useGoogleSheets();
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleConnect = async () => {
    if (!sheetsUrl || !scriptUrl) {
      toast({
        title: "Campos requeridos",
        description: "Completa la URL de Google Sheets y la URL del Apps Script",
        variant: "destructive",
      });
      return;
    }

    // Validar que la URL del script sea correcta
    if (!scriptUrl.includes('script.google.com') || !scriptUrl.includes('/exec')) {
      toast({
        title: "URL incorrecta",
        description: "La URL del Apps Script debe terminar en '/exec' y ser de script.google.com",
        variant: "destructive",
      });
      return;
    }

    await connect({
      spreadsheetId: sheetsUrl,
      scriptUrl: scriptUrl,
      sheetName: sheetName
    });
  };

  const handleDisconnect = () => {
    disconnect();
    setSheetsUrl('');
    setScriptUrl('');
    setSheetName('Hoja 1');
  };

  const copyScriptCode = () => {
    const scriptCode = `function doPost(e) {
  try {
    console.log('📥 Solicitud recibida');
    console.log('📋 Evento completo:', JSON.stringify(e, null, 2));
    
    let data;
    
    // Intentar múltiples formas de obtener los datos
    if (e.parameter && e.parameter.data) {
      // Datos enviados como form parameter
      console.log('📦 Datos encontrados en e.parameter.data');
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      // Datos enviados como JSON en el body
      console.log('📦 Datos encontrados en e.postData.contents');
      data = JSON.parse(e.postData.contents);
    } else if (e.postData && e.postData.getDataAsString) {
      // Otra forma de obtener datos POST
      console.log('📦 Datos encontrados con getDataAsString');
      data = JSON.parse(e.postData.getDataAsString());
    } else {
      throw new Error('No se encontraron datos en la solicitud POST. Verifica el formato de envío.');
    }
    
    console.log('📋 Datos procesados:', JSON.stringify(data, null, 2));
    
    const { action, spreadsheetId, sheetName, values } = data;
    
    console.log('🔍 Parámetros extraídos:', { 
      action: action, 
      spreadsheetId: spreadsheetId, 
      sheetName: sheetName, 
      valuesCount: values ? values.length : 0 
    });
    
    // Verificar que tenemos los datos necesarios
    if (!action || !spreadsheetId || !sheetName) {
      throw new Error('Faltan datos requeridos: action, spreadsheetId o sheetName');
    }
    
    // Abrir la hoja de cálculo
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      console.log('✅ Spreadsheet abierto correctamente');
    } catch (error) {
      throw new Error('No se pudo abrir el spreadsheet. Verifica que el ID sea correcto y que tengas acceso: ' + error.toString());
    }
    
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Hoja "' + sheetName + '" no encontrada. Verifica que el nombre sea correcto.');
    }
    console.log('✅ Hoja encontrada:', sheetName);
    
    if (action === 'test') {
      console.log('🧪 Ejecutando prueba de conexión');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Conexión exitosa con Google Apps Script',
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'append' && values && Array.isArray(values) && values.length > 0) {
      console.log('📝 Iniciando proceso de agregar datos');
      
      // Agregar encabezados si la hoja está vacía
      if (sheet.getLastRow() === 0) {
        const headers = ['Fecha', 'Tipo', 'Título', 'Descripción', 'Fuente', 'Impacto', 'URL'];
        sheet.appendRow(headers);
        console.log('📝 Encabezados agregados:', headers);
      }
      
      // Agregar los datos fila por fila
      let rowsAdded = 0;
      values.forEach(function(row, index) {
        try {
          if (Array.isArray(row) && row.length > 0) {
            sheet.appendRow(row);
            rowsAdded++;
            console.log('✅ Fila ' + (index + 1) + ' agregada:', row);
          }
        } catch (rowError) {
          console.error('❌ Error en fila ' + (index + 1) + ':', rowError);
        }
      });
      
      console.log('🎉 Proceso completado: ' + rowsAdded + ' filas agregadas de ' + values.length + ' intentadas');
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: rowsAdded + ' filas agregadas correctamente',
          rowsAdded: rowsAdded,
          totalAttempted: values.length,
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    throw new Error('Acción no válida: "' + action + '" o datos faltantes');
    
  } catch (error) {
    console.error('❌ Error en doPost:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

    navigator.clipboard.writeText(scriptCode);
    toast({
      title: "Código copiado",
      description: "El código actualizado del Apps Script ha sido copiado al portapapeles",
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configuración Google Sheets + Apps Script
        </CardTitle>
        <CardDescription className="text-indigo-100">
          Conecta tu hoja de cálculo usando Google Apps Script
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {!isConnected ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="sheets-url">URL de Google Sheets</Label>
                <Input
                  id="sheets-url"
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetsUrl}
                  onChange={(e) => setSheetsUrl(e.target.value)}
                  className="border-gray-200 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="script-url">URL del Google Apps Script</Label>
                <Input
                  id="script-url"
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={scriptUrl}
                  onChange={(e) => setScriptUrl(e.target.value)}
                  className="border-gray-200 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-600">
                  Debe terminar en "/exec" (no "/dev")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sheet-name">Nombre de la hoja</Label>
                <Input
                  id="sheet-name"
                  type="text"
                  placeholder="Hoja 1"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  className="border-gray-200 focus:border-indigo-500"
                />
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm font-medium text-red-800">
                    Código actualizado - Error corregido
                  </p>
                </div>
                <p className="text-xs text-red-700">
                  Si acabas de recibir un error de "Cannot read properties of undefined", 
                  copia el nuevo código y actualiza tu Apps Script.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-blue-800">
                    Código corregido para Google Apps Script:
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyScriptCode}
                    className="text-blue-600 border-blue-300"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar código corregido
                  </Button>
                </div>
                
                <div className="text-xs text-blue-700 space-y-2">
                  <p><strong>Pasos:</strong></p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Ve a <a href="https://script.google.com" target="_blank" rel="noopener" className="underline font-medium">script.google.com</a></li>
                    <li>Crea un "Nuevo proyecto"</li>
                    <li>Borra el código existente y pega el código copiado</li>
                    <li>Guarda el proyecto (Ctrl+S)</li>
                    <li>Haz clic en "Implementar" → "Nueva implementación"</li>
                    <li>Selecciona tipo: "Aplicación web"</li>
                    <li>Ejecutar como: "Yo"</li>
                    <li>Quién puede acceder: "Cualquier usuario"</li>
                    <li>Copia la URL que termina en "/exec"</li>
                  </ol>
                </div>
                
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    <strong>⚠️ Importante:</strong> Usa la URL que termina en "/exec", NO la que termina en "/dev"
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !sheetsUrl || !scriptUrl}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white w-full"
              >
                <Code className={`h-4 w-4 mr-2 ${isConnecting ? 'animate-spin' : ''}`} />
                {isConnecting ? 'Conectando...' : 'Conectar Google Apps Script'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-700">Conectado exitosamente</span>
                <Badge className="bg-green-100 text-green-800">Google Apps Script</Badge>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 mb-2">
                  <strong>Configuración guardada</strong>
                </p>
                <p className="text-xs text-green-700">
                  Los datos se guardarán automáticamente usando Google Apps Script en cada actualización
                </p>
              </div>
              
              <div className="flex items-start space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Configuración de columnas automática:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Columna A: Fecha/Hora</li>
                    <li>• Columna B: Tipo (Noticia/Métrica/Reporte/Paper)</li>
                    <li>• Columna C: Título</li>
                    <li>• Columna D: Descripción</li>
                    <li>• Columna E: Fuente</li>
                    <li>• Columna F: Impacto/Relevancia</li>
                    <li>• Columna G: URL</li>
                  </ul>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Desconectar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;
