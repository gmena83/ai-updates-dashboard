
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Zap, ExternalLink } from 'lucide-react';

interface MetricItem {
  id?: number;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
  source?: string;
  url?: string;
}

interface MetricsSectionProps {
  data?: MetricItem[];
}

const MetricsSection = ({ data }: MetricsSectionProps) => {
  // Debug logging
  console.log('MetricsSection - datos recibidos:', data);
  console.log('MetricsSection - cantidad de datos:', data?.length || 0);
  
  const handleMetricClick = (url?: string) => {
    console.log('Metric clicked, URL:', url);
    if (url && url !== '#') {
      console.log('Opening URL:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.log('No valid URL provided');
    }
  };
  
  // Datos mock como fallback con fuentes consultoras
  const fallbackData = [
    {
      id: 1,
      name: "PyMEs que usan IA diariamente",
      value: "34%",
      change: "+15%",
      trend: "up" as const,
      description: "Porcentaje de PyMEs y startups que utilizan IA en operaciones diarias según McKinsey Global Institute",
      source: "McKinsey",
      url: "https://perplexity.ai/search?q=McKinsey+SME+AI+adoption"
    },
    {
      id: 2,
      name: "Incremento de productividad con IA",
      value: "+42%",
      change: "+8%",
      trend: "up" as const,
      description: "Mejora en productividad de empresas que usan IA vs las que no según Deloitte AI Institute",
      source: "Deloitte",
      url: "https://perplexity.ai/search?q=Deloitte+AI+productivity+gains"
    },
    {
      id: 3,
      name: "Horas ahorradas por trabajador/semana",
      value: "6.5 hrs",
      change: "+2.1 hrs",
      trend: "up" as const,
      description: "Tiempo promedio ahorrado por trabajador usando herramientas de IA según PwC Global AI Study",
      source: "PwC",
      url: "https://perplexity.ai/search?q=PwC+AI+time+savings+worker"
    },
    {
      id: 4,
      name: "Gasto mensual promedio en IA",
      value: "$650",
      change: "+23%",
      trend: "up" as const,
      description: "Inversión mensual en servicios, apps y entrenamiento de IA por empresa según BCG AI Report",
      source: "BCG",
      url: "https://perplexity.ai/search?q=BCG+AI+spending+small+business"
    }
  ];

  const metricsData = data && data.length > 0 ? data : fallbackData;
  const isUsingRealData = data && data.length > 0;

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Métricas Clave
          {isUsingRealData && (
            <Badge className="ml-2 bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Perplexity AI
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-blue-100">
          {isUsingRealData 
            ? "Datos en tiempo real de Perplexity AI" 
            : "Indicadores principales del mercado"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {metricsData.map((metric, index) => (
            <div 
              key={metric.id || index} 
              className="border border-gray-100 rounded-lg p-4 hover:bg-blue-50 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => handleMetricClick(metric.url)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                    {metric.name}: <span className="text-blue-600">{metric.value}</span>
                  </h3>
                  {metric.change && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                      metric.trend === 'up' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{metric.change}</span>
                    </div>
                  )}
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
              {metric.source && (
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {metric.source}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {isUsingRealData ? (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              📊 <strong>Fuentes monitoreadas:</strong> McKinsey, Deloitte, PwC, BCG, Accenture
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              📡 <strong>Datos de demostración:</strong> Configura Perplexity para obtener métricas en tiempo real
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsSection;
