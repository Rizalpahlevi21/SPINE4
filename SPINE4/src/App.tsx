import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileJson, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react';
import { Dataset, DataRow } from './types';
import { sampleDataset } from './sample-data';
import { parseCSV, parseExcel, parseJSON } from './lib/data-utils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [datasets, setDatasets] = useState<Dataset[]>([sampleDataset]);
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState(0);

  const currentDataset = datasets[currentDatasetIndex];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let newDataset: Dataset;
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'csv') {
        newDataset = await parseCSV(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        newDataset = await parseExcel(file);
      } else if (extension === 'json') {
        newDataset = await parseJSON(file);
      } else {
        toast.error('Unsupported file format. Please use CSV, Excel, or JSON.');
        return;
      }

      setDatasets((prev) => [...prev, newDataset]);
      setCurrentDatasetIndex(datasets.length);
      setActiveTab('dashboard');
      toast.success(`Successfully uploaded ${file.name}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to parse file. Please check the file format.');
    }
  };

  const updateCurrentDataset = (newData: DataRow[]) => {
    const updatedDatasets = [...datasets];
    updatedDatasets[currentDatasetIndex] = {
      ...updatedDatasets[currentDatasetIndex],
      data: newData,
    };
    setDatasets(updatedDatasets);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={setIsAuthenticated} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' ? 'Analytics Dashboard' : 
                 activeTab === 'data' ? 'Data Management' : 'Upload Center'}
              </h1>
              <p className="text-slate-500 mt-1">
                Currently viewing: <span className="font-semibold text-blue-600">{currentDataset.name}</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <select 
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentDatasetIndex}
                onChange={(e) => setCurrentDatasetIndex(Number(e.target.value))}
              >
                {datasets.map((ds, idx) => (
                  <option key={idx} value={idx}>{ds.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'dashboard' && (
              <Dashboard dataset={currentDataset} />
            )}

            {activeTab === 'data' && (
              <DataTable dataset={currentDataset} onUpdate={updateCurrentDataset} />
            )}

            {activeTab === 'upload' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-dashed border-2 border-slate-200 bg-white hover:border-blue-400 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                    accept=".csv,.xlsx,.xls,.json"
                  />
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">Drop your files here</CardTitle>
                    <CardDescription className="text-center">
                      Support for CSV, Excel (.xlsx, .xls), and JSON files.<br />
                      Max file size: 10MB
                    </CardDescription>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        Supported Formats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="font-semibold text-sm">CSV (Comma Separated Values)</p>
                          <p className="text-xs text-slate-500">Standard data format for spreadsheets.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-sm">Excel (.xlsx, .xls)</p>
                          <p className="text-xs text-slate-500">Microsoft Excel workbooks.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <FileJson className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-semibold text-sm">JSON (JavaScript Object Notation)</p>
                          <p className="text-xs text-slate-500">Structured data format for web APIs.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
