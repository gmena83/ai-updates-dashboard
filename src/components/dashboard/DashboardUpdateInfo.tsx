
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardUpdateInfoProps {
  lastUpdate: Date;
  isConnected: boolean;
}

const DashboardUpdateInfo = ({ lastUpdate, isConnected }: DashboardUpdateInfoProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-300">
                {t('update.lastUpdate')}: {lastUpdate.toLocaleString('es-ES')}
              </Badge>
              {isConnected && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
                  {t('update.sheetsConnected')}
                </Badge>
              )}
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">
              {t('update.systemActive')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardUpdateInfo;
