

import React from 'react';

// This component is deprecated. Use DestructiveConfirmationModal instead for delete actions.
export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger' }) => {
  if (!isOpen) return null;
  
  const confirmClasses = {
      danger: 'bg-red-600 hover:bg-red-500 focus:ring-red-500',
      primary: 'bg-pink-500 text-white hover:bg-pink-400 focus:ring-pink-400'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm m-4 p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>

            <div className="flex gap-4">
                <button onClick={onClose} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    Cancel
                </button>
                <button onClick={onConfirm} className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 ${confirmClasses[confirmVariant]}`}>
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
  );
};