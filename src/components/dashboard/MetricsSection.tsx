
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
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
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
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
        <div className="grid grid-cols-1 gap-4">
          {metricsData.map((metric, index) => (
            <div 
              key={metric.id || index} 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary"
              onClick={() => handleMetricClick(metric.url)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {metric.name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-primary">{metric.value}</span>
                    {metric.change && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        metric.trend === 'up' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
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
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {metric.description}
              </p>
              {metric.source && (
                <div className="flex items-center gap-2 pt-3 border-t border-blue-200">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {metric.source}
                  </span>
                  <span className="text-xs text-gray-600">
                    Haz clic para ver el reporte completo
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Tendencia General
          </h4>
          <p className="text-sm text-blue-800">
            {isUsingRealData 
              ? "Métricas actualizadas en tiempo real desde diversas fuentes de la industria."
              : "El mercado muestra un crecimiento sostenido con mejoras en eficiencia y reducción de barreras de entrada para PyMEs."
            }
          </p>
        </div>
        
        {!isUsingRealData && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
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
