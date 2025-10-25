'use client';

import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Check, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { db, type Medication, type MedicationLog, type Vitals } from '@/lib/database';
import { useVoiceRecognition } from '@/lib/voice';
import { sanitizeText } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dailyCheckInSchema, type DailyCheckInData } from '@/lib/validations';

interface DailyCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

type Step = 'medications' | 'vitals' | 'notes';

export function DailyCheckInModal({ open, onOpenChange, onComplete }: DailyCheckInModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('medications');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationStatuses, setMedicationStatuses] = useState<Record<number, 'taken' | 'skipped'>>({});
  const [voiceText, setVoiceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [piiWarnings, setPiiWarnings] = useState<string[]>([]);
  const { toast } = useToast();
  
  const voice = useVoiceRecognition();

  const form = useForm<DailyCheckInData>({
    resolver: zodResolver(dailyCheckInSchema),
    defaultValues: {
      medications: [],
      vitals: {
        systolic: 120,
        diastolic: 80,
        heartRate: 70,
        weight: 150,
      },
      voiceNote: '',
    },
  });

  useEffect(() => {
    if (open) {
      loadMedications();
      loadLastVitals();
    }
  }, [open]);

  useEffect(() => {
    if (voice.isListening !== isRecording) {
      setIsRecording(voice.isListening);
    }
  }, [voice.isListening, isRecording]);

  const loadMedications = async () => {
    try {
      const meds = await db.medications.toArray();
      setMedications(meds);
      
      // Initialize medication statuses
      const statuses: Record<number, 'taken' | 'skipped'> = {};
      meds.forEach(med => {
        statuses[med.id!] = 'taken'; // Default to taken
      });
      setMedicationStatuses(statuses);
    } catch (error) {
      console.error('Failed to load medications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load medications',
        variant: 'destructive',
      });
    }
  };

  const loadLastVitals = async () => {
    try {
      const lastVitals = await db.vitals.orderBy('recordedAt').reverse().first();
      if (lastVitals) {
        form.setValue('vitals', {
          systolic: lastVitals.systolic,
          diastolic: lastVitals.diastolic,
          heartRate: lastVitals.heartRate,
          weight: lastVitals.weight,
          temperature: lastVitals.temperature,
          spO2: lastVitals.spO2,
        });
      }
    } catch (error) {
      console.error('Failed to load last vitals:', error);
    }
  };

  const handleMedicationToggle = (medicationId: number, status: 'taken' | 'skipped') => {
    setMedicationStatuses(prev => ({
      ...prev,
      [medicationId]: status,
    }));
  };

  const handleAllTaken = () => {
    const statuses: Record<number, 'taken' | 'skipped'> = {};
    medications.forEach(med => {
      statuses[med.id!] = 'taken';
    });
    setMedicationStatuses(statuses);
  };

  const handleVoiceStart = () => {
    if (!voice.isSupported) {
      toast({
        title: 'Voice not supported',
        description: 'Voice input is not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    voice.onResult((result) => {
      if (result.isFinal) {
        const { sanitized, warnings } = sanitizeText(result.text);
        setVoiceText(sanitized);
        setPiiWarnings(warnings);
        form.setValue('voiceNote', sanitized);
      }
    });

    voice.onError((error) => {
      toast({
        title: 'Voice recognition error',
        description: error,
        variant: 'destructive',
      });
      setIsRecording(false);
    });

    voice.start();
  };

  const handleVoiceStop = () => {
    voice.stop();
  };

  const handleNext = () => {
    if (currentStep === 'medications') {
      setCurrentStep('vitals');
    } else if (currentStep === 'vitals') {
      setCurrentStep('notes');
    }
  };

  const handleBack = () => {
    if (currentStep === 'vitals') {
      setCurrentStep('medications');
    } else if (currentStep === 'notes') {
      setCurrentStep('vitals');
    }
  };

  const handleSubmit = async (data: DailyCheckInData) => {
    try {
      // Save medication logs
      const medicationLogs: Omit<MedicationLog, 'id'>[] = medications.map(med => ({
        medicationId: med.id!,
        takenAt: new Date(),
        status: medicationStatuses[med.id!] || 'skipped',
      }));

      await db.medicationLogs.bulkAdd(medicationLogs);

      // Save vitals
      await db.vitals.add({
        ...data.vitals,
        recordedAt: new Date(),
      });

      // Save voice note if present
      if (data.voiceNote && data.voiceNote.trim()) {
        await db.voiceNotes.add({
          text: data.voiceNote,
          createdAt: new Date(),
        });
      }

      toast({
        title: 'Check-in completed',
        description: 'Your daily check-in has been saved successfully',
      });

      onComplete();
      onOpenChange(false);
      
      // Reset form
      form.reset();
      setMedicationStatuses({});
      setVoiceText('');
      setPiiWarnings([]);
      setCurrentStep('medications');
    } catch (error) {
      console.error('Failed to save check-in:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your check-in. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daily Check-In</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {(['medications', 'vitals', 'notes'] as Step[]).map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step
                      ? 'bg-primary text-primary-foreground'
                      : index < (['medications', 'vitals', 'notes'].indexOf(currentStep))
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className="w-8 h-0.5 bg-muted mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Medications */}
          {currentStep === 'medications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Medications</h3>
                <p className="text-sm text-muted-foreground">
                  Mark your medications as taken or skipped
                </p>
              </div>
              
              {medications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No medications scheduled. Add medications in settings to track them.
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAllTaken}
                    >
                      Mark All Taken
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {medications.map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {med.dose} {med.unit}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={medicationStatuses[med.id!] === 'taken' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleMedicationToggle(med.id!, 'taken')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Taken
                          </Button>
                          <Button
                            variant={medicationStatuses[med.id!] === 'skipped' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleMedicationToggle(med.id!, 'skipped')}
                          >
                            <XIcon className="h-4 w-4 mr-1" />
                            Skipped
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Vitals */}
          {currentStep === 'vitals' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Vitals</h3>
                <p className="text-sm text-muted-foreground">
                  Record your current vital signs
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Systolic BP</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    {...form.register('vitals.systolic', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Diastolic BP</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    {...form.register('vitals.diastolic', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    {...form.register('vitals.heartRate', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Weight (lbs)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    {...form.register('vitals.weight', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-2 border rounded-md"
                    {...form.register('vitals.temperature', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SpO2 (%)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    {...form.register('vitals.spO2', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Voice Notes */}
          {currentStep === 'notes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Voice Notes (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Record a quick note about how you're feeling
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isRecording ? 'destructive' : 'outline'}
                    onClick={isRecording ? handleVoiceStop : handleVoiceStart}
                    disabled={!voice.isSupported}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Mic className="h-4 w-4 mr-2" />
                    )}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                  {!voice.isSupported && (
                    <span className="text-sm text-muted-foreground">
                      Voice input not supported in this browser
                    </span>
                  )}
                </div>
                
                {voiceText && (
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <div className="text-sm font-medium mb-2">Transcribed text:</div>
                    <div className="text-sm">{voiceText}</div>
                    {piiWarnings.length > 0 && (
                      <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                        <div className="font-medium">PII Detected:</div>
                        <ul className="list-disc list-inside">
                          {piiWarnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Manual Notes</label>
                  <textarea
                    className="w-full p-2 border rounded-md h-20 resize-none"
                    placeholder="Add any additional notes..."
                    {...form.register('voiceNote')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 'medications' ? () => onOpenChange(false) : handleBack}
            >
              {currentStep === 'medications' ? 'Cancel' : 'Back'}
            </Button>
            
            {currentStep === 'notes' ? (
              <Button onClick={form.handleSubmit(handleSubmit)}>
                Complete Check-In
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}