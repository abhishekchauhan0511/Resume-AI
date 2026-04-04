import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

type Mode = 'login' | 'signup' | 'forgot';

export default function Login() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) { toast.error('Please enter your email'); return; }
    if (mode !== 'forgot' && !password) { toast.error('Please enter your password'); return; }
    if (mode !== 'forgot' && password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success('Password reset email sent! Check your inbox.');
        setMode('login');

      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Account created! Please check your email to verify.');

      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully!');
        window.location.href = '/';
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: { title: 'Welcome back!', subtitle: 'Login to your account' },
    signup: { title: 'Create your account', subtitle: 'Start analyzing resumes for free' },
    forgot: { title: 'Forgot Password?', subtitle: 'Enter your email to reset password' },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">📄</span>
            <span className="text-2xl font-bold text-primary">ResumeAI</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{titles[mode].title}</h1>
          <p className="text-muted-foreground mt-1">{titles[mode].subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-foreground mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password - hidden in forgot mode */}
          {mode !== 'forgot' && (
            <div className="mb-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'login' && (
            <div className="text-right mb-4">
              <button onClick={() => setMode('forgot')} className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={loading} className="w-full gap-2 mt-2" size="lg">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Please wait...</>
            ) : mode === 'forgot' ? '📧 Send Reset Email' : mode === 'signup' ? '🚀 Create Account' : '🔑 Login'}
          </Button>

          {/* Back to login from forgot */}
          {mode === 'forgot' && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Remember your password?
              <button onClick={() => setMode('login')} className="text-primary font-medium ml-1 hover:underline">
                Back to Login
              </button>
            </p>
          )}

          {/* Toggle login/signup */}
          {mode !== 'forgot' && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="text-primary font-medium ml-1 hover:underline">
                {mode === 'signup' ? 'Login' : 'Sign Up'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}