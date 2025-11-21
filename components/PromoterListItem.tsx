import React from 'react';
import { Promoter } from '../types';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';

interface PromoterListItemProps {
  promoter: Promoter;
  onViewProfile: (promoter: Promoter) => void;
  onBook: (promoter: Promoter) => void;
  isFavorite: boolean;
  onToggleFavorite: (promoterId: number) => void;
}

export const PromoterListItem: React.FC<PromoterListItemProps> = ({ promoter, onViewProfile, onBook, isFavorite, onToggleFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(promoter.id);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center gap-4 transition-colors duration-200 hover:bg-gray-800">
      <div className="relative flex-shrink-0">
        <img className="w-20 h-20 rounded-full object-cover" src={promoter.profilePhoto} alt={`Profile photo of ${promoter.name}`} />
         {promoter.isOnline && (
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900" title="Online"></div>
        )}
        <button
          onClick={handleFavoriteClick}
          className="absolute bottom-0 left-0 bg-black/70 p-1.5 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label={isFavorite ? `Remove ${promoter.name} from favorites` : `Add ${promoter.name} to favorites`}
        >
          <HeartIcon className="w-4 h-4" isFilled={isFavorite} />
        </button>
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-white">{promoter.name}</h3>
                <p className="text-sm text-gray-400">{promoter.handle}</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 px-2 py-1 rounded-full">
                <StarIcon className="w-4 h-4 text-amber-400" />
                <span className="text-white font-semibold text-sm">{promoter.rating.toFixed(1)}</span>
            </div>
        </div>
        <p className="text-gray-300 mt-2 text-sm leading-relaxed line-clamp-2 h-10">{promoter.bio}</p>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0 w-32">
        <button
          onClick={() => onBook(promoter)}
          className="w-full text-center bg-amber-400 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-300 hover:bg-amber-300"
          aria-label={`Book a table with ${promoter.name}`}
        >
          Book Table
        </button>
        <button
          onClick={() => onViewProfile(promoter)}
          className="w-full text-center bg-gray-800 border border-gray-700 text-gray-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-300 hover:bg-gray-700 hover:text-white"
          aria-label={`View profile of ${promoter.name}`}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};