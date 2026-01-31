import React, { useState } from 'react';
import { DataRow, ColumnInfo } from './types';
import { parseFile, analyzeData } from './services/dataService';
import { generateInitialInsights } from './services/geminiService';
import FileUpload from './components/FileUpload';
import DataOverview from './components/DataOverview';
import Visualizer from './components/Visualizer';
import ReportGenerator from './components/ReportGenerator';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleFileProcess = async (file: File) => {
    setLoading(true);
    try {
      // 1. Parse File
      const parsedData = await parseFile(file);
      setData(parsedData);

      // 2. Analyze Structure
      const analyzedColumns = analyzeData(parsedData);
      setColumns(analyzedColumns);

      // 3. Trigger AI Insights (non-blocking)
      setAiLoading(true);
      generateInitialInsights(parsedData, analyzedColumns)
        .then(setAiInsight)
        .catch(err => setAiInsight("Failed to generate AI insights."))
        .finally(() => setAiLoading(false));

    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please ensure it is a valid CSV or Excel file.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData([]);
    setColumns([]);
    setAiInsight('');
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={reset}>
            <div className="bg-primary p-1.5 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              InsightFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
             {data.length > 0 && (
                <button 
                  onClick={reset}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Upload New File
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Data Analysis <span className="text-primary">Reimagined</span>
              </h1>
              <p className="text-lg text-slate-400">
                Upload your CSV or Excel files and get instant visualizations, meaningful statistics, and AI-powered insights without writing a single line of code.
              </p>
            </div>
            <FileUpload onFileProcess={handleFileProcess} isLoading={loading} />
          </div>
        ) : (
          <div className="space-y-16">
            <section>
              <DataOverview 
                columns={columns} 
                rowCount={data.length} 
                aiInsight={aiInsight}
                isAiLoading={aiLoading}
              />
            </section>
            
            <div className="w-full h-px bg-slate-800" />
            
            <section>
              <Visualizer data={data} columns={columns} />
            </section>

            <div className="w-full h-px bg-slate-800" />

            <section>
              <ReportGenerator data={data} columns={columns} />
            </section>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-900 bg-background py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm flex flex-col items-center gap-3">
          <p>&copy; {new Date().getFullYear()} InsightFlow. Local & Secure Data Processing.</p>
          <p className="font-medium text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            Proudly made by NU ITCS students in Egypt <span className="ml-1">🇪🇬</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;