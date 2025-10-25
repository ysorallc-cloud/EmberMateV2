'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Heart, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Medications', href: '/medications', icon: Pill },
  { name: 'Vitals', href: '/vitals', icon: Heart },
  { name: 'Trends', href: '/trends', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}