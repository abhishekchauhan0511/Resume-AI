import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span className="font-bold text-lg text-primary">ResumeAI</span>
        </Link>

        {/* Center Tab Buttons */}
        <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
          <Link to="/">
            <button
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📋 Screener
            </button>
          </Link>
          <Link to="/analytics">
  <button
    className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      location.pathname === '/analytics'
        ? 'bg-white text-primary shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    📊 Analytics
  </button>
</Link>
          <Link to="/builder">
            <button
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === '/builder'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔨 Builder
            </button>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:block">{user.email?.split('@')[0]}</span>
              </div>
              <Button size="sm" variant="outline" onClick={logout} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gap-1.5">
                🔑 Login
              </Button>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}