import React from 'react';
import { Page } from '../types';
import { BookTableIcon } from './icons/BookTableIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CartIcon } from './icons/CartIcon';
import { ChatIcon } from './icons/ChatIcon';

interface PromoterBottomNavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  cartItemCount: number;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
}> = ({ icon, label, isActive, onClick, badgeCount }) => {
  const activeClass = 'text-amber-400';
  const inactiveClass = 'text-gray-400';
  return (
    <button onClick={onClick} className={`relative flex flex-col items-center justify-center gap-1 w-full ${isActive ? activeClass : inactiveClass} hover:text-amber-300 transition-colors`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {badgeCount > 0 && (
        <span className="absolute top-0 right-1/4 w-4 h-4 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-black">
            {badgeCount}
        </span>
      )}
    </button>
  );
};

export const PromoterBottomNavBar: React.FC<PromoterBottomNavBarProps> = ({ currentPage, onNavigate, cartItemCount }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-lg border-t border-gray-800 z-40" aria-label="Promoter Navigation">
            <div className="container mx-auto h-full flex items-center justify-around px-2">
                <NavItem
                    icon={<BookTableIcon className="w-6 h-6" />}
                    label="Book Table"
                    isActive={currentPage === 'bookATable'}
                    onClick={() => onNavigate('bookATable')}
                />
                 <NavItem
                    icon={<ChatIcon className="w-6 h-6" />}
                    label="Chats"
                    isActive={currentPage === 'guestlistChats'}
                    onClick={() => onNavigate('guestlistChats')}
                />

                <div className="w-full flex justify-center">
                    <button onClick={() => onNavigate('eventTimeline')} className="relative -top-6" aria-label="Timeline">
                        <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-black shadow-lg shadow-amber-500/40 transition-transform hover:scale-110">
                            <ClockIcon className="w-8 h-8"/>
                        </div>
                    </button>
                </div>

                 <NavItem
                    icon={<CartIcon className="w-6 h-6" />}
                    label="My plans"
                    isActive={currentPage === 'checkout'}
                    onClick={() => onNavigate('checkout')}
                    badgeCount={cartItemCount}
                />
            </div>
        </nav>
    )
};