import React, { useState } from 'react';
import { supabase } from '@lib/supabase';
import { Button } from '@shared/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/components/card';
import { Badge } from '@shared/ui/components/badge';
import { AlertTriangle, Eye, Save } from 'lucide-react';

interface CloneWarning {
  warning_level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  similar_note_id?: number;
  similar_note_title?: string;
  original_user_id?: string;
  similarity_score?: number;
  message: string;
}

interface CloneWarningModalProps {
  userId: string;
  noteTitle: string;
  noteContent: string;
  onProceed: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

export function CloneWarningModal({
  userId,
  noteTitle,
  noteContent,
  onProceed,
  onCancel,
  isVisible,
}: CloneWarningModalProps) {
  const [warning, setWarning] = useState<CloneWarning | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkForCloneWarning = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-clone-warning', {
        body: {
          user_id: userId,
          note_title: noteTitle,
          note_content: noteContent,
        },
      });

      if (error) throw error;
      setWarning(data);
      setChecked(true);
    } catch (error) {
      console.error('Error checking for clone warning:', error);
      setWarning({
        warning_level: 'NONE',
        message: 'Unable to check for similar content',
      });
      setChecked(true);
    } finally {
      setLoading(false);
    }
  }, [userId, noteTitle, noteContent]);

  React.useEffect(() => {
    if (isVisible && !checked) {
      checkForCloneWarning();
    }
  }, [isVisible, checked, checkForCloneWarning]);

  const getWarningColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'border-red-500 bg-red-50';
      case 'MEDIUM':
        return 'border-yellow-500 bg-yellow-50';
      case 'LOW':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-2xl w-full ${getWarningColor(warning?.warning_level || 'NONE')}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Content Similarity Check
          </CardTitle>
          <CardDescription>
            Checking your content for similarity to existing notes...
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Analyzing content...</p>
            </div>
          ) : warning ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getBadgeColor(warning.warning_level)}>
                  {warning.warning_level} {warning.warning_level !== 'NONE' ? 'Similarity' : ''}
                </Badge>
                {warning.similarity_score && (
                  <Badge variant="outline">
                    {warning.similarity_score}% similar
                  </Badge>
                )}
              </div>

              <p className="text-sm">{warning.message}</p>

              {warning.warning_level !== 'NONE' && warning.similar_note_id && (
                <Card className="border-2 border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Similar note found:</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm font-medium mb-2">{warning.similar_note_title}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/notes/${warning.similar_note_id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Similar Note
                    </Button>
                  </CardContent>
                </Card>
              )}

              {warning.warning_level === 'HIGH' && (
                <div className="p-3 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                  <strong>High Similarity Warning:</strong> This content may be flagged as a clone.
                  Publishing very similar content may result in restrictions.
                </div>
              )}

              {warning.warning_level === 'MEDIUM' && (
                <div className="p-3 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                  <strong>Similarity Notice:</strong> The original creator will be notified about this similarity.
                </div>
              )}
            </div>
          ) : null}

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={onProceed} 
              className="flex-1"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {warning?.warning_level === 'HIGH' ? 'Publish Anyway' : 'Publish Note'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
