'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Pill, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicationForm } from '@/components/medication-form';
import { db, type Medication } from '@/lib/database';
import { formatTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const meds = await db.medications.orderBy('name').toArray();
      setMedications(meds);
    } catch (error) {
      console.error('Failed to load medications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load medications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMedication(null);
    setIsFormOpen(true);
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    try {
      await db.medications.delete(id);
      await db.medicationLogs.where('medicationId').equals(id).delete();
      await loadMedications();
      toast({
        title: 'Success',
        description: 'Medication deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete medication:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete medication',
        variant: 'destructive',
      });
    }
  };

  const handleFormComplete = () => {
    setIsFormOpen(false);
    setEditingMedication(null);
    loadMedications();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground">
            Manage your medication schedule and tracking
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Medications List */}
      {medications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No medications added</h3>
            <p className="text-muted-foreground mb-4">
              Add your first medication to start tracking
            </p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((medication) => (
            <Card key={medication.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {medication.dose} {medication.unit}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(medication)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(medication.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Schedule */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Schedule
                  </h4>
                  <div className="space-y-1">
                    {medication.schedule
                      .filter(sched => sched.enabled)
                      .map((sched, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{formatTime(new Date(`2000-01-01T${sched.time}`))}</span>
                          <div className="flex items-center space-x-1">
                            {sched.days.map(day => (
                              <span key={day} className="text-xs bg-muted px-1 rounded">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Refill Tracking */}
                {medication.remainingPills !== undefined && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Refill Tracking</h4>
                    <div className="text-sm text-muted-foreground">
                      {medication.remainingPills} pills remaining
                    </div>
                  </div>
                )}

                {/* Notes */}
                {medication.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {medication.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Medication Form Modal */}
      <MedicationForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        medication={editingMedication}
        onComplete={handleFormComplete}
      />
    </div>
  );
}