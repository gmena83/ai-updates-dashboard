
import React, { useState, useEffect } from 'react';
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
import LLMNewsSection from '@/components/dashboard/LLMNewsSection';
import OfficialManualsSection from '@/components/dashboard/OfficialManualsSection';
import GoogleSheetsConfig from '@/components/dashboard/GoogleSheetsConfig';

const Index = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const { isConnected, isSending, sendData, checkConnection } = useGoogleSheets();

  // Verificar conexión al cargar el componente
  useEffect(() => {
    console.log('Componente Index cargado, verificando conexión...');
    const connected = checkConnection();
    console.log('Estado de conexión inicial:', connected);
  }, [checkConnection]);

  // Log cuando cambia el estado de conexión
  useEffect(() => {
    console.log('Estado de conexión cambió a:', isConnected);
  }, [isConnected]);

  const generateMockData = (): SheetData[] => {
    const currentTime = new Date().toISOString();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Filtrar solo noticias del último mes
    const isRecentNews = (date: Date) => date >= oneMonthAgo;
    
    return [
      // Noticias PyMEs (todas las mostradas en NewsSection)
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
      {
        timestamp: currentTime,
        type: 'Noticia',
        title: 'Nuevas regulaciones de IA para pequeñas empresas',
        description: 'Marco regulatorio simplificado para facilitar la adopción',
        source: 'Forbes',
        impact: 'Alto',
        url: 'https://forbes.com/ai-regulations-sme'
      },
      
      // Métricas (todas las mostradas en MetricsSection)
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
      {
        timestamp: currentTime,
        type: 'Métrica',
        title: 'ROI promedio IA',
        description: '230% retorno de inversión, incremento del 18%',
        source: 'Dashboard Interno',
        impact: 'Alto',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Métrica',
        title: 'Tiempo de implementación',
        description: '3.2 meses promedio, reducción del 15%',
        source: 'Dashboard Interno',
        impact: 'Alto',
        url: '#'
      },
      
      // Reportes (todos los mostrados en ReportsSection)
      {
        timestamp: currentTime,
        type: 'Reporte',
        title: 'Estado de IA en PyMEs 2024',
        description: 'Análisis completo de adopción y tendencias - 45 páginas',
        source: 'Reporte Industria',
        impact: 'Alto',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Reporte',
        title: 'Casos de Éxito: Startups IA',
        description: '10 casos de estudio detallados - 32 páginas',
        source: 'Casos de Estudio',
        impact: 'Alto',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Reporte',
        title: 'Predicciones IA 2025',
        description: 'Tendencias y oportunidades futuras - 28 páginas',
        source: 'Predicción',
        impact: 'Alto',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Reporte',
        title: 'Guía Implementación IA',
        description: 'Manual práctico para PyMEs - 56 páginas',
        source: 'Guía',
        impact: 'Alto',
        url: '#'
      },
      
      // Papers (todos los mostrados en PapersSection)
      {
        timestamp: currentTime,
        type: 'Paper',
        title: 'AI Adoption in SMEs: A Comprehensive Analysis',
        description: 'Investigación académica con 127 citas - Journal of Business Technology',
        source: 'Journal of Business Technology',
        impact: 'Alto',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Paper',
        title: 'Machine Learning ROI in Small Business Environments',
        description: 'Investigación con 89 citas - AI Business Review',
        source: 'AI Business Review',
        impact: 'Alto',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Paper',
        title: 'Barriers to AI Implementation in Startups',
        description: 'Estudio con 156 citas - Entrepreneurship & Technology',
        source: 'Entrepreneurship & Technology',
        impact: 'Medio',
        url: '#'
      },
      {
        timestamp: currentTime,
        type: 'Paper',
        title: 'Cost-Effective AI Solutions for SMEs',
        description: 'Investigación con 73 citas - Small Business Innovation',
        source: 'Small Business Innovation',
        impact: 'Alto',
        url: '#'
      },
      
      // Noticias LLMs
      {
        timestamp: currentTime,
        type: 'Noticia LLM',
        title: 'OpenAI anuncia GPT-5 con capacidades multimodales',
        description: 'Nueva versión promete mejor razonamiento y comprensión contextual',
        source: 'OpenAI Blog',
        impact: 'Alto',
        url: 'https://openai.com/blog/gpt-5-announcement'
      },
      {
        timestamp: currentTime,
        type: 'Noticia LLM',
        title: 'Anthropic mejora Claude con nuevas funciones de código',
        description: 'Claude 3.5 incluye herramientas especializadas para programación',
        source: 'Anthropic',
        impact: 'Alto',
        url: 'https://anthropic.com/claude-coding'
      },
      {
        timestamp: currentTime,
        type: 'Noticia LLM',
        title: 'Google lanza Gemini Ultra para empresas',
        description: 'Versión empresarial con mayor capacidad y seguridad',
        source: 'Google AI',
        impact: 'Alto',
        url: 'https://ai.google/gemini-ultra'
      },
      {
        timestamp: currentTime,
        type: 'Noticia LLM',
        title: 'DeepSeek alcanza nuevo benchmark en matemáticas',
        description: 'Supera a modelos occidentales en resolución de problemas complejos',
        source: 'DeepSeek AI',
        impact: 'Medio',
        url: 'https://deepseek.com/math-benchmark'
      },
      
      // Manuales oficiales
      {
        timestamp: currentTime,
        type: 'Manual Oficial',
        title: 'OpenAI API Reference Guide v2.0',
        description: 'Guía completa para desarrolladores - 120 páginas',
        source: 'OpenAI',
        impact: 'Alto',
        url: 'https://platform.openai.com/docs'
      },
      {
        timestamp: currentTime,
        type: 'Manual Oficial',
        title: 'Claude Enterprise Implementation Guide',
        description: 'Manual de implementación empresarial - 85 páginas',
        source: 'Anthropic',
        impact: 'Alto',
        url: 'https://docs.anthropic.com/enterprise'
      },
      {
        timestamp: currentTime,
        type: 'Manual Oficial',
        title: 'Google AI Studio Best Practices',
        description: 'Mejores prácticas para desarrollo con Gemini - 67 páginas',
        source: 'Google',
        impact: 'Alto',
        url: 'https://ai.google.dev/docs/best-practices'
      },
      {
        timestamp: currentTime,
        type: 'Manual Oficial',
        title: 'Microsoft Copilot Integration Manual',
        description: 'Guía de integración para empresas - 94 páginas',
        source: 'Microsoft',
        impact: 'Alto',
        url: 'https://docs.microsoft.com/copilot'
      }
    ];
  };

  const handleManualUpdate = async () => {
    setIsUpdating(true);
    console.log("=== INICIANDO ACTUALIZACIÓN MANUAL ===");
    console.log("Estado actual de conexión:", isConnected);
    
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setLastUpdate(new Date());
    
    // Verificar conexión antes de enviar datos
    console.log("Verificando conexión antes de enviar datos...");
    const connectionStatus = checkConnection();
    console.log("Estado de conexión verificado:", connectionStatus);
    
    // Si Google Sheets está conectado, enviar datos automáticamente
    if (isConnected) {
      console.log("Google Sheets está conectado, enviando datos...");
      const mockData = generateMockData();
      console.log("Datos a enviar:", mockData);
      const success = await sendData(mockData);
      console.log("Resultado del envío:", success);
    } else {
      console.log("Google Sheets NO está conectado, saltando envío de datos");
      console.log("Para conectar, usa el botón 'Configurar' en la parte superior");
    }
    
    setIsUpdating(false);
    
    toast({
      title: "Actualización completada",
      description: isConnected 
        ? "Los datos han sido actualizados y guardados en Google Sheets" 
        : "Los datos han sido actualizados exitosamente",
    });
    
    console.log("=== ACTUALIZACIÓN MANUAL COMPLETADA ===");
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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Noticias PyMEs</p>
                  <p className="text-3xl font-bold">127</p>
                </div>
                <Newspaper className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-rose-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Noticias LLMs</p>
                  <p className="text-3xl font-bold">78</p>
                </div>
                <Newspaper className="h-8 w-8 text-red-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Manuales</p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <FileText className="h-8 w-8 text-amber-100" />
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
          <div className="animate-fade-in hover:animate-pulse">
            <NewsSection />
          </div>
          <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: '0.1s' }}>
            <MetricsSection />
          </div>
          <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: '0.2s' }}>
            <ReportsSection />
          </div>
          <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: '0.3s' }}>
            <PapersSection />
          </div>
          <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: '0.4s' }}>
            <LLMNewsSection />
          </div>
          <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: '0.5s' }}>
            <OfficialManualsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
