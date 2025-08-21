
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Calendar, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ManualItem {
  id?: number;
  title: string;
  description: string;
  company: string;
  pages: number;
  date: string;
  url: string;
  type: string;
}

interface OfficialManualsSectionProps {
  data?: ManualItem[];
}

const OfficialManualsSection = ({ data }: OfficialManualsSectionProps) => {
  const { t } = useLanguage();
  
  // Datos mock como fallback
  const fallbackData = [
    {
      id: 1,
      title: "OpenAI API Reference Guide v2.0",
      description: "Guía completa para desarrolladores con ejemplos y mejores prácticas",
      company: "OpenAI",
      pages: 120,
      date: "2024-06-10",
      url: "https://platform.openai.com/docs",
      type: "API Documentation"
    },
    {
      id: 2,
      title: "Claude Enterprise Implementation Guide",
      description: "Manual de implementación empresarial con casos de uso específicos",
      company: "Anthropic",
      pages: 85,
      date: "2024-06-08",
      url: "https://docs.anthropic.com/enterprise",
      type: "Implementation Guide"
    },
    {
      id: 3,
      title: "Google AI Studio Best Practices",
      description: "Mejores prácticas para desarrollo con Gemini y herramientas de Google AI",
      company: "Google",
      pages: 67,
      date: "2024-06-05",
      url: "https://ai.google.dev/docs/best-practices",
      type: "Best Practices"
    },
    {
      id: 4,
      title: "Microsoft Copilot Integration Manual",
      description: "Guía completa de integración para empresas y desarrolladores",
      company: "Microsoft",
      pages: 94,
      date: "2024-06-01",
      url: "https://docs.microsoft.com/copilot",
      type: "Integration Manual"
    }
  ];

  const manualsData = data && data.length > 0 ? data : fallbackData;
  const isUsingRealData = data && data.length > 0;

  const getCompanyColor = (company: string) => {
    switch(company) {
      case 'OpenAI': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'Anthropic': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case 'Google': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'Microsoft': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800';
      case 'Meta': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'API Documentation': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'Implementation Guide': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'Best Practices': return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800';
      case 'Integration Manual': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {t('sections.manuals')}
        </CardTitle>
        <CardDescription className="text-amber-100">
          {t('sections.manuals.desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {manualsData.map((manual, index) => (
            <div 
              key={manual.id || index} 
              className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(manual.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  {manual.title}
                </h3>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{manual.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getCompanyColor(manual.company)}`}>
                    {manual.company}
                  </Badge>
                  <Badge className={`text-xs ${getTypeColor(manual.type)}`}>
                    {manual.type}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{manual.pages} {t('common.pages')}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {manual.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {isUsingRealData ? (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-100 dark:border-amber-900">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              📚 <strong>{t('sources.companies')}</strong> OpenAI, Anthropic, Google, Microsoft, Meta, xAI
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-100 dark:border-amber-900">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              📡 <strong>{t('demo.title')}</strong> {t('demo.manuals')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfficialManualsSection;
