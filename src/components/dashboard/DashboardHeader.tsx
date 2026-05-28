import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Languages, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import LoginModal from '@/components/auth/LoginModal';

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
  const [showLogin, setShowLogin] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const handleConfigClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    onConfigToggle();
  };

  return (
    <>
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-white/10">
                <img
                  src="/brand/menatech-iso-orange.png"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t('dashboard.title')}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="p-2"
              >
                <Languages className="h-4 w-4" />
                <span className="ml-1 text-xs">{language.toUpperCase()}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfigClick}
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('header.config')}
              </Button>
              
              <Button
                onClick={onManualUpdate}
                disabled={isUpdating || isSending}
                className="bg-[#D93D03] text-white shadow-lg transition-all duration-300 hover:bg-[#B83300] hover:shadow-xl"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${(isUpdating || isSending) ? 'animate-spin' : ''}`} />
                {isUpdating ? t('header.updating') : isSending ? t('header.saving') : t('header.update')}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <LoginModal 
        open={showLogin} 
        onOpenChange={setShowLogin} 
        onSuccess={handleLoginSuccess} 
      />
    </>
  );
};

export default DashboardHeader;
