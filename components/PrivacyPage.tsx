

import React from 'react';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { UserIcon } from './icons/UserIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { CookieIcon } from './icons/CookieIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { Page } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const SettingRow: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    action: 'navigate';
    onClick?: () => void;
    variant?: 'default' | 'danger';
}> = ({ icon, title, description, action, onClick, variant = 'default' }) => {
    const content = (
        <>
            <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-300'}`}>
                {icon}
            </div>
            <div className="flex-grow">
                <h3 className={`font-bold ${variant === 'danger' ? 'text-red-400' : 'text-white'}`}>{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <div className="flex-shrink-0 pt-1 flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            </div>
        </>
    );

    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-start gap-4 p-4 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variant === 'danger' ? 'hover:bg-red-900/20' : 'hover:bg-gray-800/50'}`}
            disabled={!onClick}
            aria-label={title}
        >
            {content}
        </button>
    );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider px-2 mt-8 mb-3">{title}</h2>
);


interface PrivacyPageProps {
  onNavigate: (page: Page) => void;
  onDeleteAccountRequest: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate, onDeleteAccountRequest }) => {
  return (
    <div className="p-4 md:p-8 animate-fade-in text-white">
        <div>
            <SectionHeader title="Your Data" />
            <div className="bg-gray-900 rounded-lg divide-y divide-gray-800">
                <SettingRow 
                    icon={<DownloadIcon className="w-6 h-6" />}
                    title="Export Your Data"
                    description="Request a copy of your personal data."
                    action="navigate"
                    onClick={() => onNavigate('dataExport')}
                />
                <SettingRow 
                    icon={<TrashIcon className="w-6 h-6" />}
                    title="Delete Your Account"
                    description="Permanently delete your account and all associated data."
                    action="navigate"
                    variant="danger"
                    onClick={onDeleteAccountRequest}
                />
            </div>
        </div>

        <div>
            <SectionHeader title="Cookies & Usage" />
            <div className="bg-gray-900 rounded-lg divide-y divide-gray-800">
                 <SettingRow 
                    icon={<CookieIcon className="w-6 h-6" />}
                    title="Manage Cookies"
                    description="Manage your cookie settings to control data collection."
                    action="navigate"
                    onClick={() => onNavigate('cookieSettings')}
                />
                <SettingRow 
                    icon={<ChartBarIcon className="w-6 h-6" />}
                    title="Data Usage Report"
                    description="View a report of your data usage within the app."
                    action="navigate"
                />
            </div>
        </div>
    </div>
  );
};