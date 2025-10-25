'use client';

import { useEffect } from 'react';
import { Dashboard } from '@/components/dashboard';
import { DisclaimerModal } from '@/components/disclaimer-modal';
import { db, initializeDefaultSettings } from '@/lib/database';

export default function Home() {
  useEffect(() => {
    // Initialize database and settings
    initializeDefaultSettings();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DisclaimerModal />
        <Dashboard />
      </div>
    </div>
  );
}
