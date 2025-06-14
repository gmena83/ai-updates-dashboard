
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { generateMockData } from '@/services/mockDataService';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardUpdateInfo from '@/components/dashboard/DashboardUpdateInfo';
import DashboardSections from '@/components/dashboard/DashboardSections';
import GoogleSheetsConfig from '@/components/dashboard/GoogleSheetsConfig';

const Index = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const { isConnected, isSending, sendData, checkConnection } = useGoogleSheets();

  // Verificar conexión al cargar el componente
  useEffect(() => {
    console.log('Componente Index cargado, verificando conexión...');
    const connected = checkConnection();
    console.log('Estado de conexión inicial:', connected);
  }, [checkConnection]);

  // Log cuando cambia el estado de conexión
  useEffect(() => {
    console.log('Estado de conexión cambió a:', isConnected);
  }, [isConnected]);

  const handleManualUpdate = async () => {
    setIsUpdating(true);
    console.log("=== INICIANDO ACTUALIZACIÓN MANUAL ===");
    console.log("Estado actual de conexión:", isConnected);
    
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setLastUpdate(new Date());
    
    // Verificar conexión antes de enviar datos
    console.log("Verificando conexión antes de enviar datos...");
    const connectionStatus = checkConnection();
    console.log("Estado de conexión verificado:", connectionStatus);
    
    // Si Google Sheets está conectado, enviar datos automáticamente
    if (isConnected) {
      console.log("Google Sheets está conectado, enviando datos...");
      const mockData = generateMockData();
      console.log("Datos a enviar:", mockData);
      const success = await sendData(mockData);
      console.log("Resultado del envío:", success);
    } else {
      console.log("Google Sheets NO está conectado, saltando envío de datos");
      console.log("Para conectar, usa el botón 'Configurar' en la parte superior");
    }
    
    setIsUpdating(false);
    
    toast({
      title: "Actualización completada",
      description: isConnected 
        ? "Los datos han sido actualizados y guardados en Google Sheets" 
        : "Los datos han sido actualizados exitosamente",
    });
    
    console.log("=== ACTUALIZACIÓN MANUAL COMPLETADA ===");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <DashboardHeader
        isUpdating={isUpdating}
        isSending={isSending}
        showConfig={showConfig}
        onConfigToggle={() => setShowConfig(!showConfig)}
        onManualUpdate={handleManualUpdate}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Configuración de Google Sheets */}
        {showConfig && (
          <div className="mb-8 animate-fade-in">
            <GoogleSheetsConfig />
          </div>
        )}

        {/* Estadísticas principales */}
        <DashboardStats />

        {/* Información de última actualización */}
        <DashboardUpdateInfo 
          lastUpdate={lastUpdate}
          isConnected={isConnected}
        />

        {/* Secciones principales */}
        <DashboardSections />
      </div>
    </div>
  );
};

export default Index;
