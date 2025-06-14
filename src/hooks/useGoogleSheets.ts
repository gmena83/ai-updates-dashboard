
import { useState, useCallback } from 'react';
import { googleSheetsService, SheetData, GoogleSheetsConfig } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';

export const useGoogleSheets = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(async (config: GoogleSheetsConfig) => {
    setIsConnecting(true);
    try {
      googleSheetsService.setConfig(config);
      const connectionTest = await googleSheetsService.testConnection();
      
      if (connectionTest) {
        setIsConnected(true);
        toast({
          title: "Conexión establecida",
          description: "Google Sheets configurado correctamente",
        });
        return true;
      } else {
        throw new Error('No se pudo conectar con Google Sheets');
      }
    } catch (error) {
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
    googleSheetsService.clearConfig();
    setIsConnected(false);
    toast({
      title: "Desconectado",
      description: "La conexión con Google Sheets ha sido removida",
    });
  }, [toast]);

  const sendData = useCallback(async (data: SheetData[]) => {
    if (!isConnected) {
      toast({
        title: "No conectado",
        description: "Configura Google Sheets primero",
        variant: "destructive",
      });
      return false;
    }

    setIsSending(true);
    try {
      await googleSheetsService.appendData(data);
      toast({
        title: "Datos enviados",
        description: `${data.length} elementos guardados en Google Sheets`,
      });
      return true;
    } catch (error) {
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
    const config = googleSheetsService.getConfig();
    setIsConnected(!!config);
    return !!config;
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
