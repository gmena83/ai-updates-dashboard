
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar } from 'lucide-react';

const ReportsSection = () => {
  const reportsData = [
    {
      id: 1,
      title: "Estado de IA en PyMEs 2024",
      description: "Análisis completo de adopción y tendencias",
      type: "Industria",
      date: "2024-06-10",
      pages: 45,
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Casos de Éxito: Startups IA",
      description: "10 casos de estudio detallados",
      type: "Casos de Estudio",
      date: "2024-06-08",
      pages: 32,
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Predicciones IA 2025",
      description: "Tendencias y oportunidades futuras",
      type: "Predicción",
      date: "2024-06-05",
      pages: 28,
      downloadUrl: "#"
    },
    {
      id: 4,
      title: "Guía Implementación IA",
      description: "Manual práctico para PyMEs",
      type: "Guía",
      date: "2024-06-01",
      pages: 56,
      downloadUrl: "#"
    }
  ];

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
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Reportes Destacados
        </CardTitle>
        <CardDescription className="text-emerald-100">
          Análisis e informes especializados
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {reportsData.map((report) => (
            <div key={report.id} className="border border-gray-100 rounded-lg p-4 hover:bg-emerald-50 transition-colors duration-200 group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {report.title}
                </h3>
                <Download className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors cursor-pointer" />
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
        
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
          <p className="text-sm text-emerald-800">
            💡 <strong>Próximo reporte:</strong> "Impacto Económico IA en Startups" - Disponible el 20 de junio
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
