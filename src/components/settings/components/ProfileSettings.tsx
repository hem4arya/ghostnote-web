/**
 * ProfileSettings Component
 * Profile information management component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/components/button';
import { Input } from '@/components/shared/ui/components/input';
import { Label } from '@/components/shared/ui/components/label';
import { Textarea } from '@/components/shared/ui/components/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/components/card';
import { Save, User } from 'lucide-react';
import type { ProfileSettingsProps, SettingsFormData } from '../types';

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  loading,
  onSave
}) => {
  const [formData, setFormData] = useState<SettingsFormData>({
    username: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  // Handle form input changes
  const handleInputChange = (field: keyof SettingsFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Profile Information</CardTitle>
            <CardDescription>
              Update your public profile information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-foreground">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Enter your username"
            className="bg-muted/30 border border-white/20 text-foreground transition-all duration-300 focus:outline-none focus:ring-0 focus:border-white/40 hover:border-white/30"
          />
          <p className="text-xs text-muted-foreground">
            This is your public display name. It can be your real name or a pseudonym.
          </p>
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-foreground">
            Bio
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us a little about yourself..."
            rows={4}
            className="bg-muted/30 border border-white/20 text-foreground transition-all duration-300 focus:outline-none focus:ring-0 focus:border-white/40 hover:border-white/30 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Brief description for your profile. Maximum 500 characters.
          </p>
        </div>

        {/* Account Info */}
        {profile && (
          <div className="pt-4 border-t border-border/50">
            <h3 className="text-sm font-medium text-foreground mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {profile.created_at && (
                <div>
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="ml-2 text-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {profile.updated_at && (
                <div>
                  <span className="text-muted-foreground">Last updated:</span>
                  <span className="ml-2 text-foreground">
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(0,255,65,0.3)] hover:border-[#00ff41] text-white font-medium px-6 py-2 transition-all duration-300 border border-transparent"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};