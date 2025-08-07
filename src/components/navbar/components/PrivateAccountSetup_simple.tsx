import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getSupabaseClient } from '../../../../lib/supabase';
import { ClientDialog } from '@/components/shared/ClientDialog';
import { Button } from '@/components/shared/ui/components/button';
import { Input } from '@/components/shared/ui/components/input';
import { Label } from '@/components/shared/ui/components/label';

interface PrivateAccountSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrivateAccountSetup({ open, onOpenChange }: PrivateAccountSetupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const supabase = getSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Private Account"
      description="Set up your private account with email and password."
      className="sm:max-w-md bg-gradient-to-br from-card to-card/90 border-primary/20"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm your password"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </ClientDialog>
  );
}
