'use client';

import React, { useState, useEffect } from 'react';
import { X, Heart, Weight, Thermometer, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vitalsFormSchema, type VitalsFormData } from '@/lib/validations';
import { db, type Vitals } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface VitalsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vitals?: Vitals | null;
  onComplete: () => void;
}

export function VitalsForm({ open, onOpenChange, vitals, onComplete }: VitalsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<VitalsFormData>({
    resolver: zodResolver(vitalsFormSchema),
    defaultValues: {
      systolic: 120,
      diastolic: 80,
      heartRate: 70,
      weight: 150,
      temperature: undefined,
      spO2: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (vitals) {
      form.reset({
        systolic: vitals.systolic,
        diastolic: vitals.diastolic,
        heartRate: vitals.heartRate,
        weight: vitals.weight,
        temperature: vitals.temperature,
        spO2: vitals.spO2,
        notes: vitals.notes || '',
      });
    } else {
      // Load last vitals for quick entry
      loadLastVitals();
    }
  }, [vitals, form]);

  const loadLastVitals = async () => {
    try {
      const lastVitals = await db.vitals.orderBy('recordedAt').reverse().first();
      if (lastVitals) {
        form.reset({
          systolic: lastVitals.systolic,
          diastolic: lastVitals.diastolic,
          heartRate: lastVitals.heartRate,
          weight: lastVitals.weight,
          temperature: lastVitals.temperature,
          spO2: lastVitals.spO2,
          notes: '',
        });
      }
    } catch (error) {
      console.error('Failed to load last vitals:', error);
    }
  };

  const onSubmit = async (data: VitalsFormData) => {
    setIsSubmitting(true);
    try {
      if (vitals) {
        // Update existing vitals
        await db.vitals.update(vitals.id!, {
          ...data,
          recordedAt: vitals.recordedAt, // Keep original time
        });
        toast({
          title: 'Success',
          description: 'Vitals updated successfully',
        });
      } else {
        // Create new vitals
        await db.vitals.add({
          ...data,
          recordedAt: new Date(),
        });
        toast({
          title: 'Success',
          description: 'Vitals recorded successfully',
        });
      }
      onComplete();
    } catch (error) {
      console.error('Failed to save vitals:', error);
      toast({
        title: 'Error',
        description: 'Failed to save vitals',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsePrevious = () => {
    loadLastVitals();
  };

  const handleQuickAdjust = (field: keyof VitalsFormData, delta: number) => {
    const currentValue = form.getValues(field);
    if (typeof currentValue === 'number') {
      form.setValue(field, currentValue + delta);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {vitals ? 'Edit Vitals' : 'Record Vitals'}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Quick Actions */}
            {!vitals && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUsePrevious}
                >
                  Use Previous Values
                </Button>
              </div>
            )}

            {/* Blood Pressure */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Blood Pressure
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Systolic (Top Number)</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuickAdjust('systolic', -5)}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      className="flex-1 p-2 border rounded-md text-center"
                      {...form.register('systolic', { valueAsNumber: true })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuickAdjust('systolic', 5)}
                    >
                      +
                    </Button>
                  </div>
                  {form.formState.errors.systolic && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.systolic.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Diastolic (Bottom Number)</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuickAdjust('diastolic', -5)}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      className="flex-1 p-2 border rounded-md text-center"
                      {...form.register('diastolic', { valueAsNumber: true })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuickAdjust('diastolic', 5)}
                    >
                      +
                    </Button>
                  </div>
                  {form.formState.errors.diastolic && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.diastolic.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Heart Rate and Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Heart Rate
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('heartRate', -5)}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    className="flex-1 p-2 border rounded-md text-center"
                    {...form.register('heartRate', { valueAsNumber: true })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('heartRate', 5)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">bpm</span>
                </div>
                {form.formState.errors.heartRate && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.heartRate.message}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Weight className="h-5 w-5 mr-2" />
                  Weight
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('weight', -1)}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    step="0.1"
                    className="flex-1 p-2 border rounded-md text-center"
                    {...form.register('weight', { valueAsNumber: true })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('weight', 1)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">lbs</span>
                </div>
                {form.formState.errors.weight && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.weight.message}
                  </p>
                )}
              </div>
            </div>

            {/* Optional Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Thermometer className="h-5 w-5 mr-2" />
                  Temperature (Optional)
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('temperature', -0.1)}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    step="0.1"
                    className="flex-1 p-2 border rounded-md text-center"
                    {...form.register('temperature', { valueAsNumber: true })}
                    placeholder="98.6"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('temperature', 0.1)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">°F</span>
                </div>
                {form.formState.errors.temperature && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.temperature.message}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  SpO2 (Optional)
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('spO2', -1)}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    className="flex-1 p-2 border rounded-md text-center"
                    {...form.register('spO2', { valueAsNumber: true })}
                    placeholder="98"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuickAdjust('spO2', 1)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                {form.formState.errors.spO2 && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.spO2.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                className="w-full p-2 border rounded-md mt-1 h-20 resize-none"
                {...form.register('notes')}
                placeholder="Any additional notes about your vitals..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : vitals ? 'Update' : 'Record'} Vitals
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}