import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Plus, Trash2, Search, Database } from 'lucide-react';
import { Dataset, DataRow } from '../types';
import { exportToExcel } from '../lib/data-utils';

interface DataTableProps {
  dataset: Dataset;
  onUpdate: (updatedData: DataRow[]) => void;
}

export default function DataTable({ dataset, onUpdate }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleCellChange = (rowIndex: number, column: string, value: any) => {
    const newData = [...dataset.data];
    // Try to parse as number if possible
    const numValue = isNaN(value) || value === '' ? value : Number(value);
    newData[rowIndex] = { ...newData[rowIndex], [column]: numValue };
    onUpdate(newData);
  };

  const addRow = () => {
    const newRow: DataRow = {};
    dataset.columns.forEach((col) => (newRow[col] = ''));
    onUpdate([...dataset.data, newRow]);
  };

  const deleteRow = (index: number) => {
    const newData = dataset.data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const filteredData = dataset.data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const numericColumns = dataset.columns.filter(col => 
    dataset.data.some(row => typeof row[col] === 'number')
  );

  const getColumnSum = (col: string) => {
    return dataset.data.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
  };

  const getColumnAvg = (col: string) => {
    if (dataset.data.length === 0) return 0;
    return getColumnSum(col) / dataset.data.length;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Data Editor</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search data..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={addRow} variant="outline" className="flex gap-2">
              <Plus className="w-4 h-4" />
              Add Row
            </Button>
            <Button
              onClick={() => exportToExcel(dataset.data, dataset.name)}
              className="bg-green-600 hover:bg-green-700 text-white flex gap-2"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  {dataset.columns.map((col) => (
                    <TableHead key={col} className="font-bold text-slate-700">
                      {col}
                    </TableHead>
                  ))}
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {dataset.columns.map((col) => (
                      <TableCell key={col} className="p-2">
                        <Input
                          value={row[col] ?? ''}
                          onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                          className="border-none focus-visible:ring-1 h-8 text-sm"
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRow(rowIndex)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {numericColumns.length > 0 && (
        <Card className="shadow-sm border-none bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
              <Database className="w-5 h-5" />
              Quick Calculations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {numericColumns.map(col => (
                <div key={col} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{col}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500">Sum</p>
                      <p className="text-lg font-bold text-slate-800">{getColumnSum(col).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Avg</p>
                      <p className="text-lg font-bold text-slate-800">{getColumnAvg(col).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
