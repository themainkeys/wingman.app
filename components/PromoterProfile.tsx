
import React, { useState, useEffect } from 'react';
import { Promoter, Venue, User, UserAccessLevel, UserRole, Page, Event } from '../types';
import { venues } from '../data/mockData';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { StarIcon } from './icons/StarIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ImageCarouselModal } from './modals/ImageCarouselModal';
import { ShareIcon } from './icons/ShareIcon';
import { CheckIcon } from './icons/CheckIcon';
import { FavoriteConfirmationModal } from './modals/FavoriteConfirmationModal';
import { PencilIcon } from './icons/PencilIcon';
import { EditScheduleModal } from './modals/EditScheduleModal';

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface PromoterProfileProps {
  promoter: Promoter;
  onBack: () => void;
  onBook: (promoter: Promoter, venue?: Venue, date?: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (promoterId: number) => void;
  onViewVenue: (venue: Venue) => void;
  onJoinGuestlist: (promoter: Promoter, venue?: Venue, date?: string) => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onUpdatePromoter: (promoter: Promoter) => void;
  onEditProfile?: () => void;
  onNavigate?: (page: Page, params?: any) => void;
  tokenBalance?: number;
  events?: Event[];
}

export const PromoterProfile: React.FC<PromoterProfileProps> = ({ 
    promoter, 
    onBack, 
    onBook, 
    isFavorite, 
    onToggleFavorite, 
    onViewVenue, 
    onJoinGuestlist, 
    currentUser, 
    onUpdateUser, 
    onUpdatePromoter,
    onEditProfile,
    onNavigate,
    tokenBalance = 0,
    events = []
}) => {
  const getVenueById = (id: number): Venue | undefined => venues.find(v => v.id === id);
  const getEventById = (id: number | string): Event | undefined => events.find(e => e.id === id);

  const showBottomNav = (currentUser.role === UserRole.USER || currentUser.role === UserRole.ADMIN);
  const [galleryModalState, setGalleryModalState] = useState<{isOpen: boolean, startIndex: number}>({ isOpen: false, startIndex: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false);

  const isOwnProfile = currentUser.id === promoter.id;
  const canEdit = currentUser.role === UserRole.ADMIN || isOwnProfile;

  useEffect(() => {
    const existingRating = currentUser.promoterRatings?.find(r => r.promoterId === promoter.id)?.rating;
    if (existingRating) {
        setUserRating(existingRating);
    }
  }, [currentUser, promoter.id]);

  const openGalleryModal = (index: number) => {
    setGalleryModalState({ isOpen: true, startIndex: index });
  };

  const closeGalleryModal = () => {
    setGalleryModalState({ isOpen: false, startIndex: 0 });
  };

  const getNextDateForDay = (dayOfWeek: string): string => {
      const dayIndex = WEEKDAYS.indexOf(dayOfWeek);
      if (dayIndex === -1) return new Date().toISOString().split('T')[0];
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      const todayIndex = today.getDay();
  
      let daysToAdd = dayIndex - todayIndex;
      if (daysToAdd < 0) {
          daysToAdd += 7;
      }
  
      const nextDate = new Date(today.getTime());
      nextDate.setDate(today.getDate() + daysToAdd);
      
      return nextDate.toISOString().split('T')[0];
  };

  const getNextWorkingDateAndVenue = () => {
      const WEEKDAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIndex = today.getDay();

      for (let i = 0; i < 7; i++) {
          const checkDayIndex = (todayIndex + i) % 7;
          const dayName = WEEKDAYS_ORDER[checkDayIndex];
          
          const scheduleForDay = promoter.weeklySchedule.find(s => s.day === dayName && s.venueId);
          if (scheduleForDay && scheduleForDay.venueId) {
              const venue = getVenueById(scheduleForDay.venueId);
              if (venue) {
                  const nextDate = new Date(today);
                  nextDate.setDate(today.getDate() + i);
                  return {
                      date: nextDate.toISOString().split('T')[0],
                      venue: venue,
                  };
              }
          }
      }
      return null;
  }

  const nextWorkingInfo = getNextWorkingDateAndVenue();
  const guestlistDateString = nextWorkingInfo 
    ? `for ${new Date(nextWorkingInfo.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}`
    : '';

  const handleJoinGuestlistClick = () => {
    if (!nextWorkingInfo) {
      onJoinGuestlist(promoter);
      return;
    }
    onJoinGuestlist(promoter, nextWorkingInfo.venue, nextWorkingInfo.date);
  };

  const handleShareClick = async () => {
    const shareUrl = `${window.location.origin}?promoter=${promoter.id}`;
    const shareData = {
        title: `Check out ${promoter.name} on WINGMAN`,
        text: `Check out ${promoter.name}'s profile on WINGMAN!`,
        url: shareUrl,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error(err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }
  };

  const handleRate = (rating: number) => {
      setUserRating(rating);
      
      const currentRatings = currentUser.promoterRatings || [];
      const otherRatings = currentRatings.filter(r => r.promoterId !== promoter.id);
      const newRatings = [...otherRatings, { promoterId: promoter.id, rating }];
      
      onUpdateUser({
          ...currentUser,
          promoterRatings: newRatings
      });
  };

  const handleFavoriteToggle = () => {
    setIsFavoriteModalOpen(true);
  };

  const confirmFavorite = () => {
    onToggleFavorite(promoter.id);
    setIsFavoriteModalOpen(false);
  };

  const handleScheduleUpdate = (newSchedule: { day: string; venueId?: number; eventId?: number | string }[]) => {
      onUpdatePromoter({
          ...promoter,
          weeklySchedule: newSchedule
      });
  };

  // Group schedule items by day for cleaner display
  const groupedSchedule = WEEKDAYS.map(day => {
      const items = promoter.weeklySchedule.filter(s => s.day === day);
      return { day, items };
  }).filter(group => group.items.length > 0);

  return (
    <div className="animate-fade-in bg-[var(--color-background)] min-h-screen pb-32">
      {/* Hero Header */}
      <div className="relative h-96 w-full">
        <img src={promoter.profilePhoto} alt={`Profile of ${promoter.name}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-60"></div>
        
        <button onClick={onBack} className="absolute top-6 left-4 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/20 transition-colors z-10" aria-label="Go back">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <div className="absolute top-6 right-4 flex items-center gap-3 z-10">
             <div className={`bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transition-opacity duration-300 ${isCopied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                Copied!
            </div>
            <button 
                onClick={handleShareClick} 
                className="bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/20 transition-colors"
                aria-label="Share profile"
            >
                {isCopied ? <CheckIcon className="w-6 h-6" /> : <ShareIcon className="w-6 h-6" />}
            </button>
        </div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
           <div className="container mx-auto max-w-6xl flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                 <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-2 drop-shadow-lg">{promoter.name}</h1>
                 <p className="text-xl text-gray-200 font-medium tracking-wide drop-shadow-md">{promoter.handle}</p>
              </div>
              {!isOwnProfile && (
                  <button onClick={handleFavoriteToggle} className="self-start md:self-end bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 border border-white/20">
                     <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-[#EC4899] fill-current' : ''}`} isFilled={isFavorite} />
                     {isFavorite ? 'Favorited' : 'Favorite'}
                  </button>
              )}
           </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-6 space-y-10 -mt-8 relative z-20">
         {/* Stats Bar */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#1C1C1E] rounded-2xl border border-gray-800 shadow-2xl">
            <div className="text-center border-r border-gray-800 last:border-0">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <StarIcon className="w-4 h-4 text-[#EC4899]" />
                    <span className="text-2xl font-bold text-white">{promoter.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rating</p>
            </div>
            <div className="text-center border-r border-gray-800 last:border-0">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <UsersIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold text-white">{promoter.favoritedByCount}</span>
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Followers</p>
            </div>
             <div className="text-center border-r border-gray-800 last:border-0">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <CalendarIcon className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-white">{promoter.weeklySchedule.length}</span>
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Venues/Events</p>
            </div>
            {(currentUser.role === UserRole.ADMIN || isOwnProfile) && promoter.earnings !== undefined && (
                 <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <CurrencyDollarIcon className="w-5 h-5 text-amber-400" />
                        <span className="text-2xl font-bold text-white">${(promoter.earnings / 1000).toFixed(1)}k</span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Earnings</p>
                </div>
            )}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details, Gallery, Rating/Menu */}
            <div className="lg:col-span-2 space-y-10">
               {/* Section 1: About */}
               <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#EC4899] rounded-full"></span> About
                  </h2>
                  <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-gray-800 leading-relaxed text-gray-300">
                      {promoter.bio}
                  </div>
               </section>

               {/* Section 2: Gallery */}
               <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-amber-400 rounded-full"></span> Gallery
                  </h2>
                  {promoter.galleryImages && promoter.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {promoter.galleryImages.map((img, index) => (
                        <button 
                          key={index} 
                          onClick={() => openGalleryModal(index)}
                          className="aspect-square rounded-xl overflow-hidden group relative focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <img src={img} alt={`${promoter.name} gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-[#1C1C1E] rounded-2xl border border-gray-800 text-gray-500">No gallery images available.</div>
                  )}
               </section>

               {/* Section 3: Rating (Only for non-owners) */}
               {!isOwnProfile && (
                   <section>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                          <span className="w-1 h-6 bg-purple-500 rounded-full"></span> Rate Experience
                      </h2>
                      <div className="bg-[#1C1C1E] p-8 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
                          <h3 className="text-lg font-semibold text-white mb-2">How was your experience with {promoter.name.split(' ')[0]}?</h3>
                          <p className="text-gray-400 text-sm mb-6">Your feedback helps the community find the best promoters.</p>
                          <div className="flex gap-3 mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                  <button 
                                      key={star} 
                                      onClick={() => handleRate(star)}
                                      className="transition-transform hover:scale-110 focus:outline-none"
                                      aria-label={`Rate ${star} stars`}
                                  >
                                      <StarIcon className={`w-10 h-10 transition-colors ${star <= userRating ? 'text-amber-400' : 'text-gray-700'}`} />
                                  </button>
                              ))}
                          </div>
                          {userRating > 0 && (
                              <div className="animate-fade-in">
                                  <p className="text-green-400 font-bold bg-green-400/10 px-4 py-2 rounded-full">Thanks for rating!</p>
                              </div>
                          )}
                      </div>
                   </section>
               )}
            </div>

            {/* Right Column: Weekly Schedule (Sticky on Desktop) */}
            <div className="space-y-8">
               <section className="sticky top-24">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                          <span className="w-1 h-6 bg-blue-500 rounded-full"></span> Weekly Schedule
                      </h2>
                      {canEdit && (
                          <button 
                              onClick={() => setIsEditScheduleModalOpen(true)} 
                              className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
                          >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                          </button>
                      )}
                  </div>
                  <div className="space-y-6">
                      {groupedSchedule.map(group => (
                          <div key={group.day}>
                              <h3 className="text-lg font-bold text-white mb-3">{group.day}</h3>
                              <div className="space-y-3">
                                  {group.items.map((item, idx) => {
                                      const venue = item.venueId ? getVenueById(item.venueId) : undefined;
                                      const event = item.eventId ? getEventById(item.eventId) : undefined;
                                      
                                      if (!venue && !event) return null;
                                      
                                      const nextDate = getNextDateForDay(item.day);
                                      const name = venue?.name || event?.title;
                                      const image = venue?.coverImage || event?.image;
                                      const typeLabel = venue ? 'Venue' : 'Event';
                                      
                                      return (
                                          <div key={`${group.day}-${idx}`} className="group bg-[#1C1C1E] rounded-xl border border-gray-800 overflow-hidden hover:border-[#EC4899] transition-colors">
                                              <div className="relative h-24">
                                                  <img src={image} alt={name} className="w-full h-full object-cover" />
                                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                      <h4 className="text-lg font-bold text-white drop-shadow-lg text-center px-2">{name}</h4>
                                                  </div>
                                                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-black ${venue ? 'bg-amber-400' : 'bg-purple-400'}`}>
                                                      {typeLabel}
                                                  </div>
                                              </div>
                                              <div className="p-2 flex gap-2">
                                                  <button 
                                                      onClick={() => venue ? onViewVenue(venue) : onNavigate?.('eventTimeline', { eventId: event?.id })}
                                                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-bold py-1.5 rounded-md transition-colors"
                                                  >
                                                      View Details
                                                  </button>
                                                  {!isOwnProfile && (
                                                      <button 
                                                          onClick={() => venue ? onBook(promoter, venue, nextDate) : onNavigate?.('eventTimeline', { eventId: event?.id })}
                                                          className="flex-1 bg-[#EC4899] hover:bg-[#d8428a] text-white text-[10px] font-bold py-1.5 rounded-md transition-colors shadow-lg shadow-[#EC4899]/20"
                                                      >
                                                          {venue ? 'Book Table' : 'View Event'}
                                                      </button>
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      ))}
                      {groupedSchedule.length === 0 && (
                          <p className="text-gray-500 text-sm text-center py-8 bg-[#1C1C1E] rounded-xl border border-gray-800">No schedule available yet.</p>
                      )}
                  </div>
               </section>
            </div>
         </div>
      </div>

       <div className={`fixed inset-x-0 ${showBottomNav ? 'bottom-20' : 'bottom-0'} z-30 bg-black/80 backdrop-blur-lg border-t border-gray-800 p-4`}>
        <div className="container mx-auto max-w-5xl text-center flex flex-col sm:flex-row items-center justify-center gap-3">
            {isOwnProfile ? (
                <button onClick={onEditProfile} className="w-full sm:flex-1 bg-[#EC4899] text-white font-bold py-4 px-6 rounded-xl transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#EC4899] hover:bg-[#d8428a] shadow-xl shadow-[#EC4899]/20 text-lg">
                    <PencilIcon className="w-5 h-5 inline-block mr-2" />
                    Edit Profile
                </button>
            ) : (
                <>
                    <button onClick={() => onBook(promoter)} className="w-full sm:flex-1 bg-[#EC4899] text-white font-bold py-4 px-6 rounded-xl transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#EC4899] hover:bg-[#d8428a] shadow-xl shadow-[#EC4899]/20 text-lg" aria-label={`Book a table with ${promoter.name}`}>
                        Book with {promoter.name.split(' ')[0]}
                    </button>
                    {(currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL || currentUser.role === UserRole.ADMIN) && (
                    <button
                        onClick={handleJoinGuestlistClick}
                        className="w-full sm:flex-1 bg-gray-800 text-amber-400 font-bold py-4 px-6 rounded-xl transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 hover:bg-gray-700 border border-amber-400/30 text-lg shadow-lg shadow-amber-900/20"
                    >
                        Join Guestlist {guestlistDateString}
                    </button>
                    )}
                </>
            )}
        </div>
    </div>
      <ImageCarouselModal 
        isOpen={galleryModalState.isOpen}
        onClose={closeGalleryModal}
        images={promoter.galleryImages}
        startIndex={galleryModalState.startIndex}
      />
      <FavoriteConfirmationModal 
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onConfirm={confirmFavorite}
        promoterName={promoter.name}
        action={isFavorite ? 'remove' : 'add'}
      />
      <EditScheduleModal 
        isOpen={isEditScheduleModalOpen} 
        onClose={() => setIsEditScheduleModalOpen(false)} 
        currentSchedule={promoter.weeklySchedule} 
        venues={venues} 
        events={events}
        onSave={handleScheduleUpdate} 
      />
    </div>
  );
};
