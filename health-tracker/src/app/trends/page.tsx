'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db, type Vitals, type MedicationLog } from '@/lib/database';
import { formatDate, exportData, importData } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function TrendsPage() {
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
      
      const [vitalsData, logsData] = await Promise.all([
        db.vitals
          .where('recordedAt')
          .above(daysAgo)
          .reverse()
          .sortBy('recordedAt'),
        db.medicationLogs
          .where('takenAt')
          .above(daysAgo)
          .toArray()
      ]);
      
      setVitals(vitalsData);
      setMedicationLogs(logsData);
    } catch (error) {
      console.error('Failed to load trends data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trends data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export successful',
        description: 'Your data has been exported',
      });
    } catch (error) {
      console.error('Failed to export data:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export your data',
        variant: 'destructive',
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result as string;
        const result = await importData(data);
        
        if (result.success) {
          toast({
            title: 'Import successful',
            description: 'Your data has been imported',
          });
          loadData();
        } else {
          toast({
            title: 'Import failed',
            description: result.errors.join(', '),
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Failed to import data:', error);
        toast({
          title: 'Import failed',
          description: 'Invalid file format',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const getChartData = () => {
    return vitals.slice(0, parseInt(timeRange)).reverse().map((vital, index) => ({
      date: formatDate(vital.recordedAt),
      weight: vital.weight,
      systolic: vital.systolic,
      diastolic: vital.diastolic,
      heartRate: vital.heartRate,
      temperature: vital.temperature || null,
    }));
  };

  const getMedicationAdherence = () => {
    const totalLogs = medicationLogs.length;
    const takenLogs = medicationLogs.filter(log => log.status === 'taken').length;
    const skippedLogs = medicationLogs.filter(log => log.status === 'skipped').length;
    const missedLogs = medicationLogs.filter(log => log.status === 'missed').length;

    return [
      { name: 'Taken', value: takenLogs, color: COLORS[0] },
      { name: 'Skipped', value: skippedLogs, color: COLORS[1] },
      { name: 'Missed', value: missedLogs, color: COLORS[2] },
    ];
  };

  const getWeeklyTrends = () => {
    const weeks: Record<string, { weight: number[]; heartRate: number[]; count: number }> = {};
    
    vitals.forEach(vital => {
      const week = formatDate(new Date(vital.recordedAt.getTime() - vital.recordedAt.getDay() * 24 * 60 * 60 * 1000));
      if (!weeks[week]) {
        weeks[week] = { weight: [], heartRate: [], count: 0 };
      }
      weeks[week].weight.push(vital.weight);
      weeks[week].heartRate.push(vital.heartRate);
      weeks[week].count++;
    });

    return Object.entries(weeks).map(([week, data]) => ({
      week,
      avgWeight: data.weight.reduce((a, b) => a + b, 0) / data.weight.length,
      avgHeartRate: data.heartRate.reduce((a, b) => a + b, 0) / data.heartRate.length,
      readings: data.count,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = getChartData();
  const adherenceData = getMedicationAdherence();
  const weeklyData = getWeeklyTrends();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trends & Analytics</h1>
          <p className="text-muted-foreground">
            Analyze your health data and track progress over time
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" asChild>
            <label>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {(['7', '30', '90'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            Last {range} days
          </Button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6">
        {/* Weight and Heart Rate Trends */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Weight Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke={COLORS[0]} 
                      strokeWidth={2}
                      dot={{ fill: COLORS[0] }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Heart Rate Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="heartRate" 
                      stroke={COLORS[1]} 
                      strokeWidth={2}
                      dot={{ fill: COLORS[1] }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blood Pressure and Medication Adherence */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Blood Pressure Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke={COLORS[0]} 
                      strokeWidth={2}
                      dot={{ fill: COLORS[0] }}
                      name="Systolic"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke={COLORS[1]} 
                      strokeWidth={2}
                      dot={{ fill: COLORS[1] }}
                      name="Diastolic"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Medication Adherence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={adherenceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {adherenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Averages */}
        {weeklyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Weekly Averages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="avgWeight" 
                      fill={COLORS[0]} 
                      name="Avg Weight (lbs)"
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="avgHeartRate" 
                      fill={COLORS[1]} 
                      name="Avg Heart Rate (bpm)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Data Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Vitals Recorded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vitals.length}</div>
            <p className="text-xs text-muted-foreground">
              Over the last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Medication Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicationLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Over the last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicationLogs.length > 0 
                ? Math.round((medicationLogs.filter(log => log.status === 'taken').length / medicationLogs.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Medications taken as scheduled
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}