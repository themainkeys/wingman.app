import React, { useMemo } from 'react';
import { Venue, Promoter } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { StarIcon } from './icons/StarIcon';

interface SelectPromoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue | null;
  onSelectPromoter: (promoter: Promoter) => void;
  promoters: Promoter[];
}

export const SelectPromoterModal: React.FC<SelectPromoterModalProps> = ({ isOpen, onClose, venue, onSelectPromoter, promoters }) => {

  const availablePromoters = useMemo(() => {
    if (!venue) return [];
    return promoters.filter(p => p.assignedVenueIds.includes(venue.id));
  }, [venue, promoters]);

  if (!isOpen || !venue) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-promoter-title"
      onClick={onClose}
    >
      <div className="bg-[#121212] border border-gray-800 rounded-xl shadow-2xl w-full max-w-md m-4 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 id="select-promoter-title" className="text-xl font-bold text-white">Select Promoter for {venue.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 flex-grow overflow-y-auto">
          {availablePromoters.length > 0 ? (
            <div className="space-y-3">
              {availablePromoters.map(promoter => (
                <button 
                  key={promoter.id}
                  onClick={() => onSelectPromoter(promoter)}
                  className="w-full flex items-center gap-4 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-left cursor-pointer"
                  aria-label={`Select promoter ${promoter.name}`}
                >
                  <img src={promoter.profilePhoto} alt={promoter.name} className="w-14 h-14 rounded-full object-cover" />
                  <div className="flex-grow">
                    <p className="font-bold text-white">{promoter.name}</p>
                    <p className="text-sm text-gray-400">{promoter.handle}</p>
                  </div>
                   <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
                      <StarIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-white font-semibold text-sm">{promoter.rating.toFixed(1)}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No promoters are currently available for this venue. Please check back later.</p>
          )}
        </div>
      </div>
    </div>
  );
};