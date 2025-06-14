
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, ExternalLink, Star, DollarSign, Zap } from 'lucide-react';

interface RecommendedToolItem {
  id?: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  features: string[];
  website: string;
  popularity: 'Trending' | 'Stable' | 'New';
  date: string;
}

interface RecommendedToolsSectionProps {
  data?: RecommendedToolItem[];
}

const RecommendedToolsSection = ({ data }: RecommendedToolsSectionProps) => {
  // Datos mock como fallback
  const fallbackData = [
    {
      id: 1,
      name: "Claude for Business",
      description: "Asistente de IA conversacional optimizado para tareas empresariales",
      category: "Asistente Virtual",
      pricing: "Desde $20/mes",
      features: ["Análisis de documentos", "Generación de código", "Escritura empresarial"],
      website: "https://claude.ai",
      popularity: "Trending" as const,
      date: "2024-06-01"
    },
    {
      id: 2,
      name: "Notion AI",
      description: "IA integrada en workspace para automatizar documentación y procesos",
      category: "Productividad",
      pricing: "Desde $10/mes",
      features: ["Autocompletado", "Resúmenes", "Traducción automática"],
      website: "https://notion.so",
      popularity: "Stable" as const,
      date: "2024-05-15"
    },
    {
      id: 3,
      name: "Perplexity Pro",
      description: "Motor de búsqueda con IA para investigación empresarial avanzada",
      category: "Investigación",
      pricing: "Desde $20/mes",
      features: ["Búsqueda avanzada", "Fuentes verificadas", "API disponible"],
      website: "https://perplexity.ai",
      popularity: "New" as const,
      date: "2024-06-10"
    }
  ];

  const toolsData = data && data.length > 0 ? data : fallbackData;
  const isUsingRealData = data && data.length > 0;

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Asistente Virtual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Productividad': return 'bg-green-100 text-green-800 border-green-200';
      case 'Investigación': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Diseño': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Marketing': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPopularityColor = (popularity: string) => {
    switch(popularity) {
      case 'Trending': return 'bg-red-100 text-red-800 border-red-200';
      case 'New': return 'bg-green-100 text-green-800 border-green-200';
      case 'Stable': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Wrench className="h-5 w-5 mr-2" />
          Herramientas Recomendadas
          {isUsingRealData && (
            <Badge className="ml-2 bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Perplexity AI
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-violet-100">
          {isUsingRealData 
            ? "Datos en tiempo real de Perplexity AI" 
            : "Las herramientas de IA más populares del momento"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {toolsData.map((tool, index) => (
            <div 
              key={tool.id || index} 
              className="border border-gray-100 rounded-lg p-4 hover:bg-violet-50 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(tool.website, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                  {tool.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-gray-400 group-hover:text-violet-500 transition-colors" />
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-violet-500 transition-colors" />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {tool.features.slice(0, 3).map((feature, featureIndex) => (
                  <Badge key={featureIndex} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getCategoryColor(tool.category)}`}>
                    {tool.category}
                  </Badge>
                  <Badge className={`text-xs ${getPopularityColor(tool.popularity)}`}>
                    {tool.popularity}
                  </Badge>
                  <span className="flex items-center text-xs text-gray-600">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {tool.pricing}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{tool.date}</span>
              </div>
            </div>
          ))}
        </div>
        
        {!isUsingRealData && (
          <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
            <p className="text-sm text-violet-800">
              📡 <strong>Datos de demostración:</strong> Configura Perplexity para obtener herramientas actuales
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedToolsSection;
