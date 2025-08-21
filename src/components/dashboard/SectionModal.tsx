import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const SectionModal = ({ open, onOpenChange, title, children }: SectionModalProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-bold text-foreground">{title}</DialogTitle>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </DialogHeader>
        <div className="pt-4">
          {children}
          <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground text-center">
            {t('common.sources')}: Perplexity AI, McKinsey, Deloitte, PwC, BCG, Accenture, Academic journals, Official company sources
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionModal;