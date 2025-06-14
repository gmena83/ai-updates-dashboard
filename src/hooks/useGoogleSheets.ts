
import { useState, useCallback } from 'react';
import { googleSheetsService, SheetData, GoogleSheetsConfig } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';

export const useGoogleSheets = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(async (config: GoogleSheetsConfig) => {
    console.log('Intentando conectar con Google Sheets...');
    setIsConnecting(true);
    try {
      googleSheetsService.setConfig(config);
      console.log('Configuración establecida, probando conexión...');
      const connectionTest = await googleSheetsService.testConnection();
      
      if (connectionTest) {
        setIsConnected(true);
        console.log('Conexión exitosa con Google Sheets');
        toast({
          title: "Conexión establecida",
          description: "Google Sheets configurado correctamente",
        });
        return true;
      } else {
        console.error('Falló la prueba de conexión');
        throw new Error('No se pudo conectar con Google Sheets. Verifica tu API Key y que la hoja sea accesible.');
      }
    } catch (error) {
      console.error('Error en connect:', error);
      toast({
        title: "Error de conexión",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    console.log('Desconectando Google Sheets...');
    googleSheetsService.clearConfig();
    setIsConnected(false);
    toast({
      title: "Desconectado",
      description: "La conexión con Google Sheets ha sido removida",
    });
  }, [toast]);

  const sendData = useCallback(async (data: SheetData[]) => {
    console.log('Intentando enviar datos:', data.length, 'elementos');
    
    if (!isConnected) {
      console.error('No está conectado a Google Sheets');
      toast({
        title: "No conectado",
        description: "Configura Google Sheets primero",
        variant: "destructive",
      });
      return false;
    }

    setIsSending(true);
    try {
      console.log('Enviando datos a Google Sheets...');
      await googleSheetsService.appendData(data);
      console.log('Datos enviados exitosamente');
      toast({
        title: "Datos enviados",
        description: `${data.length} elementos guardados en Google Sheets`,
      });
      return true;
    } catch (error) {
      console.error('Error al enviar datos:', error);
      toast({
        title: "Error al enviar datos",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  }, [isConnected, toast]);

  const checkConnection = useCallback(() => {
    console.log('Verificando conexión existente...');
    const config = googleSheetsService.getConfig();
    const connected = !!config;
    console.log('Estado de conexión:', connected);
    setIsConnected(connected);
    return connected;
  }, []);

  return {
    isConnected,
    isConnecting,
    isSending,
    connect,
    disconnect,
    sendData,
    checkConnection
  };
};
