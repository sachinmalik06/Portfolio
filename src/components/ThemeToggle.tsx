import { useTheme } from '@/components/providers/ThemeProvider';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <div className="checkbox-wrapper-41">
      <input
        type="checkbox"
        checked={theme === 'light'}
        onChange={handleToggle}
        aria-label="Toggle theme"
      />
    </div>
  );
}

