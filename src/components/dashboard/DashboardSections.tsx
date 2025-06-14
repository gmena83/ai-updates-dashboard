
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
  const sections = [
    { 
      Component: NewsSection, 
      delay: "0s",
      hasData: perplexityData?.news && perplexityData.news.length > 0,
      data: perplexityData?.news
    },
    { 
      Component: MetricsSection, 
      delay: "0.1s",
      hasData: perplexityData?.metrics && perplexityData.metrics.length > 0,
      data: perplexityData?.metrics
    },
    { 
      Component: ReportsSection, 
      delay: "0.2s",
      hasData: true, // Los reportes no dependen de Perplexity
      data: null
    },
    { 
      Component: PapersSection, 
      delay: "0.3s",
      hasData: perplexityData?.papers && perplexityData.papers.length > 0,
      data: perplexityData?.papers
    },
    { 
      Component: LLMNewsSection, 
      delay: "0.4s",
      hasData: perplexityData?.llmNews && perplexityData.llmNews.length > 0,
      data: perplexityData?.llmNews
    },
    { 
      Component: OfficialManualsSection, 
      delay: "0.5s",
      hasData: perplexityData?.manuals && perplexityData.manuals.length > 0,
      data: perplexityData?.manuals
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map(({ Component, delay, data }, index) => (
          <div 
            key={index}
            className="animate-fade-in hover:animate-pulse" 
            style={{ animationDelay: delay }}
          >
            <Component data={data} />
          </div>
        ))}
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
