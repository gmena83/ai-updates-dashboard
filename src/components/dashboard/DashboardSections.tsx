
import React from 'react';
import NewsSection from './NewsSection';
import MetricsSection from './MetricsSection';
import ReportsSection from './ReportsSection';
import PapersSection from './PapersSection';
import LLMNewsSection from './LLMNewsSection';
import OfficialManualsSection from './OfficialManualsSection';
import SuccessCasesSection from './SuccessCasesSection';
import RecommendedToolsSection from './RecommendedToolsSection';
import { PerplexityData } from '@/hooks/usePerplexityData';

interface DashboardSectionsProps {
  perplexityData?: PerplexityData;
}

const DashboardSections = ({ perplexityData }: DashboardSectionsProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0s" }}>
          <NewsSection data={perplexityData?.news} />
        </div>
        
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0.1s" }}>
          <MetricsSection data={perplexityData?.metrics} />
        </div>
        
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0.2s" }}>
          <ReportsSection data={perplexityData?.reports} />
        </div>
        
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0.3s" }}>
          <PapersSection data={perplexityData?.papers} />
        </div>
        
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0.4s" }}>
          <LLMNewsSection data={perplexityData?.llmNews} />
        </div>
        
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0.5s" }}>
          <OfficialManualsSection data={perplexityData?.manuals} />
        </div>
        
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0.6s" }}>
          <SuccessCasesSection data={perplexityData?.successCases} />
        </div>
        
        <div className="animate-fade-in hover:animate-pulse" style={{ animationDelay: "0.7s" }}>
          <RecommendedToolsSection data={perplexityData?.recommendedTools} />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <p>Dashboard creado por <strong>Menatech</strong> | Educación, estrategia y servicios de IA para empresas | <a href="mailto:inbox@menatech.cloud" className="text-blue-600 hover:text-blue-800 underline">inbox@menatech.cloud</a></p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardSections;
