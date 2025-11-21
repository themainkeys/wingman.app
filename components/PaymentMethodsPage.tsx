
import React, { useState } from 'react';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { Page } from '../types';
import { AddPaymentMethodModal } from './modals/AddPaymentMethodModal';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PaymentMethodsPageProps {
  onNavigate: (page: Page) => void;
}

interface PaymentMethod {
    id: string;
    category: 'cards' | 'other';
    type: string;
    last4?: string;
    expiry?: string;
    icon?: string;
    isDefault: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
    { id: '1', category: 'cards', type: 'Visa', last4: '4567', expiry: '03/2026', isDefault: true },
    { id: '2', category: 'cards', type: 'Mastercard', last4: '1234', expiry: '01/2025', isDefault: false },
    { id: '3', category: 'cards', type: 'American Express', last4: '7890', expiry: '05/2027', isDefault: false },
    { id: '4', category: 'other', type: 'PayPal', icon: 'https://picsum.photos/seed/paypal/40/40', isDefault: false },
    { id: '5', category: 'other', type: 'Cash App', icon: 'https://picsum.photos/seed/cashapp/40/40', isDefault: false },
    { id: '6', category: 'other', type: 'Crypto Wallet', icon: 'https://picsum.photos/seed/crypto/40/40', isDefault: false },
];

const ThreeDotsIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
    </svg>
);

export const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({ onNavigate }) => {
    const [methods, setMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSetDefault = (id: string) => {
        setMethods(prev => prev.map(m => ({
            ...m,
            isDefault: m.id === id
        })));
        setActiveMenuId(null);
    };

    const handleRemove = (id: string) => {
        if (confirm("Are you sure you want to remove this payment method?")) {
            setMethods(prev => prev.filter(m => m.id !== id));
        }
        setActiveMenuId(null);
    };

    const handleAddMethod = (newMethod: PaymentMethod) => {
        setMethods(prev => [...prev, newMethod]);
    };

    const cards = methods.filter(m => m.category === 'cards');
    const otherMethods = methods.filter(m => m.category === 'other');

    return (
        <div className="p-4 md:p-6 animate-fade-in text-white pb-24">
             <button 
                onClick={() => onNavigate('promoterDashboard')} 
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 text-sm font-semibold"
            >
                <ChevronLeftIcon className="w-5 h-5"/>
                Back
            </button>
            
            <h1 className="text-3xl font-bold mb-8">Manage Payment Methods</h1>

            <div className="space-y-8">
                <div>
                    <h2 className="text-lg font-semibold text-amber-400 mb-3">Credit & Debit Cards</h2>
                    <div className="space-y-3">
                        {cards.map((card) => (
                            <div key={card.id} className={`bg-gray-900 p-4 rounded-lg flex items-center gap-4 border ${card.isDefault ? 'border-amber-400/50' : 'border-transparent'}`}>
                                <div className="bg-gray-700 p-3 rounded-md">
                                    <CreditCardIcon className="w-6 h-6 text-gray-300" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-white">{card.type} •••• {card.last4}</p>
                                        {card.isDefault && <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-bold">DEFAULT</span>}
                                    </div>
                                    <p className="text-sm text-gray-400">Expires {card.expiry}</p>
                                </div>
                                <div className="relative">
                                    <button onClick={() => setActiveMenuId(activeMenuId === card.id ? null : card.id)} className="text-gray-500 hover:text-white p-1">
                                        <ThreeDotsIcon />
                                    </button>
                                    
                                    {activeMenuId === card.id && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl z-20 border border-gray-700 overflow-hidden">
                                                {!card.isDefault && (
                                                    <button onClick={() => handleSetDefault(card.id)} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-2">
                                                        <CheckCircleIcon className="w-4 h-4" /> Set as Default
                                                    </button>
                                                )}
                                                <button onClick={() => handleRemove(card.id)} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2">
                                                    <TrashIcon className="w-4 h-4" /> Remove
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {cards.length === 0 && <p className="text-gray-500 italic text-sm">No cards added.</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-amber-400 mb-3">Other Methods</h2>
                    <div className="space-y-3">
                         {otherMethods.map((method) => (
                            <div key={method.id} className={`bg-gray-900 p-4 rounded-lg flex items-center gap-4 border ${method.isDefault ? 'border-amber-400/50' : 'border-transparent'}`}>
                                <div className="bg-gray-700 w-12 h-12 rounded-md flex items-center justify-center overflow-hidden">
                                    {method.type === 'Crypto Wallet' ? 
                                     <span className="font-bold text-xl text-amber-400">B</span> :
                                     <CreditCardIcon className="w-6 h-6 text-gray-300" />
                                    }
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-white">{method.type}</p>
                                        {method.isDefault && <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-bold">DEFAULT</span>}
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={() => setActiveMenuId(activeMenuId === method.id ? null : method.id)} className="text-gray-500 hover:text-white p-1">
                                        <ThreeDotsIcon />
                                    </button>
                                     {activeMenuId === method.id && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl z-20 border border-gray-700 overflow-hidden">
                                                {!method.isDefault && (
                                                    <button onClick={() => handleSetDefault(method.id)} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 flex items-center gap-2">
                                                        <CheckCircleIcon className="w-4 h-4" /> Set as Default
                                                    </button>
                                                )}
                                                <button onClick={() => handleRemove(method.id)} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2">
                                                    <TrashIcon className="w-4 h-4" /> Remove
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-gray-800 p-4 z-10">
                <div className="container mx-auto max-w-5xl">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full bg-amber-400 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5"/>
                        Add Payment Method
                    </button>
                </div>
            </div>

            <AddPaymentMethodModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddMethod} 
            />
        </div>
    );
};
