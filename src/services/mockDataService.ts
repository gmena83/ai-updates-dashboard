
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
      date: new Date().toISOString().split('T')[0],
      url: 'https://techcrunch.com/ai-pymes',
      metadata: JSON.stringify({ category: 'tools', target: 'SME' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Noticia',
      title: 'Estudio revela adopción de IA en startups',
      description: 'El 67% de las startups implementaron alguna forma de IA en 2024',
      source: 'MIT Technology Review',
      date: new Date().toISOString().split('T')[0],
      url: 'https://technologyreview.com/ai-startups',
      metadata: JSON.stringify({ study: true, percentage: 67 }),
      impact: 'Medio'
    },
    {
      timestamp: currentTime,
      type: 'Noticia',
      title: 'Nuevas regulaciones de IA para pequeñas empresas',
      description: 'Marco regulatorio simplificado para facilitar la adopción',
      source: 'Forbes',
      date: new Date().toISOString().split('T')[0],
      url: 'https://forbes.com/ai-regulations-sme',
      metadata: JSON.stringify({ regulations: true, simplified: true }),
      impact: 'Alto'
    },
    
    // Métricas (todas las mostradas en MetricsSection)
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'Adopción de IA en PyMEs',
      description: '45% de adopción con incremento del 12% vs trimestre anterior',
      source: 'Dashboard Interno',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ value: '45%', change: '+12%', period: 'trimestre' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'Inversión promedio en IA',
      description: '$15,400 por empresa en 2024, incremento del 8%',
      source: 'Dashboard Interno',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ value: '$15,400', change: '+8%', year: 2024 }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'ROI promedio IA',
      description: '230% retorno de inversión, incremento del 18%',
      source: 'Dashboard Interno',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ value: '230%', change: '+18%', metric: 'ROI' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Métrica',
      title: 'Tiempo de implementación',
      description: '3.2 meses promedio, reducción del 15%',
      source: 'Dashboard Interno',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ value: '3.2 meses', change: '-15%', metric: 'tiempo' }),
      impact: 'Alto'
    },
    
    // Reportes (todos los mostrados en ReportsSection)
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Estado de IA en PyMEs 2024',
      description: 'Análisis completo de adopción y tendencias - 45 páginas',
      source: 'Reporte Industria',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ pages: 45, year: 2024, type: 'analysis' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Casos de Éxito: Startups IA',
      description: '10 casos de estudio detallados - 32 páginas',
      source: 'Casos de Estudio',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ pages: 32, cases: 10, type: 'case-study' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Predicciones IA 2025',
      description: 'Tendencias y oportunidades futuras - 28 páginas',
      source: 'Predicción',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ pages: 28, year: 2025, type: 'prediction' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Reporte',
      title: 'Guía Implementación IA',
      description: 'Manual práctico para PyMEs - 56 páginas',
      source: 'Guía',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      metadata: JSON.stringify({ pages: 56, type: 'guide', target: 'SME' }),
      impact: 'Alto'
    },
    
    // Papers (todos los mostrados en PapersSection)
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'AI Adoption in SMEs: A Comprehensive Analysis',
      description: 'Investigación académica con 127 citas - Journal of Business Technology',
      source: 'Journal of Business Technology',
      date: '2024',
      url: '#',
      metadata: JSON.stringify({ citations: 127, type: 'academic', topic: 'AI adoption' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'Machine Learning ROI in Small Business Environments',
      description: 'Investigación con 89 citas - AI Business Review',
      source: 'AI Business Review',
      date: '2024',
      url: '#',
      metadata: JSON.stringify({ citations: 89, type: 'academic', topic: 'ML ROI' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'Barriers to AI Implementation in Startups',
      description: 'Estudio con 156 citas - Entrepreneurship & Technology',
      source: 'Entrepreneurship & Technology',
      date: '2024',
      url: '#',
      metadata: JSON.stringify({ citations: 156, type: 'academic', topic: 'barriers' }),
      impact: 'Medio'
    },
    {
      timestamp: currentTime,
      type: 'Paper',
      title: 'Cost-Effective AI Solutions for SMEs',
      description: 'Investigación con 73 citas - Small Business Innovation',
      source: 'Small Business Innovation',
      date: '2024',
      url: '#',
      metadata: JSON.stringify({ citations: 73, type: 'academic', topic: 'cost-effective' }),
      impact: 'Alto'
    },
    
    // Noticias LLMs
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'OpenAI anuncia GPT-5 con capacidades multimodales',
      description: 'Nueva versión promete mejor razonamiento y comprensión contextual',
      source: 'OpenAI Blog',
      date: new Date().toISOString().split('T')[0],
      url: 'https://openai.com/blog/gpt-5-announcement',
      metadata: JSON.stringify({ llm: 'GPT-5', company: 'OpenAI', feature: 'multimodal' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'Anthropic mejora Claude con nuevas funciones de código',
      description: 'Claude 3.5 incluye herramientas especializadas para programación',
      source: 'Anthropic',
      date: new Date().toISOString().split('T')[0],
      url: 'https://anthropic.com/claude-coding',
      metadata: JSON.stringify({ llm: 'Claude 3.5', company: 'Anthropic', feature: 'coding' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'Google lanza Gemini Ultra para empresas',
      description: 'Versión empresarial con mayor capacidad y seguridad',
      source: 'Google AI',
      date: new Date().toISOString().split('T')[0],
      url: 'https://ai.google/gemini-ultra',
      metadata: JSON.stringify({ llm: 'Gemini Ultra', company: 'Google', target: 'enterprise' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Noticia LLM',
      title: 'DeepSeek alcanza nuevo benchmark en matemáticas',
      description: 'Supera a modelos occidentales en resolución de problemas complejos',
      source: 'DeepSeek AI',
      date: new Date().toISOString().split('T')[0],
      url: 'https://deepseek.com/math-benchmark',
      metadata: JSON.stringify({ llm: 'DeepSeek', achievement: 'math benchmark', region: 'China' }),
      impact: 'Medio'
    },
    
    // Manuales oficiales
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'OpenAI API Reference Guide v2.0',
      description: 'Guía completa para desarrolladores - 120 páginas',
      source: 'OpenAI',
      date: new Date().toISOString().split('T')[0],
      url: 'https://platform.openai.com/docs',
      metadata: JSON.stringify({ pages: 120, version: '2.0', type: 'API guide' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'Claude Enterprise Implementation Guide',
      description: 'Manual de implementación empresarial - 85 páginas',
      source: 'Anthropic',
      date: new Date().toISOString().split('T')[0],
      url: 'https://docs.anthropic.com/enterprise',
      metadata: JSON.stringify({ pages: 85, target: 'enterprise', type: 'implementation' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'Google AI Studio Best Practices',
      description: 'Mejores prácticas para desarrollo con Gemini - 67 páginas',
      source: 'Google',
      date: new Date().toISOString().split('T')[0],
      url: 'https://ai.google.dev/docs/best-practices',
      metadata: JSON.stringify({ pages: 67, platform: 'AI Studio', type: 'best practices' }),
      impact: 'Alto'
    },
    {
      timestamp: currentTime,
      type: 'Manual Oficial',
      title: 'Microsoft Copilot Integration Manual',
      description: 'Guía de integración para empresas - 94 páginas',
      source: 'Microsoft',
      date: new Date().toISOString().split('T')[0],
      url: 'https://docs.microsoft.com/copilot',
      metadata: JSON.stringify({ pages: 94, product: 'Copilot', type: 'integration' }),
      impact: 'Alto'
    }
  ];
};
