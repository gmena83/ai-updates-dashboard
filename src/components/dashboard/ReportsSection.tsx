
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, ExternalLink, Zap } from 'lucide-react';

interface ReportItem {
  id?: number;
  title: string;
  description: string;
  company: string;
  pages: number;
  date: string;
  url: string;
  type: string;
}

interface ReportsSectionProps {
  data?: ReportItem[];
}

const ReportsSection = ({ data }: ReportsSectionProps) => {
  // Datos mock como fallback
  const fallbackData = [
    {
      id: 1,
      title: "Estado de IA en PyMEs 2024",
      description: "Análisis completo de adopción y tendencias",
      company: "McKinsey & Company",
      type: "Informe",
      date: "2024-06-10",
      pages: 45,
      url: "#"
    },
    {
      id: 2,
      title: "Casos de Éxito: Startups IA",
      description: "10 casos de estudio detallados",
      company: "Deloitte",
      type: "Estudio",
      date: "2024-06-08",
      pages: 32,
      url: "#"
    },
    {
      id: 3,
      title: "Predicciones IA 2025",
      description: "Tendencias y oportunidades futuras",
      company: "PwC",
      type: "Reporte",
      date: "2024-06-05",
      pages: 28,
      url: "#"
    },
    {
      id: 4,
      title: "Guía Implementación IA",
      description: "Manual práctico para PyMEs",
      company: "BCG",
      type: "Guía",
      date: "2024-06-01",
      pages: 56,
      url: "#"
    }
  ];

  const reportsData = data && data.length > 0 ? data : fallbackData;
  const isUsingRealData = data && data.length > 0;

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Industria': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Casos de Estudio': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Predicción': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Guía': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Reportes Destacados
          {isUsingRealData && (
            <Badge className="ml-2 bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Perplexity AI
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-emerald-100">
          {isUsingRealData 
            ? "Informes comerciales en tiempo real de Perplexity AI" 
            : "Análisis e informes especializados"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {reportsData.map((report) => (
            <div 
              key={report.id} 
              className="border border-gray-100 rounded-lg p-4 hover:bg-emerald-50 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(report.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {report.title}
                </h3>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getTypeColor(report.type)}`}>
                    {report.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{report.pages} páginas</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {report.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {isUsingRealData ? (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
            <p className="text-sm text-emerald-800">
              🏢 <strong>Fuentes monitoreadas:</strong> McKinsey, Deloitte, PwC, BCG, Accenture, IDC, Gartner
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
            <p className="text-sm text-emerald-800">
              📡 <strong>Datos de demostración:</strong> Configura Perplexity para obtener reportes en tiempo real
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
