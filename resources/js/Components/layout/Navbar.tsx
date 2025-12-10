import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button.tsx';
import { ThemeToggle } from '@/Components/ui/ThemeToggle.tsx';
import type { PageProps } from '@/types';
import {
  User,
  LogOut,
  Coins,
  Settings,
  LayoutDashboard,
  Briefcase,
  ChevronDown,
  ArrowRight,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';

export const Navbar: React.FC = () => {
  const { auth } = usePage<PageProps>().props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    const handleNavigate = () => {
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    };

    const removeListener = router.on('navigate', handleNavigate);
    return () => {
      removeListener();
    };
  }, []);

  const handleLogout = () => {
    router.post('/logout');
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isActiveLink = (path: string) => currentPath === path;

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={auth.user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/images/waddle-logo.svg"
                  alt="Waddle"
                  className="h-10 w-10 rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-foreground">Waddle</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {auth.user ? (
                <>
                  <NavLink href="/dashboard" active={isActiveLink('/dashboard')}>Dashboard</NavLink>
                  <NavLink href="/consultations" active={isActiveLink('/consultations')}>Consultations</NavLink>
                  <NavLink href="/tokens" active={isActiveLink('/tokens')}>Tokens</NavLink>
                </>
              ) : (
                <>
                  <NavLink href="/using-ai" active={isActiveLink('/using-ai')}>
                    <span className="flex items-center gap-1.5">
                      <Bot className="h-4 w-4" />
                      Using AI?
                    </span>
                  </NavLink>
                  <NavLink href="/pricing" active={isActiveLink('/pricing')}>Pricing</NavLink>
                  <NavLink href="/how-it-works" active={isActiveLink('/how-it-works')}>How It Works</NavLink>
                </>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {auth.user ? (
                <>
                  {/* Token Balance */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{auth.user.token_balance || 0}</span>
                  </div>

                  {/* User Menu */}
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all',
                        'hover:bg-muted/50 border border-transparent hover:border-border/50',
                        isUserMenuOpen && 'bg-muted/50 border-border/50'
                      )}
                    >
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden xl:block text-sm font-medium">{auth.user.first_name}</span>
                      <ChevronDown className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform',
                        isUserMenuOpen && 'rotate-180'
                      )} />
                    </button>

                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden animate-fade-up">
                          <div className="p-2">
                            <div className="px-3 py-2 mb-1">
                              <p className="text-sm font-medium">{auth.user.first_name} {auth.user.last_name}</p>
                              <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                            </div>
                            <div className="h-px bg-border my-1" />
                            <UserMenuItem href="/profile" icon={User}>Profile</UserMenuItem>
                            <UserMenuItem href="/settings" icon={Settings}>Settings</UserMenuItem>
                            {auth.user.is_consultant && (
                              <UserMenuItem href="/consultant" icon={Briefcase}>Consultant Dashboard</UserMenuItem>
                            )}
                            {auth.user.is_admin && (
                              <UserMenuItem href="/admin" icon={LayoutDashboard} external>Admin Panel</UserMenuItem>
                            )}
                            <div className="h-px bg-border my-1" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="shadow-lg shadow-primary/25">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Hamburger Menu Button */}
              <button
                className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span
                    className={cn(
                      "w-full h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center",
                      isMenuOpen && "rotate-45 translate-y-[7px]"
                    )}
                  />
                  <span
                    className={cn(
                      "w-full h-0.5 bg-foreground rounded-full transition-all duration-300",
                      isMenuOpen && "opacity-0 scale-0"
                    )}
                  />
                  <span
                    className={cn(
                      "w-full h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center",
                      isMenuOpen && "-rotate-45 -translate-y-[7px]"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Slide-in Panel */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 lg:hidden transition-opacity duration-300",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-72 max-w-[85vw] bg-card border-l border-border shadow-2xl lg:hidden",
          "transform transition-transform duration-300 ease-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel Content */}
        <div className="flex flex-col h-full pt-20">
          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {auth.user ? (
              <>
                <MobileNavLink
                  href="/dashboard"
                  active={isActiveLink('/dashboard')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink
                  href="/consultations"
                  active={isActiveLink('/consultations')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Consultations
                </MobileNavLink>
                <MobileNavLink
                  href="/tokens"
                  active={isActiveLink('/tokens')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center justify-between w-full">
                    Tokens
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      {auth.user.token_balance || 0}
                    </span>
                  </span>
                </MobileNavLink>

                <div className="h-px bg-border my-3" />

                <MobileNavLink
                  href="/profile"
                  active={isActiveLink('/profile')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </MobileNavLink>
                <MobileNavLink
                  href="/settings"
                  active={isActiveLink('/settings')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </MobileNavLink>

                {auth.user.is_consultant && (
                  <MobileNavLink
                    href="/consultant"
                    active={isActiveLink('/consultant')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Consultant Dashboard
                  </MobileNavLink>
                )}
                {auth.user.is_admin && (
                  <MobileNavLink
                    href="/admin"
                    active={isActiveLink('/admin')}
                    onClick={() => setIsMenuOpen(false)}
                    external
                  >
                    Admin Panel
                  </MobileNavLink>
                )}
              </>
            ) : (
              <>
                <MobileNavLink
                  href="/"
                  active={isActiveLink('/')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </MobileNavLink>
                <MobileNavLink
                  href="/using-ai"
                  active={isActiveLink('/using-ai')}
                  onClick={() => setIsMenuOpen(false)}
                  highlight
                >
                  <span className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Using AI?
                  </span>
                </MobileNavLink>
                <MobileNavLink
                  href="/pricing"
                  active={isActiveLink('/pricing')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </MobileNavLink>
                <MobileNavLink
                  href="/how-it-works"
                  active={isActiveLink('/how-it-works')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </MobileNavLink>
              </>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-3">
            {auth.user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{auth.user.first_name} {auth.user.last_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{auth.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full"
                >
                  <Button className="w-full">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Sub-components
const NavLink: React.FC<{ href: string; active: boolean; children: React.ReactNode }> = ({ href, active, children }) => (
  <Link
    href={href}
    className={cn(
      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
      active
        ? 'text-foreground bg-muted/50'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
    )}
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  highlight?: boolean;
  external?: boolean;
}> = ({ href, active, onClick, children, highlight, external }) => {
  if (external) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-muted/50",
          highlight && !active && "text-primary"
        )}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-muted/50",
        highlight && !active && "text-primary"
      )}
    >
      {children}
    </Link>
  );
};

const UserMenuItem: React.FC<{
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
}> = ({ href, icon: Icon, children, external }) => {
  if (external) {
    return (
      <a
        href={href}
        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors"
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {children}
    </Link>
  );
};
