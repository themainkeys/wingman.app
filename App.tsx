
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Promoter, UserAccessLevel, Event, Venue, Page, User, UserRole, StoreItem, Transaction, Challenge, Experience, AccessGroup, GroupPost, Itinerary, ConfirmedBookingDetails, ConfirmedExperienceBookingDetails, AppNotification, GuestlistChat, GuestlistChatMessage, EventInvitationRequest, EventInvitation, CartItem, EventChat, EventChatMessage, ChallengeTask, GuestlistJoinRequest, PromoterApplication, DataExportRequest, PaymentMethod, FriendZoneChat, FriendZoneChatMessage } from './types';
import { promoters as mockPromoters, users as mockUsers, mockTokenTransactions, venues as mockVenues, bookingHistory as mockBookingHistory, accessGroups as mockAccessGroups, groupPosts as mockGroupPosts, itineraries as mockItineraries, events as mockEvents, experiences as mockExperiences, mockNotifications, mockGuestlistChats, mockGuestlistChatMessages, mockInvitationRequests, suggestedEvents, timelineEvents, mockEventInvitations, mockEventChats, mockEventChatMessages, challenges as mockChallenges, mockGuestlistJoinRequests, mockPromoterApplications, storeItems as mockStoreItems, mockDataExportRequests, mockFriendZoneChats, mockFriendZoneChatMessages } from './data/mockData';
import { PromoterDirectory } from './components/PromoterDirectory';
import { PromoterProfile } from './components/PromoterProfile';
import { BookingFlow } from './components/BookingFlow';
import { SideMenu } from './components/SideMenu';
import { HomeScreen } from './components/HomeScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { ProfilePage } from './components/ProfilePage';
import { QrScanner } from './components/QrScanner';
import { Header } from './components/Header';
import { NotificationsPanel } from './components/NotificationsPanel';
import { CartPanel } from './components/CartPanel';
import { EventTimeline } from './components/EventTimeline';
import { ChallengesPage } from './components/ChallengesPage';
import { BookingsPage } from './components/BookingsPage';
import { SettingsPage } from './components/SettingsPage';
import { SecurityPage } from './components/SecurityPage';
import { PrivacyPage } from './components/PrivacyPage';
import { NotificationsSettingsPage } from './components/NotificationsSettingsPage';
import { HelpPage } from './components/HelpPage';
import { ReportIssuePage } from './components/ReportIssuePage';
import { CookieSettingsPage } from './components/CookieSettingsPage';
import { DataExportPage } from './components/DataExportPage';
import { ChatbotPage } from './components/ChatbotPage';
import { LiveChatPage } from './components/LiveChatPage';
import { ExclusiveExperiencesPage } from './components/ExclusiveExperiencesPage';
import { ExperienceBookingFlow } from './components/ExperienceBookingFlow';
import { VenueDetailsPage } from './components/VenueDetailsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PromoterDashboard } from './components/PromoterDashboard';
import { GroupChatPage } from './components/GroupChatPage';
import { StorePage } from './components/StorePage';
import { TokenWalletPage } from './components/TokenWalletPage';
import { AccessGroupsPage } from './components/AccessGroupsPage';
import { AccessGroupFeedPage } from './components/AccessGroupFeedPage';
import { MyItinerariesPage } from './components/MyItinerariesPage';
import { ItineraryDetailsPage } from './components/ItineraryDetailsPage';
import { ItineraryBuilderPage } from './components/ItineraryBuilderPage';
import { BookingConfirmedPage } from './components/BookingConfirmedPage';
import { PromoterApplicationPage } from './components/PromoterApplicationPage';
import { CreateGroupPage } from './components/CreateGroupPage';
import { GuestlistChatsPage } from './components/GuestlistChatsPage';
import { GuestlistChatPage } from './components/GuestlistChatPage';
import { InvitationsPage } from './components/InvitationsPage';
import { CheckoutPage } from './components/CheckoutPage';
import { BookATablePage } from './components/BookATablePage';
import { FavoritesPage } from './components/FavoritesPage';
import { EditProfilePage } from './components/EditProfilePage';
import { EventChatsListPage } from './components/EventChatsListPage';
import { EventChatPage } from './components/EventChatPage';
import { SelectPromoterModal } from './components/SelectPromoterModal';
import { GuestlistModal } from './components/modals/GuestlistModal';
import { UserProfilePreviewModal } from './components/modals/UserProfilePreviewModal';
import { AdminEditUserModal } from './components/modals/AdminEditUserModal';
import { AdminAddUserModal } from './components/modals/AdminAddUserModal';
import { AdminEditPromoterModal } from './components/modals/AdminEditPromoterModal';
import { DestructiveConfirmationModal } from './components/modals/DestructiveConfirmationModal';
import { DeleteAccountModal } from './components/modals/DeleteAccountModal';
import { AdminEditEventModal } from './components/modals/AdminEditEventModal';
import { AdminEditVenueModal } from './components/modals/AdminEditVenueModal';
import { EventGuestDetailsModal } from './components/modals/EventGuestDetailsModal';
import { EventDetailModal } from './components/modals/EventDetailModal';
import { EventParticipantsModal } from './components/modals/EventParticipantsModal';
import { useTheme } from './contexts/ThemeContext';
import { ToastNotification } from './components/ToastNotification';
import { AdminEditStoreItemModal } from './components/modals/AdminEditStoreItemModal';
import { StoreItemPreviewModal } from './components/modals/StoreItemPreviewModal';
import { PromoterStatsPage } from './components/PromoterStatsPage';
import { GuestlistJoinSuccessModal } from './components/modals/GuestlistJoinSuccessModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { Spinner } from './components/icons/Spinner';
import { PaymentMethodsPage } from './components/PaymentMethodsPage';
import { FriendsZonePage } from './components/FriendsZonePage';
import { FriendZoneChatPage } from './components/FriendZoneChatPage';

type ModalState = 
  | { type: 'experienceBooking'; experience: Experience }
  | { type: 'guestlist'; context: { promoter?: Promoter; venue?: Venue; date?: string } }
  | { type: 'selectPromoter'; venue: Venue }
  | null;

const getOriginalEventId = (eventId: number | string) => {
    return typeof eventId === 'string' ? parseInt(eventId.split('-')[0], 10) : eventId;
};

const initialPaymentMethods: PaymentMethod[] = [
    { id: '1', category: 'cards', type: 'Visa', last4: '4567', expiry: '03/2026', isDefault: true },
    { id: '2', category: 'cards', type: 'Mastercard', last4: '1234', expiry: '01/2025', isDefault: false },
    { id: '3', category: 'cards', type: 'American Express', last4: '7890', expiry: '05/2027', isDefault: false },
    { id: '4', category: 'other', type: 'PayPal', icon: 'https://picsum.photos/seed/paypal/40/40', isDefault: false },
    { id: '5', category: 'other', type: 'Cash App', icon: 'https://picsum.photos/seed/cashapp/40/40', isDefault: false },
    { id: '6', category: 'other', type: 'Crypto Wallet', icon: 'https://picsum.photos/seed/crypto/40/40', isDefault: false },
];

