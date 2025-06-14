
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

const LLMNewsSection = () => {
  const llmNewsData = [
    {
      id: 1,
      title: "OpenAI anuncia GPT-5 con capacidades multimodales",
      description: "Nueva versión promete mejor razonamiento y comprensión contextual",
      source: "OpenAI Blog",
      impact: "Alto",
      date: "2024-06-14",
      url: "https://openai.com/blog/gpt-5-announcement",
      llm: "ChatGPT"
    },
    {
      id: 2,
      title: "Anthropic mejora Claude con nuevas funciones de código",
      description: "Claude 3.5 incluye herramientas especializadas para programación",
      source: "Anthropic",
      impact: "Alto",
      date: "2024-06-13",
      url: "https://anthropic.com/claude-coding",
      llm: "Claude"
    },
    {
      id: 3,
      title: "Google lanza Gemini Ultra para empresas",
      description: "Versión empresarial con mayor capacidad y seguridad",
      source: "Google AI",
      impact: "Alto",
      date: "2024-06-12",
      url: "https://ai.google/gemini-ultra",
      llm: "Gemini"
    },
    {
      id: 4,
      title: "DeepSeek alcanza nuevo benchmark en matemáticas",
      description: "Supera a modelos occidentales en resolución de problemas complejos",
      source: "DeepSeek AI",
      impact: "Medio",
      date: "2024-06-11",
      url: "https://deepseek.com/math-benchmark",
      llm: "DeepSeek"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'Alto': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bajo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLLMColor = (llm: string) => {
    switch(llm) {
      case 'ChatGPT': return 'bg-green-100 text-green-800';
      case 'Claude': return 'bg-orange-100 text-orange-800';
      case 'Gemini': return 'bg-blue-100 text-blue-800';
      case 'DeepSeek': return 'bg-purple-100 text-purple-800';
      case 'Copilot': return 'bg-indigo-100 text-indigo-800';
      case 'Grok': return 'bg-gray-100 text-gray-800';
      case 'Perplexity': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          Noticias sobre LLMs
        </CardTitle>
        <CardDescription className="text-red-100">
          Últimas actualizaciones de los principales LLMs comerciales
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {llmNewsData.map((news) => (
            <div 
              key={news.id} 
              className="border border-gray-100 rounded-lg p-4 hover:bg-red-50 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(news.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                  {news.title}
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 mb-3">{news.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getLLMColor(news.llm)}`}>
                    {news.llm}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {news.source}
                  </Badge>
                  <Badge className={`text-xs ${getImpactColor(news.impact)}`}>
                    Impacto {news.impact}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {news.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
          <p className="text-sm text-red-800">
            🤖 <strong>LLMs monitoreados:</strong> ChatGPT, Claude, Gemini, Copilot, Grok, DeepSeek, Perplexity
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMNewsSection;
