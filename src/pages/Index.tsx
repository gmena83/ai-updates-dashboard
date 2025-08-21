
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { usePerplexityData, PerplexityData } from "@/hooks/usePerplexityData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardUpdateInfo from "@/components/dashboard/DashboardUpdateInfo";
import GoogleSheetsConfig from "@/components/dashboard/GoogleSheetsConfig";
import DashboardAccordion from "@/components/dashboard/DashboardAccordion";
import Footer from "@/components/Footer";

const Index = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const { isConnected, isSending, sendData, checkConnection } = useGoogleSheets();
  const { data, isLoading: isUpdating, updateAllData } = usePerplexityData();

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
    
    try {
      // Actualizar datos usando Perplexity
      await updateAllData();
      setLastUpdate(new Date());
      
      // Si Google Sheets está conectado, enviar datos automáticamente
      if (isConnected && data) {
        console.log("Google Sheets está conectado, enviando datos de Perplexity...");
        
        // Convertir datos de Perplexity al formato de Google Sheets
        const sheetsData = [
          ...data.news.map(item => ({
            timestamp: new Date().toISOString(),
            type: 'news',
            title: item.title,
            description: item.description,
            source: item.source,
            date: item.date,
            url: item.url,
            metadata: JSON.stringify({ impact: item.impact }),
            impact: item.impact
          })),
          ...data.llmNews.map(item => ({
            timestamp: new Date().toISOString(),
            type: 'llm-news',
            title: item.title,
            description: item.description,
            source: item.source,
            date: item.date,
            url: item.url,
            metadata: JSON.stringify({ impact: item.impact, llm: item.llm }),
            impact: item.impact
          })),
          ...data.papers.map(item => ({
            timestamp: new Date().toISOString(),
            type: 'papers',
            title: item.title,
            description: `${item.authors.join(', ')} - ${item.journal}`,
            source: item.journal,
            date: item.year,
            url: item.url,
            metadata: JSON.stringify({ relevance: item.relevance, citations: item.citations }),
            impact: item.relevance
          })),
          ...data.manuals.map(item => ({
            timestamp: new Date().toISOString(),
            type: 'manuals',
            title: item.title,
            description: item.description,
            source: item.company,
            date: item.date,
            url: item.url,
            metadata: JSON.stringify({ pages: item.pages, type: item.type }),
            impact: 'Medio'
          })),
          ...data.metrics.map(item => ({
            timestamp: new Date().toISOString(),
            type: 'metrics',
            title: item.name,
            description: item.description,
            source: 'Perplexity Analysis',
            date: new Date().toISOString().split('T')[0],
            url: '#',
            metadata: JSON.stringify({ value: item.value, change: item.change, trend: item.trend }),
            impact: 'Alto'
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
      
    } catch (error) {
      console.error("Error durante la actualización:", error);
      // El toast de error ya se muestra en usePerplexityData, no necesitamos otro aquí
    }
    
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

        <DashboardAccordion data={data} />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
