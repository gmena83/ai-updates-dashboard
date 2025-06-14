
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Link, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

const GoogleSheetsConfig = () => {
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [sheetName, setSheetName] = useState('Hoja 1');
  const { isConnected, isConnecting, connect, disconnect, checkConnection } = useGoogleSheets();

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleConnect = async () => {
    if (!sheetsUrl || !apiKey) {
      return;
    }

    await connect({
      spreadsheetId: sheetsUrl,
      apiKey: apiKey,
      sheetName: sheetName
    });
  };

  const handleDisconnect = () => {
    disconnect();
    setSheetsUrl('');
    setApiKey('');
    setSheetName('Hoja 1');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configuración Google Sheets
        </CardTitle>
        <CardDescription className="text-indigo-100">
          Conecta tu hoja de cálculo para almacenar los datos automáticamente
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
                <Label htmlFor="api-key">API Key de Google</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="border-gray-200 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-600">
                  Obtén tu API Key desde Google Cloud Console
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

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 mb-2">
                  <strong>Pasos para configurar:</strong>
                </p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Habilita Google Sheets API en Google Cloud Console</li>
                  <li>Crea una API Key</li>
                  <li>Haz tu hoja pública o agrega permisos de lectura/escritura</li>
                  <li>Configura las columnas: Fecha, Tipo, Título, Descripción, Fuente, Impacto, URL</li>
                </ol>
              </div>
              
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !sheetsUrl || !apiKey}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                <Link className={`h-4 w-4 mr-2 ${isConnecting ? 'animate-spin' : ''}`} />
                {isConnecting ? 'Conectando...' : 'Conectar Google Sheets'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-700">Conectado exitosamente</span>
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 mb-2">
                  <strong>Configuración guardada</strong>
                </p>
                <p className="text-xs text-green-700">
                  Los datos se guardarán automáticamente en cada actualización
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
