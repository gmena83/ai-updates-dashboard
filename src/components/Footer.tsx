import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-background py-8 mt-12">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('footer.created')}{' '}
            <a 
              href="https://menatech.cloud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Menatech
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            {t('footer.perplexity')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;