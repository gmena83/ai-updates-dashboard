import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp, BarChart, FileText, GraduationCap, Bot, BookOpen, Newspaper, Brain, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionModal from './SectionModal';
import NewsSection from './NewsSection';
import MetricsSection from './MetricsSection';
import ReportsSection from './ReportsSection';
import PapersSection from './PapersSection';
import LLMNewsSection from './LLMNewsSection';
import OfficialManualsSection from './OfficialManualsSection';
import { PerplexityData } from '@/hooks/usePerplexityData';

interface DashboardAccordionProps {
  data?: PerplexityData;
}

const DashboardAccordion = ({ data }: DashboardAccordionProps) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { t } = useLanguage();

  const sections = [
    {
      id: 'news',
      title: t('sections.news'),
      description: t('sections.news.desc'),
      icon: Newspaper,
      component: <NewsSection data={data?.news} />,
      color: 'from-orange-500 to-pink-500'
    },
    {
      id: 'metrics',
      title: t('sections.metrics'),
      description: t('sections.metrics.desc'),
      icon: TrendingUp,
      component: <MetricsSection data={data?.metrics} />,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'reports',
      title: t('sections.reports'),
      description: t('sections.reports.desc'),
      icon: FileText,
      component: <ReportsSection data={data?.reports} />,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'papers',
      title: t('sections.papers'),
      description: t('sections.papers.desc'),
      icon: BookOpen,
      component: <PapersSection data={data?.papers} />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'llmNews',
      title: t('sections.llmNews'),
      description: t('sections.llmNews.desc'),
      icon: Brain,
      component: <LLMNewsSection data={data?.llmNews} />,
      color: 'from-red-500 to-rose-500'
    },
    {
      id: 'manuals',
      title: t('sections.manuals'),
      description: t('sections.manuals.desc'),
      icon: Settings,
      component: <OfficialManualsSection data={data?.manuals} />,
      color: 'from-amber-500 to-yellow-500'
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    setOpenSection(sectionId);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer border-0 shadow-lg bg-gradient-to-br ${section.color} text-white hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in group`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSectionClick(section.id)}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{section.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
                      {section.description}
                    </p>
                  </div>
                  <IconComponent className="h-12 w-12 ml-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modals for each section */}
      {sections.map((section) => (
        <SectionModal
          key={`modal-${section.id}`}
          open={openSection === section.id}
          onOpenChange={(open) => setOpenSection(open ? section.id : null)}
          title={section.title}
        >
          {section.component}
        </SectionModal>
      ))}
    </div>
  );
};

export default DashboardAccordion;