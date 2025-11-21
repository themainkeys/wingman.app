
import React from 'react';
import { Promoter, Venue, User, Page } from '../types';
import { venues as mockVenues } from '../data/mockData';
import { SavedVenueCard } from './SavedVenueCard';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { SavedPromoterCard } from './SavedPromoterCard';

interface FavoritesPageProps {
  promoters: Promoter[];
  onSelectPromoter: (promoter: Promoter) => void;
  onToggleFavorite: (promoterId: number) => void;
  onNavigate: (page: Page) => void;
  favoriteVenueIds: number[];
  onToggleVenueFavorite: (venueId: number) => void;
  onViewVenueDetails: (venue: Venue) => void;
  currentUser: User;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
    promoters,
    onSelectPromoter,
    onToggleFavorite,
    onNavigate, 
    favoriteVenueIds, 
    onToggleVenueFavorite,
    onViewVenueDetails,
    currentUser
}) => {
  const favoriteVenues = mockVenues.filter(v => favoriteVenueIds.includes(v.id));
  const favoritePromoters = promoters.filter(p => (currentUser.favoritePromoterIds || []).includes(p.id));

  return (
    <div className="p-4 md:p-8 animate-fade-in text-white">
      <button onClick={() => onNavigate('userProfile')} className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 text-sm font-semibold">
        <ChevronLeftIcon className="w-5 h-5"/>
        Back to Profile
      </button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Favorite Promoters</h1>
        <div className="space-y-3">
            {favoritePromoters.length > 0 ? (
                favoritePromoters.map(promoter => (
                    <SavedPromoterCard 
                        key={promoter.id}
                        promoter={promoter}
                        onSelect={onSelectPromoter}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))
            ) : (
                 <p className="text-gray-400 text-center py-8">You haven't favorited any promoters yet.</p>
            )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Favorite Venues</h1>
        <div className="space-y-3">
            {favoriteVenues.length > 0 ? (
                favoriteVenues.map(venue => (
                    <SavedVenueCard 
                        key={venue.id} 
                        venue={venue} 
                        onToggleFavorite={onToggleVenueFavorite}
                        onViewDetails={onViewVenueDetails}
                    />
                ))
            ) : (
            <p className="text-gray-400 text-center py-8">You haven't saved any venues yet.</p>
            )}
        </div>
      </div>
    </div>
  );
};
