
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  perplexityService, 
  NewsItem, 
  LLMNewsItem, 
  PaperItem, 
  ManualItem, 
  MetricItem 
} from '@/services/perplexityService';

export interface PerplexityData {
  news: NewsItem[];
  llmNews: LLMNewsItem[];
  papers: PaperItem[];
  manuals: ManualItem[];
  metrics: MetricItem[];
}

export const usePerplexityData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PerplexityData>({
    news: [],
    llmNews: [],
    papers: [],
    manuals: [],
    metrics: []
  });
  const { toast } = useToast();

  const updateAllData = useCallback(async () => {
    console.log('=== INICIANDO ACTUALIZACIÓN CON PERPLEXITY ===');
    setIsLoading(true);
    
    try {
      // Ejecutar todas las búsquedas en paralelo
      const [newsData, llmNewsData, papersData, manualsData, metricsData] = await Promise.all([
        perplexityService.searchNews(),
        perplexityService.searchLLMNews(),
        perplexityService.searchPapers(),
        perplexityService.searchManuals(),
        perplexityService.searchMetrics()
      ]);

      setData({
        news: newsData,
        llmNews: llmNewsData,
        papers: papersData,
        manuals: manualsData,
        metrics: metricsData
      });

      console.log('Datos actualizados exitosamente:', {
        news: newsData.length,
        llmNews: llmNewsData.length,
        papers: papersData.length,
        manuals: manualsData.length,
        metrics: metricsData.length
      });

      toast({
        title: "Datos actualizados",
        description: "Información actualizada con datos reales de Perplexity",
      });

    } catch (error) {
      console.error('Error actualizando datos:', error);
      toast({
        title: "Error al actualizar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
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
    } catch (error) {
      console.error('Error actualizando noticias:', error);
      toast({
        title: "Error al actualizar noticias",
        description: error instanceof Error ? error.message : "Error desconocido",
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
    } catch (error) {
      console.error('Error actualizando noticias LLM:', error);
      toast({
        title: "Error al actualizar noticias LLM",
        description: error instanceof Error ? error.message : "Error desconocido",
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
