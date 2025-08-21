
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LLMNewsItem {
  id?: number;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
  impact: 'Alto' | 'Medio' | 'Bajo';
  llm: string;
}

interface LLMNewsSectionProps {
  data?: LLMNewsItem[];
}

const LLMNewsSection = ({ data }: LLMNewsSectionProps) => {
  const { t } = useLanguage();
  
  // Debug logging
  console.log('LLMNewsSection - datos recibidos:', data);
  console.log('LLMNewsSection - cantidad de datos:', data?.length || 0);
  
  // Datos mock como fallback
  const fallbackData = [
    {
      id: 1,
      title: "OpenAI anuncia GPT-5 con capacidades multimodales",
      description: "Nueva versión promete mejor razonamiento y comprensión contextual",
      source: "OpenAI Blog",
      impact: "Alto" as const,
      date: "2024-06-14",
      url: "https://openai.com/blog/gpt-5-announcement",
      llm: "ChatGPT"
    },
    {
      id: 2,
      title: "Anthropic mejora Claude con nuevas funciones de código",
      description: "Claude 3.5 incluye herramientas especializadas para programación",
      source: "Anthropic",
      impact: "Alto" as const,
      date: "2024-06-13",
      url: "https://anthropic.com/claude-coding",
      llm: "Claude"
    },
    {
      id: 3,
      title: "Google lanza Gemini Ultra para empresas",
      description: "Versión empresarial con mayor capacidad y seguridad",
      source: "Google AI",
      impact: "Alto" as const,
      date: "2024-06-12",
      url: "https://ai.google/gemini-ultra",
      llm: "Gemini"
    },
    {
      id: 4,
      title: "DeepSeek alcanza nuevo benchmark en matemáticas",
      description: "Supera a modelos occidentales en resolución de problemas complejos",
      source: "DeepSeek AI",
      impact: "Medio" as const,
      date: "2024-06-11",
      url: "https://deepseek.com/math-benchmark",
      llm: "DeepSeek"
    }
  ];

  const llmNewsData = data && data.length > 0 ? data : fallbackData;
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

  const getLLMColor = (llm: string) => {
    switch(llm) {
      case 'ChatGPT': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Claude': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Gemini': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'DeepSeek': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Copilot': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'Grok': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'Perplexity': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card">
      <CardHeader className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          {t('sections.llmNews')}
        </CardTitle>
        <CardDescription className="text-red-100">
          {t('sections.llmNews.desc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {llmNewsData.map((news, index) => (
            <div 
              key={news.id || index} 
              className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(news.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                  {news.title}
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{news.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getLLMColor(news.llm)}`}>
                    {news.llm}
                  </Badge>
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
        
        {isUsingRealData ? (
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg border border-red-100 dark:border-red-900">
            <p className="text-sm text-red-800 dark:text-red-300">
              🤖 <strong>{t('sources.llms')}</strong> ChatGPT, Claude, Gemini, Copilot, Grok, DeepSeek, Perplexity
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg border border-red-100 dark:border-red-900">
            <p className="text-sm text-red-800 dark:text-red-300">
              📡 <strong>{t('demo.title')}</strong> {t('demo.llm')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LLMNewsSection;
