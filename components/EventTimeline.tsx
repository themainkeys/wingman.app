
import React, { useState, useEffect, useMemo } from 'react';
import { venues, users } from '../data/mockData';
import { AskGabyBanner } from './AskGabyBanner';
import { DiscoverCard } from './DiscoverCard';
import { SuggestedEventCard } from './SuggestedEventCard';
import { TimelineEventCard } from './TimelineEventCard';
// FIX: Imported Promoter type to resolve reference error.
import { Event, User, UserAccessLevel, EventInvitationRequest, Venue, UserRole, Promoter, GuestlistJoinRequest } from '../types';
import { EventDetailModal } from './modals/EventDetailModal';
import { MiamiMapModal } from './MiamiMapModal';
import { EventParticipantsModal } from './modals/EventParticipantsModal';

interface EventTimelineProps {
  currentUser: User;
  allEvents: Event[];
  likedEventIds: number[];
  onToggleLike: (eventId: number | string) => void;
  rsvpedEventIds: number[];
  onRsvp: (eventId: number | string) => void;
  bookmarkedEventIds: number[];
  onToggleBookmark: (eventId: number | string) => void;
  onOpenGabyWithPrompt: (prompt: string) => void;
  invitationRequests: EventInvitationRequest[];
  onRequestInvite: (eventId: number | string) => void;
  onPayForEvent: (event: Event) => void;
  onNavigateToChat: (event: Event) => void;
  subscribedEventIds: number[];
  onToggleSubscription: (eventId: number | string) => void;
  onBookVenue: (venue: Venue) => void;
  onJoinGuestlist: (context: { promoter?: Promoter; venue?: Venue, date?: string }) => void;
  guestlistRequests: GuestlistJoinRequest[];
}

const EVENTS_PER_PAGE = 4;

const getOriginalEventId = (eventId: number | string) => {
    return typeof eventId === 'string' ? parseInt(eventId.split('-')[0], 10) : eventId;
};

