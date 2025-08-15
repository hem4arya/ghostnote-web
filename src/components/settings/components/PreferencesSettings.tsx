/**
 * PreferencesSettings Component
 * User preferences and configuration settings
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/components/card';
import { Settings } from 'lucide-react';
import type { PreferencesSettingsProps } from '../types';

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = () => {
  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Preferences</CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Additional preference settings will be available here in future updates.
        </p>
      </CardContent>
    </Card>
  );
};