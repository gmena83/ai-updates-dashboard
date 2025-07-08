import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PerplexityRequest {
  query: string;
  type: 'news' | 'llm-news' | 'papers' | 'manuals' | 'metrics' | 'success-cases' | 'recommended-tools' | 'reports';
  maxResults?: number;
}

serve(async (req) => {
  console.log('=== PERPLEXITY EDGE FUNCTION STARTED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('Function is alive and receiving requests!');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request (CORS preflight)');
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
    console.log('=== API KEY VALIDATION ===');
    console.log('API Key exists:', !!PERPLEXITY_API_KEY);
    console.log('API Key length:', PERPLEXITY_API_KEY?.length || 0);
    console.log('API Key prefix:', PERPLEXITY_API_KEY?.substring(0, 20) || 'none');
    console.log('All env vars:', Object.keys(Deno.env.toObject()));
    
    if (!PERPLEXITY_API_KEY) {
      console.error('CRITICAL: Perplexity API key not found in environment');
      const errorResponse = {
        success: false, 
        error: 'PERPLEXITY_API_KEY not found in Supabase secrets. Please add it in Edge Functions settings.',
        keyStatus: 'missing',
        debug: {
          availableEnvVars: Object.keys(Deno.env.toObject()),
          timestamp: new Date().toISOString()
        }
      };
      console.log('Error response:', errorResponse);
      return new Response(JSON.stringify(errorResponse), { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      });
    }
    
    // Validate API key format
    if (!PERPLEXITY_API_KEY.startsWith('pplx-')) {
      console.error('CRITICAL: Invalid API key format. Expected to start with pplx-');
      const errorResponse = {
        success: false, 
        error: 'Invalid Perplexity API key format. Key should start with "pplx-"',
        keyStatus: 'invalid_format',
        debug: {
          keyPrefix: PERPLEXITY_API_KEY.substring(0, 5),
          timestamp: new Date().toISOString()
        }
      };
      console.log('Error response:', errorResponse);
      return new Response(JSON.stringify(errorResponse), { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      });
    }

    // Construir prompt específico según el tipo
    const systemPrompt = getSystemPrompt(type);
    const searchQuery = buildSearchQuery(query, type);
    
    console.log('Making request to Perplexity API...');
    console.log('Query:', searchQuery);
    console.log('System prompt (first 100 chars):', systemPrompt.substring(0, 100));
    console.log('API URL: https://api.perplexity.ai/chat/completions');
    console.log('Authorization header will use key starting with:', PERPLEXITY_API_KEY.substring(0, 10));

    const perplexityPayload = {
      model: 'llama-3.1-sonar-small-128k-online',
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
    };

    console.log('Perplexity payload:', JSON.stringify(perplexityPayload, null, 2));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(perplexityPayload),
    });

    console.log('Perplexity API response status:', response.status);
    console.log('Perplexity API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Perplexity API error (${response.status}): ${response.statusText}`,
          details: errorText,
          keyStatus: 'present'
        }),
        { 
          status: response.status,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    const data = await response.json();
    console.log('Perplexity API response received:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      hasContent: !!data.choices?.[0]?.message?.content
    });
    
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content received from Perplexity API');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No content received from Perplexity API',
          rawResponse: data
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

    console.log('Raw content from Perplexity (first 500 chars):', content.substring(0, 500));

    // Procesar la respuesta según el tipo
    const processedData = processPerplexityResponse(content, type, maxResults);
    console.log('Processed data:', processedData.length, 'items');

    console.log('=== FINAL RESPONSE ===');
    console.log('Sending response with data:', processedData);
    console.log('Response structure:', { success: true, data: processedData });
    
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
      return 'Eres un experto en inteligencia artificial y PyMEs. Busca y resume las noticias más recientes sobre adopción de IA en pequeñas y medianas empresas y startups. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"title": "título", "description": "descripción", "source": "fuente", "date": "YYYY-MM-DD", "url": "url", "impact": "Alto|Medio|Bajo"}]';
    
    case 'llm-news':
      return 'Eres un experto en modelos de lenguaje grandes (LLMs). Busca y resume las noticias más recientes sobre ChatGPT, Claude, Gemini, Copilot, Grok, DeepSeek y Perplexity. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"title": "título", "description": "descripción", "source": "fuente", "date": "YYYY-MM-DD", "url": "url", "llm": "nombre", "impact": "Alto|Medio|Bajo"}]';
    
    case 'papers':
      return 'Eres un investigador académico experto en IA. Busca papers y estudios académicos recientes sobre adopción de IA en PyMEs, publicados en revistas científicas, universidades y centros de investigación. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"title": "título", "authors": ["autor1", "autor2"], "journal": "revista", "year": "2024", "citations": 100, "relevance": "Alto|Medio|Bajo", "url": "url"}]';
    
    case 'reports':
      return 'Eres un analista de mercado especializado en informes comerciales. Busca reportes e informes recientes sobre IA en PyMEs publicados por consultoras como McKinsey, Deloitte, PWC, BCG, Accenture, IDC, Gartner, y entidades gubernamentales o cámaras de comercio. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"title": "título", "description": "descripción", "company": "consultora", "pages": 45, "date": "YYYY-MM-DD", "url": "url", "type": "Informe|Estudio|Reporte"}]';
    
    case 'manuals':
      return 'Eres un experto en documentación técnica de IA. Busca manuales oficiales, guías de implementación y documentación reciente de OpenAI, Anthropic, Google, Microsoft y otras empresas de IA relevantes para PyMEs. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"title": "título", "description": "descripción", "company": "empresa", "pages": 20, "date": "YYYY-MM-DD", "url": "url", "type": "Manual|Guía|Documentación"}]';
    
    case 'metrics':
      return 'Eres un analista de mercado especializado en IA. Busca métricas actuales sobre adopción de IA en PyMEs, inversión promedio, ROI y tiempo de implementación. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"name": "nombre", "value": "valor", "change": "+5%", "trend": "up|down", "description": "descripción"}]';
    
    case 'success-cases':
      return 'Eres un experto en casos de éxito empresariales en Latinoamérica. Busca casos reales de PyMEs y startups que han implementado exitosamente IA en países como México, Colombia, Argentina, Chile, Perú, etc. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"title": "título", "company": "empresa", "description": "descripción", "industry": "industria", "country": "país", "aiTechnology": "tecnología", "results": "resultados", "date": "YYYY-MM-DD", "url": "url"}]';
    
    case 'recommended-tools':
      return 'Eres un experto en herramientas de IA para empresas. Busca las herramientas de inteligencia artificial más nuevas, populares y recomendadas para PyMEs en 2024. IMPORTANTE: Responde ÚNICAMENTE con un array JSON válido, sin texto adicional. Formato: [{"name": "nombre", "description": "descripción", "category": "categoría", "pricing": "precio", "features": ["feat1", "feat2"], "website": "url", "popularity": "Trending|Stable|New", "date": "YYYY-MM-DD"}]';
    
    default:
      return 'Busca información relevante sobre inteligencia artificial en pequeñas y medianas empresas. Responde en formato JSON.';
  }
}