export const App: React.FC = () => {
    const { theme } = useTheme();
    // Set default to Anderson (Promoter)
    const [currentUser, setCurrentUser] = useState<User>(mockUsers.find(u => u.name === 'Anderson') || mockUsers[0]);
    const [showOnboarding, setShowOnboarding] = useState(currentUser.isNewUser);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [promoters, setPromoters] = useState<Promoter[]>(mockPromoters);
    const [isLoadingPromoters, setIsLoadingPromoters] = useState(false);
    const [allEvents, setAllEvents] = useState<Event[]>([...mockEvents, ...suggestedEvents, ...timelineEvents]);
    const [venues, setVenues] = useState<Venue[]>(mockVenues);
    const [storeItems, setStoreItems] = useState<StoreItem[]>(mockStoreItems);
    const [promoterApplications, setPromoterApplications] = useState<PromoterApplication[]>(mockPromoterApplications);
    const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
    const [dataExportRequests, setDataExportRequests] = useState<DataExportRequest[]>(mockDataExportRequests);
    const [invitationRequests, setInvitationRequests] = useState<EventInvitationRequest[]>(mockInvitationRequests);
    const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [pageParams, setPageParams] = useState<Record<string, any>>({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<ModalState>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [previewedUser, setPreviewedUser] = useState<User | null>(null);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [rsvpToCancel, setRsvpToCancel] = useState<CartItem | null>(null);
    const [guestlistSuccessDetails, setGuestlistSuccessDetails] = useState<{ venueName: string, date: string, isVip: boolean } | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [userToBlock, setUserToBlock] = useState<User | null>(null);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [eventToPreview, setEventToPreview] = useState<Event | null>(null);
    const [participantsForEvent, setParticipantsForEvent] = useState<User[]>([]);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [isAdminEditEventModalOpen, setIsAdminEditEventModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'event' | 'venue' | 'storeItem'; id: number | string; name: string } | null>(null);
    const [promoterToEdit, setPromoterToEdit] = useState<{ promoter: Promoter; user: User } | null>(null);
    const [promoterToDelete, setPromoterToDelete] = useState<Promoter | null>(null);
    const [promoterToSuspend, setPromoterToSuspend] = useState<User | null>(null);
    const [venueToEdit, setVenueToEdit] = useState<Venue | null>(null);
    const [storeItemToEdit, setStoreItemToEdit] = useState<StoreItem | null>(null);
    const [storeItemToPreview, setStoreItemToPreview] = useState<StoreItem | null>(null);
    const [isAdminEditVenueModalOpen, setIsAdminEditVenueModalOpen] = useState(false);
    const [isAdminEditStoreItemModalOpen, setIsAdminEditStoreItemModalOpen] = useState(false);
    const [likedEventIds, setLikedEventIds] = useState<number[]>([204, 211]);
    const [bookmarkedEventIds, setBookmarkedEventIds] = useState<number[]>([204, 211]);
    const [subscribedEventIds, setSubscribedEventIds] = useState<number[]>([]);
    const [tokenBalance, setTokenBalance] = useState(mockTokenTransactions.reduce((acc, tx) => tx.type === 'add' ? acc + tx.amount : acc - tx.amount, 0));
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [bookedItems, setBookedItems] = useState<CartItem[]>([]);
    const [tableBookings, setTableBookings] = useState<Record<string, number>>({});
    const [guestlistJoinRequests, setGuestlistJoinRequests] = useState<GuestlistJoinRequest[]>(mockGuestlistJoinRequests);
    const [guestlistChats, setGuestlistChats] = useState<GuestlistChat[]>(mockGuestlistChats);
    const [guestlistChatMessages, setGuestlistChatMessages] = useState<GuestlistChatMessage[]>(mockGuestlistChatMessages);
    const [eventChats, setEventChats] = useState<EventChat[]>(mockEventChats);
    const [eventInvitations, setEventInvitations] = useState<EventInvitation[]>(mockEventInvitations);
    const [eventChatMessages, setEventChatMessages] = useState<EventChatMessage[]>(mockEventChatMessages);
    const [allRsvps, setAllRsvps] = useState<{ userId: number, eventId: number }[]>([{ userId: 102, eventId: 202 }, { userId: 101, eventId: 204 }]);
    const [eventGuestDetailsModal, setEventGuestDetailsModal] = useState<{ event: Event; item: CartItem } | null>(null);
    const [itineraries, setItineraries] = useState<Itinerary[]>(mockItineraries);
    const [bookingFlowData, setBookingFlowData] = useState<{ promoter: Promoter, venue?: Venue } | null>(null);
    const [isGlobalScannerOpen, setIsGlobalScannerOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    
    // Friend Zone Chat State
    const [friendZoneChats, setFriendZoneChats] = useState<FriendZoneChat[]>(mockFriendZoneChats);
    const [friendZoneChatMessages, setFriendZoneChatMessages] = useState<FriendZoneChatMessage[]>(mockFriendZoneChatMessages);

    useEffect(() => {
        // Handle deep linking for shared promoter profiles
        const params = new URLSearchParams(window.location.search);
        const promoterId = params.get('promoter');
        const eventId = params.get('event');
        const itineraryId = params.get('itinerary');
        
        if (promoterId) {
            const id = parseInt(promoterId, 10);
            if (!isNaN(id)) {
                handleNavigate('promoterProfile', { promoterId: id });
            }
        } else if (eventId) {
             const id = parseInt(eventId, 10);
             if(!isNaN(id)) {
                 handleNavigate('eventTimeline');
             }
        } else if (itineraryId) {
             const id = parseInt(itineraryId, 10);
             if(!isNaN(id)) {
                 handleNavigate('itineraryDetails', { itineraryId: id });
             }
        }
    }, []);

    const handleNavigate = (page: Page, params: Record<string, any> = {}) => {
        setCurrentPage(page);
        setPageParams(params);
        setIsMenuOpen(false);
        setIsCartOpen(false);
        window.scrollTo(0, 0);
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const handleOpenBookingFlow = (promoter: Promoter, venue?: Venue) => {
        setBookingFlowData({ promoter, venue });
    };

    const handleOpenGuestlistModal = (context: { promoter?: Promoter; venue?: Venue; date?: string }) => {
        setActiveModal({ type: 'guestlist', context });
    };

    const handleOpenSelectPromoterModal = (venue: Venue) => {
        setActiveModal({ type: 'selectPromoter', venue });
    };

    const handleUpdateProfile = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        // Sync with promoters list if applicable
        if (updatedUser.role === UserRole.PROMOTER) {
            setPromoters(prev => prev.map(p => p.id === updatedUser.id ? { ...p, ...updatedUser } : p));
        }
    };

    const handleUpdatePromoter = (updatedPromoter: Promoter) => {
        setPromoters(prev => prev.map(p => p.id === updatedPromoter.id ? updatedPromoter : p));
    };
    
    const handleUpdateRequestStatus = (requestId: number, status: 'pending' | 'show' | 'no-show') => {
        setGuestlistJoinRequests(prev => prev.map(req => req.id === requestId ? { ...req, attendanceStatus: status } : req));
        showToast(`Request status updated to ${status}`, "success");
    };

    const handleReviewGuestlistRequest = (requestId: number, status: 'approved' | 'rejected') => {
        setGuestlistJoinRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: status } : req));
        const request = guestlistJoinRequests.find(r => r.id === requestId);
        const user = users.find(u => u.id === request?.userId);
        showToast(`${user?.name || 'User'}'s request ${status}.`, status === 'approved' ? "success" : "error");
    };

    const handleToggleLikeEvent = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0]) : eventId;
        setLikedEventIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const currentUserRsvps = useMemo(() => allRsvps.filter(r => r.userId === currentUser.id).map(r => r.eventId), [allRsvps, currentUser.id]);

    const handleRsvp = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0]) : eventId;
        const isRsvped = currentUserRsvps.includes(id);
        if (isRsvped) {
            setAllRsvps(prev => prev.filter(r => !(r.userId === currentUser.id && r.eventId === id)));
            showToast("RSVP cancelled.", "success");
        } else {
            setAllRsvps(prev => [...prev, { userId: currentUser.id, eventId: id }]);
            showToast("RSVP confirmed!", "success");
        }
    };

    const handleToggleBookmarkEvent = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0]) : eventId;
        setBookmarkedEventIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleOpenGabyWithPrompt = (prompt: string) => {
        handleNavigate('chatbot', { initialPrompt: prompt });
    };

    const handleRequestInvite = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0]) : eventId;
        const newRequest: EventInvitationRequest = {
            id: Date.now(),
            userId: currentUser.id,
            eventId: id,
            status: 'pending'
        };
        setInvitationRequests(prev => [...prev, newRequest]);
        showToast("Invitation requested.", "success");
    };

    const handleNavigateToEventChat = (event: Event) => {
        const originalId = typeof event.id === 'string' ? parseInt(event.id.split('-')[0], 10) : event.id;
        let chat = eventChats.find(c => c.eventId === originalId);
        if (!chat) {
            chat = { id: Date.now(), eventId: originalId, memberIds: [currentUser.id] };
            setEventChats(prev => [...prev, chat!]);
        } else if (!chat.memberIds.includes(currentUser.id)) {
             setEventChats(prev => prev.map(c => c.id === chat!.id ? { ...c, memberIds: [...c.memberIds, currentUser.id] } : c));
        }
        handleNavigate('eventChat', { chatId: chat.id });
    };

    const handleToggleSubscription = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0]) : eventId;
        setSubscribedEventIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        showToast(subscribedEventIds.includes(id) ? "Unsubscribed." : "Subscribed for updates.", "success");
    };

    const handleToggleFavoriteVenue = (venueId: number) => {
        const currentFavorites = currentUser.favoriteVenueIds || [];
        const isFavorite = currentFavorites.includes(venueId);
        const newFavorites = isFavorite ? currentFavorites.filter(id => id !== venueId) : [...currentFavorites, venueId];
        const updatedUser = { ...currentUser, favoriteVenueIds: newFavorites };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        showToast(isFavorite ? "Removed from favorite venues." : "Added to favorite venues!", "success");
    };

    const handleSetFavoritePromoter = (promoterId: number) => {
        const currentFavorites = currentUser.favoritePromoterIds || [];
        const isFavorite = currentFavorites.includes(promoterId);
        
        let newFavorites: number[];
        if (isFavorite) {
            newFavorites = currentFavorites.filter(id => id !== promoterId);
        } else {
            newFavorites = [...currentFavorites, promoterId];
        }

        const updatedUser = {
            ...currentUser,
            favoritePromoterIds: newFavorites,
        };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        
        setPromoters(prevPromoters => 
            prevPromoters.map(p => {
                if (p.id === promoterId) {
                    return { 
                        ...p, 
                        favoritedByCount: isFavorite ? Math.max(0, p.favoritedByCount - 1) : p.favoritedByCount + 1 
                    };
                }
                return p;
            })
        );
        
        const actionText = isFavorite ? "Removed from" : "Added to";
        showToast(`${actionText} favorites.`, "success");
    };

    const handleOnboardingPromoterSelection = (promoterId: number | null) => {
        const updatedUser = { 
            ...currentUser, 
            referredByPromoterId: promoterId || undefined,
            favoritePromoterIds: promoterId ? [...(currentUser.favoritePromoterIds || []), promoterId] : currentUser.favoritePromoterIds
        };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (promoterId) {
            showToast("Promoter selected!", "success");
        }
    };

    const handleAdminApproveGroup = (groupId: number) => { 
        // mock impl
        showToast("Group approved", "success");
    };
    const handleAdminApproveRequest = (requestId: number) => { 
        setInvitationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
        showToast("Request approved", "success");
    };
    const handleAdminRejectRequest = (requestId: number) => { 
         setInvitationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
         showToast("Request rejected", "error");
    };
    const handleSendInvites = (eventId: number, userIds: number[]) => { 
        // mock impl
        showToast(`Sent ${userIds.length} invitations`, "success");
    };
    const handleAdminApprovePromoter = (appId: number) => { 
         const app = promoterApplications.find(a => a.id === appId);
         if (app) {
             // Create new user if userId is 0, otherwise find user
             let user = users.find(u => u.id === app.userId);
             if (!user) {
                 user = {
                     id: Date.now(),
                     name: app.fullName,
                     email: app.email,
                     profilePhoto: app.profilePhotoUrl,
                     accessLevel: UserAccessLevel.GENERAL,
                     role: UserRole.PROMOTER,
                     city: app.city,
                     joinDate: new Date().toISOString().split('T')[0],
                     instagramHandle: app.instagram,
                     phoneNumber: app.phone,
                     status: 'active',
                     galleryImages: app.mediaLinks,
                 }
                 setUsers(prev => [...prev, user!]);
             } else {
                 setUsers(prev => prev.map(u => u.id === user!.id ? { ...u, role: UserRole.PROMOTER } : u));
             }

             const newPromoter: Promoter = {
                 id: user.id,
                 name: app.stageName || app.fullName,
                 handle: `@${app.instagram}`,
                 rating: 5.0, // New promoters start with 5.0
                 bio: `Promoter in ${app.city}. Specializing in ${app.categories.join(', ')}.`,
                 profilePhoto: app.profilePhotoUrl,
                 city: app.city,
                 weeklySchedule: [],
                 assignedVenueIds: [], // Needs assignment
                 earnings: 0,
                 isOnline: true,
                 favoritedByCount: 0,
                 galleryImages: app.mediaLinks
             };
             setPromoters(prev => [...prev, newPromoter]);
         }
         setPromoterApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
         showToast("Promoter approved and account created.", "success");
    };
    const handleAdminRejectPromoter = (appId: number) => { 
         setPromoterApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
         showToast("Promoter rejected", "error");
    };
    const handleSendPushNotification = (notif: any) => { 
        setNotifications(prev => [{ id: Date.now(), time: 'Just now', read: false, ...notif }, ...prev]);
        showToast("Notification sent.", "success");
    };

    const handleAddToCart = (item: CartItem) => {
        setCartItems(prev => [...prev, item]);
        showToast("Added to plans.", "success");
    };
    
    // Derive watchlist items from bookmarkedEventIds
    const watchlistItems = useMemo(() => {
        return bookmarkedEventIds.map(id => {
            const event = allEvents.find(e => {
                 const eId = typeof e.id === 'string' ? parseInt(e.id.split('-')[0], 10) : e.id;
                 return eId === id;
            });
            if (!event) return null;
            
            const cartItem: CartItem = {
                id: `bookmark-${event.id}`,
                type: 'event',
                name: event.title,
                image: event.image,
                date: event.date,
                sortableDate: event.date,
                quantity: 1,
                fullPrice: event.priceGeneral || event.priceMale || 0,
                depositPrice: 0,
                paymentOption: 'full',
                isPlaceholder: true,
                eventDetails: {
                    event: event,
                    guestDetails: { name: currentUser.name, email: currentUser.email }
                }
            };
            return cartItem;
        }).filter((item): item is CartItem => item !== null);
    }, [bookmarkedEventIds, allEvents, currentUser]);

    const combinedCartItems = useMemo(() => [...cartItems, ...watchlistItems], [cartItems, watchlistItems]);

    const handleRemoveFromCart = (itemId: string) => {
        if (itemId.startsWith('bookmark-')) {
            // Handle un-bookmarking
            const eventIdStr = itemId.replace('bookmark-', '');
            const originalId = parseInt(eventIdStr.split('-')[0], 10);
            setBookmarkedEventIds(prev => prev.filter(id => id !== originalId));
            showToast("Removed from watchlist", "success");
        } else {
            // Handle removing actual cart item
            setCartItems(prev => prev.filter(i => i.id !== itemId));
            showToast("Removed from plans", "success");
        }
    };
    
    const handleUpdatePaymentOption = (itemId: string, option: 'deposit' | 'full') => {
        setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, paymentOption: option } : i));
    };

    const itemToConfirmedBookingDetails = (item: CartItem): ConfirmedBookingDetails => {
        return {
            venue: item.tableDetails?.venue,
            date: item.sortableDate || '',
            tableOption: item.tableDetails?.tableOption,
            numberOfGuests: item.tableDetails?.numberOfGuests || 0,
            totalPrice: item.paymentOption === 'full' ? (item.fullPrice || 0) : (item.depositPrice || 0),
            guestDetails: item.tableDetails?.guestDetails,
            bookingId: item.id,
            promoter: item.tableDetails?.promoter,
            event: item.eventDetails?.event,
            experience: item.experienceDetails?.experience,
        };
    };
    
    const handleConfirmCheckout = (method: 'tokens' | 'usd' | 'cashapp', itemIds: string[]) => {
        const itemsToBook = cartItems.filter(i => itemIds.includes(i.id));
        const newBookedItems = itemsToBook.map(i => ({ ...i, bookedTimestamp: Date.now() }));
        setBookedItems(prev => [...prev, ...newBookedItems]);
        setCartItems(prev => prev.filter(i => !itemIds.includes(i.id)));
        
        if (method === 'tokens') {
            const total = itemsToBook.reduce((sum, item) => sum + (item.fullPrice || 0), 0); // Using full price for token calc simplification
            setTokenBalance(prev => prev - (total * 100)); // Mock rate
        }
        
        if (newBookedItems.length > 0) {
            handleNavigate('bookingConfirmed', { details: itemToConfirmedBookingDetails(newBookedItems[0]) });
        }
    };
    
    const handleCheckIn = (venueId: number, qrData: string) => {
        showToast(`Checked in at venue ${venueId}`, "success");
    };

    const handleSaveItinerary = (itinerary: Itinerary) => {
        if (itinerary.id === 0) {
            setItineraries(prev => [...prev, { ...itinerary, id: Date.now(), creatorId: currentUser.id }]);
        } else {
            setItineraries(prev => prev.map(i => i.id === itinerary.id ? itinerary : i));
        }
        handleNavigate('myItineraries');
        showToast("Itinerary saved.", "success");
    };

    const handleSendGuestlistMessage = (chatId: number, text: string) => {
       const newMessage: GuestlistChatMessage = {
           id: Date.now(),
           chatId,
           senderId: currentUser.id,
           text,
           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       };
       setGuestlistChatMessages(prev => [...prev, newMessage]);
    };
    
    const handleSendEventChatMessage = (chatId: number, text: string) => {
       const newMessage: EventChatMessage = {
           id: Date.now(),
           chatId,
           senderId: currentUser.id,
           text,
           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       };
       setEventChatMessages(prev => [...prev, newMessage]);
    };

    const handleStartChat = (item: CartItem) => {
        if (item.tableDetails?.promoter) {
          handleNavigate('guestlistChats');
        }
    };

    const handleGlobalScan = (data: string) => {
        setIsGlobalScannerOpen(false);
        if (data.includes('table') || data.includes('booking')) {
            showToast("Booking Verified Successfully", "success");
        } else {
            showToast(`Scanned: ${data}`, "success");
        }
    };

    const handleCompleteBooking = (item: CartItem) => {
        if (item.type === 'event' && item.eventDetails) {
             setEventToPreview(item.eventDetails.event);
        } else if (item.type === 'table' && item.tableDetails) {
             handleOpenBookingFlow(item.tableDetails.promoter || promoters[0], item.tableDetails.venue);
        }
        // Only remove if it's not a bookmark
        if (!item.id.startsWith('bookmark-')) {
             setCartItems(prev => prev.filter(i => i.id !== item.id));
        }
    };

    const handleAddFriend = (userId: number) => {
        if (currentUser.friends && currentUser.friends.length >= 25) {
            showToast("You can only have up to 25 friends in your zone.", "error");
            return;
        }
        const updatedFriends = [...(currentUser.friends || []), userId];
        const updatedUser = { ...currentUser, friends: updatedFriends };
        handleUpdateProfile(updatedUser);
        showToast("Friend added to your zone!", "success");
    };

    const handleRemoveFriend = (userId: number) => {
        const updatedFriends = (currentUser.friends || []).filter(id => id !== userId);
        const updatedUser = { ...currentUser, friends: updatedFriends };
        handleUpdateProfile(updatedUser);
        showToast("Friend removed.", "success");
    };
    
    const handleAddPaymentMethod = (method: PaymentMethod) => {
        setPaymentMethods(prev => [...prev, method]);
        showToast("Payment method added.", "success");
    };
    
    const handleRemovePaymentMethod = (id: string) => {
        setPaymentMethods(prev => prev.filter(m => m.id !== id));
        showToast("Payment method removed.", "success");
    };
    
    const handleSetDefaultPaymentMethod = (id: string) => {
        setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
        showToast("Default payment method updated.", "success");
    };

    // --- Friend Zone Chat Handlers ---
    const handleCreateFriendZoneChat = (name: string) => {
        const newChat: FriendZoneChat = {
            id: Date.now(),
            name,
            creatorId: currentUser.id,
            memberIds: [currentUser.id, ...(currentUser.friends || [])], // Start with friends
            promoterId: undefined
        };
        setFriendZoneChats(prev => [...prev, newChat]);
        showToast("Chat created!", "success");
    };

    const handleDeleteFriendZoneChat = (chatId: number) => {
        setFriendZoneChats(prev => prev.filter(c => c.id !== chatId));
        showToast("Chat deleted.", "success");
    };

    const handleSendFriendZoneMessage = (chatId: number, text: string) => {
        const newMessage: FriendZoneChatMessage = {
            id: Date.now(),
            chatId,
            senderId: currentUser.id,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setFriendZoneChatMessages(prev => [...prev, newMessage]);
    };

    const handleAddPromoterToChat = (chatId: number, promoterId: number) => {
        setFriendZoneChats(prev => prev.map(c => 
            c.id === chatId ? { ...c, promoterId, memberIds: [...c.memberIds, promoterId] } : c
        ));
        showToast("Promoter added to chat.", "success");
    };

    const handleRemovePromoterFromChat = (chatId: number, promoterId: number) => {
        setFriendZoneChats(prev => prev.map(c => 
            c.id === chatId ? { 
                ...c, 
                promoterId: undefined, 
                memberIds: c.memberIds.filter(id => id !== promoterId) 
            } : c
        ));
        showToast("Promoter removed from chat.", "success");
    };

    const handleAddFriendToChat = (chatId: number, friendId: number) => {
        setFriendZoneChats(prev => prev.map(c => 
            c.id === chatId ? { ...c, memberIds: [...c.memberIds, friendId] } : c
        ));
        showToast("Friend added to chat.", "success");
    };

    const handleRemoveFriendFromChat = (chatId: number, friendId: number) => {
        setFriendZoneChats(prev => prev.map(c => 
            c.id === chatId ? { ...c, memberIds: c.memberIds.filter(id => id !== friendId) } : c
        ));
        showToast("Friend removed from chat.", "success");
    };

    const handleLeaveChat = (chatId: number) => {
        setFriendZoneChats(prev => prev.map(c => 
            c.id === chatId ? { ...c, memberIds: c.memberIds.filter(id => id !== currentUser.id) } : c
        ));
        handleNavigate('friendsZone');
        showToast("You left the chat.", "success");
    };
    // ----------------------------------

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomeScreen onNavigate={handleNavigate} currentUser={currentUser} onOpenMenu={() => setIsMenuOpen(true)} />;
            case 'directory':
                return <PromoterDirectory promoters={promoters} isLoading={isLoadingPromoters} onViewProfile={(p) => handleNavigate('promoterProfile', { promoterId: p.id })} onBookPromoter={handleOpenBookingFlow} onToggleFavorite={handleSetFavoritePromoter} currentUser={currentUser} onNavigate={handleNavigate} onJoinGuestlist={(p) => handleOpenGuestlistModal({ promoter: p })} />;
            case 'promoterProfile':
                if (isLoadingPromoters) return <div className="flex items-center justify-center h-screen"><Spinner className="w-12 h-12 text-[#EC4899]" /></div>;
                const promoter = promoters.find(p => p.id === pageParams.promoterId);
                return promoter ? <PromoterProfile promoter={promoter} onBack={() => handleNavigate('directory')} onBook={handleOpenBookingFlow} isFavorite={(currentUser.favoritePromoterIds || []).includes(promoter.id)} onToggleFavorite={handleSetFavoritePromoter} onViewVenue={(v) => handleNavigate('venueDetails', { venueId: v.id })} onJoinGuestlist={handleOpenGuestlistModal} currentUser={currentUser} onUpdateUser={handleUpdateProfile} onUpdatePromoter={handleUpdatePromoter} /> : <div className="p-8 text-center text-white">Promoter not found</div>;
            case 'userProfile':
                // Check if current user is also a promoter to pass promoter data
                const promoterProfile = currentUser.role === UserRole.PROMOTER ? promoters.find(p => p.id === currentUser.id) : undefined;
                return <ProfilePage onNavigate={handleNavigate} currentUser={currentUser} tokenBalance={tokenBalance} bookingHistory={mockBookingHistory} favoriteVenueIds={currentUser.favoriteVenueIds || []} venues={venues} onViewVenueDetails={(v) => handleNavigate('venueDetails', { venueId: v.id })} promoterProfile={promoterProfile} onUpdatePromoter={handleUpdatePromoter} />;
            case 'editProfile':
                 return <EditProfilePage currentUser={currentUser} onSave={handleUpdateProfile} onNavigate={handleNavigate} showToast={showToast} />;
            case 'eventTimeline':
                return <EventTimeline currentUser={currentUser} allEvents={allEvents} likedEventIds={likedEventIds} onToggleLike={handleToggleLikeEvent} rsvpedEventIds={currentUserRsvps} onRsvp={handleRsvp} bookmarkedEventIds={bookmarkedEventIds} onToggleBookmark={handleToggleBookmarkEvent} onOpenGabyWithPrompt={handleOpenGabyWithPrompt} invitationRequests={invitationRequests} onRequestInvite={handleRequestInvite} onPayForEvent={() => {}} onNavigateToChat={handleNavigateToEventChat} subscribedEventIds={subscribedEventIds} onToggleSubscription={handleToggleSubscription} onBookVenue={(v) => handleOpenSelectPromoterModal(v)} onJoinGuestlist={handleOpenGuestlistModal} guestlistRequests={guestlistJoinRequests} />;
            case 'challenges':
                return <ChallengesPage challenges={challenges} onToggleTask={(challengeId, taskId) => {
                    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t) } : c))
                }} onDeleteTask={() => {}} onRewardClaimed={(amount) => setTokenBalance(prev => prev + amount)} />;
            case 'bookings':
                return <BookingsPage onNavigate={handleNavigate} />;
            case 'favorites':
                return <FavoritesPage onNavigate={handleNavigate} promoters={promoters} onSelectPromoter={(p) => handleNavigate('promoterProfile', { promoterId: p.id })} onToggleFavorite={handleSetFavoritePromoter} favoriteVenueIds={currentUser.favoriteVenueIds || []} onToggleVenueFavorite={handleToggleFavoriteVenue} onViewVenueDetails={(v) => handleNavigate('venueDetails', { venueId: v.id })} currentUser={currentUser} />;
            case 'settings':
                return <SettingsPage onNavigate={handleNavigate} />;
            case 'security':
                return <SecurityPage />;
            case 'privacy':
                return <PrivacyPage onNavigate={handleNavigate} onDeleteAccountRequest={() => setIsDeleteAccountModalOpen(true)} />;
            case 'notificationsSettings':
                 return <NotificationsSettingsPage settings={{ eventAnnouncements: true, bookingUpdates: true, recommendations: false }} onSettingsChange={() => {}} />;
            case 'help':
                return <HelpPage />;
            case 'reportIssue':
                return <ReportIssuePage />;
            case 'cookieSettings':
                return <CookieSettingsPage />;
            case 'dataExport':
                return <DataExportPage requests={dataExportRequests} onNewRequest={() => { setDataExportRequests(prev => [...prev, {id: `export-${Date.now()}`, requestDate: new Date().toISOString(), status: 'pending' }]); showToast("Data export requested.", "success"); }} />;
            case 'bookATable':
                return <BookATablePage 
                    onBookVenue={handleOpenSelectPromoterModal}
                    favoriteVenueIds={currentUser.favoriteVenueIds || []}
                    onToggleFavorite={handleToggleFavoriteVenue}
                    onViewVenueDetails={(v) => handleNavigate('venueDetails', { venueId: v.id })}
                    currentUser={currentUser}
                    promoters={promoters}
                    onJoinGuestlist={(p, v) => handleOpenGuestlistModal({ promoter: p, venue: v })}
                    guestlistJoinRequests={guestlistJoinRequests}
                />;
            case 'chatbot':
                return <ChatbotPage initialPrompt={pageParams.initialPrompt} />;
            case 'liveChat':
                return <LiveChatPage />;
            case 'exclusiveExperiences':
                return <ExclusiveExperiencesPage currentUser={currentUser} onBookExperience={(exp) => setActiveModal({ type: 'experienceBooking', experience: exp })} venueFilter={pageParams.venue || null} onClearFilter={() => handleNavigate('exclusiveExperiences')} />;
            case 'adminDashboard':
                const adminProps = { 
                    users, 
                    promoters, 
                    venues, 
                    events: allEvents, 
                    storeItems, 
                    pendingGroups: [], 
                    invitationRequests: invitationRequests, 
                    pendingTableReservations: [], 
                    onEditUser: setUserToEdit, 
                    onAddUser: () => setIsAddUserModalOpen(true), 
                    onBlockUser: setUserToBlock, 
                    onViewUser: (u: User) => { setPreviewedUser(u) }, 
                    onEditPromoter: (p: Promoter, u: User) => setPromoterToEdit({promoter: p, user: u}), 
                    onDeletePromoter: setPromoterToDelete, 
                    onSuspendPromoter: setPromoterToSuspend, 
                    onPreviewPromoter: (p: Promoter) => handleNavigate('promoterProfile', { promoterId: p.id }), 
                    onApproveGroup: handleAdminApproveGroup, 
                    onApproveRequest: handleAdminApproveRequest, 
                    onRejectRequest: handleAdminRejectRequest, 
                    onSendDirectInvites: handleSendInvites, 
                    onNavigate: handleNavigate, 
                    onAddEvent: () => { setEventToEdit(null); setIsAdminEditEventModalOpen(true); }, 
                    onEditEvent: (e: Event) => { setEventToEdit(e); setIsAdminEditEventModalOpen(true); }, 
                    onDeleteEvent: (e: Event) => setItemToDelete({type: 'event', id: e.id, name: e.title}), 
                    onPreviewEvent: setEventToPreview, 
                    onAddVenue: () => { setVenueToEdit(null); setIsAdminEditVenueModalOpen(true); }, 
                    onEditVenue: (v: Venue) => { setVenueToEdit(v); setIsAdminEditVenueModalOpen(true); }, 
                    onDeleteVenue: (v: Venue) => setItemToDelete({type: 'venue', id: v.id, name: v.name}), 
                    onPreviewVenue: (v: Venue) => handleNavigate('venueDetails', {venueId: v.id}), 
                    onAddStoreItem: () => { setStoreItemToEdit(null); setIsAdminEditStoreItemModalOpen(true); }, 
                    onEditStoreItem: (item: StoreItem) => { setStoreItemToEdit(item); setIsAdminEditStoreItemModalOpen(true); }, 
                    onDeleteStoreItem: (item: StoreItem) => setItemToDelete({type: 'storeItem', id: item.id, name: item.title}), 
                    onPreviewStoreItem: setStoreItemToPreview, 
                    promoterApplications, 
                    onApprovePromoterApplication: handleAdminApprovePromoter, 
                    onRejectPromoterApplication: handleAdminRejectPromoter, 
                    bookedItems, 
                    guestlistRequests: guestlistJoinRequests, 
                    allRsvps, 
                    onPreviewUser: (u: User) => setPreviewedUser(u), 
                    eventInvitations, 
                    onSendPushNotification: handleSendPushNotification, 
                    onUpdateRequestStatus: handleUpdateRequestStatus, 
                    onReviewGuestlistRequest: handleReviewGuestlistRequest 
                };
                return <AdminDashboard {...adminProps} />;
            case 'promoterDashboard':
                const promoterForDash = promoters.find(p => p.id === currentUser.id);
                const promoterProps = {
                    promoter: promoterForDash!,
                    onNavigate: handleNavigate,
                    promoterUser: currentUser,
                    onUpdateUser: handleUpdateProfile,
                    guestlistRequests: guestlistJoinRequests,
                    users: users,
                    venues: venues,
                    events: allEvents,
                    onViewUser: (u: User) => setPreviewedUser(u),
                    onUpdateRequestStatus: handleUpdateRequestStatus,
                    onReviewGuestlistRequest: handleReviewGuestlistRequest,
                    bookedItems: bookedItems,
                    eventInvitations: eventInvitations,
                    onSendDirectInvites: handleSendInvites
                };
                return promoterForDash ? <PromoterDashboard {...promoterProps} /> : <div>Loading...</div>;
            case 'groupChat':
                return <GroupChatPage currentUser={currentUser} users={users} promoters={promoters} />;
            case 'store':
                return <StorePage currentUser={currentUser} onPurchase={(item) => { const cost = item.price; if (tokenBalance >= cost) { setTokenBalance(p => p - cost); return true; } return false; }} userTokenBalance={tokenBalance} showToast={showToast} onAddToCart={handleAddToCart} />;
            case 'tokenWallet':
                return <TokenWalletPage onNavigate={handleNavigate} transactions={mockTokenTransactions} />;
            case 'venueDetails':
                const venue = venues.find(v => v.id === pageParams.venueId);
                return venue ? <VenueDetailsPage venue={venue} onBack={() => window.history.back()} onBookVenue={handleOpenSelectPromoterModal} isFavorite={(currentUser.favoriteVenueIds || []).includes(venue.id)} onToggleFavorite={handleToggleFavoriteVenue} currentUser={currentUser} onUpdateVenue={(v) => setVenues(prev => prev.map(pv => pv.id === v.id ? v : pv))} promoters={promoters} onBookWithSpecificPromoter={handleOpenBookingFlow} onJoinGuestlist={handleOpenGuestlistModal} guestlistJoinRequests={guestlistJoinRequests} onCheckIn={handleCheckIn} /> : <div>Venue not found.</div>;
            case 'accessGroups':
                return <AccessGroupsPage currentUser={currentUser} allGroups={mockAccessGroups} onViewGroup={(id) => handleNavigate('accessGroupFeed', { groupId: id })} onJoinGroup={() => {}} onLeaveGroup={() => {}} groupNotificationSettings={{}} onToggleGroupNotification={() => {}} onNavigate={handleNavigate} />;
            case 'accessGroupFeed':
                return <AccessGroupFeedPage groupId={pageParams.groupId} currentUser={currentUser} allPosts={mockGroupPosts} allGroups={mockAccessGroups} onToggleLike={() => {}} />;
            case 'myItineraries':
                return <MyItinerariesPage currentUser={currentUser} itineraries={itineraries} onNavigate={handleNavigate} onViewItinerary={(id) => handleNavigate('itineraryDetails', { itineraryId: id })} />;
            case 'itineraryDetails':
                const itinerary = itineraries.find(i => i.id === pageParams.itineraryId);
                return itinerary ? <ItineraryDetailsPage itinerary={itinerary} currentUser={currentUser} onEdit={() => handleNavigate('itineraryBuilder', { itineraryId: itinerary.id })} onClone={(it) => handleNavigate('itineraryBuilder', { itineraryId: it.id, mode: 'clone' })} /> : <div>Itinerary not found.</div>;
            case 'itineraryBuilder':
                const isCloneMode = pageParams.mode === 'clone';
                const existingItinerary = pageParams.itineraryId ? itineraries.find(i => i.id === pageParams.itineraryId) : undefined;
                const itineraryToEdit = isCloneMode && existingItinerary ? { ...existingItinerary, id: 0, title: `Copy of ${existingItinerary.title}`, creatorId: currentUser.id, sharedWithUserIds: [], isPublic: false } : existingItinerary;
                
                return <ItineraryBuilderPage 
                    onSave={handleSaveItinerary} 
                    onCancel={() => handleNavigate('myItineraries')} 
                    venues={venues} 
                    events={allEvents} 
                    experiences={mockExperiences} 
                    itinerary={itineraryToEdit}
                    users={users}
                    currentUser={currentUser}
                />;
            case 'bookingConfirmed':
                return <BookingConfirmedPage details={pageParams.details} experience={pageParams.experience} onNavigate={handleNavigate} />;
            case 'promoterApplication':
                return <PromoterApplicationPage onApply={(app) => { setPromoterApplications(prev => [...prev, {...app, id: Date.now(), status: 'pending', userId: 0, submissionDate: new Date().toISOString() }]); showToast("Application submitted!", "success"); handleNavigate('home'); }} onCancel={() => handleNavigate('userProfile')} showToast={showToast} />;
            case 'createGroup':
                return <CreateGroupPage onSave={() => {}} onCancel={() => handleNavigate('accessGroups')} />;
            case 'guestlistChats':
                return <GuestlistChatsPage currentUser={currentUser} guestlistChats={guestlistChats} venues={venues} promoters={promoters} onViewChat={(id) => handleNavigate('guestlistChat', { chatId: id })} />;
            case 'guestlistChat':
                return <GuestlistChatPage chatId={pageParams.chatId} currentUser={currentUser} messages={guestlistChatMessages} allUsers={users} allPromoters={promoters} guestlistChats={guestlistChats} venues={venues} onSendMessage={handleSendGuestlistMessage} onBack={() => handleNavigate('guestlistChats')} />;
            case 'invitations':
                return <InvitationsPage currentUser={currentUser} invitations={eventInvitations} events={allEvents} allUsers={users} onAccept={(id) => setEventInvitations(prev => prev.map(i => i.id === id ? {...i, status: 'accepted'} : i))} onDecline={(id) => setEventInvitations(prev => prev.map(i => i.id === id ? {...i, status: 'declined'} : i))} onNavigate={handleNavigate} />;
            case 'checkout':
                return <CheckoutPage 
                    currentUser={currentUser} 
                    onCancelRsvp={setRsvpToCancel} 
                    watchlist={combinedCartItems} 
                    bookedItems={bookedItems} 
                    venues={venues} 
                    onRemoveItem={handleRemoveFromCart} 
                    onUpdatePaymentOption={handleUpdatePaymentOption} 
                    onConfirmCheckout={handleConfirmCheckout} 
                    onCompleteBooking={handleCompleteBooking} 
                    onViewReceipt={(item) => handleNavigate('bookingConfirmed', { details: itemToConfirmedBookingDetails(item)})} 
                    userTokenBalance={tokenBalance} 
                    onStartChat={handleStartChat} 
                    initialTab={pageParams.initialTab as 'cart' | 'watchlist' | 'purchased'}
                    paymentMethods={paymentMethods} // Pass global payment methods
                />;
            case 'eventChatsList':
                return <EventChatsListPage currentUser={currentUser} onNavigate={handleNavigate} eventChats={eventChats} guestlistChats={guestlistChats} allEvents={allEvents} venues={venues} promoters={promoters} allUsers={users} />;
            case 'eventChat':
                return <EventChatPage chatId={pageParams.chatId} currentUser={currentUser} messages={eventChatMessages} allParticipants={[...users, ...promoters]} allEvents={allEvents} eventChats={eventChats} onSendMessage={handleSendEventChatMessage} onBack={() => handleNavigate('eventChatsList')} />;
            case 'promoterStats':
                return <PromoterStatsPage currentUser={currentUser} bookedItems={bookedItems} guestlistRequests={guestlistJoinRequests} users={users} onNavigate={handleNavigate} />;
            case 'paymentMethods':
                return <PaymentMethodsPage 
                    onNavigate={handleNavigate} 
                    paymentMethods={paymentMethods}
                    onAddMethod={handleAddPaymentMethod}
                    onRemoveMethod={handleRemovePaymentMethod}
                    onSetDefault={handleSetDefaultPaymentMethod}
                />;
            case 'friendsZone':
                return <FriendsZonePage 
                    currentUser={currentUser} 
                    allUsers={users} 
                    allItineraries={itineraries} 
                    onNavigate={handleNavigate} 
                    onAddFriend={handleAddFriend} 
                    onRemoveFriend={handleRemoveFriend} 
                    onViewProfile={(u) => setPreviewedUser(u)} 
                    friendZoneChats={friendZoneChats} // Pass chats
                    onCreateChat={handleCreateFriendZoneChat}
                    onDeleteChat={handleDeleteFriendZoneChat}
                    onOpenChat={(chatId) => handleNavigate('friendZoneChat', { chatId })}
                />;
            case 'friendZoneChat':
                return <FriendZoneChatPage 
                    chatId={pageParams.chatId}
                    currentUser={currentUser}
                    chats={friendZoneChats}
                    messages={friendZoneChatMessages}
                    promoters={promoters}
                    users={users}
                    onSendMessage={handleSendFriendZoneMessage}
                    onAddPromoter={handleAddPromoterToChat}
                    onRemovePromoter={handleRemovePromoterFromChat}
                    onBack={() => handleNavigate('friendsZone')}
                    onAddMember={handleAddFriendToChat}
                    onRemoveMember={handleRemoveFriendFromChat}
                    onLeaveChat={handleLeaveChat}
                />;
            default:
                return <div>Page not found</div>;
        }
    };
    
    const shouldShowHeader = currentPage !== 'home';

    return (
        <div className={`App ${theme}`}>
            {shouldShowHeader && (
                <Header 
                    title="WINGMAN" 
                    onOpenMenu={() => setIsMenuOpen(true)} 
                    onOpenNotifications={() => setIsNotificationsOpen(true)} 
                    hasNotifications={notifications.some(n => !n.read)}
                    tokenBalance={tokenBalance}
                    currentUser={currentUser}
                    onOpenGroupChat={() => handleNavigate('groupChat')}
                    showQrScanner={currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROMOTER}
                    onOpenScanner={() => setIsGlobalScannerOpen(true)}
                    onOpenCart={() => setIsCartOpen(true)}
                    cartItemCount={cartItems.length}
                />
            )}
            
            <SideMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onNavigate={handleNavigate} 
                currentPage={currentPage}
                currentUser={currentUser}
            />
            <NotificationsPanel 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
                notifications={notifications} 
                onNavigate={handleNavigate}
            />
            <CartPanel
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onNavigateToCheckout={() => handleNavigate('checkout')}
                totalPrice={cartItems.reduce((sum, item) => sum + (item.paymentOption === 'full' ? (item.fullPrice || 0) : (item.depositPrice || 0)), 0)}
            />
            
            <main className="pb-20 min-h-screen bg-[var(--color-background)]">
                {renderPage()}
            </main>

            {showOnboarding && (
                <OnboardingModal 
                    user={currentUser} 
                    onFinish={(completed) => { setShowOnboarding(false); if(completed) setTokenBalance(prev => prev + 100); }} 
                    onNavigate={handleNavigate}
                    promoters={promoters}
                    onSelectPromoter={handleOnboardingPromoterSelection}
                />
            )}

            <BottomNavBar currentUser={currentUser} currentPage={currentPage} onNavigate={handleNavigate} cartItemCount={cartItems.length} onOpenMenu={() => setIsMenuOpen(true)} />

            {bookingFlowData && (
                <BookingFlow 
                    promoter={bookingFlowData.promoter} 
                    initialVenue={bookingFlowData.venue}
                    onClose={() => setBookingFlowData(null)}
                    onAddToCart={handleAddToCart}
                    currentUser={currentUser}
                    tableBookings={tableBookings}
                    onNavigateToCheckout={() => handleNavigate('checkout')}
                    onKeepBooking={() => {
                         setBookingFlowData(null);
                         handleNavigate('bookATable');
                    }}
                />
            )}

            {activeModal?.type === 'guestlist' && (
                 <GuestlistModal 
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    context={activeModal.context}
                    onConfirmJoin={(promoterId, venueId, date, maleGuests, femaleGuests) => {
                        const isVip = currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL || currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROMOTER;
                        const newReq: GuestlistJoinRequest = { 
                            id: Date.now(), 
                            userId: currentUser.id, 
                            venueId, 
                            promoterId, 
                            date, 
                            status: isVip ? 'approved' : 'pending', 
                            attendanceStatus: 'pending',
                            isVip: isVip
                        };
                        setGuestlistJoinRequests(prev => [...prev, newReq]);
                        setActiveModal(null);
                        const venue = venues.find(v => v.id === venueId);
                        setGuestlistSuccessDetails({ venueName: venue?.name || '', date, isVip });
                    }}
                    currentUser={currentUser}
                    bookedItems={bookedItems}
                    onViewProfile={setPreviewedUser}
                 />
            )}
            
            {activeModal?.type === 'selectPromoter' && (
                <SelectPromoterModal 
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    venue={activeModal.venue}
                    onSelectPromoter={(p) => { setActiveModal(null); handleOpenBookingFlow(p, activeModal.venue); }}
                    promoters={promoters}
                />
            )}
            
            {activeModal?.type === 'experienceBooking' && (
                <ExperienceBookingFlow 
                    experience={activeModal.experience}
                    user={currentUser}
                    onClose={() => setActiveModal(null)}
                    onAddToCart={handleAddToCart}
                    onNavigateToCheckout={() => handleNavigate('checkout')}
                />
            )}

            {guestlistSuccessDetails && (
                <GuestlistJoinSuccessModal 
                    isOpen={true}
                    onClose={() => setGuestlistSuccessDetails(null)}
                    onNavigateToPlans={() => { setGuestlistSuccessDetails(null); handleNavigate('checkout', { initialTab: 'purchased' }); }}
                    venueName={guestlistSuccessDetails.venueName}
                    date={guestlistSuccessDetails.date}
                    isVip={guestlistSuccessDetails.isVip}
                />
            )}

            {isGlobalScannerOpen && (
                <QrScanner onClose={() => setIsGlobalScannerOpen(false)} onScan={handleGlobalScan} />
            )}
            
            <UserProfilePreviewModal isOpen={!!previewedUser} onClose={() => setPreviewedUser(null)} user={previewedUser} />
            <AdminEditUserModal isOpen={!!userToEdit} onClose={() => setUserToEdit(null)} user={userToEdit} onSave={(u) => { setUsers(prev => prev.map(user => user.id === u.id ? u : user)); setUserToEdit(null); showToast("User updated.", "success"); }} />
            <AdminAddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onSave={async (u) => { const newUser = { ...u, id: Date.now(), joinDate: new Date().toISOString().split('T')[0] }; setUsers(prev => [...prev, newUser]); showToast("User created.", "success"); }} />
            <AdminEditPromoterModal isOpen={!!promoterToEdit} onClose={() => setPromoterToEdit(null)} data={promoterToEdit} onSave={(p, u) => { setPromoters(prev => prev.map(prom => prom.id === p.id ? p : prom)); setUsers(prev => prev.map(user => user.id === u.id ? u : user)); setPromoterToEdit(null); showToast("Promoter updated.", "success"); }} />
            <DestructiveConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => { if (itemToDelete) { if (itemToDelete.type === 'event') setAllEvents(prev => prev.filter(e => e.id !== itemToDelete.id)); else if (itemToDelete.type === 'venue') setVenues(prev => prev.filter(v => v.id !== itemToDelete.id)); else if (itemToDelete.type === 'storeItem') setStoreItems(prev => prev.filter(i => i.id !== itemToDelete.id)); showToast(`${itemToDelete.type} deleted.`, "success"); setItemToDelete(null); } }} itemType={itemToDelete?.type || ''} itemName={itemToDelete?.name || ''} />
            <DeleteAccountModal isOpen={isDeleteAccountModalOpen} onClose={() => setIsDeleteAccountModalOpen(false)} onConfirm={() => { showToast("Account deleted.", "success"); window.location.reload(); }} currentUser={currentUser} />
            <AdminEditEventModal isOpen={isAdminEditEventModalOpen} onClose={() => setIsAdminEditEventModalOpen(false)} event={eventToEdit} venues={venues} onSave={(e) => { if (eventToEdit) { setAllEvents(prev => prev.map(ev => ev.id === e.id ? e : ev)); } else { setAllEvents(prev => [...prev, { ...e, id: Date.now() }]); } setIsAdminEditEventModalOpen(false); showToast("Event saved.", "success"); }} />
            <AdminEditVenueModal isOpen={isAdminEditVenueModalOpen} onClose={() => setIsAdminEditVenueModalOpen(false)} venue={venueToEdit} onSave={(v) => { if (venueToEdit) { setVenues(prev => prev.map(ven => ven.id === v.id ? v : ven)); } else { setVenues(prev => [...prev, { ...v, id: Date.now() }]); } setIsAdminEditVenueModalOpen(false); showToast("Venue saved.", "success"); }} />
            <AdminEditStoreItemModal isOpen={isAdminEditStoreItemModalOpen} onClose={() => setIsAdminEditStoreItemModalOpen(false)} item={storeItemToEdit} onSave={(item) => { if (storeItemToEdit) { setStoreItems(prev => prev.map(i => i.id === item.id ? item : i)); } else { setStoreItems(prev => [...prev, { ...item, id: `item-${Date.now()}` }]); } setIsAdminEditStoreItemModalOpen(false); showToast("Store item saved.", "success"); }} />
            
            {eventToPreview && (
                <EventDetailModal 
                    event={eventToPreview} 
                    onClose={() => setEventToPreview(null)}
                    isRsvped={currentUserRsvps.includes(getOriginalEventId(eventToPreview.id))}
                    onRsvp={handleRsvp}
                    venues={venues}
                    onViewVenueExperiences={(v) => handleNavigate('venueDetails', { venueId: v.id })}
                    invitationStatus={invitationRequests.find(r => r.userId === currentUser.id && r.eventId === getOriginalEventId(eventToPreview.id))?.status || 'none'}
                    onRequestInvite={handleRequestInvite}
                    currentUser={currentUser}
                    isBookmarked={bookmarkedEventIds.includes(getOriginalEventId(eventToPreview.id))}
                    onToggleBookmark={handleToggleBookmarkEvent}
                    onPayForEvent={() => {}}
                    onViewParticipants={() => { setIsParticipantsModalOpen(true); setParticipantsForEvent(users.filter(u => currentUserRsvps.includes(u.id))); }}
                    onNavigateToChat={handleNavigateToEventChat}
                    isSubscribed={subscribedEventIds.includes(getOriginalEventId(eventToPreview.id))}
                    onToggleSubscription={handleToggleSubscription}
                    onBookVenue={handleOpenSelectPromoterModal}
                    isLiked={likedEventIds.includes(getOriginalEventId(eventToPreview.id))}
                    onToggleLike={handleToggleLikeEvent}
                    onJoinGuestlist={(context) => handleOpenGuestlistModal({ venue: context.venue, date: context.date })}
                />
            )}
            
            {storeItemToPreview && (
                <StoreItemPreviewModal item={storeItemToPreview} isOpen={!!storeItemToPreview} onClose={() => setStoreItemToPreview(null)} />
            )}
        </div>
    );
};
