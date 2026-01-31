import React, { useState } from 'react';
import { ColumnInfo, DataRow, AIReport } from '../types';
import { generateDetailedReport } from '../services/geminiService';
import { FileText, CheckSquare, Square, Wand2, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportGeneratorProps {
  data: DataRow[];
  columns: ColumnInfo[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data, columns }) => {
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set(columns.slice(0, 3).map(c => c.name)));
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);

  const toggleColumn = (name: string) => {
    const newSet = new Set(selectedCols);
    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }
    setSelectedCols(newSet);
  };

  const handleGenerate = async () => {
    if (selectedCols.size === 0) return;
    setIsLoading(true);
    setReport(null);
    try {
      const result = await generateDetailedReport(data, Array.from(selectedCols));
      setReport(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up delay-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-pink-500" />
            AI Report Generator
          </h2>
          <p className="text-slate-400 text-sm">Select columns to generate a detailed, intelligent report</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Panel */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">Focus Columns</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {columns.map(col => (
              <div 
                key={col.name}
                onClick={() => toggleColumn(col.name)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedCols.has(col.name) 
                  ? 'bg-primary/20 border-primary/50' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                }`}
              >
                {selectedCols.has(col.name) 
                  ? <CheckSquare className="w-5 h-5 text-primary mr-3" /> 
                  : <Square className="w-5 h-5 text-slate-500 mr-3" />
                }
                <div>
                  <div className="text-sm font-medium text-slate-200">{col.name}</div>
                  <div className="text-xs text-slate-500">{col.type}</div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || selectedCols.size === 0}
            className="w-full mt-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center">
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Report
              </span>
            )}
          </button>
        </div>

        {/* Report Output */}
        <div className="lg:col-span-2 min-h-[400px]">
          {report ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="bg-slate-800 p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-2">{report.title}</h2>
                <p className="text-slate-400 italic">{report.summary}</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8">
                {/* Insights */}
                <div>
                  <h4 className="text-lg font-semibold text-secondary mb-3 flex items-center">
                    <Wand2 className="w-4 h-4 mr-2" /> Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {report.keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start text-slate-300 text-sm">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 mr-3 flex-shrink-0"></span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                   <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" /> Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.recommendations.map((rec, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm text-slate-300">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Markdown */}
                <div className="pt-6 border-t border-slate-800">
                   <h4 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h4>
                   <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                     <ReactMarkdown>{report.markdownContent}</ReactMarkdown>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to Analyze</h3>
              <p className="text-slate-500 max-w-sm">
                Select specific columns on the left and click "Generate Report" to receive AI-powered insights tailored to your selection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
