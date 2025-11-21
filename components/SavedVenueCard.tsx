import React from 'react';
import { Venue } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { HeartIcon } from './icons/HeartIcon';

interface SavedVenueCardProps {
  venue: Venue;
  onToggleFavorite: (venueId: number) => void;
  onViewDetails: (venue: Venue) => void;
}

export const SavedVenueCard: React.FC<SavedVenueCardProps> = ({ venue, onToggleFavorite, onViewDetails }) => {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(venue.id);
    };

    return (
        <button 
            onClick={() => onViewDetails(venue)}
            className="w-full flex items-center gap-4 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-left"
            aria-label={`View details for ${venue.name}`}
        >
            <img src={venue.coverImage} alt={venue.name} className="w-20 h-14 rounded-md object-cover" />
            <div className="flex-grow">
                <p className="font-bold text-white">{venue.name}</p>
                <p className="text-sm text-gray-400">{venue.location} &bull; {venue.musicType}</p>
            </div>
            <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full text-amber-400 hover:bg-gray-700 transition-colors z-10"
                aria-label={`Remove ${venue.name} from favorites`}
            >
                <HeartIcon isFilled={true} className="w-6 h-6" />
            </button>
            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
        </button>
    );
};