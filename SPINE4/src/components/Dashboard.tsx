import React, { useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Dataset } from '../types';
import { contributionData, performanceData } from '../sample-data';

interface DashboardProps {
  dataset: Dataset;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard({ dataset }: DashboardProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const exportImage = async () => {
    if (chartRef.current === null) return;
    const dataUrl = await toPng(chartRef.current, { cacheBust: true });
    const link = document.createElement('a');
    link.download = 'dashboard-visualizations.png';
    link.href = dataUrl;
    link.click();
  };

  const totalKeterlambatan = dataset.data.reduce(
    (acc, row) => {
      acc.pettyCash += Number(row['Petty Cash'] || 0);
      acc.umOp += Number(row['UM OP'] || 0);
      acc.umSppd += Number(row['UM SPPD'] || 0);
      return acc;
    },
    { pettyCash: 0, umOp: 0, umSppd: 0 }
  );

  return (
    <div className="space-y-6" ref={chartRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <Button onClick={exportImage} variant="outline" className="flex gap-2">
          <ImageIcon className="w-4 h-4" />
          Export as Image
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-900 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Total Petty Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalKeterlambatan.pettyCash}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-500 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Total UM SPPD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalKeterlambatan.umSppd}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-600 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Total UM OP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalKeterlambatan.umOp}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataset.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="Bulan" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Petty Cash" stroke="#0088FE" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="UM OP" stroke="#FFBB28" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="UM SPPD" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Contribution Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Performance: Realisasi vs RKAP</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="realisasi" fill="#FF8042" name="REALISASI" radius={[0, 4, 4, 0]} />
              <Bar dataKey="rkap" fill="#0088FE" name="RKAP" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
