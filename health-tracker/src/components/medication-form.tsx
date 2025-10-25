'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicationFormSchema, type MedicationFormData } from '@/lib/validations';
import { db, type Medication } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface MedicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication?: Medication | null;
  onComplete: () => void;
}

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function MedicationForm({ open, onOpenChange, medication, onComplete }: MedicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: '',
      dose: 1,
      unit: 'mg',
      schedule: [
        {
          id: crypto.randomUUID(),
          time: '08:00',
          days: [1, 2, 3, 4, 5], // Weekdays
          enabled: true,
        },
      ],
      notes: '',
      remainingPills: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedule',
  });

  useEffect(() => {
    if (medication) {
      form.reset({
        name: medication.name,
        dose: medication.dose,
        unit: medication.unit,
        schedule: medication.schedule,
        notes: medication.notes || '',
        remainingPills: medication.remainingPills,
      });
    } else {
      form.reset({
        name: '',
        dose: 1,
        unit: 'mg',
        schedule: [
          {
            id: crypto.randomUUID(),
            time: '08:00',
            days: [1, 2, 3, 4, 5],
            enabled: true,
          },
        ],
        notes: '',
        remainingPills: undefined,
      });
    }
  }, [medication, form]);

  const onSubmit = async (data: MedicationFormData) => {
    setIsSubmitting(true);
    try {
      if (medication) {
        // Update existing medication
        await db.medications.update(medication.id!, {
          ...data,
          updatedAt: new Date(),
        });
        toast({
          title: 'Success',
          description: 'Medication updated successfully',
        });
      } else {
        // Create new medication
        await db.medications.add({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast({
          title: 'Success',
          description: 'Medication added successfully',
        });
      }
      onComplete();
    } catch (error) {
      console.error('Failed to save medication:', error);
      toast({
        title: 'Error',
        description: 'Failed to save medication',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSchedule = () => {
    append({
      id: crypto.randomUUID(),
      time: '12:00',
      days: [],
      enabled: true,
    });
  };

  const removeSchedule = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {medication ? 'Edit Medication' : 'Add Medication'}
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Medication Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md mt-1"
                  {...form.register('name')}
                  placeholder="e.g., Metformin"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Dose</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border rounded-md mt-1"
                  {...form.register('dose', { valueAsNumber: true })}
                />
                {form.formState.errors.dose && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.dose.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Unit</label>
                <select className="w-full p-2 border rounded-md mt-1" {...form.register('unit')}>
                  <option value="mg">mg</option>
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="tablet">tablet</option>
                  <option value="capsule">capsule</option>
                  <option value="drops">drops</option>
                  <option value="units">units</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Remaining Pills (Optional)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md mt-1"
                  {...form.register('remainingPills', { valueAsNumber: true })}
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            {/* Schedule */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Schedule
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addSchedule}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Schedule {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSchedule(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <input
                          type="time"
                          className="w-full p-2 border rounded-md mt-1"
                          {...form.register(`schedule.${index}.time`)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Days</label>
                        <div className="mt-1 space-y-2">
                          {DAYS.map((day) => (
                            <label key={day.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                value={day.value}
                                {...form.register(`schedule.${index}.days`, {
                                  setValueAs: (value) => {
                                    const currentDays = form.getValues(`schedule.${index}.days`) || [];
                                    if (value) {
                                      return [...currentDays, day.value];
                                    } else {
                                      return currentDays.filter((d: number) => d !== day.value);
                                    }
                                  },
                                })}
                                checked={form.watch(`schedule.${index}.days`)?.includes(day.value) || false}
                                onChange={(e) => {
                                  const currentDays = form.getValues(`schedule.${index}.days`) || [];
                                  if (e.target.checked) {
                                    form.setValue(`schedule.${index}.days`, [...currentDays, day.value]);
                                  } else {
                                    form.setValue(`schedule.${index}.days`, currentDays.filter((d: number) => d !== day.value));
                                  }
                                }}
                              />
                              <span className="text-sm">{day.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...form.register(`schedule.${index}.enabled`)}
                        />
                        <span className="text-sm">Enable this schedule</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                className="w-full p-2 border rounded-md mt-1 h-20 resize-none"
                {...form.register('notes')}
                placeholder="Any additional notes about this medication..."
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
                {isSubmitting ? 'Saving...' : medication ? 'Update' : 'Add'} Medication
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}