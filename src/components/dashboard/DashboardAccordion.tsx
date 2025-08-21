import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp, BarChart, FileText, GraduationCap, Bot, BookOpen } from 'lucide-react';
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
      icon: TrendingUp,
      component: <NewsSection data={data?.news} />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'metrics',
      title: t('sections.metrics'),
      icon: BarChart,
      component: <MetricsSection data={data?.metrics} />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'reports',
      title: t('sections.reports'),
      icon: FileText,
      component: <ReportsSection data={data?.reports} />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'papers',
      title: t('sections.papers'),
      icon: GraduationCap,
      component: <PapersSection data={data?.papers} />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'llmNews',
      title: t('sections.llmNews'),
      icon: Bot,
      component: <LLMNewsSection data={data?.llmNews} />,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'manuals',
      title: t('sections.manuals'),
      icon: BookOpen,
      component: <OfficialManualsSection data={data?.manuals} />,
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    setOpenSection(sectionId);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card 
              key={section.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in border-0 shadow-md"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSectionClick(section.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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