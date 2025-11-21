
import React from 'react';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface NotificationSettings {
    eventAnnouncements: boolean;
    bookingUpdates: boolean;
    recommendations: boolean;
}

interface NotificationsSettingsPageProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
    </label>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-lg font-bold text-gray-300 px-2 mt-8 mb-3">{title}</h2>
);

const SettingRow: React.FC<{
    title: string;
    description: string;
    action: 'toggle' | 'navigate';
    checked?: boolean;
    onToggle?: () => void;
}> = ({ title, description, action, checked, onToggle }) => (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
        <div className="flex-grow pr-4">
            <h3 className="font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className="flex-shrink-0">
            {action === 'toggle' && checked !== undefined && onToggle && <ToggleSwitch checked={checked} onChange={onToggle} />}
            {action === 'navigate' && <button><ChevronRightIcon className="w-5 h-5 text-gray-500" /></button>}
        </div>
    </div>
);


export const NotificationsSettingsPage: React.FC<NotificationsSettingsPageProps> = ({ settings, onSettingsChange }) => {
  
  const handleToggle = (key: keyof NotificationSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };
  
  return (
    <div className="p-4 md:p-8 animate-fade-in text-white">
        <div className="space-y-3">
            <SectionHeader title="General" />
            <div className="space-y-2">
                <SettingRow 
                  title="New Event Announcements" 
                  description="Be the first to know about new events and experiences." 
                  action="toggle" 
                  checked={settings.eventAnnouncements} 
                  onToggle={() => handleToggle('eventAnnouncements')}
                />
                <SettingRow 
                  title="Booking Status Updates" 
                  description="Stay informed about your booking confirmations, changes, and reminders." 
                  action="toggle" 
                  checked={settings.bookingUpdates}
                  onToggle={() => handleToggle('bookingUpdates')}
                />
            </div>

            <SectionHeader title="Personalized" />
            <div className="space-y-2">
                 <SettingRow 
                    title="AI Concierge Recommendations" 
                    description="Receive personalized suggestions from our AI concierge." 
                    action="toggle" 
                    checked={settings.recommendations}
                    onToggle={() => handleToggle('recommendations')}
                 />
                 <SettingRow 
                    title="Promotional Offers" 
                    description="Get exclusive deals and promotions tailored to your preferences." 
                    action="toggle" 
                 />
                 <SettingRow 
                    title="Community Activity" 
                    description="See updates on community interactions, like comments and reactions." 
                    action="toggle" 
                 />
            </div>
            
        </div>
    </div>
  );
};
