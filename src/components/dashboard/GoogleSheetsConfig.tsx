
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Link, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GoogleSheetsConfig = () => {
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!sheetsUrl) {
      toast({
        title: "Error",
        description: "Por favor ingresa la URL de Google Sheets",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    console.log("Conectando con Google Sheets:", sheetsUrl);
    
    // Simular conexión
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnected(true);
    setIsConnecting(false);
    
    toast({
      title: "Conexión establecida",
      description: "Google Sheets configurado correctamente",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSheetsUrl('');
    toast({
      title: "Desconectado",
      description: "La conexión con Google Sheets ha sido removida",
    });
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
                <p className="text-xs text-gray-600">
                  Asegúrate de que la hoja tenga permisos de escritura habilitados
                </p>
              </div>
              
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
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
                  <strong>Hoja configurada:</strong>
                </p>
                <p className="text-xs text-green-700 font-mono break-all">
                  {sheetsUrl}
                </p>
              </div>
              
              <div className="flex items-start space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Configuración de columnas recomendada:
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
