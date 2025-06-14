
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, FileText, Newspaper, Settings, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { SheetData } from '@/services/googleSheetsService';
import NewsSection from '@/components/dashboard/NewsSection';
import MetricsSection from '@/components/dashboard/MetricsSection';
import ReportsSection from '@/components/dashboard/ReportsSection';
import PapersSection from '@/components/dashboard/PapersSection';
import GoogleSheetsConfig from '@/components/dashboard/GoogleSheetsConfig';

const Index = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const { isConnected, isSending, sendData } = useGoogleSheets();

  const generateMockData = (): SheetData[] => {
    const currentTime = new Date().toISOString();
    
    return [
      // Noticias
      {
        timestamp: currentTime,
        type: 'Noticia',
        title: 'OpenAI lanza nueva herramienta para PyMEs',
        description: 'Una solución de IA accesible que promete reducir costos operativos en un 30%',
        source: 'TechCrunch',
        impact: 'Alto',
        url: 'https://techcrunch.com/ai-pymes'
      },
      {
        timestamp: currentTime,
        type: 'Noticia',
        title: 'Estudio revela adopción de IA en startups',
        description: 'El 67% de las startups implementaron alguna forma de IA en 2024',
        source: 'MIT Technology Review',
        impact: 'Medio',
        url: 'https://technologyreview.com/ai-startups'
      },
      // Métricas
      {
        timestamp: currentTime,
        type: 'Métrica',
        title: 'Adopción de IA en PyMEs',
        description: '45% de adopción con incremento del 12% vs trimestre anterior',
        source: 'Dashboard Interno',
        impact: 'Alto',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Métrica',
        title: 'Inversión promedio en IA',
        description: '$15,400 por empresa en 2024, incremento del 8%',
        source: 'Dashboard Interno',
        impact: 'Alto',
        url: '#'
      },
      // Reportes
      {
        timestamp: currentTime,
        type: 'Reporte',
        title: 'Estado de IA en PyMEs 2024',
        description: 'Análisis completo de adopción y tendencias - 45 páginas',
        source: 'Reporte Industria',
        impact: 'Alto',
        url: '#'
      },
      // Papers
      {
        timestamp: currentTime,
        type: 'Paper',
        title: 'AI Adoption in SMEs: A Comprehensive Analysis',
        description: 'Investigación académica con 127 citas - Journal of Business Technology',
        source: 'Journal of Business Technology',
        impact: 'Alto',
        url: '#'
      }
    ];
  };

  const handleManualUpdate = async () => {
    setIsUpdating(true);
    console.log("Iniciando actualización manual del dashboard...");
    
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setLastUpdate(new Date());
    
    // Si Google Sheets está conectado, enviar datos automáticamente
    if (isConnected) {
      console.log("Enviando datos a Google Sheets...");
      const mockData = generateMockData();
      await sendData(mockData);
    }
    
    setIsUpdating(false);
    
    toast({
      title: "Actualización completada",
      description: isConnected 
        ? "Los datos han sido actualizados y guardados en Google Sheets" 
        : "Los datos han sido actualizados exitosamente",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  AI Impact Dashboard
                </h1>
                <p className="text-sm text-gray-600">PyMEs y Startups</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
                className="border-orange-200 hover:bg-orange-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
              
              <Button
                onClick={handleManualUpdate}
                disabled={isUpdating || isSending}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${(isUpdating || isSending) ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Actualizando...' : isSending ? 'Guardando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Configuración de Google Sheets */}
        {showConfig && (
          <div className="mb-8 animate-fade-in">
            <GoogleSheetsConfig />
          </div>
        )}

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Noticias</p>
                  <p className="text-3xl font-bold">127</p>
                </div>
                <Newspaper className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Métricas</p>
                  <p className="text-3xl font-bold">89</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Reportes</p>
                  <p className="text-3xl font-bold">34</p>
                </div>
                <FileText className="h-8 w-8 text-emerald-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Papers</p>
                  <p className="text-3xl font-bold">56</p>
                </div>
                <FileText className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de última actualización */}
        <div className="mb-8">
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    Última actualización: {lastUpdate.toLocaleString('es-ES')}
                  </Badge>
                  {isConnected && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Google Sheets conectado
                    </Badge>
                  )}
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Sistema activo
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-fade-in">
            <NewsSection />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <MetricsSection />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ReportsSection />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <PapersSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
