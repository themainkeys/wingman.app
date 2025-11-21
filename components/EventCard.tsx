
import React from 'react';
import { Event } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { HeartIcon } from './icons/HeartIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ShareIcon } from './icons/ShareIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { RepeatIcon } from './icons/RepeatIcon';
import { ClockIcon } from './icons/ClockIcon';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  isLiked?: boolean;
  onToggleLike?: (eventId: number | string) => void;
  isRsvped?: boolean;
  onRsvp?: (eventId: number | string) => void;
  venueName?: string;
  venueLocation?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (eventId: number | string) => void;
  venueCategory?: string;
  venueMusicType?: string;
  guestlistStatus?: 'pending' | 'approved' | 'rejected' | 'none';
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onViewDetails, 
  isLiked, 
  onToggleLike, 
  isRsvped, 
  onRsvp, 
  venueName, 
  venueLocation, 
  isBookmarked, 
  onToggleBookmark, 
  venueCategory, 
  venueMusicType,
  guestlistStatus
}) => {
  const attendancePercentage = event.capacity && event.currentAttendees ? Math.round((event.currentAttendees / event.capacity) * 100) : null;

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?event=${event.id}`;
    const shareData = {
        title: `Check out ${event.title} on WINGMAN`,
        text: event.description,
        url: shareUrl,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Event link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Sharing is not supported on this browser. Could not copy link.');
        }
    }
  };


  return (
    <div 
      onClick={() => onViewDetails(event)}
      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4 flex gap-4 items-center text-left hover:bg-gray-800 transition-colors duration-200 cursor-pointer relative"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onViewDetails(event)}
      aria-label={`View details for ${event.title}`}
    >
      {onToggleLike && (
         <button
            onClick={(e) => {
                e.stopPropagation();
                onToggleLike(event.id);
            }}
            className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white hover:bg-white/20 transition-colors z-10"
            aria-label={isLiked ? `Unlike ${event.title}` : `Like ${event.title}`}
         >
            <HeartIcon className="w-5 h-5" isFilled={isLiked} />
         </button>
      )}
      <img src={event.image} alt={event.title} className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover flex-shrink-0" />
      <div className="flex-grow flex flex-col justify-between self-stretch">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-green-400 uppercase tracking-wider">{event.type}</p>
            {event.recurrence && <RepeatIcon className="w-4 h-4 text-gray-400" title="Recurring Event" />}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-lg font-bold text-white leading-tight">{event.title}</h3>
            {guestlistStatus === 'approved' && (
                <div className="bg-green-500/20 p-1 rounded-full" title="Guestlist Approved">
                    <CheckIcon className="w-4 h-4 text-green-400" />
                </div>
            )}
            {guestlistStatus === 'pending' && (
                <div className="bg-yellow-500/20 p-1 rounded-full" title="Guestlist Request Pending">
                    <ClockIcon className="w-4 h-4 text-yellow-400" />
                </div>
            )}
          </div>
          {venueName && venueLocation && (
            <p className="text-xs text-gray-500 mt-1">{venueName} &bull; {venueLocation}</p>
          )}
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{event.description}</p>
        </div>
        <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                {venueCategory && <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded-md">{venueCategory}</span>}
                {venueMusicType && <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded-md">{venueMusicType}</span>}
            </div>
          {attendancePercentage !== null && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <UsersIcon className="w-4 h-4" />
                  <span>Capacity</span>
                </div>
                <span className="text-xs font-semibold text-white">{attendancePercentage}% Full</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-[#EC4899] h-1.5 rounded-full" style={{ width: `${attendancePercentage}%` }}></div>
              </div>
            </div>
          )}
          {(onRsvp || onToggleBookmark) && (
            <div className="flex items-center gap-2">
                {onRsvp && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRsvp(event.id);
                        }}
                        className={`flex-grow font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                            isRsvped
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-[#EC4899] text-white hover:bg-[#d8428a]'
                        }`}
                        aria-label={isRsvped ? `Cancel RSVP for ${event.title}` : `RSVP for ${event.title}`}
                    >
                        {isRsvped ? (
                            <>
                                <CheckIcon className="w-4 h-4" />
                                RSVPed
                            </>
                        ) : (
                            'RSVP'
                        )}
                    </button>
                )}
                {onToggleBookmark && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(event.id);
                        }}
                        className="flex-shrink-0 bg-gray-700 text-gray-300 p-2.5 rounded-lg transition-colors hover:bg-gray-600"
                        aria-label={isBookmarked ? `Remove ${event.title} from bookmarks` : `Bookmark ${event.title}`}
                    >
                        <BookmarkIcon className="w-5 h-5" isFilled={isBookmarked} />
                    </button>
                )}
                <button
                    onClick={handleShareClick}
                    className="flex-shrink-0 bg-gray-700 text-gray-300 p-2.5 rounded-lg transition-colors hover:bg-gray-600"
                    aria-label={`Share ${event.title}`}
                >
                    <ShareIcon className="w-5 h-5" />
                </button>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};
