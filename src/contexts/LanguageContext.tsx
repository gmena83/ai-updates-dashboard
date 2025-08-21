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
    'sections.metrics': 'Métricas Claves',
    'sections.reports': 'Reportes en Profundidad',
    'sections.papers': 'Papers Académicos y Científicos',
    'sections.llmNews': 'Noticias sobre LLMs',
    'sections.manuals': 'Manuales Oficiales',
    
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
    'sections.metrics': 'Key Metrics',
    'sections.reports': 'In-Depth Reports',
    'sections.papers': 'Academic & Scientific Papers',
    'sections.llmNews': 'LLM News',
    'sections.manuals': 'Official Manuals',
    
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