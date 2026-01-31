import React, { useState, useRef, useCallback } from 'react';
import { ColumnInfo, DataRow, ChartType } from '../types';
import { 
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Download, Settings2, BarChart2, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface VisualizerProps {
  data: DataRow[];
  columns: ColumnInfo[];
}

const Visualizer: React.FC<VisualizerProps> = ({ data, columns }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>(columns[0]?.name || '');
  const [yAxis, setYAxis] = useState<string>(columns.find(c => c.type === 'number')?.name || columns[0]?.name || '');
  const chartRef = useRef<HTMLDivElement>(null);

  const numericColumns = columns.filter(c => c.type === 'number');
  // For X Axis allow any, but prefer string/date/number
  const validXColumns = columns; 
  // For Y Axis prefer numbers
  const validYColumns = numericColumns.length > 0 ? numericColumns : columns;

  const handleDownload = useCallback(async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(chartRef.current, { backgroundColor: '#0f172a' });
        const link = document.createElement('a');
        link.download = `insightflow-figure-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to download image", err);
      }
    }
  }, [chartRef]);

  // Data processing for Pie chart (aggregation)
  const getChartData = () => {
    if (chartType === 'pie') {
      // Aggregate by X-Axis unique values
      const agg: {[key: string]: number} = {};
      data.forEach(row => {
        const key = String(row[xAxis]);
        const val = Number(row[yAxis]) || 0;
        agg[key] = (agg[key] || 0) + val;
      });
      // Top 10 slices to avoid clutter
      return Object.entries(agg)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }
    // Limit rows for performance if too large
    return data.slice(0, 100); 
  };

  const chartData = getChartData();
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={xAxis} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
            <Legend />
            <Line type="monotone" dataKey={chartType === 'pie' ? 'value' : yAxis} stroke="#6366f1" strokeWidth={3} dot={false} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={xAxis} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
            <Legend />
            <Area type="monotone" dataKey={yAxis} stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="category" dataKey={xAxis} name={xAxis} stroke="#94a3b8" />
            <YAxis type="number" dataKey={yAxis} name={yAxis} stroke="#94a3b8" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
            <Legend />
            <Scatter name={yAxis} data={chartData} fill="#f59e0b" />
          </ScatterChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name.substring(0,10)} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
          </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={xAxis} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
            <Legend />
            <Bar dataKey={yAxis} fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up delay-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-secondary" />
            Visualizer
          </h2>
          <p className="text-slate-400 text-sm">Explore your data with custom figures</p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700 font-medium text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Figure
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-slate-800 pb-2 mb-4">
            <Settings2 className="w-5 h-5" />
            <span>Configuration</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Chart Type</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'bar', icon: BarChart2 },
                  { id: 'line', icon: TrendingUp },
                  { id: 'area', icon: Activity },
                  { id: 'pie', icon: PieIcon },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id as ChartType)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${chartType === type.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    title={type.id}
                  >
                    <type.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">X Axis (Category)</label>
              <select 
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {validXColumns.map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Y Axis (Value)</label>
              <select 
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                 {validYColumns.map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 min-h-[500px] flex flex-col">
          <div ref={chartRef} className="flex-1 w-full h-full p-4 bg-slate-900 rounded-xl">
             <ResponsiveContainer width="100%" height={450}>
               {renderChart()}
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