function buildSearchQuery(query: string, type: string): string {
  const baseQuery = query || '';
  
  switch (type) {
    case 'news':
      return `${baseQuery} noticias IA PyMEs startups inteligencia artificial pequeñas empresas 2024 2025`;
    
    case 'llm-news':
      return `${baseQuery} ChatGPT Claude Gemini Copilot Grok DeepSeek Perplexity actualizaciones noticias 2024 2025`;
    
    case 'papers':
      return `${baseQuery} papers académicos científicos "AI adoption SMEs" "machine learning small business" universidad investigación 2024 2025`;
    
    case 'reports':
      return `${baseQuery} informes reportes McKinsey Deloitte PWC BCG IA PyMEs consultoras estudio mercado 2024 2025`;
    
    case 'manuals':
      return `${baseQuery} manuales oficiales OpenAI Anthropic Google Microsoft documentación IA implementación empresas 2024 2025`;
    
    case 'metrics':
      return `${baseQuery} métricas adopción IA PyMEs estadísticas inversión ROI inteligencia artificial pequeñas empresas 2024 2025`;
    
    case 'success-cases':
      return `${baseQuery} casos éxito PyMEs IA Latinoamérica México Colombia Argentina empresas implementación inteligencia artificial resultados 2024 2025`;
    
    case 'recommended-tools':
      return `${baseQuery} mejores herramientas IA 2024 2025 empresas ChatGPT Claude Notion AI Perplexity nuevas trending populares`;
    
    default:
      return baseQuery;
  }
}