export const EventTimeline: React.FC<EventTimelineProps> = ({ 
    currentUser, 
    allEvents,
    likedEventIds, 
    onToggleLike,
    rsvpedEventIds,
    onRsvp,
    bookmarkedEventIds,
    onToggleBookmark,
    onOpenGabyWithPrompt,
    invitationRequests,
    onRequestInvite,
    onPayForEvent,
    onNavigateToChat,
    subscribedEventIds,
    onToggleSubscription,
    onBookVenue,
    onJoinGuestlist,
    guestlistRequests
}) => {
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedEventForModal, setSelectedEventForModal] = useState<Event | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [participantsForEvent, setParticipantsForEvent] = useState<User[]>([]);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'EXCLUSIVE' | 'INVITE ONLY'>('EXCLUSIVE');
  
  const visibleSuggestedEvents = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allEvents.filter(event => {
        const isSuggested = Number(event.id) >= 100 && Number(event.id) < 200;
        if (!isSuggested) return false;

        const typeMatch = typeFilter === 'all' || event.type === typeFilter;
        if (!typeMatch) return false;

        const searchMatch = lowercasedSearchTerm === '' ||
            event.title.toLowerCase().includes(lowercasedSearchTerm) ||
            event.description.toLowerCase().includes(lowercasedSearchTerm);
        if (!searchMatch) return false;

        if (event.accessLevels && event.accessLevels.length > 0) {
            if (!event.accessLevels.includes(currentUser.accessLevel)) {
                return false;
            }
        }

        if (event.type === 'INVITE ONLY') {
            return currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL || 
                   currentUser.accessLevel === UserAccessLevel.ACCESS_MALE || 
                   currentUser.accessLevel === UserAccessLevel.PROMO || 
                   currentUser.role === UserRole.ADMIN;
        }
        return true;
    });
  }, [allEvents, currentUser.accessLevel, searchTerm, currentUser.role, typeFilter]);

  const visibleTimelineEvents = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allEvents.filter(event => {
        const isTimelineEvent = Number(event.id) >= 200 || new Date(event.date).getFullYear() >= 2025;
        if (!isTimelineEvent) return false;
        
        const typeMatch = typeFilter === 'all' || event.type === typeFilter;
        if (!typeMatch) return false;

        const searchMatch = lowercasedSearchTerm === '' ||
            event.title.toLowerCase().includes(lowercasedSearchTerm) ||
            event.description.toLowerCase().includes(lowercasedSearchTerm);
        if (!searchMatch) return false;
        
        if (event.accessLevels && event.accessLevels.length > 0) {
            if (!event.accessLevels.includes(currentUser.accessLevel)) {
                return false;
            }
        }

        if (event.type === 'INVITE ONLY') {
            return currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL || 
                   currentUser.accessLevel === UserAccessLevel.ACCESS_MALE || 
                   currentUser.accessLevel === UserAccessLevel.PROMO || 
                   currentUser.role === UserRole.ADMIN;
        }
        return true;
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, currentUser.accessLevel, searchTerm, currentUser.role, typeFilter]);

  // Mock API call
  const fetchEvents = (page: number): Promise<{ events: Event[], hasMore: boolean }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * EVENTS_PER_PAGE;
        const end = start + EVENTS_PER_PAGE;
        const newEvents = visibleTimelineEvents.slice(start, end);
        resolve({
          events: newEvents,
          hasMore: end < visibleTimelineEvents.length,
        });
      }, 1000); // 1-second delay
    });
  };

  useEffect(() => {
    // Initial load or when search term changes
    setIsLoading(true);
    fetchEvents(1).then(result => {
      setDisplayedEvents(result.events);
      setHasMore(result.hasMore);
      setIsLoading(false);
      setPage(2);
    });
  }, [visibleTimelineEvents]);

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    fetchEvents(page).then(result => {
      setDisplayedEvents(prev => [...prev, ...result.events]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
      setIsLoading(false);
    });
  };

  const handleViewDetails = (event: Event) => {
    // Mock fetching participants for the event
    const originalId = getOriginalEventId(event.id);
    const rsvpedUserIds = rsvpedEventIds.includes(originalId) ? [101, 102, currentUser.id] : [101, 102]; // Mock data
    const participants = users.filter(u => rsvpedUserIds.includes(u.id));
    setParticipantsForEvent(participants);
    setSelectedEventForModal(event);
  };

  const getInvitationStatus = (eventId: number | string) => {
    const request = invitationRequests.find(req => req.userId === currentUser.id && req.eventId === eventId);
    if (!request) return 'none';
    return request.status;
  };
  
  const handleViewParticipants = () => {
      setIsParticipantsModalOpen(true);
  };
  
  const getGuestlistStatus = (event: Event) => {
      if (!guestlistRequests) return 'none';
      const request = guestlistRequests.find(req => 
          req.userId === currentUser.id && 
          req.venueId === event.venueId && 
          req.date === event.date
      );
      return request ? request.status : 'none';
  };

  return (
    <>
      <MiamiMapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      <EventParticipantsModal isOpen={isParticipantsModalOpen} onClose={() => setIsParticipantsModalOpen(false)} participants={participantsForEvent} />
      <div className="animate-fade-in">
        <div className="p-4 md:px-8 mt-4">
          <AskGabyBanner onAsk={() => onOpenGabyWithPrompt('')} />
           <div className="mt-8 relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search events by title or description..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-4 pl-12 focus:ring-[#EC4899] focus:border-[#EC4899]"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
                {(['all', 'EXCLUSIVE', 'INVITE ONLY'] as const).map(type => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                            typeFilter === type
                                ? 'bg-white text-black'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                    >
                        {type === 'all' ? 'All Events' : type.replace('_', ' ')}
                    </button>
                ))}
            </div>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Suggested For You</h2>
        </div>

        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="flex space-x-4 pl-4 md:pl-8">
            <DiscoverCard onClick={() => setIsMapOpen(true)} />
            {visibleSuggestedEvents.map(event => {
                const venue = venues.find(v => v.id === event.venueId);
                return (
                  <SuggestedEventCard 
                    key={event.id} 
                    event={event} 
                    onViewDetails={handleViewDetails}
                    venueCategory={venue?.category}
                    venueMusicType={venue?.musicType}
                    venueName={venue?.name}
                    venueLocation={venue?.location}
                  />
                )
            })}
          </div>
        </div>
        
        {/* Vertical Timeline Section */}
        <div className="p-4 md:px-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upcoming Timeline</h2>
          <div className="space-y-4">
            {displayedEvents.map(event => {
                const venue = venues.find(v => v.id === event.venueId);
                const originalId = getOriginalEventId(event.id);
                return (
                  <TimelineEventCard 
                      key={event.id} 
                      event={event} 
                      isLiked={likedEventIds.includes(originalId)}
                      onToggleLike={onToggleLike}
                      onViewDetails={handleViewDetails}
                      isBookmarked={bookmarkedEventIds.includes(originalId)}
                      onToggleBookmark={onToggleBookmark}
                      venueCategory={venue?.category}
                      venueMusicType={venue?.musicType}
                      isRsvped={rsvpedEventIds.includes(originalId)}
                      onRsvp={onRsvp}
                      venueName={venue?.name}
                      venueLocation={venue?.location}
                      guestlistStatus={getGuestlistStatus(event)}
                  />
                )
            })}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 hover:bg-white hover:text-blue-600 disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-wait"
                aria-live="polite"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
          {!isLoading && !hasMore && displayedEvents.length > 0 && (
              <p className="mt-8 text-center text-gray-500">You've reached the end.</p>
          )}
           {!isLoading && visibleTimelineEvents.length === 0 && (
             <p className="mt-8 text-center text-gray-500">No events found matching your search.</p>
           )}
        </div>

      </div>
      {selectedEventForModal && (
        <EventDetailModal
            event={selectedEventForModal}
            onClose={() => setSelectedEventForModal(null)}
            isRsvped={rsvpedEventIds.includes(getOriginalEventId(selectedEventForModal.id))}
            onRsvp={onRsvp}
            venues={venues}
            onViewVenueExperiences={() => {}} // Not needed here
            invitationStatus={getInvitationStatus(selectedEventForModal.id) as 'none' | 'pending' | 'approved' | 'rejected'}
            onRequestInvite={onRequestInvite}
            currentUser={currentUser}
            isBookmarked={bookmarkedEventIds.includes(getOriginalEventId(selectedEventForModal.id))}
            onToggleBookmark={onToggleBookmark}
            onPayForEvent={onPayForEvent}
            onNavigateToChat={onNavigateToChat}
            onViewParticipants={handleViewParticipants}
            isSubscribed={subscribedEventIds.includes(getOriginalEventId(selectedEventForModal.id))}
            onToggleSubscription={onToggleSubscription}
            onBookVenue={onBookVenue}
            isLiked={likedEventIds.includes(getOriginalEventId(selectedEventForModal.id))}
            onToggleLike={onToggleLike}
            onJoinGuestlist={onJoinGuestlist}
        />
      )}
    </>
  );
};
