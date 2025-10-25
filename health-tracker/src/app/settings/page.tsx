'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Palette, Database, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db, type UserProfile } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import { exportData, importData } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileFormSchema, type UserProfileFormData } from '@/lib/validations';

export default function SettingsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      firstName: '',
      ageRange: undefined,
      height: undefined,
      alertThresholds: {
        weightChangePercent: 5,
        heartRateMin: 60,
        heartRateMax: 100,
      },
      preferences: {
        voiceInputEnabled: true,
        darkMode: 'auto',
        notifications: true,
      },
    },
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await db.userProfile.orderBy('createdAt').first();
      if (profile) {
        setUserProfile(profile);
        form.reset({
          firstName: profile.firstName || '',
          ageRange: profile.ageRange as any,
          height: profile.height,
          alertThresholds: profile.alertThresholds,
          preferences: profile.preferences,
        });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (userProfile) {
        await db.userProfile.update(userProfile.id!, {
          ...data,
          updatedAt: new Date(),
        });
      } else {
        await db.userProfile.add({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
      await loadUserProfile();
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
          loadUserProfile();
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

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    try {
      await db.medications.clear();
      await db.medicationLogs.clear();
      await db.vitals.clear();
      await db.voiceNotes.clear();
      await db.settings.clear();
      await db.userProfile.clear();
      
      toast({
        title: 'Data cleared',
        description: 'All data has been cleared',
      });
      
      // Reset form
      form.reset({
        firstName: '',
        ageRange: undefined,
        height: undefined,
        alertThresholds: {
          weightChangePercent: 5,
          heartRateMin: 60,
          heartRateMax: 100,
        },
        preferences: {
          voiceInputEnabled: true,
          darkMode: 'auto',
          notifications: true,
        },
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear data',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, preferences, and data
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name (Optional)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md mt-1"
                  {...form.register('firstName')}
                  placeholder="Enter your first name or nickname"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Age Range</label>
                <select className="w-full p-2 border rounded-md mt-1" {...form.register('ageRange')}>
                  <option value="">Select age range</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46-55">46-55</option>
                  <option value="56-65">56-65</option>
                  <option value="65+">65+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Height (cm) - Optional</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md mt-1"
                {...form.register('height', { valueAsNumber: true })}
                placeholder="Enter your height in centimeters"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for BMI calculation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Alert Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Weight Change Alert (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md mt-1"
                  {...form.register('alertThresholds.weightChangePercent', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alert when weight changes by this percentage
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Min Heart Rate (bpm)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md mt-1"
                  {...form.register('alertThresholds.heartRateMin', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Heart Rate (bpm)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md mt-1"
                  {...form.register('alertThresholds.heartRateMax', { valueAsNumber: true })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register('preferences.voiceInputEnabled')}
                />
                <span className="text-sm">Enable voice input for notes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register('preferences.notifications')}
                />
                <span className="text-sm">Enable notifications</span>
              </label>
            </div>
            <div>
              <label className="text-sm font-medium">Theme</label>
              <select className="w-full p-2 border rounded-md mt-1" {...form.register('preferences.darkMode')}>
                <option value="auto">Auto (System)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={handleClearData}
                className="w-full md:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently delete all your data. Make sure to export first if you want to keep a backup.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}