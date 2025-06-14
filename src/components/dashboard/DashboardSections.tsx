
import React from 'react';
import NewsSection from './NewsSection';
import MetricsSection from './MetricsSection';
import ReportsSection from './ReportsSection';
import PapersSection from './PapersSection';
import LLMNewsSection from './LLMNewsSection';
import OfficialManualsSection from './OfficialManualsSection';

const DashboardSections = () => {
  const sections = [
    { Component: NewsSection, delay: "0s" },
    { Component: MetricsSection, delay: "0.1s" },
    { Component: ReportsSection, delay: "0.2s" },
    { Component: PapersSection, delay: "0.3s" },
    { Component: LLMNewsSection, delay: "0.4s" },
    { Component: OfficialManualsSection, delay: "0.5s" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {sections.map(({ Component, delay }, index) => (
        <div 
          key={index}
          className="animate-fade-in hover:animate-pulse" 
          style={{ animationDelay: delay }}
        >
          <Component />
        </div>
      ))}
    </div>
  );
};

export default DashboardSections;
