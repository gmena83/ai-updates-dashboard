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
    'sections.news.desc': 'Desarrollos empresariales, legales, médicos y sociales de IA\nde fuentes creíbles y verificadas',
    'sections.metrics': 'Métricas Claves',
    'sections.metrics.desc': 'Insights estadísticos de reportes académicos y consultoras Big 5\nsobre el impacto de la IA en PyMEs',
    'sections.reports': 'Reportes en Profundidad',
    'sections.reports.desc': 'Estudios comprehensivos por consultoras líderes\ne instituciones gubernamentales',
    'sections.papers': 'Papers Académicos y Científicos',
    'sections.papers.desc': 'Investigación revisada por pares sobre implicaciones\nsocietales y empresariales de la IA',
    'sections.llmNews': 'Noticias sobre LLMs',
    'sections.llmNews.desc': 'Últimos anuncios oficiales de ChatGPT, Claude,\nDeepSeek, Gemini y Perplexity',
    'sections.manuals': 'Manuales Oficiales',
    'sections.manuals.desc': 'Guías paso a paso y tutoriales publicados\npor compañías desarrolladoras de LLMs',
    
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
    'footer.perplexity': 'Toda la investigación se realiza mediante una integración con la API de Perplexity'
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
    'sections.news.desc': 'Business, legal, medical, and social AI developments\nfrom credible and verified sources',
    'sections.metrics': 'Key Metrics',
    'sections.metrics.desc': 'Statistical insights from academic reports and Big 5 consulting\nfirms on AI\'s SME impact',
    'sections.reports': 'In-Depth Reports',
    'sections.reports.desc': 'Comprehensive studies by leading consulting companies\nand government institutions',
    'sections.papers': 'Academic & Scientific Papers',
    'sections.papers.desc': 'Peer-reviewed research on AI\'s societal\nand business implications',
    'sections.llmNews': 'LLM News',
    'sections.llmNews.desc': 'Latest official announcements from ChatGPT, Claude,\nDeepSeek, Gemini, and Perplexity',
    'sections.manuals': 'Official Manuals',
    'sections.manuals.desc': 'Step-by-step guides and tutorials published\nby LLM companies',
    
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
    'footer.perplexity': 'All research is conducted through an integration with the Perplexity API'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};