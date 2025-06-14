
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
      props: { newsData: perplexityData?.news }
    },
    { 
      Component: MetricsSection, 
      delay: "0.1s",
      props: { metricsData: perplexityData?.metrics }
    },
    { 
      Component: ReportsSection, 
      delay: "0.2s",
      props: {}
    },
    { 
      Component: PapersSection, 
      delay: "0.3s",
      props: { papersData: perplexityData?.papers }
    },
    { 
      Component: LLMNewsSection, 
      delay: "0.4s",
      props: { llmNewsData: perplexityData?.llmNews }
    },
    { 
      Component: OfficialManualsSection, 
      delay: "0.5s",
      props: { manualsData: perplexityData?.manuals }
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {sections.map(({ Component, delay, props }, index) => (
        <div 
          key={index}
          className="animate-fade-in hover:animate-pulse" 
          style={{ animationDelay: delay }}
        >
          <Component {...props} />
        </div>
      ))}
    </div>
  );
};

export default DashboardSections;
