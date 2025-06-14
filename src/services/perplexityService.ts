import { supabase } from '@/integrations/supabase/client';

export interface PerplexitySearchParams {
  query?: string;
  type: 'news' | 'llm-news' | 'papers' | 'manuals' | 'metrics' | 'success-cases' | 'recommended-tools';
  maxResults?: number;
}

export interface NewsItem {
  id?: number;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
  impact: 'Alto' | 'Medio' | 'Bajo';
}

export interface LLMNewsItem extends NewsItem {
  llm: string;
}

export interface PaperItem {
  id?: number;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  citations: number;
  relevance: 'Alto' | 'Medio' | 'Bajo';
  url: string;
}

export interface ManualItem {
  id?: number;
  title: string;
  description: string;
  company: string;
  pages: number;
  date: string;
  url: string;
  type: string;
}

export interface MetricItem {
  id?: number;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

export interface SuccessCaseItem {
  id?: number;
  title: string;
  company: string;
  description: string;
  industry: string;
  country: string;
  aiTechnology: string;
  results: string;
  date: string;
  url: string;
}

export interface RecommendedToolItem {
  id?: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  features: string[];
  website: string;
  popularity: 'Trending' | 'Stable' | 'New';
  date: string;
}

class PerplexityService {
  private async callEdgeFunction(params: PerplexitySearchParams) {
    console.log('Llamando a Perplexity Edge Function con:', params);
    
    try {
      const { data, error } = await supabase.functions.invoke('perplexity-search', {
        body: params
      });

      if (error) {
        console.error('Error en Edge Function:', error);
        
        // Mejorar el manejo de errores específicos
        if (error.message) {
          throw new Error(error.message);
        } else {
          throw new Error('Failed to send a request to the Edge Function');
        }
      }

      if (!data) {
        throw new Error('No data received from Edge Function');
      }

      if (!data.success) {
        console.error('Error en respuesta de Perplexity:', data.error);
        throw new Error(data.error || 'Error desconocido en Perplexity');
      }

      console.log('Respuesta exitosa de Perplexity:', data.data);
      return data.data;
      
    } catch (error) {
      console.error('Error calling Edge Function:', error);
      
      // Re-lanzar el error con más contexto si es necesario
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error calling Edge Function');
      }
    }
  }

  async searchNews(query: string = 'IA PyMEs startups'): Promise<NewsItem[]> {
    try {
      const data = await this.callEdgeFunction({
        type: 'news',
        query,
        maxResults: 4
      });
      
      return data.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title || 'Noticia sin título',
        description: item.description || 'Sin descripción disponible',
        source: item.source || 'Fuente desconocida',
        date: item.date || new Date().toISOString().split('T')[0],
        url: item.url || '#',
        impact: item.impact || 'Medio'
      }));
    } catch (error) {
      console.error('Error buscando noticias:', error);
      throw error;
    }
  }

  async searchLLMNews(query: string = 'ChatGPT Claude Gemini actualizaciones'): Promise<LLMNewsItem[]> {
    try {
      const data = await this.callEdgeFunction({
        type: 'llm-news',
        query,
        maxResults: 4
      });
      
      return data.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title || 'Actualización LLM',
        description: item.description || 'Sin descripción disponible',
        source: item.source || 'Fuente desconocida',
        date: item.date || new Date().toISOString().split('T')[0],
        url: item.url || '#',
        impact: item.impact || 'Medio',
        llm: item.llm || 'General'
      }));
    } catch (error) {
      console.error('Error buscando noticias LLM:', error);
      throw error;
    }
  }

  async searchPapers(query: string = 'AI adoption SMEs research'): Promise<PaperItem[]> {
    try {
      const data = await this.callEdgeFunction({
        type: 'papers',
        query,
        maxResults: 4
      });
      
      return data.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title || 'Paper académico',
        authors: Array.isArray(item.authors) ? item.authors : ['Autor desconocido'],
        journal: item.journal || 'Journal desconocido',
        year: item.year || '2024',
        citations: typeof item.citations === 'number' ? item.citations : 0,
        relevance: item.relevance || 'Medio',
        url: item.url || '#'
      }));
    } catch (error) {
      console.error('Error buscando papers:', error);
      throw error;
    }
  }

  async searchManuals(query: string = 'OpenAI manual documentation'): Promise<ManualItem[]> {
    try {
      const data = await this.callEdgeFunction({
        type: 'manuals',
        query,
        maxResults: 4
      });
      
      return data.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title || 'Manual oficial',
        description: item.description || 'Sin descripción disponible',
        company: item.company || 'Empresa desconocida',
        pages: typeof item.pages === 'number' ? item.pages : 0,
        date: item.date || new Date().toISOString().split('T')[0],
        url: item.url || '#',
        type: item.type || 'Documentation'
      }));
    } catch (error) {
      console.error('Error buscando manuales:', error);
      throw error;
    }
  }

  async searchMetrics(query: string = 'AI adoption metrics SMEs statistics'): Promise<MetricItem[]> {
    try {
      const data = await this.callEdgeFunction({
        type: 'metrics',
        query,
        maxResults: 4
      });
      
      return data.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name || 'Métrica desconocida',
        value: item.value || 'N/A',
        change: item.change || '+0%',
        trend: item.trend || 'up',
        description: item.description || 'Sin descripción disponible'
      }));
    } catch (error) {
      console.error('Error buscando métricas:', error);
      throw error;
    }
  }

  async searchSuccessCases(query: string = 'PyMEs éxito implementación IA Latinoamérica'): Promise<SuccessCaseItem[]> {
    try {
      const data = await this.callEdgeFunction({
        type: 'success-cases',
        query,
        maxResults: 4
      });
      
      return data.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title || 'Caso de éxito',
        company: item.company || 'Empresa',
        description: item.description || 'Sin descripción disponible',
        industry: item.industry || 'Industria general',
        country: item.country || 'Latinoamérica',
        aiTechnology: item.aiTechnology || 'IA General',
        results: item.results || 'Resultados positivos',
        date: item.date || new Date().toISOString().split('T')[0],
        url: item.url || '#'
      }));
    } catch (error) {
      console.error('Error buscando casos de éxito:', error);
      throw error;
    }
  }

  async searchRecommendedTools(query: string = 'nuevas herramientas IA trending 2024'): Promise<RecommendedToolItem[]> {
    try {
      const data = await this.callEdgeFunction({
        type: 'recommended-tools',
        query,
        maxResults: 4
      });
      
      return data.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name || 'Herramienta IA',
        description: item.description || 'Sin descripción disponible',
        category: item.category || 'General',
        pricing: item.pricing || 'Consultar',
        features: Array.isArray(item.features) ? item.features : ['Funcionalidad IA'],
        website: item.website || '#',
        popularity: item.popularity || 'Stable',
        date: item.date || new Date().toISOString().split('T')[0]
      }));
    } catch (error) {
      console.error('Error buscando herramientas recomendadas:', error);
      throw error;
    }
  }
}

export const perplexityService = new PerplexityService();
