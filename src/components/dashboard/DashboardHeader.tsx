
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  isUpdating: boolean;
  isSending: boolean;
  showConfig: boolean;
  onConfigToggle: () => void;
  onManualUpdate: () => void;
}

const DashboardHeader = ({ 
  isUpdating, 
  isSending, 
  showConfig, 
  onConfigToggle, 
  onManualUpdate 
}: DashboardHeaderProps) => {
  return (
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
              onClick={onConfigToggle}
              className="border-orange-200 hover:bg-orange-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            
            <Button
              onClick={onManualUpdate}
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
  );
};

export default DashboardHeader;
