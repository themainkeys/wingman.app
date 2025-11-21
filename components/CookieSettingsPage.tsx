
import React, { useState } from 'react';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { Button } from './ui/Button';

const CookieCategory: React.FC<{ title: string; description: string; isEnabled: boolean; onToggle?: () => void; isRequired?: boolean; }> = ({ title, description, isEnabled, onToggle, isRequired }) => (
    <div className="flex items-start gap-4 p-4 bg-[var(--color-card)] rounded-lg">
        <div className="flex-grow">
            <h3 className="font-bold text-[var(--color-card-foreground)]">{title} {isRequired && <span className="text-xs text-[var(--color-text-muted)]">(Always On)</span>}</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{description}</p>
        </div>
        <div className="flex-shrink-0 pt-1">
            <ToggleSwitch checked={isEnabled} onChange={onToggle || (() => {})} label={title} />
        </div>
    </div>
);


export const CookieSettingsPage: React.FC = () => {
    const [performanceCookies, setPerformanceCookies] = useState(true);
    const [marketingCookies, setMarketingCookies] = useState(false);

    const handleSave = () => {
        // In a real app, you would save these preferences to localStorage or a server
        console.log({
            performance: performanceCookies,
            marketing: marketingCookies
        });
        alert("Preferences saved!");
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">Cookie Settings</h1>
            <p className="text-[var(--color-text-muted)] mb-8">
                We use cookies to enhance your experience. You can manage your preferences for non-essential cookies below.
            </p>

            <div className="space-y-4">
                <CookieCategory
                    title="Essential Cookies"
                    description="These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms."
                    isEnabled={true}
                    isRequired={true}
                />
                <CookieCategory
                    title="Performance Cookies"
                    description="These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site."
                    isEnabled={performanceCookies}
                    onToggle={() => setPerformanceCookies(prev => !prev)}
                />
                 <CookieCategory
                    title="Marketing Cookies"
                    description="These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites."
                    isEnabled={marketingCookies}
                    onToggle={() => setMarketingCookies(prev => !prev)}
                />
            </div>

            <div className="mt-8">
                <Button onClick={handleSave} size="lg" className="w-full">
                    Save Preferences
                </Button>
            </div>
        </div>
    );
};