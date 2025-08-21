
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Users, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaperItem {
  id?: number;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  citations: number;
  relevance: 'Alto' | 'Medio' | 'Bajo';
  url: string;
}

interface PapersSectionProps {
  data?: PaperItem[];
}

const PapersSection = ({ data }: PapersSectionProps) => {
  const { t } = useLanguage();
  
  // Datos mock como fallback
  const fallbackData = [
    {
      id: 1,
      title: "AI Adoption in SMEs: A Comprehensive Analysis",
      authors: ["Smith, J.", "García, M.", "Chen, L."],
      journal: "Journal of Business Technology",
      year: "2024",
      citations: 127,
      relevance: "Alto" as const,
      url: "#"
    },
    {
      id: 2,
      title: "Machine Learning ROI in Small Business Environments",
      authors: ["Johnson, R.", "López, A."],
      journal: "AI Business Review",
      year: "2024",
      citations: 89,
      relevance: "Alto" as const,
      url: "#"
    },
    {
      id: 3,
      title: "Barriers to AI Implementation in Startups",
      authors: ["Williams, K.", "Zhang, X.", "Patel, S."],
      journal: "Entrepreneurship & Technology",
      year: "2024",
      citations: 156,
      relevance: "Medio" as const,
      url: "#"
    },
    {
      id: 4,
      title: "Cost-Effective AI Solutions for SMEs",
      authors: ["Brown, D.", "Martinez, C."],
      journal: "Small Business Innovation",
      year: "2024",
      citations: 73,
      relevance: "Alto" as const,
      url: "#"
    }
  ];

  const papersData = data && data.length > 0 ? data : fallbackData;
  const isUsingRealData = data && data.length > 0;

  const getRelevanceColor = (relevance: string) => {
    switch(relevance) {
      case 'Alto': 
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medio': 
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bajo': 
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {t('sections.papers.title')}
          {isUsingRealData && (
            <Badge className="ml-2 bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Perplexity AI
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-purple-100">
          {isUsingRealData 
            ? t('desc.papers.realtime')
            : t('desc.papers.default')
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {papersData.map((paper, index) => (
            <div 
              key={paper.id || index} 
              className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200 group cursor-pointer transform hover:scale-102"
              onClick={() => window.open(paper.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors text-sm leading-tight">
                  {paper.title}
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
              </div>
              
              <div className="flex items-center mb-2">
                <Users className="h-3 w-3 text-gray-400 mr-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {paper.authors.join(', ')}
                </p>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">{paper.journal} ({paper.year})</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getRelevanceColor(paper.relevance)}`}>
                    {t(`impact.${paper.relevance.toLowerCase()}`)}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {paper.citations} {t('common.citations')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {isUsingRealData ? (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-900">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              📚 <strong>{t('sources.academic')}</strong> ArXiv, IEEE, ACM, Google Scholar, ResearchGate
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-900">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              📡 <strong>{t('demo.title')}</strong> {t('demo.papers')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PapersSection;
