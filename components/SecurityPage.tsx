import React, { useState } from 'react';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ChangePasswordModal } from './modals/ChangePasswordModal';

const SettingRow: React.FC<{ label: string, children: React.ReactNode, isButton?: boolean, onClick?: () => void }> = ({ label, children, isButton, onClick }) => {
    const content = (
        <>
            <span className="font-semibold text-white">{label}</span>
            <div>{children}</div>
        </>
    );
    if (isButton) {
        return (
            <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors" aria-label={label}>
                {content}
            </button>
        )
    }
    return (
        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            {content}
        </div>
    );
};

const ToggleSwitch: React.FC<{ label: string }> = ({ label }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" aria-label={label} />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
    </label>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2 mt-8 mb-3">{title}</h2>
);

const ActivityRow: React.FC<{ time: string, location: string }> = ({ time, location }) => (
    <button className="w-full flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors" aria-label={`View login activity from ${location} at ${time}`}>
        <div>
            <p className="font-semibold text-white">{time}</p>
            <p className="text-sm text-gray-400">{location}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
    </button>
);

export const SecurityPage: React.FC = () => {
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  return (
    <>
        <div className="p-4 md:p-8 animate-fade-in text-white">
            <div className="space-y-3">
                <SectionHeader title="Password" />
                <SettingRow label="Change Password" isButton onClick={() => setIsChangePasswordModalOpen(true)}>
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                </SettingRow>

                <SectionHeader title="Two-Factor Authentication" />
                <SettingRow label="Enable Two-Factor Authentication">
                    <ToggleSwitch label="Enable Two-Factor Authentication" />
                </SettingRow>

                <SectionHeader title="Login Activity" />
                <div className="space-y-2">
                    <ActivityRow time="Today, 10:30 AM" location="Los Angeles, CA" />
                    <ActivityRow time="Yesterday, 8:15 PM" location="New York, NY" />
                </div>

                <SectionHeader title="Connected Devices" />
                <div className="space-y-2">
                    <ActivityRow time="iPhone 14 Pro" location="Last Active: Today, 10:30 AM" />
                    <ActivityRow time="MacBook Pro" location="Last Active: Yesterday, 8:15 PM" />
                </div>
            </div>
        </div>
        <ChangePasswordModal 
            isOpen={isChangePasswordModalOpen}
            onClose={() => setIsChangePasswordModalOpen(false)}
        />
    </>
  );
};