
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, TrendingUp, FileText } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: "Noticias PyMEs",
      value: "127",
      icon: Newspaper,
      gradient: "from-orange-500 to-pink-500",
      textColor: "text-orange-100",
      delay: "0s"
    },
    {
      title: "Métricas",
      value: "89",
      icon: TrendingUp,
      gradient: "from-blue-500 to-indigo-500",
      textColor: "text-blue-100",
      delay: "0.1s"
    },
    {
      title: "Reportes",
      value: "34",
      icon: FileText,
      gradient: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-100",
      delay: "0.2s"
    },
    {
      title: "Papers",
      value: "56",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      textColor: "text-purple-100",
      delay: "0.3s"
    },
    {
      title: "Noticias LLMs",
      value: "78",
      icon: Newspaper,
      gradient: "from-red-500 to-rose-500",
      textColor: "text-red-100",
      delay: "0.4s"
    },
    {
      title: "Manuales",
      value: "23",
      icon: FileText,
      gradient: "from-amber-500 to-yellow-500",
      textColor: "text-amber-100",
      delay: "0.5s"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={stat.title}
            className={`border-0 shadow-lg bg-gradient-to-br ${stat.gradient} text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`}
            style={{ animationDelay: stat.delay }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${stat.textColor} text-sm font-medium`}>{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <IconComponent className={`h-8 w-8 ${stat.textColor}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
