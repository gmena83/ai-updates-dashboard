
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';

const MetricsSection = () => {
  const metricsData = [
    {
      id: 1,
      name: "Adopción de IA en PyMEs",
      value: "45%",
      change: "+12%",
      trend: "up",
      description: "Incremento vs trimestre anterior"
    },
    {
      id: 2,
      name: "Inversión promedio en IA",
      value: "$15,400",
      change: "+8%",
      trend: "up",
      description: "Por empresa en 2024"
    },
    {
      id: 3,
      name: "ROI promedio IA",
      value: "230%",
      change: "+18%",
      trend: "up",
      description: "Retorno de inversión"
    },
    {
      id: 4,
      name: "Tiempo de implementación",
      value: "3.2 meses",
      change: "-15%",
      trend: "down",
      description: "Reducción en tiempo promedio"
    }
  ];

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Métricas Clave
        </CardTitle>
        <CardDescription className="text-blue-100">
          Indicadores principales del mercado
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metricsData.map((metric) => (
            <div key={metric.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm">{metric.name}</h3>
                <div className={`flex items-center text-xs font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              </div>
              <p className="text-xs text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Tendencia General
          </h4>
          <p className="text-sm text-blue-800">
            El mercado muestra un crecimiento sostenido con mejoras en eficiencia y reducción de barreras de entrada para PyMEs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsSection;
