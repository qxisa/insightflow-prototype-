import React, { useRef, useState } from 'react';
import { Upload, FileType, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileProcess: (file: File) => Promise<void>;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    // Simple check (MIME types can be tricky on some systems, so we also check extension in service)
    
    try {
      await onFileProcess(file);
    } catch (err: any) {
      setError(err.message || "Failed to process file");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 animate-fade-in">
      <div 
        className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-3xl transition-all duration-300 ease-in-out
          ${dragActive ? 'border-primary bg-primary/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          multiple={false} 
          accept=".csv,.xlsx,.xls"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-slate-800 rounded-full shadow-lg">
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-100">
              {isLoading ? "Processing..." : "Upload your dataset"}
            </h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Drag & drop your CSV or Excel file here, or click to browse.
            </p>
          </div>

          <button 
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-indigo-600 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Browse Files
          </button>
        </div>

        <div className="mt-8 flex items-center space-x-4 text-xs text-slate-500">
          <span className="flex items-center"><FileType className="w-4 h-4 mr-1" /> .CSV</span>
          <span className="flex items-center"><FileType className="w-4 h-4 mr-1" /> .XLSX</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400 text-sm animate-pulse">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
