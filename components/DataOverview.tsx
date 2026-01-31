import React from 'react';
import { ColumnInfo } from '../types';
import { BarChart, Bar, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { FileText, Layers, Hash, AlertTriangle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DataOverviewProps {
  columns: ColumnInfo[];
  rowCount: number;
  aiInsight: string;
  isAiLoading: boolean;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; subtext?: string }> = ({ title, value, icon, subtext }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-800 transition-all">
    <div className="flex justify-between items-start mb-2">
      <span className="text-slate-400 text-sm font-medium">{title}</span>
      <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300">
        {icon}
      </div>
    </div>
    <div>
      <h4 className="text-2xl font-bold text-slate-100">{value}</h4>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

const DataOverview: React.FC<DataOverviewProps> = ({ columns, rowCount, aiInsight, isAiLoading }) => {
  const numericColumns = columns.filter(c => c.type === 'number');
  const stringColumns = columns.filter(c => c.type === 'string');
  const missingValueCount = columns.reduce((acc, col) => acc + col.missingValues, 0);

  // Prepare simple distribution data for numeric cols (just using means for visual fluff)
  const distData = numericColumns.slice(0, 10).map((col, i) => ({
    name: col.name,
    value: col.mean || 0
  }));
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      <div className="flex items-center space-x-2 mb-2">
        <h2 className="text-2xl font-bold text-white">Dataset Overview</h2>
        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">Auto-Generated</span>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Rows" 
          value={rowCount.toLocaleString()} 
          icon={<Layers className="w-5 h-5" />} 
        />
        <StatCard 
          title="Columns" 
          value={columns.length} 
          icon={<Hash className="w-5 h-5" />} 
          subtext={`${numericColumns.length} Numeric, ${stringColumns.length} Categorical`}
        />
        <StatCard 
          title="Missing Values" 
          value={missingValueCount.toLocaleString()} 
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} 
          subtext={missingValueCount > 0 ? "Consider cleaning data" : "Data looks clean"}
        />
        <StatCard 
          title="Completeness" 
          value={`${Math.max(0, 100 - (missingValueCount / (rowCount * columns.length) * 100)).toFixed(1)}%`} 
          icon={<FileText className="w-5 h-5 text-secondary" />} 
        />
      </div>

      {/* Two Column Layout: AI Insights & Quick Viz */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Insights Panel */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <h3 className="text-lg font-semibold text-white">AI Quick Insights</h3>
          </div>
          
          <div className="prose prose-invert prose-sm max-w-none text-slate-300">
            {isAiLoading ? (
               <div className="space-y-3 animate-pulse">
                 <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                 <div className="h-2 bg-slate-700 rounded w-full"></div>
                 <div className="h-2 bg-slate-700 rounded w-5/6"></div>
                 <div className="h-2 bg-slate-700 rounded w-1/2"></div>
               </div>
            ) : (
              <ReactMarkdown>{aiInsight}</ReactMarkdown>
            )}
          </div>
          
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-white" />
          </div>
        </div>

        {/* Mini Chart Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Numeric Means</h3>
          {distData.length > 0 ? (
            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distData}>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#cbd5e1' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {distData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              No numeric data to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataOverview;
