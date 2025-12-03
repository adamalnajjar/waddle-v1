import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to safely access localStorage
const getStoredTheme = (): Theme => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('waddle-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
  } catch {
    // localStorage might be blocked (Firefox privacy mode, etc.)
  }
  return 'system';
};

const setStoredTheme = (theme: Theme) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('waddle-theme', theme);
    }
  } catch {
    // localStorage might be blocked
  }
};

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Apply theme to DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    
    setResolvedTheme(resolved);
    
    // Apply to document - try multiple methods for Firefox compatibility
    const root = document.documentElement;
    
    // Method 1: classList
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    
    // Method 2: data attribute
    root.setAttribute('data-theme', resolved);
    
    // Method 3: style property (Firefox fallback)
    root.style.colorScheme = resolved;
  }, []);

  // Set theme (called by user action)
  const setTheme = useCallback((newTheme: Theme) => {
    // Update state
    setThemeState(newTheme);
    
    // Store in localStorage
    setStoredTheme(newTheme);
    
    // Apply immediately to DOM (don't wait for React re-render)
    applyTheme(newTheme);
    
    // Force a re-render by toggling a class (Firefox workaround)
    requestAnimationFrame(() => {
      document.body.style.display = 'none';
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
    });
  }, [applyTheme]);

  // Initialize on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);
    setMounted(true);
  }, [applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

