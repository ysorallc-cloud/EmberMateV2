'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/database';

export function DisclaimerModal() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkDisclaimerStatus();
  }, []);

  const checkDisclaimerStatus = async () => {
    try {
      const disclaimerSetting = await db.settings.get('disclaimerAccepted');
      setShowModal(!disclaimerSetting?.value);
    } catch (error) {
      console.error('Failed to check disclaimer status:', error);
      setShowModal(true); // Show modal if we can't check status
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await db.settings.put({
        key: 'disclaimerAccepted',
        value: true,
        updatedAt: new Date(),
      });
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save disclaimer acceptance:', error);
    }
  };

  if (isLoading || !showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-2">Not HIPAA Compliant</p>
                <p>
                  This application is for informational purposes only and is NOT HIPAA compliant. 
                  Do not enter sensitive personal health information, medical record numbers, 
                  or any data that could identify you or others.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-2">Local Data Only</p>
                <p>
                  All data is stored locally on your device using IndexedDB. No data is sent to 
                  external servers or cloud services. You can export your data at any time.
                </p>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium text-foreground mb-2">Allowed Information Only:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>First name or nickname (optional)</li>
                <li>Age range (not exact birth date)</li>
                <li>Medication names and dosages</li>
                <li>Vital signs (blood pressure, heart rate, weight)</li>
                <li>General health notes</li>
              </ul>
            </div>
            
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <p className="font-medium text-destructive mb-2">Do NOT Enter:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                <li>Full names, addresses, or phone numbers</li>
                <li>Social Security Numbers or MRNs</li>
                <li>Insurance information</li>
                <li>Exact birth dates</li>
                <li>Healthcare provider names</li>
                <li>Any personally identifiable information</li>
              </ul>
            </div>
            
            <p className="text-center font-medium">
              By clicking "I Understand", you acknowledge that you have read and 
              agree to these terms and will use this application responsibly.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleAccept}
              size="lg"
              className="px-8"
            >
              I Understand
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}