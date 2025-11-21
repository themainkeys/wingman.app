import React from 'react';
import { Page } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ShieldIcon, EyeIcon, QuestionMarkCircleIcon, FlagIcon } from './icons/FeatureIcons';
import { BellIcon } from './icons/BellIcon';
import { MoonIcon } from './icons/MoonIcon';
import { useTheme } from '../contexts/ThemeContext';
import { ToggleSwitch } from './ui/ToggleSwitch';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
}

// Reusable component for links
const SettingsLink: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 bg-[var(--color-card)] rounded-lg hover:bg-[var(--color-input)] transition-colors duration-200">
        <div className="text-[var(--color-accent)]">{icon}</div>
        <span className="font-semibold text-[var(--color-card-foreground)] flex-grow text-left">{label}</span>
        <ChevronRightIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
    </button>
);

// Reusable component for rows with toggles
const SettingsToggle: React.FC<{ icon: React.ReactNode, label: string, description: string, isEnabled: boolean, onToggle: () => void }> = ({ icon, label, description, isEnabled, onToggle }) => (
    <div className="w-full flex items-center gap-4 p-4 bg-[var(--color-card)] rounded-lg">
        <div className="text-[var(--color-accent)]">{icon}</div>
        <div className="flex-grow">
            <span className="font-semibold text-[var(--color-card-foreground)]">{label}</span>
            <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
        <ToggleSwitch checked={isEnabled} onChange={onToggle} label={label} />
    </div>
);

// Reusable component for section headers
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider px-1 mt-8 mb-3">{title}</h2>
);


export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <SectionHeader title="General" />
      <div className="space-y-3">
        <SettingsLink icon={<ShieldIcon className="w-6 h-6" />} label="Security" onClick={() => onNavigate('security')} />
        <SettingsLink icon={<EyeIcon className="w-6 h-6" />} label="Privacy" onClick={() => onNavigate('privacy')} />
        <SettingsLink icon={<BellIcon className="w-6 h-6" />} label="Notifications" onClick={() => onNavigate('notificationsSettings')} />
      </div>

      <SectionHeader title="Appearance" />
      <div className="space-y-3">
        <SettingsToggle 
            icon={<MoonIcon className="w-6 h-6" />}
            label="Dark Mode"
            description="Toggle between light and dark themes"
            isEnabled={isDarkMode}
            onToggle={toggleTheme}
        />
      </div>

      <SectionHeader title="Support" />
      <div className="space-y-3">
        <SettingsLink icon={<QuestionMarkCircleIcon className="w-6 h-6" />} label="Help & Support" onClick={() => onNavigate('help')} />
        <SettingsLink icon={<FlagIcon className="w-6 h-6" />} label="Report an Issue" onClick={() => onNavigate('reportIssue')} />
      </div>
    </div>
  );
};
