
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { usePerplexityData } from '@/hooks/usePerplexityData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardUpdateInfo from '@/components/dashboard/DashboardUpdateInfo';
import DashboardSections from '@/components/dashboard/DashboardSections';
import GoogleSheetsConfig from '@/components/dashboard/GoogleSheetsConfig';

const Index = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const { isConnected, isSending, sendData, checkConnection } = useGoogleSheets();
  const { data: perplexityData, isLoading: isUpdating, updateAllData } = usePerplexityData();

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
    console.log("=== INICIANDO ACTUALIZACIÓN MANUAL CON PERPLEXITY ===");
    console.log("Estado actual de conexión Google Sheets:", isConnected);
    
    // Actualizar datos usando Perplexity
    await updateAllData();
    setLastUpdate(new Date());
    
    // Si Google Sheets está conectado, enviar datos automáticamente
    if (isConnected && perplexityData) {
      console.log("Google Sheets está conectado, enviando datos de Perplexity...");
      
      // Convertir datos de Perplexity al formato de Google Sheets
      const sheetsData = [
        ...perplexityData.news.map(item => ({
          type: 'news',
          title: item.title,
          description: item.description,
          source: item.source,
          date: item.date,
          url: item.url,
          metadata: JSON.stringify({ impact: item.impact })
        })),
        ...perplexityData.llmNews.map(item => ({
          type: 'llm-news',
          title: item.title,
          description: item.description,
          source: item.source,
          date: item.date,
          url: item.url,
          metadata: JSON.stringify({ impact: item.impact, llm: item.llm })
        })),
        ...perplexityData.papers.map(item => ({
          type: 'papers',
          title: item.title,
          description: `${item.authors.join(', ')} - ${item.journal}`,
          source: item.journal,
          date: item.year,
          url: item.url,
          metadata: JSON.stringify({ relevance: item.relevance, citations: item.citations })
        })),
        ...perplexityData.manuals.map(item => ({
          type: 'manuals',
          title: item.title,
          description: item.description,
          source: item.company,
          date: item.date,
          url: item.url,
          metadata: JSON.stringify({ pages: item.pages, type: item.type })
        })),
        ...perplexityData.metrics.map(item => ({
          type: 'metrics',
          title: item.name,
          description: item.description,
          source: 'Perplexity Analysis',
          date: new Date().toISOString().split('T')[0],
          url: '#',
          metadata: JSON.stringify({ value: item.value, change: item.change, trend: item.trend })
        }))
      ];
      
      console.log("Datos a enviar a Google Sheets:", sheetsData.length, "elementos");
      const success = await sendData(sheetsData);
      console.log("Resultado del envío:", success);
    } else {
      console.log("Google Sheets NO está conectado, saltando envío de datos");
    }
    
    toast({
      title: "Actualización completada",
      description: isConnected 
        ? "Datos actualizados con Perplexity y guardados en Google Sheets" 
        : "Datos actualizados con información real de Perplexity",
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

        {/* Secciones principales con datos de Perplexity */}
        <DashboardSections perplexityData={perplexityData} />
      </div>
    </div>
  );
};

export default Index;
