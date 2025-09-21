import React from 'react';
import { useTheme } from './ThemeProvider';
import Icon from '../AppIcon';

const ThemeToggle = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth ${className}`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Icon 
        name={theme === 'light' ? 'Moon' : 'Sun'} 
        size={20} 
      />
    </button>
  );
};

export default ThemeToggle;