function processPerplexityResponse(content: string, type: string, maxResults: number): any[] {
  console.log('Processing content for type:', type);
  console.log('Content length:', content.length);
  
  try {
    // Limpiar el contenido antes de parsearlo
    let cleanContent = content.trim();
    
    // Remover marcadores de código si existen
    cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    cleanContent = cleanContent.replace(/```\s*/g, '');
    
    // Remover texto adicional antes y después del JSON
    cleanContent = cleanContent.replace(/^[^[\{]*/, '').replace(/[^}\]]*$/, '');
    
    // Buscar el array JSON en el contenido
    const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }
    
    console.log('Clean content to parse (first 200 chars):', cleanContent.substring(0, 200));
    
    // Intentar parsear directamente como JSON
    const parsed = JSON.parse(cleanContent);
    
    if (Array.isArray(parsed)) {
      console.log('Successfully parsed JSON array with', parsed.length, 'items');
      return parsed.slice(0, maxResults);
    } else {
      console.log('Parsed single object, converting to array');
      return [parsed];
    }
    
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.log('Failed content (first 500 chars):', content.substring(0, 500));
    
    // Si el parsing falla, crear datos de fallback basados en el contenido
    return createFallbackData(content, type, maxResults);
  }
}

function createFallbackData(content: string, type: string, maxResults: number): any[] {
  console.log('Creating fallback data for type:', type);
  
  // Dividir el contenido en líneas y crear elementos básicos
  const lines = content.split('\n').filter(line => line.trim() && line.length > 10);
  const results = [];
  
  for (let i = 0; i < Math.min(lines.length, maxResults); i++) {
    const line = lines[i].trim();
    if (line) {
      results.push(createFallbackItem(line, type, i + 1));
    }
  }
  
  // Si no hay suficientes líneas, crear datos mínimos
  if (results.length === 0) {
    for (let i = 0; i < Math.min(3, maxResults); i++) {
      results.push(createFallbackItem(content.substring(0, 100), type, i + 1));
    }
  }
  
  return results;
}

function createFallbackItem(content: string, type: string, index: number): any {
  const base = {
    title: `${type} ${index}: ${content.substring(0, 60)}...`,
    description: content.substring(0, 200),
    date: new Date().toISOString().split('T')[0],
    url: '#'
  };
  
  switch (type) {
    case 'news':
      return { ...base, source: 'Perplexity Search', impact: 'Medio' };
    
    case 'llm-news':
      return { ...base, source: 'Perplexity Search', llm: 'General', impact: 'Medio' };
    
    case 'papers':
      return { ...base, authors: ['Perplexity Research'], journal: 'AI Research', year: '2024', citations: 0, relevance: 'Medio' };
    
    case 'reports':
      return { ...base, company: 'Perplexity Analysis', pages: 25, type: 'Informe' };
    
    case 'manuals':
      return { ...base, company: 'General', pages: 20, type: 'Documentation' };
    
    case 'metrics':
      return { name: base.title, value: 'N/A', change: '+0%', trend: 'up', description: base.description };
    
    case 'success-cases':
      return { 
        ...base, 
        company: 'Empresa Ejemplo', 
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
