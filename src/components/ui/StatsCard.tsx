import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'purple' | 'orange' | 'green' | 'pink';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  color 
}) => {
  const colorStyles = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-200',
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-200',
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02]",
      colorStyles[color]
    )}>
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
          </div>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={cn(
              "font-medium px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm",
              trendUp ? "text-white" : "text-white/90"
            )}>
              {trend}
            </span>
            <span className="ml-2 text-white/70">vs last month</span>
          </div>
        )}
      </div>
      
      {/* Decorative Circles */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-black/5 rounded-full blur-xl" />
    </div>
  );
};
