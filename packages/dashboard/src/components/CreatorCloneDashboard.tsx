import React, { useState, useEffect, useCallback } from 'react';
// import { supabase } from '../../../../supabase'; 
// Mock supabase for compilation
const supabase = {
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  }),
  functions: {
    invoke: async (name: string, options?: any) => ({ 
      data: { 
        data: [], 
        stats: {
          total_notes_created: 0,
          total_clones_detected: 0,
          high_similarity_clones: 0,
          pending_actions: 0,
          takedown_requests: 0,
          allowed_resales: 0,
          denied_resales: 0
        },
        success: true,
        message: 'Mock response' 
      }, 
      error: null 
    })
  }
}; 
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Badge } from '@/components/badge';
import { Textarea } from '@/components/textarea';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { 
  AlertTriangle, 
  Eye, 
  MessageCircle, 
  Ban, 
  Check, 
  X, 
  TrendingUp,
  FileText,
  Shield
} from 'lucide-react';

// React 19 compatible icon wrappers
const AlertTriangleIcon = AlertTriangle as React.ElementType;
const EyeIcon = Eye as React.ElementType;
const MessageCircleIcon = MessageCircle as React.ElementType;
const BanIcon = Ban as React.ElementType;
const CheckIcon = Check as React.ElementType;
const XIcon = X as React.ElementType;
const TrendingUpIcon = TrendingUp as React.ElementType;
const FileTextIcon = FileText as React.ElementType;
const ShieldIcon = Shield as React.ElementType;

interface CloneInfo {
  clone_id: number;
  note: {
    id: number;
    title: string;
    created_at: string;
  };
  cloner: {
    user_id: string;
    username: string;
    is_anonymous: boolean;
  };
  similarity_score: number;
  status: 'CLONE' | 'POTENTIAL_COPY';
  creator_action: 'PENDING' | 'ALLOWED' | 'DENIED' | 'TAKEDOWN_REQUESTED';
  resale_allowed: boolean | null;
  detected_at: string;
  last_action_at: string | null;
}

interface OriginalNoteWithClones {
  original_note: {
    id: number;
    title: string;
    created_at: string;
  };
  clones: CloneInfo[];
}

interface CreatorStats {
  total_notes_created: number;
  total_clones_detected: number;
  high_similarity_clones: number;
  pending_actions: number;
  takedown_requests: number;
  allowed_resales: number;
  denied_resales: number;
}

interface CreatorCloneDashboardProps {
  userId: string;
}

export function CreatorCloneDashboard({ userId }: CreatorCloneDashboardProps) {
  const [dashboardData, setDashboardData] = useState<OriginalNoteWithClones[]>([]);
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedClone, setSelectedClone] = useState<CloneInfo | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('creator-clone-dashboard', {
        body: {
          action: 'get_dashboard',
          creator_user_id: userId,
        },
      });

      if (error) throw error;
      setDashboardData(data?.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [userId]);

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('creator-clone-dashboard', {
        body: {
          action: 'get_stats',
          creator_user_id: userId,
        },
      });

      if (error) throw error;
      setStats(data?.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [userId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardData(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchDashboardData, fetchStats]);

  const handleCreatorAction = async (
    cloneId: number,
    actionType: string,
    message?: string,
    resaleDecision?: boolean
  ) => {
    setActionLoading(cloneId);
    try {
      const { data, error } = await supabase.functions.invoke('creator-clone-dashboard', {
        body: {
          action: 'handle_action',
          creator_user_id: userId,
          clone_id: cloneId,
          action_type: actionType,
          message,
          resale_decision: resaleDecision,
        },
      });

      if (error) throw error;

      if (data.success) {
        await fetchDashboardData(); // Refresh data
        await fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error handling creator action:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedClone) return;

    setActionLoading(selectedClone.clone_id);
    try {
      const { data, error } = await supabase.functions.invoke('creator-clone-dashboard', {
        body: {
          action: 'send_message',
          creator_user_id: userId,
          clone_id: selectedClone.clone_id,
          message_subject: messageSubject,
          message_body: messageBody,
        },
      });

      if (error) throw error;

      if (data.success) {
        setShowMessageModal(false);
        setMessageSubject('');
        setMessageBody('');
        setSelectedClone(null);
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setActionLoading(null);
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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'ALLOWED':
        return 'bg-green-100 text-green-800';
      case 'DENIED':
        return 'bg-red-100 text-red-800';
      case 'TAKEDOWN_REQUESTED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading creator dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_notes_created}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clones Detected</CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_clones_detected}</div>
              <p className="text-xs text-muted-foreground">
                {stats.high_similarity_clones} high similarity (90%+)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_actions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Takedown Requests</CardTitle>
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.takedown_requests}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Clone Detection Dashboard</h2>
        
        {dashboardData.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Clones Detected</CardTitle>
              <CardDescription>
                No clones with 70%+ similarity have been detected for your notes.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          dashboardData.map((noteData) => (
            <Card key={noteData.original_note.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Original Note: {noteData.original_note.title}</span>
                  <Badge variant="outline">
                    {noteData.clones.length} clone{noteData.clones.length !== 1 ? 's' : ''} detected
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Created on {new Date(noteData.original_note.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {noteData.clones.map((clone) => (
                  <Card key={clone.clone_id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{clone.note.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>By: {clone.cloner.is_anonymous ? 'Anonymous User' : clone.cloner.username}</span>
                            <span>•</span>
                            <span>Created: {new Date(clone.note.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(clone.status)}>
                            {clone.status === 'CLONE' ? 'Clone' : 'Potential Copy'}
                          </Badge>
                          <Badge variant="outline">
                            {clone.similarity_score}% similar
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className={getActionColor(clone.creator_action)}>
                          {clone.creator_action}
                        </Badge>
                        {clone.resale_allowed !== null && (
                          <Badge className={clone.resale_allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            Resale {clone.resale_allowed ? 'Allowed' : 'Denied'}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/notes/${clone.note.id}`, '_blank')}
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View Clone
                        </Button>

                        {!clone.cloner.is_anonymous && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedClone(clone);
                              setMessageSubject(`Regarding your note: ${clone.note.title}`);
                              setMessageBody(`Hello,\n\nI noticed that your note "${clone.note.title}" appears to be very similar (${clone.similarity_score}% match) to my original note "${noteData.original_note.title}".\n\nI'd like to discuss this with you.\n\nBest regards`);
                              setShowMessageModal(true);
                            }}
                          >
                            <MessageCircleIcon className="h-4 w-4 mr-2" />
                            Message User
                          </Button>
                        )}

                        {clone.creator_action === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreatorAction(clone.clone_id, 'RESALE_ALLOWED', undefined, true)}
                              disabled={actionLoading === clone.clone_id}
                            >
                              <CheckIcon className="h-4 w-4 mr-2" />
                              Allow Resale
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreatorAction(clone.clone_id, 'RESALE_DENIED', undefined, false)}
                              disabled={actionLoading === clone.clone_id}
                            >
                              <XIcon className="h-4 w-4 mr-2" />
                              Deny Resale
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCreatorAction(clone.clone_id, 'TAKEDOWN_REQUESTED', 'Requesting takedown due to copyright infringement')}
                              disabled={actionLoading === clone.clone_id}
                            >
                              <BanIcon className="h-4 w-4 mr-2" />
                              Request Takedown
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedClone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle>Send Message to {selectedClone.cloner.username}</CardTitle>
              <CardDescription>
                Send a message regarding the similar content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Message subject"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Your message..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowMessageModal(false)} variant="outline">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageSubject || !messageBody || actionLoading === selectedClone.clone_id}
                >
                  <MessageCircleIcon className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
