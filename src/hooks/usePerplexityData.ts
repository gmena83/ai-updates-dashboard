
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  perplexityService, 
  NewsItem, 
  LLMNewsItem, 
  PaperItem, 
  ReportItem,
  ManualItem, 
  MetricItem,
  SuccessCaseItem,
  RecommendedToolItem
} from '@/services/perplexityService';

export interface PerplexityData {
  news: NewsItem[];
  llmNews: LLMNewsItem[];
  papers: PaperItem[];
  reports: ReportItem[];
  manuals: ManualItem[];
  metrics: MetricItem[];
  successCases: SuccessCaseItem[];
  recommendedTools: RecommendedToolItem[];
}

export const usePerplexityData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PerplexityData>({
    news: [],
    llmNews: [],
    papers: [],
    reports: [],
    manuals: [],
    metrics: [],
    successCases: [],
    recommendedTools: []
  });
  const { toast } = useToast();

  const updateAllData = useCallback(async () => {
    console.log('=== INICIANDO ACTUALIZACIÓN CON PERPLEXITY ===');
    setIsLoading(true);
    
    try {
      console.log('Ejecutando búsquedas de Perplexity...');
      
      // Ejecutar todas las búsquedas en paralelo
      const [newsData, llmNewsData, papersData, reportsData, manualsData, metricsData, successCasesData, recommendedToolsData] = await Promise.all([
        perplexityService.searchNews(),
        perplexityService.searchLLMNews(),
        perplexityService.searchPapers(),
        perplexityService.searchReports(),
        perplexityService.searchManuals(),
        perplexityService.searchMetrics(),
        perplexityService.searchSuccessCases(),
        perplexityService.searchRecommendedTools()
      ]);

      setData({
        news: newsData,
        llmNews: llmNewsData,
        papers: papersData,
        reports: reportsData,
        manuals: manualsData,
        metrics: metricsData,
        successCases: successCasesData,
        recommendedTools: recommendedToolsData
      });

      console.log('Datos actualizados exitosamente desde Perplexity:', {
        news: newsData.length,
        llmNews: llmNewsData.length,
        papers: papersData.length,
        reports: reportsData.length,
        manuals: manualsData.length,
        metrics: metricsData.length,
        successCases: successCasesData.length,
        recommendedTools: recommendedToolsData.length
      });

      toast({
        title: "Datos actualizados con Perplexity",
        description: "Información actualizada con datos reales de Perplexity AI",
      });

    } catch (error) {
      console.error('Error al actualizar con Perplexity:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.log('Error message:', errorMessage);
      
      // Verificar diferentes tipos de error más específicamente
      if (errorMessage.includes('PERPLEXITY_API_KEY') || errorMessage.includes('API key not configured')) {
        toast({
          title: "API Key de Perplexity requerida",
          description: "Ve a Configuraciones > Secretos de Edge Functions en Supabase y agrega PERPLEXITY_API_KEY",
          variant: "destructive",
        });
      } else if (errorMessage.includes('Failed to send a request to the Edge Function')) {
        toast({
          title: "Error de conexión con Edge Function",
          description: "No se pudo conectar con la función de Supabase. Verifica que la función esté desplegada correctamente.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        toast({
          title: "Error de red",
          description: "Problema de conectividad. Verifica tu conexión a internet e intenta nuevamente.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('Invalid JSON')) {
        toast({
          title: "Error de formato",
          description: "Error en el formato de datos. Intenta nuevamente en unos momentos.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al actualizar",
          description: `Error: ${errorMessage}`,
          variant: "destructive",
        });
      }
      
      // Mantener los datos actuales en caso de error
      console.log('Manteniendo datos actuales debido al error');
    } finally {
      setIsLoading(false);
      console.log('=== ACTUALIZACIÓN CON PERPLEXITY COMPLETADA ===');
    }
  }, [toast]);

  const updateNews = useCallback(async (query?: string) => {
    setIsLoading(true);
    try {
      const newsData = await perplexityService.searchNews(query);
      setData(prev => ({ ...prev, news: newsData }));
      
      toast({
        title: "Noticias actualizadas",
        description: "Noticias obtenidas de Perplexity AI",
      });
    } catch (error) {
      console.error('Error actualizando noticias:', error);
      toast({
        title: "Error al actualizar noticias",
        description: "No se pudo conectar con Perplexity. Verifica la configuración.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateLLMNews = useCallback(async (query?: string) => {
    setIsLoading(true);
    try {
      const llmNewsData = await perplexityService.searchLLMNews(query);
      setData(prev => ({ ...prev, llmNews: llmNewsData }));
      
      toast({
        title: "Noticias LLM actualizadas", 
        description: "Noticias LLM obtenidas de Perplexity AI",
      });
    } catch (error) {
      console.error('Error actualizando noticias LLM:', error);
      toast({
        title: "Error al actualizar noticias LLM",
        description: "No se pudo conectar con Perplexity. Verifica la configuración.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    data,
    isLoading,
    updateAllData,
    updateNews,
    updateLLMNews
  };
};
