
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardUpdateInfoProps {
  lastUpdate: Date;
  isConnected: boolean;
}

const DashboardUpdateInfo = ({ lastUpdate, isConnected }: DashboardUpdateInfoProps) => {
  return (
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
  );
};

export default DashboardUpdateInfo;
