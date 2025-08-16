'use client';

import Navbar from '@/components/navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/shared/ui/components/button';
import { Card } from '@/components/shared/ui/components/card';

export default function AuthDemo() {
  const { user, isAuthenticated, loading, signOut } = useAuth();

  const handleLoginClick = () => {
    console.log('Login clicked from navbar');
  };

  const handleSignUpClick = () => {
    console.log('Signup clicked from navbar');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghost-dark via-ghost-gray to-ghost-dark">
      {/* Navbar */}
      <Navbar
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Supabase Authentication Demo
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Test the integrated authentication system in the navbar
            </p>
          </div>

          {/* Auth Status Card */}
          <Card className="p-6 bg-ghost-dark/50 border-ghost-purple/30 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Status</h2>
            
            {loading ? (
              <div className="text-gray-300">Loading authentication state...</div>
            ) : isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="text-green-400 font-semibold">✅ Authenticated</div>
                <div className="space-y-2 text-gray-300">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.user_metadata?.full_name || 'Not set'}</p>
                  <p><strong>Created:</strong> {new Date(user.created_at || '').toLocaleDateString()}</p>
                  <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || '').toLocaleDateString()}</p>
                </div>
                
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  Sign Out (Alternative)
                </Button>
              </div>
            ) : (
              <div className="text-red-400 font-semibold">❌ Not Authenticated</div>
            )}
          </Card>

          {/* Instructions Card */}
          <Card className="p-6 bg-ghost-dark/50 border-ghost-purple/30">
            <h2 className="text-2xl font-bold text-white mb-4">How to Test</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-ghost-neon font-bold">1.</span>
                <span>Click the &quot;Login&quot; button in the navbar (top right)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ghost-neon font-bold">2.</span>
                <span>Create a new account or sign in with existing credentials</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ghost-neon font-bold">3.</span>
                <span>Watch the navbar change from &quot;Login&quot; to showing your name with a dropdown</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ghost-neon font-bold">4.</span>
                <span>Check your email for verification (for new accounts)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ghost-neon font-bold">5.</span>
                <span>Use the user dropdown or mobile menu to sign out</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-ghost-purple/20 rounded-lg border border-ghost-purple/30">
              <h3 className="text-lg font-semibold text-white mb-2">Features Implemented:</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>✅ Login/Logout button based on auth status</li>
                <li>✅ Success notifications with react-toastify</li>
                <li>✅ Global auth state with useAuth hook</li>
                <li>✅ User dropdown with email display</li>
                <li>✅ Mobile menu with auth options</li>
                <li>✅ Supabase backend integration</li>
                <li>✅ Email verification flow</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
