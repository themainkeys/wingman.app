
import React, { useState, useEffect } from 'react';
import { Page, User, Promoter } from '../../types';
import { HandWavingIcon } from '../icons/HandWavingIcon';
import { ProfileIcon } from '../icons/ProfileIcon';
import { SparkleIcon } from '../icons/SparkleIcon';
import { BellIcon } from '../icons/BellIcon';
import { TokenIcon } from '../icons/TokenIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { PromotersIcon } from '../icons/PromotersIcon';
import { BookIcon } from '../icons/BookIcon';
import { StarIcon } from '../icons/StarIcon';

interface OnboardingModalProps {
  user: User;
  onFinish: (completed: boolean) => void;
  onNavigate: (page: Page) => void;
  promoters: Promoter[];
  onSelectPromoter: (promoterId: number | null) => void;
}

const ONBOARDING_REWARD = 100;

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onFinish, onNavigate, promoters, onSelectPromoter }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');
    const [selectedPromoterId, setSelectedPromoterId] = useState<number | null>(null);

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationStatus(Notification.permission);
        }
    }, []);

    const handleRequestNotification = async () => {
        if ('Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                setNotificationStatus(permission);
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
    };

    const handleCompleteProfile = () => {
        onNavigate('editProfile');
        onFinish(false); // Finish tour so it doesn't reopen, but don't give reward yet
    };
    
    const handlePromoterSelection = (id: number | null) => {
        setSelectedPromoterId(id);
        onSelectPromoter(id);
        // Auto-advance slightly delayed for better UX if selecting a promoter
        if (id !== null) {
            setTimeout(() => {
                goToNext();
            }, 500);
        }
    };

    const steps = [
        {
            icon: <HandWavingIcon className="w-12 h-12 text-[#EC4899]" />,
            title: `Welcome, ${user.name.split(' ')[0]}!`,
            description: "You've just unlocked access to Miami's most exclusive nightlife experiences. Let's get you started.",
        },
        {
            icon: <PromotersIcon className="w-12 h-12 text-[#EC4899]" />,
            title: "Choose Your Wingman",
            description: "Pick a promoter to guide your nightlife experience. They will be your direct line to exclusive events and tables.",
            customContent: (
                <div className="mt-6 w-full max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
                        {promoters.slice(0, 6).map(promoter => (
                            <button
                                key={promoter.id}
                                onClick={() => handlePromoterSelection(promoter.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                                    selectedPromoterId === promoter.id 
                                    ? 'bg-[#EC4899]/20 border-[#EC4899]' 
                                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                }`}
                            >
                                <img src={promoter.profilePhoto} alt={promoter.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-white text-sm">{promoter.name}</p>
                                    <div className="flex items-center gap-1">
                                        <StarIcon className="w-3 h-3 text-amber-400" />
                                        <span className="text-xs text-gray-400">{promoter.rating}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => { handlePromoterSelection(null); goToNext(); }}
                        className="mt-4 text-sm text-gray-400 hover:text-white underline"
                    >
                        I don't have one / Skip for now
                    </button>
                </div>
            )
        },
        {
            icon: <ProfileIcon className="w-12 h-12 text-[#EC4899]" />,
            title: "Build Your Profile",
            description: "A complete profile helps our promoters find the best experiences for you. Add your photos and preferences to stand out.",
            action: <button onClick={handleCompleteProfile} className="mt-6 bg-white text-black font-bold py-3 px-8 rounded-lg text-lg">Complete Your Profile</button>
        },
        {
            icon: <SparkleIcon className="w-12 h-12 text-[#EC4899]" />,
            title: "Discover & Connect",
            description: "Browse elite promoters, book tables at top-tier venues, and get access to invite-only events.",
            visuals: (
                <div className="flex justify-center gap-8 mt-6">
                    <div className="flex flex-col items-center gap-2">
                        <PromotersIcon className="w-10 h-10 text-white" />
                        <span className="text-sm font-semibold">Promoters</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <BookIcon className="w-10 h-10 text-white" />
                        <span className="text-sm font-semibold">Bookings</span>
                    </div>
                </div>
            )
        },
        {
            icon: <BellIcon className="w-12 h-12 text-[#EC4899]" />,
            title: "Stay in the Loop",
            description: "Enable notifications for your favorite venues, exclusive events, and new experiences.",
            action: (
                <button 
                    onClick={handleRequestNotification} 
                    disabled={notificationStatus !== 'default' || !('Notification' in window)} 
                    className="mt-6 bg-white text-black font-bold py-3 px-8 rounded-lg text-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {!('Notification' in window) ? 'Not Supported' : notificationStatus === 'granted' ? 'Enabled!' : notificationStatus === 'denied' ? 'Permission Denied' : 'Enable Notifications'}
                </button>
            )
        },
        {
            icon: <TokenIcon className="w-12 h-12 text-[#EC4899]" />,
            title: "You're All Set!",
            description: `As a welcome gift, we've added ${ONBOARDING_REWARD} TMKC tokens to your wallet. Use them in our store for exclusive perks.`,
            action: <button onClick={() => onFinish(true)} className="mt-6 bg-white text-black font-bold py-3 px-8 rounded-lg text-lg">Let's Go!</button>
        },
    ];

    const goToNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const goToPrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const activeStep = steps[currentStep];

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col p-6 animate-fade-in text-white" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)' }}>
            <header className="flex-shrink-0">
                <div className="flex justify-center items-center gap-3">
                    {steps.map((_, index) => (
                        <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 bg-white' : 'w-3 bg-gray-600'}`} />
                    ))}
                </div>
                <button onClick={() => onFinish(false)} className="absolute top-6 right-6 text-gray-400 font-semibold text-sm hover:text-white">Skip Tour</button>
            </header>
            
            <main className="flex-grow flex flex-col justify-center text-center -mt-10 overflow-y-auto">
                <div className="animate-fade-in-up py-8">
                    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-700">
                        {activeStep.icon}
                    </div>
                    <h1 className="text-4xl font-bold font-poppins">{activeStep.title}</h1>
                    <p className="text-gray-400 mt-4 max-w-sm mx-auto">{activeStep.description}</p>
                    {activeStep.visuals}
                    {activeStep.customContent}
                    {activeStep.action}
                </div>
            </main>

            <footer className="flex-shrink-0 flex items-center justify-between pt-4">
                {currentStep > 0 ? (
                    <button onClick={goToPrev} className="flex items-center gap-2 text-gray-300 font-semibold p-2">
                        <ChevronLeftIcon className="w-5 h-5" /> Back
                    </button>
                ) : <div />}
                
                {currentStep < steps.length - 1 && (
                     <button onClick={goToNext} className="bg-white text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2">
                        Next <ChevronRightIcon className="w-5 h-5" />
                    </button>
                )}
            </footer>
        </div>
    );
};
