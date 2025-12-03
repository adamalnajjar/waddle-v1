import React from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-[18px] w-[18px] text-amber-500" />;
      case 'dark':
        return <Moon className="h-[18px] w-[18px] text-blue-400" />;
      case 'system':
        return <SunMoon className="h-[18px] w-[18px] text-muted-foreground" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
        'hover:bg-muted/80 active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label={`${getLabel()}. Click to change theme.`}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
};
