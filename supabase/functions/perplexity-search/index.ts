
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PerplexityRequest {
  query: string;
  type: 'news' | 'llm-news' | 'papers' | 'manuals' | 'metrics' | 'success-cases' | 'recommended-tools';
  maxResults?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Perplexity Edge Function Started ===');
    
    const requestBody = await req.json().catch(err => {
      console.error('Error parsing request body:', err);
      throw new Error('Invalid JSON in request body');
    });
    
    console.log('Request body received:', requestBody);
    
    const { query, type, maxResults = 5 }: PerplexityRequest = requestBody;
    
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    console.log('API Key available:', !!PERPLEXITY_API_KEY);
    
    if (!PERPLEXITY_API_KEY) {
      console.error('Perplexity API key not found in environment');
      throw new Error('Perplexity API key not configured. Please add PERPLEXITY_API_KEY to your Supabase Edge Function secrets.');
    }

    // Construir prompt específico según el tipo
    const systemPrompt = getSystemPrompt(type);
    const searchQuery = buildSearchQuery(query, type);
    
    console.log('Making request to Perplexity API...');
    console.log('Query:', searchQuery);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    console.log('Perplexity API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('Perplexity API response received');
    
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content received from Perplexity API');
      throw new Error('No content received from Perplexity API');
    }

    // Procesar la respuesta según el tipo
    const processedData = processPerplexityResponse(content, type, maxResults);
    console.log('Processed data:', processedData.length, 'items');

    return new Response(
      JSON.stringify({ success: true, data: processedData }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error('Error in perplexity-search function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});

function getSystemPrompt(type: string): string {
  switch (type) {
    case 'news':
      return 'Eres un experto en inteligencia artificial y PyMEs. Busca y resume las noticias más recientes sobre adopción de IA en pequeñas y medianas empresas y startups. Incluye título, descripción, fuente, fecha y URL cuando sea posible. Responde en formato JSON con un array de objetos con estas propiedades: title, description, source, date, url, impact (Alto/Medio/Bajo).';
    
    case 'llm-news':
      return 'Eres un experto en modelos de lenguaje grandes (LLMs). Busca y resume las noticias más recientes sobre ChatGPT, Claude, Gemini, Copilot, Grok, DeepSeek y Perplexity. Incluye actualizaciones, nuevas funciones y anuncios importantes. Responde en formato JSON con un array de objetos con estas propiedades: title, description, source, date, url, llm, impact (Alto/Medio/Bajo).';
    
    case 'papers':
      return 'Eres un investigador académico experto en IA. Busca papers académicos recientes sobre adopción de IA en PyMEs, ROI de machine learning en pequeñas empresas, y barreras de implementación. Responde en formato JSON con un array de objetos con estas propiedades: title, authors (array), journal, year, citations (número estimado), relevance (Alto/Medio/Bajo), url.';
    
    case 'manuals':
      return 'Eres un experto en documentación técnica de IA. Busca manuales oficiales, guías de implementación y documentación reciente de OpenAI, Anthropic, Google, Microsoft y otras empresas de IA relevantes para PyMEs. Responde en formato JSON con un array de objetos con estas propiedades: title, description, company, pages (número estimado), date, url, type.';
    
    case 'metrics':
      return 'Eres un analista de mercado especializado en IA. Busca métricas actuales sobre adopción de IA en PyMEs, inversión promedio, ROI y tiempo de implementación. Responde en formato JSON con un array de objetos con estas propiedades: name, value, change, trend (up/down), description.';
    
    case 'success-cases':
      return 'Eres un experto en casos de éxito empresariales en Latinoamérica. Busca casos reales de PyMEs y startups que han implementado exitosamente IA en países como México, Colombia, Argentina, Chile, Perú, etc. Incluye nombre de empresa, industria, tecnología usada y resultados obtenidos. Responde en formato JSON con un array de objetos con estas propiedades: title, company, description, industry, country, aiTechnology, results, date, url.';
    
    case 'recommended-tools':
      return 'Eres un experto en herramientas de IA para empresas. Busca las herramientas de inteligencia artificial más nuevas, populares y recomendadas para PyMEs en 2024. Incluye herramientas como ChatGPT, Claude, Notion AI, Perplexity, etc. Responde en formato JSON con un array de objetos con estas propiedades: name, description, category, pricing, features (array), website, popularity (Trending/Stable/New), date.';
    
    default:
      return 'Busca información relevante sobre inteligencia artificial en pequeñas y medianas empresas.';
  }
}

function buildSearchQuery(query: string, type: string): string {
  const baseQuery = query || '';
  
  switch (type) {
    case 'news':
      return `${baseQuery} noticias IA PyMEs startups inteligencia artificial pequeñas empresas 2024`;
    
    case 'llm-news':
      return `${baseQuery} ChatGPT Claude Gemini Copilot Grok DeepSeek Perplexity actualizaciones noticias 2024`;
    
    case 'papers':
      return `${baseQuery} papers académicos "AI adoption SMEs" "machine learning small business" "artificial intelligence implementation" 2024`;
    
    case 'manuals':
      return `${baseQuery} manuales oficiales OpenAI Anthropic Google Microsoft documentación IA implementación empresas`;
    
    case 'metrics':
      return `${baseQuery} métricas adopción IA PyMEs estadísticas inversión ROI inteligencia artificial pequeñas empresas 2024`;
    
    case 'success-cases':
      return `${baseQuery} casos éxito PyMEs IA Latinoamérica México Colombia Argentina empresas implementación inteligencia artificial resultados`;
    
    case 'recommended-tools':
      return `${baseQuery} mejores herramientas IA 2024 empresas ChatGPT Claude Notion AI Perplexity nuevas trending populares`;
    
    default:
      return baseQuery;
  }
}

function processPerplexityResponse(content: string, type: string, maxResults: number): any[] {
  try {
    // Intentar parsear directamente como JSON
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, maxResults);
    }
    return [parsed];
  } catch {
    // Si no es JSON válido, procesar como texto y crear estructura básica
    const lines = content.split('\n').filter(line => line.trim());
    const results = [];
    
    for (let i = 0; i < Math.min(lines.length, maxResults); i++) {
      const line = lines[i].trim();
      if (line) {
        results.push(createFallbackItem(line, type));
      }
    }
    
    return results.length > 0 ? results : [createFallbackItem(content, type)];
  }
}

function createFallbackItem(content: string, type: string): any {
  const base = {
    title: content.substring(0, 100),
    description: content,
    date: new Date().toISOString().split('T')[0],
    url: '#'
  };
  
  switch (type) {
    case 'news':
      return { ...base, source: 'Perplexity Search', impact: 'Medio' };
    
    case 'llm-news':
      return { ...base, source: 'Perplexity Search', llm: 'General', impact: 'Medio' };
    
    case 'papers':
      return { ...base, authors: ['Various'], journal: 'Research', year: '2024', citations: 0, relevance: 'Medio' };
    
    case 'manuals':
      return { ...base, company: 'General', pages: 0, type: 'Documentation' };
    
    case 'metrics':
      return { name: base.title, value: 'N/A', change: '+0%', trend: 'up', description: base.description };
    
    case 'success-cases':
      return { 
        ...base, 
        company: 'Empresa', 
        industry: 'General', 
        country: 'Latinoamérica', 
        aiTechnology: 'IA General', 
        results: 'Resultados positivos' 
      };
    
    case 'recommended-tools':
      return { 
        name: base.title, 
        description: base.description, 
        category: 'General', 
        pricing: 'Consultar', 
        features: ['Funcionalidad IA'], 
        website: '#', 
        popularity: 'Stable', 
        date: base.date 
      };
    
    default:
      return base;
  }
}
