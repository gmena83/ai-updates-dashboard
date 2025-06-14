
import { SheetData } from './googleSheetsService';

export const generateMockData = (): SheetData[] => {
  const currentTime = new Date().toISOString();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return [
    // Noticias PyMEs (todas las mostradas en NewsSection)
    {
      timestamp: currentTime,
      type: 'Noticia',
      title: 'OpenAI lanza nueva herramienta para PyMEs',
      description: 'Una solución de IA accesible que promete reducir costos operativos en un 30%',
      source: 'TechCrunch',
      impact: 'Alto',
      url: 'https://techcrunch.com/ai-pymes'
    },
    {
      timestamp: currentTime,
      type: 'Noticia',
      title: 'Estudio revela adopción de IA en startups',
      description: 'El 67% de las startups implementaron alguna forma de IA en 2024',
      source: 'MIT Technology Review',
      impact: 'Medio',
      url: 'https://technologyreview.com/ai-startups'
    },
    {
      timestamp: currentTime,
      type: 'Noticia',
      title: 'Nuevas regulaciones de IA para pequeñas empresas',
      description: 'Marco regulatorio simplificado para facilitar la adopción',
      source: 'Forbes',
      impact: 'Alto',
      url: 'https://forbes.com/ai-regulations-sme'
    },
    
    // Métricas (todas las mostradas en MetricsSection)
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'Adopción de IA en PyMEs',
      description: '45% de adopción con incremento del 12% vs trimestre anterior',
      source: 'Dashboard Interno',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'Inversión promedio en IA',
      description: '$15,400 por empresa en 2024, incremento del 8%',
      source: 'Dashboard Interno',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'ROI promedio IA',
      description: '230% retorno de inversión, incremento del 18%',
      source: 'Dashboard Interno',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'Tiempo de implementación',
      description: '3.2 meses promedio, reducción del 15%',
      source: 'Dashboard Interno',
      impact: 'Alto',
      url: '#'
    },
    
    // Reportes (todos los mostrados en ReportsSection)
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Estado de IA en PyMEs 2024',
      description: 'Análisis completo de adopción y tendencias - 45 páginas',
      source: 'Reporte Industria',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Casos de Éxito: Startups IA',
      description: '10 casos de estudio detallados - 32 páginas',
      source: 'Casos de Estudio',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Predicciones IA 2025',
      description: 'Tendencias y oportunidades futuras - 28 páginas',
      source: 'Predicción',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Guía Implementación IA',
      description: 'Manual práctico para PyMEs - 56 páginas',
      source: 'Guía',
      impact: 'Alto',
      url: '#'
    },
    
    // Papers (todos los mostrados en PapersSection)
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'AI Adoption in SMEs: A Comprehensive Analysis',
      description: 'Investigación académica con 127 citas - Journal of Business Technology',
      source: 'Journal of Business Technology',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'Machine Learning ROI in Small Business Environments',
      description: 'Investigación con 89 citas - AI Business Review',
      source: 'AI Business Review',
      impact: 'Alto',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'Barriers to AI Implementation in Startups',
      description: 'Estudio con 156 citas - Entrepreneurship & Technology',
      source: 'Entrepreneurship & Technology',
      impact: 'Medio',
      url: '#'
    },
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'Cost-Effective AI Solutions for SMEs',
      description: 'Investigación con 73 citas - Small Business Innovation',
      source: 'Small Business Innovation',
      impact: 'Alto',
      url: '#'
    },
    
    // Noticias LLMs
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'OpenAI anuncia GPT-5 con capacidades multimodales',
      description: 'Nueva versión promete mejor razonamiento y comprensión contextual',
      source: 'OpenAI Blog',
      impact: 'Alto',
      url: 'https://openai.com/blog/gpt-5-announcement'
    },
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'Anthropic mejora Claude con nuevas funciones de código',
      description: 'Claude 3.5 incluye herramientas especializadas para programación',
      source: 'Anthropic',
      impact: 'Alto',
      url: 'https://anthropic.com/claude-coding'
    },
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'Google lanza Gemini Ultra para empresas',
      description: 'Versión empresarial con mayor capacidad y seguridad',
      source: 'Google AI',
      impact: 'Alto',
      url: 'https://ai.google/gemini-ultra'
    },
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'DeepSeek alcanza nuevo benchmark en matemáticas',
      description: 'Supera a modelos occidentales en resolución de problemas complejos',
      source: 'DeepSeek AI',
      impact: 'Medio',
      url: 'https://deepseek.com/math-benchmark'
    },
    
    // Manuales oficiales
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'OpenAI API Reference Guide v2.0',
      description: 'Guía completa para desarrolladores - 120 páginas',
      source: 'OpenAI',
      impact: 'Alto',
      url: 'https://platform.openai.com/docs'
    },
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'Claude Enterprise Implementation Guide',
      description: 'Manual de implementación empresarial - 85 páginas',
      source: 'Anthropic',
      impact: 'Alto',
      url: 'https://docs.anthropic.com/enterprise'
    },
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'Google AI Studio Best Practices',
      description: 'Mejores prácticas para desarrollo con Gemini - 67 páginas',
      source: 'Google',
      impact: 'Alto',
      url: 'https://ai.google.dev/docs/best-practices'
    },
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'Microsoft Copilot Integration Manual',
      description: 'Guía de integración para empresas - 94 páginas',
      source: 'Microsoft',
      impact: 'Alto',
      url: 'https://docs.microsoft.com/copilot'
    }
  ];
};
