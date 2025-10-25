'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Heart, Weight, Thermometer, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VitalsForm } from '@/components/vitals-form';
import { db, type Vitals } from '@/lib/database';
import { formatDate, formatTime, detectVitalAnomalies } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function VitalsPage() {
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVitals, setEditingVitals] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');
  const { toast } = useToast();

  useEffect(() => {
    loadVitals();
  }, [timeRange]);

  const loadVitals = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
      
      const vitalsData = await db.vitals
        .where('recordedAt')
        .above(daysAgo)
        .reverse()
        .sortBy('recordedAt');
      
      setVitals(vitalsData);
    } catch (error) {
      console.error('Failed to load vitals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vitals data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingVitals(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vital: Vitals) => {
    setEditingVitals(vital);
    setIsFormOpen(true);
  };

  const handleFormComplete = () => {
    setIsFormOpen(false);
    setEditingVitals(null);
    loadVitals();
  };

  const getChartData = () => {
    return vitals.slice(0, parseInt(timeRange)).reverse().map((vital, index) => ({
      date: formatDate(vital.recordedAt),
      weight: vital.weight,
      systolic: vital.systolic,
      diastolic: vital.diastolic,
      heartRate: vital.heartRate,
    }));
  };

  const getAnomalies = () => {
    if (vitals.length < 2) return [];
    
    const latest = vitals[0];
    const previous = vitals[1];
    
    return detectVitalAnomalies(
      latest,
      previous,
      {
        weightChangePercent: 5,
        heartRateMin: 60,
        heartRateMax: 100,
      }
    );
  };

  const getLatestVitals = () => {
    return vitals[0] || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = getChartData();
  const anomalies = getAnomalies();
  const latestVitals = getLatestVitals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vitals & Trends</h1>
          <p className="text-muted-foreground">
            Track your vital signs and monitor trends
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
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

      {/* Anomalies Alert */}
      {anomalies.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {anomalies.map((anomaly, index) => (
                <li key={index} className="text-sm text-destructive">
                  • {anomaly}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Latest Vitals Summary */}
      {latestVitals && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVitals.systolic}/{latestVitals.diastolic}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTime(latestVitals.recordedAt)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestVitals.heartRate} bpm</div>
              <p className="text-xs text-muted-foreground">
                {formatTime(latestVitals.recordedAt)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight</CardTitle>
              <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestVitals.weight} lbs</div>
              <p className="text-xs text-muted-foreground">
                {formatTime(latestVitals.recordedAt)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVitals.temperature ? `${latestVitals.temperature}°F` : '--'}
              </div>
              <p className="text-xs text-muted-foreground">
                {latestVitals.temperature ? formatTime(latestVitals.recordedAt) : 'Not recorded'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Weight Trend */}
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
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Blood Pressure Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
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
                    <Line 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--destructive))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vitals History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          {vitals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No vitals recorded yet. Add your first reading to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {vitals.map((vital) => (
                <div
                  key={vital.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleEdit(vital)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium">
                      {formatDate(vital.recordedAt)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(vital.recordedAt)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="font-medium">{vital.systolic}/{vital.diastolic}</span>
                      <span className="text-muted-foreground ml-1">mmHg</span>
                    </div>
                    <div>
                      <span className="font-medium">{vital.heartRate}</span>
                      <span className="text-muted-foreground ml-1">bpm</span>
                    </div>
                    <div>
                      <span className="font-medium">{vital.weight}</span>
                      <span className="text-muted-foreground ml-1">lbs</span>
                    </div>
                    {vital.temperature && (
                      <div>
                        <span className="font-medium">{vital.temperature}</span>
                        <span className="text-muted-foreground ml-1">°F</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vitals Form Modal */}
      <VitalsForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        vitals={editingVitals}
        onComplete={handleFormComplete}
      />
    </div>
  );
}