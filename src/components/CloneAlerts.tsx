import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Eye, X } from 'lucide-react';

interface CloneAlert {
  clone_id: number;
  source_note_id: number;
  source_note_title: string;
  suspect_note_id: number;
  suspect_note_title: string;
  suspect_user_id: string;
  similarity_score: number;
  status: 'CLONE' | 'POTENTIAL_COPY';
  created_at: string;
}

interface CloneAlertsProps {
  userId: string;
}

export function CloneAlerts({ userId }: CloneAlertsProps) {
  const [alerts, setAlerts] = useState<CloneAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCloneAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_clone_alerts_for_user', {
        p_user_id: userId,
      });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching clone alerts:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCloneAlerts();
  }, [fetchCloneAlerts]);

  const dismissAlert = async (cloneId: number) => {
    try {
      const { data, error } = await supabase.rpc('dismiss_clone_alert', {
        p_clone_id: cloneId,
        p_user_id: userId,
      });

      if (error) throw error;

      if (data) {
        // Remove the alert from the list
        setAlerts(alerts.filter(alert => alert.clone_id !== cloneId));
      }
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLONE':
        return 'bg-red-100 text-red-800';
      case 'POTENTIAL_COPY':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CLONE':
        return 'Clone Detected';
      case 'POTENTIAL_COPY':
        return 'Potential Copy';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading clone alerts...</div>;
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Clone Alerts
          </CardTitle>
          <CardDescription>
            No clone alerts at this time.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        Clone Alerts ({alerts.length})
      </h2>
      
      {alerts.map((alert) => (
        <Card key={alert.clone_id} className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  Similarity detected with your note
                </CardTitle>
                <CardDescription>
                  Someone has published content similar to your note
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.clone_id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(alert.status)}>
                {getStatusText(alert.status)}
              </Badge>
              <Badge variant="outline">
                {alert.similarity_score}% similar
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700">Your original note:</h4>
                <p className="text-sm bg-green-50 p-3 rounded border">
                  {alert.source_note_title}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`/notes/${alert.source_note_id}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Your Note
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-red-700">Similar note found:</h4>
                <p className="text-sm bg-red-50 p-3 rounded border">
                  {alert.suspect_note_title}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`/notes/${alert.suspect_note_id}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Similar Note
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Detected on {new Date(alert.created_at).toLocaleDateString()}
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                {alert.status === 'CLONE' 
                  ? 'This content has been automatically flagged as a potential clone due to high similarity (90%+).'
                  : 'This content has been marked as a potential copy due to significant similarity (70-89%). You may want to review it.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
