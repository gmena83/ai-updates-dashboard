
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsItem {
  id?: number;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
  impact: 'Alto' | 'Medio' | 'Bajo';
}

interface NewsSectionProps {
  data?: NewsItem[];
}

const NewsSection = ({ data }: NewsSectionProps) => {
  const { t } = useLanguage();
  
  // Debug logging
  console.log('NewsSection - datos recibidos:', data);
  console.log('NewsSection - cantidad de datos:', data?.length || 0);
  
  // Datos mock como fallback
  const fallbackData = [
    {
      id: 1,
      title: "OpenAI lanza nueva herramienta para PyMEs",
      description: "Una solución de IA accesible que promete reducir costos operativos en un 30%",
      source: "TechCrunch",
      impact: "Alto" as const,
      date: "2024-06-14",
      url: "https://techcrunch.com/ai-pymes"
    },
    {
      id: 2,
      title: "Estudio revela adopción de IA en startups",
      description: "El 67% de las startups implementaron alguna forma de IA en 2024",
      source: "MIT Technology Review",
      impact: "Medio" as const,
      date: "2024-06-13",
      url: "https://technologyreview.com/ai-startups"
    },
    {
      id: 3,
      title: "Nuevas regulaciones de IA para pequeñas empresas",
      description: "Marco regulatorio simplificado para facilitar la adopción",
      source: "Forbes",
      impact: "Alto" as const,
      date: "2024-06-12",
      url: "https://forbes.com/ai-regulations-sme"
    }
  ];

  const newsData = data && data.length > 0 ? data : fallbackData;
  const isUsingRealData = data && data.length > 0;

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'Alto': 
      case 'High': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'Medio': 
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'Bajo': 
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          {t('sections.news')}
        </CardTitle>
        <CardDescription className="text-orange-100">
          {t('sections.news.desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {newsData.map((news, index) => (
            <div 
              key={news.id || index} 
              className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(news.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                  {news.title}
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{news.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {news.source}
                  </Badge>
                  <Badge className={`text-xs ${getImpactColor(news.impact)}`}>
                    {t('impact.label')} {t(`impact.${news.impact.toLowerCase()}`)}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {news.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!isUsingRealData && (
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg border border-orange-100 dark:border-orange-900">
            <p className="text-sm text-orange-800 dark:text-orange-300">
              📡 <strong>{t('demo.title')}</strong> {t('demo.news')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
