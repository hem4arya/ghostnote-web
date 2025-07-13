'use client';

import React, { useState } from 'react';
import { CreatorCloneDashboard } from 'packages/ui-components/src/CreatorCloneDashboard';
import { CloneAlerts } from '@/features/transparency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'packages/ui-components/src/components/card';
import { Button } from 'packages/ui-components/src/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'packages/ui-components/src/components/tabs';
import { Shield, AlertTriangle, BarChart3, Settings } from 'lucide-react';

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  // In a real app, you would get the userId from your authentication system
  // For demo purposes, using a placeholder
  const userId = 'demo-user-123';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator Protection Dashboard</h1>
        <p className="text-gray-600">
          Monitor and manage clone detection for your notes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="clones" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Clone Management
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Protection Status
                </CardTitle>
                <CardDescription>
                  Your content is being monitored for unauthorized copying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Clone Detection</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Similarity Threshold</span>
                    <span className="text-sm">70%+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monitoring Frequency</span>
                    <span className="text-sm">Real-time</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common actions for managing detected clones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    View All Pending Actions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Export Clone Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Update Protection Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Content */}
          <CreatorCloneDashboard userId={userId} />
        </TabsContent>

        <TabsContent value="clones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clone Detection & Management</CardTitle>
              <CardDescription>
                Detailed view of all detected clones with management options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatorCloneDashboard userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Clone Alerts</CardTitle>
              <CardDescription>
                Real-time alerts about potential clones of your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CloneAlerts userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Protection Settings</CardTitle>
              <CardDescription>
                Configure how clone detection works for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detection Thresholds</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">High Similarity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">90%+</div>
                        <p className="text-xs text-gray-600">Auto-flagged as clone</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Medium Similarity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">70-89%</div>
                        <p className="text-xs text-gray-600">Alert & review</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Low Similarity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">50-69%</div>
                        <p className="text-xs text-gray-600">Silent logging</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Get notified via email when clones are detected</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">In-App Alerts</p>
                        <p className="text-sm text-gray-600">Show alerts in the dashboard</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Actions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Request Takedown</p>
                        <p className="text-sm text-gray-600">Automatically request takedown for 95%+ similarity</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Message Templates</p>
                        <p className="text-sm text-gray-600">Customize default messages to cloners</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
