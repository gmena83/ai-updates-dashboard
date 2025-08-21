import React from 'react';
import NewsSection from './NewsSection';
import MetricsSection from './MetricsSection';
import ReportsSection from './ReportsSection';
import PapersSection from './PapersSection';
import LLMNewsSection from './LLMNewsSection';
import OfficialManualsSection from './OfficialManualsSection';
import { PerplexityData } from '@/hooks/usePerplexityData';

interface DashboardSectionsProps {
  perplexityData?: PerplexityData;
}

const DashboardSections = ({ perplexityData }: DashboardSectionsProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in" style={{ animationDelay: "0s" }}>
          <NewsSection data={perplexityData?.news} />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <MetricsSection data={perplexityData?.metrics} />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ReportsSection data={perplexityData?.reports} />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <PapersSection data={perplexityData?.papers} />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <LLMNewsSection data={perplexityData?.llmNews} />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <OfficialManualsSection data={perplexityData?.manuals} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;