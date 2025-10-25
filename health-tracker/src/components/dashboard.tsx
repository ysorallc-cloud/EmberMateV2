'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pill, Heart, Weight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyCheckInModal } from '@/components/daily-check-in-modal';
import { db, type Medication, type Vitals, type MedicationLog } from '@/lib/database';
import { getMedicationStatus, formatTime, isToday } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [recentVitals, setRecentVitals] = useState<Vitals[]>([]);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meds, logs, vitals] = await Promise.all([
        db.medications.toArray(),
        db.medicationLogs.toArray(),
        db.vitals.orderBy('recordedAt').reverse().limit(7).toArray(),
      ]);
      
      setMedications(meds);
      setMedicationLogs(logs);
      setRecentVitals(vitals);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayMedicationStatus = () => {
    const todayLogs = medicationLogs.filter(log => isToday(log.takenAt));
    const takenCount = todayLogs.filter(log => log.status === 'taken').length;
    const totalScheduled = medications.reduce((count, med) => {
      const today = new Date().getDay();
      return count + med.schedule.filter(sched => 
        sched.enabled && sched.days.includes(today)
      ).length;
    }, 0);
    
    return { taken: takenCount, total: totalScheduled };
  };

  const getWeightTrend = () => {
    return recentVitals
      .slice(0, 7)
      .reverse()
      .map((vital, index) => ({
        day: index + 1,
        weight: vital.weight,
      }));
  };

  const getLastVitals = () => {
    return recentVitals[0] || null;
  };

  const getUpcomingDoses = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentDay = now.getDay();
    
    const upcoming = medications.flatMap(med => 
      med.schedule
        .filter(sched => sched.enabled && sched.days.includes(currentDay))
        .map(sched => {
          const [hours, minutes] = sched.time.split(':').map(Number);
          const doseTime = hours * 60 + minutes;
          return {
            medication: med,
            time: sched.time,
            isUpcoming: doseTime > currentTime,
            isOverdue: doseTime < currentTime,
          };
        })
    ).sort((a, b) => a.time.localeCompare(b.time));
    
    return upcoming;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const medStatus = getTodayMedicationStatus();
  const weightTrend = getWeightTrend();
  const lastVitals = getLastVitals();
  const upcomingDoses = getUpcomingDoses();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
          <p className="text-muted-foreground">
            Quick overview of your health data
          </p>
        </div>
        <Button 
          onClick={() => setIsCheckInOpen(true)}
          size="lg"
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Medications Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications Today</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medStatus.taken}/{medStatus.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {medStatus.total === 0 ? 'No medications scheduled' : 
               medStatus.taken === medStatus.total ? 'All taken!' : 
               `${medStatus.total - medStatus.taken} remaining`}
            </p>
          </CardContent>
        </Card>

        {/* Weight Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight Trend</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {lastVitals ? (
              <>
                <div className="text-2xl font-bold">{lastVitals.weight} lbs</div>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightTrend}>
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">--</div>
            )}
          </CardContent>
        </Card>

        {/* Last Blood Pressure */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {lastVitals ? (
              <>
                <div className="text-2xl font-bold">
                  {lastVitals.systolic}/{lastVitals.diastolic}
                </div>
                <p className="text-xs text-muted-foreground">
                  HR: {lastVitals.heartRate} bpm
                </p>
              </>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">--/--</div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingDoses.filter(dose => dose.isOverdue).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingDoses.filter(dose => dose.isOverdue).length === 0 ? 
                'No overdue doses' : 'Overdue doses'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Doses */}
      {upcomingDoses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Medication Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingDoses.map((dose, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    dose.isOverdue ? 'border-destructive bg-destructive/5' : 
                    dose.isUpcoming ? 'border-primary bg-primary/5' : 
                    'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {dose.isOverdue ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : dose.isUpcoming ? (
                      <Clock className="h-4 w-4 text-primary" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{dose.medication.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {dose.medication.dose} {dose.medication.unit}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-mono">
                    {formatTime(new Date(`2000-01-01T${dose.time}`))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Check-In Modal */}
      <DailyCheckInModal 
        open={isCheckInOpen}
        onOpenChange={setIsCheckInOpen}
        onComplete={loadData}
      />
    </div>
  );
}