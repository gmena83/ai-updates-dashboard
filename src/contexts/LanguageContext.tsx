import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Header
    'dashboard.title': 'AI Impact Dashboard',
    'header.config': 'Configurar',
    'header.update': 'Actualizar',
    'header.updating': 'Actualizando...',
    'header.saving': 'Guardando...',
    
    // Sections
    'sections.news': 'Noticias Recientes sobre IA',
    'sections.news.desc': 'Desarrollos empresariales, legales, médicos y sociales de IA de fuentes creíbles y verificadas',
    'sections.metrics': 'Métricas Claves',
    'sections.metrics.desc': 'Insights estadísticos de reportes académicos y consultoras Big 5 sobre el impacto de la IA en PyMEs',
    'sections.reports': 'Reportes en Profundidad',
    'sections.reports.desc': 'Estudios comprehensivos por consultoras líderes e instituciones gubernamentales',
    'sections.papers': 'Papers Académicos y Científicos',
    'sections.papers.desc': 'Investigación revisada por pares sobre implicaciones societales y empresariales de la IA',
    'sections.papers.title': 'Papers y Estudios',
    'sections.reports.title': 'Reportes Destacados',
    'sections.llmNews': 'Noticias sobre LLMs',
    'sections.llmNews.desc': 'Últimos anuncios oficiales de ChatGPT, Claude, DeepSeek, Gemini y Perplexity',
    'sections.manuals': 'Manuales Oficiales',
    'sections.manuals.desc': 'Guías paso a paso y tutoriales publicados por compañías desarrolladoras de LLMs',
    
    // Update Info
    'update.lastUpdate': 'Última actualización',
    'update.sheetsConnected': 'Google Sheets conectado',
    'update.systemActive': 'Sistema activo',
    
    // Common
    'common.back': 'Volver al Dashboard',
    'common.sources': 'Fuentes monitoreadas',
    'common.login': 'Iniciar Sesión',
    'common.email': 'Correo electrónico',
    'common.password': 'Contraseña',
    'common.enter': 'Entrar',
    'common.cancel': 'Cancelar',
    
    // Footer
    'footer.created': 'Dashboard creado por',
    'footer.perplexity': 'Toda la investigación se realiza mediante una integración con la API de Perplexity',
    
    // Impact levels
    'impact.high': 'Alto',
    'impact.medium': 'Medio', 
    'impact.low': 'Bajo',
    'impact.label': 'Impacto',
    
    // Demo messages
    'demo.title': 'Datos de demostración:',
    'demo.news': 'Configura Perplexity para obtener noticias en tiempo real',
    'demo.metrics': 'Configura Perplexity para obtener métricas en tiempo real',
    'demo.llm': 'Configura Perplexity para obtener actualizaciones en tiempo real',
    'demo.papers': 'Configura Perplexity para obtener papers en tiempo real',
    'demo.reports': 'Configura Perplexity para obtener reportes en tiempo real',
    'demo.manuals': 'Configura Perplexity para obtener manuales en tiempo real',
    
    // Source monitoring
    'sources.consulting': 'Fuentes monitoreadas:',
    'sources.llms': 'LLMs monitoreados:',
    'sources.academic': 'Fuentes académicas monitoreadas:',
    'sources.companies': 'Compañías monitoreadas:',
    
    // Common terms
    'common.citations': 'citas',
    'common.pages': 'páginas',
    
    // Dynamic descriptions
    'desc.papers.realtime': 'Estudios académicos en tiempo real de Perplexity AI',
    'desc.papers.default': 'Investigación científica y académica relevante',
    'desc.reports.realtime': 'Informes comerciales en tiempo real de Perplexity AI',
    'desc.reports.default': 'Análisis e informes especializados'
  },
  en: {
    // Header
    'dashboard.title': 'AI Impact Dashboard',
    'header.config': 'Configure',
    'header.update': 'Update',
    'header.updating': 'Updating...',
    'header.saving': 'Saving...',
    
    // Sections
    'sections.news': 'Recent AI News',
    'sections.news.desc': 'Business, legal, medical, and social AI developments from credible and verified sources',
    'sections.metrics': 'Key Metrics',
    'sections.metrics.desc': 'Statistical insights from academic reports and Big 5 consulting firms on AI\'s SME impact',
    'sections.reports': 'In-Depth Reports',
    'sections.reports.desc': 'Comprehensive studies by leading consulting companies and government institutions',
    'sections.papers': 'Academic & Scientific Papers',
    'sections.papers.desc': 'Peer-reviewed research on AI\'s societal and business implications',
    'sections.papers.title': 'Papers & Studies',
    'sections.reports.title': 'Featured Reports',
    'sections.llmNews': 'LLM News',
    'sections.llmNews.desc': 'Latest official announcements from ChatGPT, Claude, DeepSeek, Gemini, and Perplexity',
    'sections.manuals': 'Official Manuals',
    'sections.manuals.desc': 'Step-by-step guides and tutorials published by LLM companies',
    
    // Update Info
    'update.lastUpdate': 'Last update',
    'update.sheetsConnected': 'Google Sheets connected',
    'update.systemActive': 'System active',
    
    // Common
    'common.back': 'Back to Dashboard',
    'common.sources': 'Monitored sources',
    'common.login': 'Login',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.enter': 'Enter',
    'common.cancel': 'Cancel',
    
    // Footer
    'footer.created': 'Dashboard created by',
    'footer.perplexity': 'All research is conducted through an integration with the Perplexity API',
    
    // Impact levels
    'impact.high': 'High',
    'impact.medium': 'Medium', 
    'impact.low': 'Low',
    'impact.label': 'Impact',
    
    // Demo messages
    'demo.title': 'Demo data:',
    'demo.news': 'Configure Perplexity to get real-time news',
    'demo.metrics': 'Configure Perplexity to get real-time metrics',
    'demo.llm': 'Configure Perplexity to get real-time updates',
    'demo.papers': 'Configure Perplexity to get real-time papers',
    'demo.reports': 'Configure Perplexity to get real-time reports',
    'demo.manuals': 'Configure Perplexity to get real-time manuals',
    
    // Source monitoring
    'sources.consulting': 'Monitored sources:',
    'sources.llms': 'Monitored LLMs:',
    'sources.academic': 'Monitored academic sources:',
    'sources.companies': 'Monitored companies:',
    
    // Common terms
    'common.citations': 'citations',
    'common.pages': 'pages',
    
    // Dynamic descriptions
    'desc.papers.realtime': 'Real-time academic studies from Perplexity AI',
    'desc.papers.default': 'Relevant scientific and academic research',
    'desc.reports.realtime': 'Real-time business reports from Perplexity AI',
    'desc.reports.default': 'Specialized analysis and reports'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    const key_typed = key as keyof typeof currentTranslations;
    return currentTranslations[key_typed] || key;
  };

  const contextValue = React.useMemo(() => ({
    language,
    toggleLanguage,
    t
  }), [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};