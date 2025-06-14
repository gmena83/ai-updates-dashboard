
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, ExternalLink, MapPin, Building, Zap } from 'lucide-react';

interface SuccessCaseItem {
  id?: number;
  title: string;
  company: string;
  description: string;
  industry: string;
  country: string;
  aiTechnology: string;
  results: string;
  date: string;
  url: string;
}

interface SuccessCasesSectionProps {
  data?: SuccessCaseItem[];
}

const SuccessCasesSection = ({ data }: SuccessCasesSectionProps) => {
  // Datos mock como fallback
  const fallbackData = [
    {
      id: 1,
      title: "Aumentó ventas 40% con chatbot inteligente",
      company: "TechnoModa",
      description: "PyME textil implementó chatbot con IA para atención al cliente 24/7",
      industry: "E-commerce",
      country: "México",
      aiTechnology: "Chatbot IA",
      results: "40% incremento en ventas, 60% reducción en tiempo de respuesta",
      date: "2024-05-15",
      url: "#"
    },
    {
      id: 2,
      title: "Optimización de inventario con machine learning",
      company: "FarmaCentral",
      description: "Cadena de farmacias redujo desperdicios usando predicción de demanda",
      industry: "Farmacéutico",
      country: "Colombia",
      aiTechnology: "Machine Learning",
      results: "25% reducción en desperdicios, 15% ahorro en costos",
      date: "2024-04-20",
      url: "#"
    },
    {
      id: 3,
      title: "Análisis predictivo para agricultura inteligente",
      company: "AgroTech Solutions",
      description: "Startup agrícola mejoró rendimiento de cultivos con IoT e IA",
      industry: "Agricultura",
      country: "Argentina",
      aiTechnology: "IoT + IA",
      results: "30% aumento en productividad, 20% ahorro en agua",
      date: "2024-03-10",
      url: "#"
    }
  ];

  const successCasesData = data && data.length > 0 ? data : fallbackData;
  const isUsingRealData = data && data.length > 0;

  const getIndustryColor = (industry: string) => {
    switch(industry) {
      case 'E-commerce': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Farmacéutico': return 'bg-green-100 text-green-800 border-green-200';
      case 'Agricultura': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Fintech': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Logística': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Casos de Éxito
          {isUsingRealData && (
            <Badge className="ml-2 bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Perplexity AI
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-emerald-100">
          {isUsingRealData 
            ? "Datos en tiempo real de Perplexity AI" 
            : "PyMEs exitosas con IA en Latinoamérica"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {successCasesData.map((successCase, index) => (
            <div 
              key={successCase.id || index} 
              className="border border-gray-100 rounded-lg p-4 hover:bg-emerald-50 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(successCase.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {successCase.title}
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">{successCase.company}</span>
                <Badge className={`text-xs ${getIndustryColor(successCase.industry)}`}>
                  {successCase.industry}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{successCase.description}</p>
              
              <div className="bg-emerald-50 rounded-lg p-3 mb-3">
                <h4 className="font-medium text-emerald-800 text-xs mb-1">Resultados:</h4>
                <p className="text-sm text-emerald-700">{successCase.results}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {successCase.aiTechnology}
                  </Badge>
                  <span className="flex items-center text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {successCase.country}
                  </span>
                </div>
                <span className="text-gray-500">{successCase.date}</span>
              </div>
            </div>
          ))}
        </div>
        
        {!isUsingRealData && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
            <p className="text-sm text-emerald-800">
              📡 <strong>Datos de demostración:</strong> Configura Perplexity para obtener casos reales
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuccessCasesSection;
