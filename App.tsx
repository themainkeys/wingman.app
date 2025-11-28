import React, { useState, useEffect, useMemo } from 'react';
import { User, Page, Promoter, Venue, Event, CartItem, AccessGroup, Itinerary, FriendZoneChat, AppNotification, UserRole, UserAccessLevel, Experience, GuestlistJoinRequest, EventInvitation, PromoterApplication, ExperienceInvitationRequest, GroupJoinRequest, PaymentMethod, StoreItem, EventInvitationRequest } from './types';
import { users, promoters, venues, events, experiences, challenges, storeItems, accessGroups, itineraries, mockNotifications, mockFriendZoneChats, mockGuestlistChats, mockEventChats, mockEventChatMessages, mockGuestlistChatMessages, mockFriendZoneChatMessages, mockInvitationRequests, mockEventInvitations, mockGuestlistJoinRequests, mockPromoterApplications, mockDataExportRequests, mockPaymentMethods } from './data/mockData';

// Component Imports
import { HomeScreen } from './components/HomeScreen';
import { PromoterDirectory } from './components/PromoterDirectory';
import { PromoterProfile } from './components/PromoterProfile';
import { BookATablePage } from './components/BookATablePage';
import { EventTimeline } from './components/EventTimeline';
import { ExclusiveExperiencesPage } from './components/ExclusiveExperiencesPage';
import { ChallengesPage } from './components/ChallengesPage';
import { FriendsZonePage } from './components/FriendsZonePage';
import { StorePage } from './components/StorePage';
import { ProfilePage } from './components/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { PromoterDashboard } from './components/PromoterDashboard';
import { BookingsPage } from './components/BookingsPage';
import { SettingsPage } from './components/SettingsPage';
import { ChatbotPage } from './components/ChatbotPage';
import { LiveChatPage } from './components/LiveChatPage';
import { AccessGroupsPage } from './components/AccessGroupsPage';
import { AccessGroupFeedPage } from './components/AccessGroupFeedPage';
import { MyItinerariesPage } from './components/MyItinerariesPage';
import { ItineraryDetailsPage } from './components/ItineraryDetailsPage';
import { ItineraryBuilderPage } from './components/ItineraryBuilderPage';
import { BookingConfirmedPage } from './components/BookingConfirmedPage';
import { PromoterApplicationPage } from './components/PromoterApplicationPage';
import { CreateGroupPage } from './components/CreateGroupPage';
import { InvitationsPage } from './components/InvitationsPage';
import { CheckoutPage } from './components/CheckoutPage';
import { EventChatsListPage } from './components/EventChatsListPage';
import { GuestlistChatsPage } from './components/GuestlistChatsPage';
import { EventChatPage } from './components/EventChatPage';
import { GuestlistChatPage } from './components/GuestlistChatPage';
import { FriendZoneChatPage } from './components/FriendZoneChatPage';
import { PromoterStatsPage } from './components/PromoterStatsPage';
import { PaymentMethodsPage } from './components/PaymentMethodsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { VenueDetailsPage } from './components/VenueDetailsPage';
import { HelpPage } from './components/HelpPage';
import { ReportIssuePage } from './components/ReportIssuePage';
import { PrivacyPage } from './components/PrivacyPage';
import { SecurityPage } from './components/SecurityPage';
import { NotificationsSettingsPage } from './components/NotificationsSettingsPage';
import { CookieSettingsPage } from './components/CookieSettingsPage';
import { DataExportPage } from './components/DataExportPage';
import { TokenWalletPage } from './components/TokenWalletPage';
import { EditProfilePage } from './components/EditProfilePage';
import { NftGalleryPage } from './components/NftGalleryPage';
import { ConnectWalletPage } from './components/ConnectWalletPage';
import { VenueReviewsPage } from './components/VenueReviewsPage';
import { ReferFriendPage } from './components/ReferFriendPage';

// Layout & Modals
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { BottomNavBar } from './components/BottomNavBar';
import { CartPanel } from './components/CartPanel';
import { NotificationsPanel } from './components/NotificationsPanel';
import { ToastNotification } from './components/ToastNotification';
import { BookingFlow } from './components/BookingFlow';
import { ExperienceBookingFlow } from './components/ExperienceBookingFlow';
import { EventBookingFlow } from './components/EventBookingFlow';
import { GuestlistModal } from './components/modals/GuestlistModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { GuestlistJoinSuccessModal } from './components/modals/GuestlistJoinSuccessModal';
import { PromoterBottomNavBar } from './components/PromoterBottomNavBar';
import { SelectPromoterModal } from './components/SelectPromoterModal';
import { Modal } from './components/ui/Modal';
import { TokenIcon } from './components/icons/TokenIcon';
import { AdminAddUserModal } from './components/modals/AdminAddUserModal';
import { AdminEditUserModal } from './components/modals/AdminEditUserModal';
import { AdminEditPromoterModal } from './components/modals/AdminEditPromoterModal';
import { AdminEditEventModal } from './components/modals/AdminEditEventModal';
import { AdminEditVenueModal } from './components/modals/AdminEditVenueModal';
import { AdminEditStoreItemModal } from './components/modals/AdminEditStoreItemModal';
import { StoreItemPreviewModal } from './components/modals/StoreItemPreviewModal';
import { UserProfilePreviewModal } from './components/modals/UserProfilePreviewModal';

const calculateProfileCompleteness = (user: User): number => {
    let score = 0;
    const totalPoints = 12;

    if (user.name) score++;
    if (user.profilePhoto && !user.profilePhoto.includes('seed')) score++;
    if (user.bio && user.bio.length > 10) score++;
    if (user.city) score++;
    if (user.instagramHandle) score++;
    if (user.phoneNumber) score++;
    if (user.dob) score++;
    if (user.ethnicity) score++;
    if (user.appearance && (user.appearance.height || user.appearance.build)) score++;
    if (user.preferences && user.preferences.music.length > 0) score++;
    if (user.preferences && user.preferences.activities.length > 0) score++;
    if (user.galleryImages && user.galleryImages.length >= 3) score++;

    return Math.min(100, Math.round((score / totalPoints) * 100));
};

type ModalState = 
  | { type: 'booking'; promoter: Promoter; venue?: Venue; date?: string }
  | { type: 'experienceBooking'; experience: Experience }
  | { type: 'eventBooking'; event: Event }
  | { type: 'guestlist'; promoter?: Promoter; venue?: Venue; date?: string }
  | { type: 'guestlistSuccess'; venueName: string; date: string; isVip: boolean }
  | { type: 'promoterSelection'; venue: Venue }
  | null;

export const App: React.FC = () => {
    // Data State with Persistence
    const [appUsers, setAppUsers] = useState<User[]>(() => {
        try {
            const saved = localStorage.getItem('wingman_users');
            return saved ? JSON.parse(saved) : users;
        } catch (e) {
            return users;
        }
    });
    const [appPromoters, setAppPromoters] = useState<Promoter[]>(() => {
        try {
            const saved = localStorage.getItem('wingman_promoters');
            return saved ? JSON.parse(saved) : promoters;
        } catch (e) {
            return promoters;
        }
    });
    const [appEvents, setAppEvents] = useState<Event[]>(() => {
        try {
            const saved = localStorage.getItem('wingman_events');
            return saved ? JSON.parse(saved) : events;
        } catch (e) {
            return events;
        }
    });
    const [appVenues, setAppVenues] = useState<Venue[]>(() => {
        try {
            const saved = localStorage.getItem('wingman_venues');
            return saved ? JSON.parse(saved) : venues;
        } catch (e) {
            return venues;
        }
    });
    const [appStoreItems, setAppStoreItems] = useState<StoreItem[]>(storeItems);
    
    // State
    const [currentUser, setCurrentUser] = useState<User>(() => {
        try {
            // Try to find the last logged in user ID
            const savedId = localStorage.getItem('wingman_currentUserId');
            if (savedId) {
                // Look up the fresh user data from appUsers using the ID
                const found = appUsers.find(u => u.id === parseInt(savedId, 10));
                if (found) return found;
            }
            // Fallback to first user if no saved ID or user not found
            return appUsers[0] || users[0];
        } catch (e) {
             return users[0];
        }
    });

    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [pageParams, setPageParams] = useState<any>({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<ModalState>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [onboardingReward, setOnboardingReward] = useState<number | null>(null);
    
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [bookedItems, setBookedItems] = useState<CartItem[]>([]);
    const [watchlist, setWatchlist] = useState<CartItem[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
    const [userTokenBalance, setUserTokenBalance] = useState(2500); // Mock balance
    const [appAccessGroups, setAppAccessGroups] = useState<AccessGroup[]>(accessGroups);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
    
    // Specific Data State
    const [guestlistJoinRequests, setGuestlistJoinRequests] = useState(mockGuestlistJoinRequests);
    const [invitationRequests, setInvitationRequests] = useState(mockInvitationRequests);
    const [experienceInvitationRequests, setExperienceInvitationRequests] = useState<ExperienceInvitationRequest[]>([]);
    const [friendZoneChats, setFriendZoneChats] = useState<FriendZoneChat[]>(mockFriendZoneChats);
    const [groupJoinRequests, setGroupJoinRequests] = useState<GroupJoinRequest[]>([]);
    const [promoterApplications, setPromoterApplications] = useState(mockPromoterApplications);
    
    // Event Interaction State
    const [likedEventIds, setLikedEventIds] = useState<number[]>([]);
    const [bookmarkedEventIds, setBookmarkedEventIds] = useState<number[]>([]);
    const [rsvpedEventIds, setRsvpedEventIds] = useState<number[]>([]);

    // Admin Modal States
    const [isAdminAddUserOpen, setIsAdminAddUserOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [promoterToEdit, setPromoterToEdit] = useState<{promoter: Promoter, user: User} | null>(null);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [isAdminEditEventOpen, setIsAdminEditEventOpen] = useState(false);
    const [venueToEdit, setVenueToEdit] = useState<Venue | null>(null);
    const [isAdminEditVenueOpen, setIsAdminEditVenueOpen] = useState(false);
    const [storeItemToEdit, setStoreItemToEdit] = useState<StoreItem | null>(null);
    const [isAdminEditStoreItemOpen, setIsAdminEditStoreItemOpen] = useState(false);
    const [previewStoreItem, setPreviewStoreItem] = useState<StoreItem | null>(null);
    const [previewUser, setPreviewUser] = useState<User | null>(null);

    // Flags
    const [hasOnboarded, setHasOnboarded] = useState(false);

    // Persistence Effects
    useEffect(() => { localStorage.setItem('wingman_users', JSON.stringify(appUsers)); }, [appUsers]);
    useEffect(() => { localStorage.setItem('wingman_promoters', JSON.stringify(appPromoters)); }, [appPromoters]);
    useEffect(() => { localStorage.setItem('wingman_events', JSON.stringify(appEvents)); }, [appEvents]);
    useEffect(() => { localStorage.setItem('wingman_venues', JSON.stringify(appVenues)); }, [appVenues]);
    useEffect(() => { 
        // Always update persisted current user data when currentUser state changes
        if (currentUser) {
            localStorage.setItem('wingman_currentUserId', currentUser.id.toString()); 
        }
    }, [currentUser]);

    const handleNavigate = (page: Page, params: any = {}) => {
        setCurrentPage(page);
        setPageParams(params);
        setIsMenuOpen(false);
        window.scrollTo(0, 0);
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const handleAddToCart = (item: CartItem) => {
        setCartItems([...cartItems, item]);
        showToast(`${item.name} added to cart`, 'success');
    };

    const handleRemoveCartItem = (itemId: string) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        handleNavigate('checkout');
    };

    const handleCompleteBooking = (item: CartItem) => {
        const bookedItem = { ...item, bookedTimestamp: Date.now(), isPlaceholder: false };
        setBookedItems(prev => [...prev, bookedItem]);
        setCartItems(prev => prev.filter(i => i.id !== item.id));
        setWatchlist(prev => prev.filter(i => i.id !== item.id));
        handleNavigate('bookingConfirmed', { items: [bookedItem] });
    };

    const handleConfirmCheckout = (paymentMethod: 'tokens' | 'usd' | 'cashapp', itemIds: string[]) => {
        const itemsToBook = cartItems.filter(i => itemIds.includes(i.id));
        const timestamp = Date.now();
        
        const newBookedItems = itemsToBook.map(item => ({
            ...item,
            bookedTimestamp: timestamp,
            isPlaceholder: false,
            paymentMethod: paymentMethod
        }));

        setBookedItems(prev => [...prev, ...newBookedItems]);
        setCartItems(prev => prev.filter(i => !itemIds.includes(i.id)));
        
        handleNavigate('bookingConfirmed', { items: newBookedItems });
    };

    const handleOpenGuestlistModal = (context: { promoter?: Promoter; venue?: Venue; date?: string }) => {
        setActiveModal({ type: 'guestlist', ...context });
    };

    const handleJoinGuestlistConfirm = (promoterId: number, venueId: number, date: string, maleGuests: number, femaleGuests: number) => {
        const venue = venues.find(v => v.id === venueId);
        const promoter = promoters.find(p => p.id === promoterId);

        const newRequest: GuestlistJoinRequest = {
            id: Date.now(),
            userId: currentUser.id,
            venueId,
            promoterId,
            date,
            status: currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL || currentUser.role === UserRole.ADMIN ? 'approved' : 'pending',
            attendanceStatus: 'pending',
            isVip: currentUser.role === UserRole.ADMIN
        };
        
        // Update request tracking state
        setGuestlistJoinRequests([...guestlistJoinRequests, newRequest]);
        
        // Create a CartItem for the guestlist entry so it appears in checkout/receipts
        if (venue && promoter) {
            const cartItem: CartItem = {
                id: `guestlist-${venueId}-${date}-${Date.now()}`,
                type: 'guestlist',
                name: `${venue.name} Guestlist`,
                image: venue.coverImage,
                date: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                sortableDate: date,
                quantity: 1,
                fullPrice: 0,
                paymentOption: 'full',
                isPlaceholder: false,
                guestlistDetails: {
                    venue,
                    promoter,
                    numberOfGuests: maleGuests + femaleGuests,
                    status: newRequest.status
                }
            };
            handleAddToCart(cartItem);
        }

        setActiveModal({ 
            type: 'guestlistSuccess', 
            venueName: venue?.name || 'Venue', 
            date, 
            isVip: newRequest.isVip || false 
        });
    };

    const handleBookVenue = (venue: Venue) => {
        setActiveModal({ type: 'promoterSelection', venue });
    };
    
    const handleBookEvent = (event: Event) => {
        setActiveModal({ type: 'eventBooking', event });
    };

    const handleToggleFavorite = (id: number, type: 'promoter' | 'venue' | 'event') => {
        let updatedUser = { ...currentUser };
        if (type === 'promoter') {
            const current = currentUser.favoritePromoterIds || [];
            updatedUser.favoritePromoterIds = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
        } else if (type === 'venue') {
            const current = currentUser.favoriteVenueIds || [];
            updatedUser.favoriteVenueIds = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
        }
        handleUpdateUserWithRewardCheck(updatedUser); // Use central updater to persist
        showToast(type === 'promoter' ? 'Promoter updated' : 'Favorites updated', 'success');
    };

    const handleRequestExperienceAccess = (experienceId: number) => {
        const newReq: ExperienceInvitationRequest = {
            id: Date.now(),
            userId: currentUser.id,
            experienceId,
            status: 'pending'
        };
        setExperienceInvitationRequests([...experienceInvitationRequests, newReq]);
        showToast('Access requested', 'success');
    };

    const handleRequestInvite = (eventId: number | string) => {
        const originalId = typeof eventId === 'string' ? parseInt(eventId.split('-')[0], 10) : eventId;
        if (invitationRequests.some(r => r.userId === currentUser.id && r.eventId === originalId)) {
            showToast('Request already sent', 'error');
            return;
        }
        const newRequest: EventInvitationRequest = {
            id: Date.now(),
            userId: currentUser.id,
            eventId: originalId,
            status: 'pending'
        };
        setInvitationRequests([...invitationRequests, newRequest]);
        showToast('Invitation request sent', 'success');
    };

    const handlePromoterSelection = (promoterId: number | null) => {
        if (promoterId) {
            // Logic to save preference could go here
        }
    };

    const handleOnboardingFinish = (completed: boolean) => {
        setHasOnboarded(true);
        if (completed) {
            const reward = 100;
            setUserTokenBalance(prev => prev + reward);
            setOnboardingReward(reward);
        }
    };

    const handleToggleLikeEvent = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0], 10) : eventId;
        setLikedEventIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleToggleBookmarkEvent = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0], 10) : eventId;
        setBookmarkedEventIds(prev => {
            const isBookmarked = prev.includes(id);
            if (isBookmarked) {
                showToast('Removed from bookmarks', 'success');
                return prev.filter(i => i !== id);
            } else {
                showToast('Added to bookmarks', 'success');
                return [...prev, id];
            }
        });
    };

    const handleRsvpEvent = (eventId: number | string) => {
        const id = typeof eventId === 'string' ? parseInt(eventId.split('-')[0], 10) : eventId;
        setRsvpedEventIds(prev => {
            const isRsvped = prev.includes(id);
            if (isRsvped) {
                showToast('RSVP cancelled', 'success');
                return prev.filter(i => i !== id);
            } else {
                showToast('RSVP confirmed', 'success');
                return [...prev, id];
            }
        });
    };

    const handleRequestJoinGroup = (groupId: number) => {
        const group = appAccessGroups.find(g => g.id === groupId);
        if (group?.memberIds.includes(currentUser.id)) return;

        const existing = groupJoinRequests.find(r => r.groupId === groupId && r.userId === currentUser.id);
        if (existing) return;

        const newReq: GroupJoinRequest = {
            id: Date.now(),
            groupId,
            userId: currentUser.id,
            status: 'pending',
            timestamp: Date.now()
        };
        setGroupJoinRequests(prev => [...prev, newReq]);
        showToast('Request to join sent!', 'success');
    };

    const handleApproveGroupRequest = (requestId: number) => {
        const request = groupJoinRequests.find(r => r.id === requestId);
        if (!request) return;

        setAppAccessGroups(prev => prev.map(g => {
            if (g.id === request.groupId) {
                return { ...g, memberIds: [...g.memberIds, request.userId] };
            }
            return g;
        }));

        setGroupJoinRequests(prev => prev.filter(r => r.id !== requestId));
        showToast('Member approved', 'success');
    };

    const handleRejectGroupRequest = (requestId: number) => {
        setGroupJoinRequests(prev => prev.filter(r => r.id !== requestId));
        showToast('Request rejected', 'success');
    };

    const handleUpdateUserWithRewardCheck = (updatedUser: User) => {
        const completeness = calculateProfileCompleteness(updatedUser);
        let userToSave = { ...updatedUser };
        
        if (completeness === 100 && !userToSave.hasProfileReward) {
            userToSave.hasProfileReward = true;
            setUserTokenBalance(prev => prev + 500);
            showToast("Profile Completed! You earned 500 TMKC.", "success");
        }
        
        // Update global users list
        setAppUsers(prev => prev.map(u => u.id === userToSave.id ? userToSave : u));
        // If updating self
        if (currentUser.id === userToSave.id) {
            setCurrentUser(userToSave);
        }
    };

    // --- Admin Functions ---

    const handleAdminAddUser = async (user: Omit<User, 'id' | 'joinDate'>) => {
        const newUser: User = {
            ...user,
            id: Date.now(),
            joinDate: new Date().toISOString().split('T')[0]
        };
        setAppUsers(prev => [...prev, newUser]);
        
        // If added as promoter directly
        if (newUser.role === UserRole.PROMOTER) {
             const newPromoter: Promoter = {
                id: newUser.id,
                name: newUser.name,
                handle: newUser.instagramHandle ? `@${newUser.instagramHandle}` : `@${newUser.name.replace(/\s/g, '').toLowerCase()}`,
                rating: 5.0,
                bio: newUser.bio || 'New Promoter',
                profilePhoto: newUser.profilePhoto,
                city: newUser.city || 'Miami',
                weeklySchedule: [],
                assignedVenueIds: [],
                earnings: 0,
                isOnline: false,
                favoritedByCount: 0,
                galleryImages: []
            };
            setAppPromoters(prev => [...prev, newPromoter]);
        }
        showToast('User created successfully', 'success');
    };

    const handleAdminEditUser = (updatedUser: User) => {
        // 1. Update User List
        setAppUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        
        // 2. Handle Role Changes (Promoter Logic)
        if (updatedUser.role === UserRole.PROMOTER) {
            setAppPromoters(prev => {
                const exists = prev.find(p => p.id === updatedUser.id);
                if (exists) {
                    // Update existing promoter basics
                    return prev.map(p => p.id === updatedUser.id ? { ...p, name: updatedUser.name, profilePhoto: updatedUser.profilePhoto } : p);
                } else {
                    // Create new promoter entry
                    const newPromoter: Promoter = {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        handle: updatedUser.instagramHandle ? `@${updatedUser.instagramHandle}` : `@${updatedUser.name.replace(/\s/g, '').toLowerCase()}`,
                        rating: 5.0,
                        bio: updatedUser.bio || 'Promoter',
                        profilePhoto: updatedUser.profilePhoto,
                        city: updatedUser.city || 'Miami',
                        weeklySchedule: [],
                        assignedVenueIds: [],
                        earnings: 0,
                        isOnline: false,
                        favoritedByCount: 0,
                        galleryImages: updatedUser.galleryImages || []
                    };
                    return [...prev, newPromoter];
                }
            });
        } else {
            // If role changed from Promoter to User/Admin, remove from promoters list
            setAppPromoters(prev => prev.filter(p => p.id !== updatedUser.id));
        }

        // 3. Update Current User if it's the one being edited
        if (currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
        
        setUserToEdit(null);
        showToast('User updated successfully', 'success');
    };

    const handleAdminEditPromoter = (updatedPromoter: Promoter, updatedUser: User) => {
        setAppPromoters(prev => prev.map(p => p.id === updatedPromoter.id ? updatedPromoter : p));
        handleAdminEditUser(updatedUser); // Reuse user update logic
        setPromoterToEdit(null);
        showToast('Promoter updated successfully', 'success');
    };

    const handleApprovePromoterApplication = (appId: number) => {
        const app = promoterApplications.find(a => a.id === appId);
        if (!app) return;

        const newUserId = app.userId || Date.now();
        
        const newUser: User = {
            id: newUserId,
            name: app.fullName,
            email: app.email,
            profilePhoto: app.profilePhotoUrl,
            accessLevel: UserAccessLevel.GENERAL,
            role: UserRole.PROMOTER, // Set role to Promoter
            city: app.city,
            joinDate: new Date().toISOString().split('T')[0],
            instagramHandle: app.instagram,
            phoneNumber: app.phone,
            status: 'active',
            galleryImages: app.mediaLinks,
            bio: `Professional Promoter in ${app.city}`
        };

        const newPromoter: Promoter = {
            id: newUserId,
            name: app.stageName || app.fullName,
            handle: `@${app.instagram}`,
            rating: 5.0,
            bio: `Promoter in ${app.city}. Specializing in ${app.categories.join(', ')}.`,
            profilePhoto: app.profilePhotoUrl,
            city: app.city,
            weeklySchedule: [],
            assignedVenueIds: [], // Needs manual assignment later
            earnings: 0,
            isOnline: true,
            favoritedByCount: 0,
            galleryImages: app.mediaLinks
        };

        setAppUsers(prev => [...prev, newUser]);
        setAppPromoters(prev => [...prev, newPromoter]);
        
        setPromoterApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
        showToast(`${app.fullName} approved as Promoter!`, 'success');
    };

    // --- Render ---

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomeScreen onNavigate={handleNavigate} currentUser={currentUser} onOpenMenu={() => setIsMenuOpen(true)} />;
            case 'directory':
                return <PromoterDirectory 
                    promoters={appPromoters} 
                    isLoading={false} 
                    onViewProfile={(p) => handleNavigate('promoterProfile', { promoterId: p.id })} 
                    onBookPromoter={(p) => setActiveModal({ type: 'booking', promoter: p })} 
                    onToggleFavorite={(id) => handleToggleFavorite(id, 'promoter')} 
                    currentUser={currentUser} 
                    onNavigate={handleNavigate}
                    onJoinGuestlist={(p) => handleOpenGuestlistModal({ promoter: p })}
                />;
            case 'promoterProfile':
                const promoter = appPromoters.find(p => p.id === (pageParams.promoterId || 1));
                if (!promoter) return <div>Promoter not found</div>;
                return <PromoterProfile 
                    promoter={promoter} 
                    onBack={() => handleNavigate('directory')} 
                    onBook={(p, v, d) => setActiveModal({ type: 'booking', promoter: p, venue: v, date: d })} 
                    isFavorite={(currentUser.favoritePromoterIds || []).includes(promoter.id)} 
                    onToggleFavorite={(id) => handleToggleFavorite(id, 'promoter')} 
                    onViewVenue={(v) => handleNavigate('venueDetails', { venueId: v.id })} 
                    onJoinGuestlist={(p, v, d) => handleOpenGuestlistModal({ promoter: p, venue: v, date: d })} 
                    currentUser={currentUser} 
                    onUpdateUser={handleUpdateUserWithRewardCheck} 
                    onUpdatePromoter={(p) => setAppPromoters(prev => prev.map(pr => pr.id === p.id ? p : pr))}
                    onEditProfile={() => handleNavigate('editProfile')}
                    onNavigate={handleNavigate}
                    tokenBalance={userTokenBalance}
                    events={appEvents}
                />;
            case 'bookATable':
                return <BookATablePage 
                    onBookVenue={handleBookVenue} 
                    favoriteVenueIds={currentUser.favoriteVenueIds || []} 
                    onToggleFavorite={(id) => handleToggleFavorite(id, 'venue')} 
                    onViewVenueDetails={(v) => handleNavigate('venueDetails', { venueId: v.id })}
                    currentUser={currentUser}
                    promoters={appPromoters}
                    onJoinGuestlist={(p, v) => handleOpenGuestlistModal({ promoter: p, venue: v })}
                    guestlistJoinRequests={guestlistJoinRequests}
                />;
            case 'eventTimeline':
                return <EventTimeline 
                    currentUser={currentUser} 
                    allEvents={appEvents} 
                    likedEventIds={likedEventIds} 
                    onToggleLike={handleToggleLikeEvent}
                    rsvpedEventIds={rsvpedEventIds} 
                    onRsvp={handleRsvpEvent}
                    bookmarkedEventIds={bookmarkedEventIds} 
                    onToggleBookmark={handleToggleBookmarkEvent}
                    onOpenGabyWithPrompt={(prompt) => handleNavigate('chatbot', { initialPrompt: prompt })}
                    invitationRequests={invitationRequests}
                    onRequestInvite={handleRequestInvite}
                    onPayForEvent={(e) => console.log('Pay for event', e)}
                    onNavigateToChat={(e) => console.log('Nav to chat', e)}
                    subscribedEventIds={[]} 
                    onToggleSubscription={(id) => console.log('Sub event', id)}
                    onBookVenue={handleBookVenue}
                    onJoinGuestlist={handleOpenGuestlistModal}
                    guestlistRequests={guestlistJoinRequests}
                    onBookEvent={handleBookEvent}
                />;
            case 'exclusiveExperiences':
                return <ExclusiveExperiencesPage 
                    currentUser={currentUser} 
                    onBookExperience={(exp) => setActiveModal({ type: 'experienceBooking', experience: exp })} 
                    venueFilter={pageParams.venue || null} 
                    onClearFilter={() => handleNavigate('exclusiveExperiences')} 
                    experienceRequests={experienceInvitationRequests}
                    onRequestAccess={handleRequestExperienceAccess}
                    venues={appVenues}
                    onJoinGuestlist={handleOpenGuestlistModal}
                />;
            case 'challenges':
                return <ChallengesPage 
                    challenges={challenges} 
                    onToggleTask={(cId, tId) => console.log('Toggle task', cId, tId)} 
                    onDeleteTask={(cId, tId) => console.log('Delete task', cId, tId)} 
                    onRewardClaimed={(amt, title) => {
                        setUserTokenBalance(prev => prev + amt);
                        showToast(`Claimed ${amt} TMKC for ${title}!`, 'success');
                    }} 
                />;
            case 'friendsZone':
                return <FriendsZonePage 
                    currentUser={currentUser} 
                    allUsers={appUsers} 
                    allItineraries={itineraries} 
                    onNavigate={handleNavigate} 
                    onAddFriend={(id) => handleUpdateUserWithRewardCheck({...currentUser, friends: [...(currentUser.friends || []), id]})} 
                    onRemoveFriend={(id) => handleUpdateUserWithRewardCheck({...currentUser, friends: (currentUser.friends || []).filter(f => f !== id)})} 
                    onViewProfile={(u) => setPreviewUser(u)} 
                    friendZoneChats={friendZoneChats} 
                    onCreateChat={(name) => {
                        const newChat: FriendZoneChat = { id: Date.now(), name, creatorId: currentUser.id, memberIds: [currentUser.id] };
                        setFriendZoneChats([...friendZoneChats, newChat]);
                    }} 
                    onDeleteChat={(id) => setFriendZoneChats(friendZoneChats.filter(c => c.id !== id))} 
                    onOpenChat={(id) => handleNavigate('friendZoneChat', { chatId: id })} 
                />;
            case 'store':
                return <StorePage 
                    currentUser={currentUser} 
                    onPurchase={(item) => {
                        if (userTokenBalance >= item.price) {
                            setUserTokenBalance(prev => prev - item.price);
                            return true;
                        }
                        return false;
                    }} 
                    userTokenBalance={userTokenBalance} 
                    showToast={showToast} 
                    onAddToCart={(item) => {
                        handleAddToCart({
                            id: `store-${item.id}-${Date.now()}`,
                            type: 'storeItem',
                            name: item.title,
                            image: item.image,
                            quantity: 1,
                            fullPrice: item.priceUSD, 
                            paymentOption: 'full',
                            storeItemDetails: { item }
                        });
                    }} 
                />;
            case 'userProfile':
                return <ProfilePage 
                    onNavigate={handleNavigate} 
                    currentUser={currentUser} 
                    tokenBalance={userTokenBalance} 
                    bookingHistory={[]}
                    favoriteVenueIds={currentUser.favoriteVenueIds || []} 
                    venues={appVenues} 
                    onViewVenueDetails={(v) => handleNavigate('venueDetails', { venueId: v.id })} 
                />;
            case 'adminDashboard':
                return <AdminDashboard 
                    users={appUsers} 
                    promoters={appPromoters} 
                    venues={appVenues} 
                    events={appEvents} 
                    storeItems={appStoreItems} 
                    pendingGroups={appAccessGroups.filter(g => g.status === 'pending')} 
                    invitationRequests={invitationRequests} 
                    pendingTableReservations={cartItems.filter(i => i.type === 'table')} 
                    onEditUser={(u) => setUserToEdit(u)} 
                    onAddUser={() => setIsAdminAddUserOpen(true)} 
                    onBlockUser={(u) => handleAdminEditUser({ ...u, status: u.status === 'blocked' ? 'active' : 'blocked' })} 
                    onViewUser={(u) => setPreviewUser(u)} 
                    onEditPromoter={(p, u) => setPromoterToEdit({promoter: p, user: u})} 
                    onDeletePromoter={(p) => {
                        setAppPromoters(prev => prev.filter(prom => prom.id !== p.id));
                        setAppUsers(prev => prev.map(u => u.id === p.id ? { ...u, role: UserRole.USER } : u));
                        showToast('Promoter removed', 'success');
                    }} 
                    onSuspendPromoter={(u) => handleAdminEditUser({ ...u, status: u.status === 'suspended' ? 'active' : 'suspended' })} 
                    onPreviewPromoter={(p) => handleNavigate('promoterProfile', { promoterId: p.id })} 
                    onApproveGroup={(id) => {
                         setAppAccessGroups(prev => prev.map(g => g.id === id ? { ...g, status: 'approved' } : g));
                         showToast('Group approved', 'success');
                    }} 
                    onApproveRequest={(id) => {
                        setInvitationRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
                        showToast('Request approved', 'success');
                    }} 
                    onRejectRequest={(id) => {
                        setInvitationRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
                         showToast('Request rejected', 'success');
                    }} 
                    onSendDirectInvites={(eId, uIds) => console.log('Send invites', eId, uIds)} 
                    onNavigate={handleNavigate} 
                    onAddEvent={() => { setEventToEdit(null); setIsAdminEditEventOpen(true); }} 
                    onEditEvent={(e) => { setEventToEdit(e); setIsAdminEditEventOpen(true); }} 
                    onDeleteEvent={(e) => { setAppEvents(prev => prev.filter(ev => ev.id !== e.id)); showToast('Event deleted', 'success'); }} 
                    onPreviewEvent={(e) => handleNavigate('eventTimeline')} 
                    onAddVenue={() => { setVenueToEdit(null); setIsAdminEditVenueOpen(true); }} 
                    onEditVenue={(v) => { setVenueToEdit(v); setIsAdminEditVenueOpen(true); }} 
                    onDeleteVenue={(v) => { setAppVenues(prev => prev.filter(ven => ven.id !== v.id)); showToast('Venue deleted', 'success'); }} 
                    onPreviewVenue={(v) => handleNavigate('venueDetails', { venueId: v.id })} 
                    onAddStoreItem={() => { setStoreItemToEdit(null); setIsAdminEditStoreItemOpen(true); }} 
                    onEditStoreItem={(i) => { setStoreItemToEdit(i); setIsAdminEditStoreItemOpen(true); }} 
                    onDeleteStoreItem={(i) => { setAppStoreItems(prev => prev.filter(it => it.id !== i.id)); showToast('Item deleted', 'success'); }} 
                    onPreviewStoreItem={(i) => setPreviewStoreItem(i)} 
                    promoterApplications={promoterApplications} 
                    onApprovePromoterApplication={handleApprovePromoterApplication} 
                    onRejectPromoterApplication={(id) => {
                        setPromoterApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
                        showToast('Application rejected', 'success');
                    }} 
                    bookedItems={bookedItems} 
                    guestlistRequests={guestlistJoinRequests} 
                    allRsvps={[]} 
                    onPreviewUser={(u) => setPreviewUser(u)} 
                    eventInvitations={mockEventInvitations} 
                    onSendPushNotification={(n) => showToast('Push notification sent', 'success')} 
                />;
            case 'promoterDashboard':
                const myPromoter = appPromoters.find(p => p.id === currentUser.id);
                if (!myPromoter) return <div>Promoter dashboard unavailable.</div>;
                return <PromoterDashboard 
                    promoter={myPromoter} 
                    onNavigate={handleNavigate} 
                    promoterUser={currentUser} 
                    onUpdateUser={handleUpdateUserWithRewardCheck} 
                    guestlistRequests={guestlistJoinRequests} 
                    users={appUsers} 
                    venues={appVenues} 
                    events={appEvents} 
                    onViewUser={(u) => setPreviewUser(u)} 
                    onUpdateRequestStatus={(id, status) => setGuestlistJoinRequests(prev => prev.map(r => r.id === id ? { ...r, attendanceStatus: status } : r))} 
                    onReviewGuestlistRequest={(id, status) => setGuestlistJoinRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))} 
                    bookedItems={bookedItems} 
                    eventInvitations={mockEventInvitations} 
                    onSendDirectInvites={(eId, uIds) => console.log('Send invites', eId, uIds)} 
                />;
            case 'bookings':
                return <BookingsPage 
                    onNavigate={handleNavigate} 
                    bookedItems={bookedItems} 
                    venues={appVenues} 
                />;
            case 'settings':
                return <SettingsPage onNavigate={handleNavigate} />;
            case 'chatbot':
                return <ChatbotPage initialPrompt={pageParams.initialPrompt} />;
            case 'liveChat':
                return <LiveChatPage />;
            case 'accessGroups':
                return <AccessGroupsPage 
                    currentUser={currentUser} 
                    allGroups={appAccessGroups} 
                    onViewGroup={(id) => handleNavigate('accessGroupFeed', { groupId: id })} 
                    onRequestJoinGroup={handleRequestJoinGroup}
                    onLeaveGroup={(g) => console.log('Leave group', g)} 
                    groupNotificationSettings={{}} 
                    onToggleGroupNotification={(id) => console.log('Toggle notif', id)} 
                    onNavigate={handleNavigate}
                    groupJoinRequests={groupJoinRequests} 
                />;
            case 'accessGroupFeed':
                return <AccessGroupFeedPage 
                    groupId={pageParams.groupId} 
                    currentUser={currentUser} 
                    allPosts={[]} 
                    allGroups={appAccessGroups} 
                    onToggleLike={(id) => console.log('Like post', id)} 
                    groupJoinRequests={groupJoinRequests}
                    onApproveRequest={handleApproveGroupRequest}
                    onRejectRequest={handleRejectGroupRequest}
                    users={appUsers}
                />;
            case 'myItineraries':
                return <MyItinerariesPage 
                    currentUser={currentUser} 
                    itineraries={itineraries} 
                    onNavigate={handleNavigate} 
                    onViewItinerary={(id) => handleNavigate('itineraryDetails', { itineraryId: id })} 
                />;
            case 'itineraryDetails':
                const itinerary = itineraries.find(i => i.id === pageParams.itineraryId);
                if (!itinerary) return <div>Itinerary not found</div>;
                return <ItineraryDetailsPage 
                    itinerary={itinerary} 
                    currentUser={currentUser} 
                    onEdit={(i) => handleNavigate('itineraryBuilder', { itineraryId: i.id })} 
                    onClone={(i) => console.log('Clone itinerary', i)} 
                />;
            case 'itineraryBuilder':
                const existingItinerary = itineraries.find(i => i.id === pageParams.itineraryId);
                return <ItineraryBuilderPage 
                    onSave={(i) => { console.log('Save itinerary', i); handleNavigate('myItineraries'); }} 
                    onCancel={() => handleNavigate('myItineraries')} 
                    itinerary={existingItinerary} 
                    venues={appVenues} 
                    events={appEvents} 
                    experiences={experiences} 
                    users={appUsers} 
                    currentUser={currentUser} 
                />;
            case 'bookingConfirmed':
                return <BookingConfirmedPage 
                    items={pageParams.items || []}
                    onNavigate={handleNavigate} 
                    onStartChat={(details) => console.log('Start chat', details)} 
                />;
            case 'promoterApplication':
                return <PromoterApplicationPage 
                    onApply={(app) => { 
                        setPromoterApplications(prev => [...prev, { ...app, id: Date.now(), userId: currentUser.id, status: 'pending' }]);
                        showToast('Application submitted!', 'success'); 
                        handleNavigate('home'); 
                    }} 
                    onCancel={() => handleNavigate('home')} 
                    showToast={showToast} 
                />;
            case 'createGroup':
                return <CreateGroupPage 
                    onSave={(g) => { 
                         const newGroup: AccessGroup = { ...g, id: Date.now(), memberIds: [currentUser.id], creatorId: currentUser.id, status: 'pending', creationDate: new Date().toISOString().split('T')[0] };
                         setAppAccessGroups(prev => [...prev, newGroup]);
                         handleNavigate('accessGroups'); 
                    }} 
                    onCancel={() => handleNavigate('accessGroups')} 
                />;
            case 'invitations':
                return <InvitationsPage 
                    currentUser={currentUser} 
                    invitations={mockEventInvitations} 
                    events={appEvents} 
                    allUsers={appUsers} 
                    onAccept={(id) => console.log('Accept invite', id)} 
                    onDecline={(id) => console.log('Decline invite', id)} 
                    onNavigate={handleNavigate} 
                />;
            case 'checkout':
                return <CheckoutPage 
                    currentUser={currentUser} 
                    watchlist={watchlist} 
                    bookedItems={bookedItems} 
                    venues={appVenues} 
                    onRemoveItem={(id) => {
                        setCartItems(prev => prev.filter(i => i.id !== id));
                        setWatchlist(prev => prev.filter(i => i.id !== id));
                    }} 
                    onUpdatePaymentOption={(id, opt) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, paymentOption: opt } : i))} 
                    onConfirmCheckout={handleConfirmCheckout} 
                    onCompleteBooking={handleCompleteBooking} 
                    onViewReceipt={(item) => handleNavigate('bookingConfirmed', { items: [item] })} 
                    userTokenBalance={userTokenBalance} 
                    onStartChat={(item) => console.log('Start chat', item)} 
                    onCancelRsvp={(item) => console.log('Cancel RSVP', item)} 
                    initialTab={pageParams.initialTab} 
                    onNavigate={handleNavigate}
                />;
            case 'eventChatsList':
                return <EventChatsListPage 
                    currentUser={currentUser} 
                    onNavigate={handleNavigate} 
                    eventChats={mockEventChats} 
                    guestlistChats={mockGuestlistChats} 
                    allEvents={appEvents} 
                    venues={appVenues} 
                    promoters={appPromoters} 
                    allUsers={appUsers} 
                />;
            case 'guestlistChats':
                return <GuestlistChatsPage 
                    currentUser={currentUser} 
                    guestlistChats={mockGuestlistChats} 
                    venues={appVenues} 
                    promoters={appPromoters} 
                    onViewChat={(id) => handleNavigate('guestlistChat', { chatId: id })} 
                />;
            case 'eventChat':
                return <EventChatPage 
                    chatId={pageParams.chatId} 
                    currentUser={currentUser} 
                    messages={mockEventChatMessages} 
                    allParticipants={[...appUsers, ...appPromoters]} 
                    allEvents={appEvents} 
                    eventChats={mockEventChats} 
                    onSendMessage={(id, text) => console.log('Send msg', id, text)} 
                    onBack={() => handleNavigate('eventChatsList')} 
                />;
            case 'guestlistChat':
                return <GuestlistChatPage 
                    chatId={pageParams.chatId} 
                    currentUser={currentUser} 
                    messages={mockGuestlistChatMessages} 
                    allUsers={appUsers} 
                    allPromoters={appPromoters} 
                    guestlistChats={mockGuestlistChats} 
                    venues={appVenues} 
                    onSendMessage={(id, text) => console.log('Send msg', id, text)} 
                    onBack={() => handleNavigate('guestlistChats')} 
                />;
            case 'friendZoneChat':
                return <FriendZoneChatPage 
                    chatId={pageParams.chatId} 
                    currentUser={currentUser} 
                    chats={friendZoneChats} 
                    messages={mockFriendZoneChatMessages} 
                    promoters={appPromoters} 
                    users={appUsers} 
                    onSendMessage={(id, text) => console.log('Send msg', id, text)} 
                    onAddPromoter={(cId, pId) => console.log('Add promoter', cId, pId)} 
                    onRemovePromoter={(cId, pId) => console.log('Remove promoter', cId, pId)} 
                    onBack={() => handleNavigate('friendsZone')} 
                    onAddMember={(cId, uId) => console.log('Add member', cId, uId)} 
                    onRemoveMember={(cId, uId) => console.log('Remove member', cId, uId)} 
                    onLeaveChat={(cId) => console.log('Leave chat', cId)} 
                />;
            case 'promoterStats':
                return <PromoterStatsPage 
                    currentUser={currentUser} 
                    bookedItems={bookedItems} 
                    guestlistRequests={guestlistJoinRequests} 
                    users={appUsers} 
                    onNavigate={handleNavigate} 
                />;
            case 'paymentMethods':
                return <PaymentMethodsPage 
                    onNavigate={handleNavigate} 
                    showToast={showToast} 
                    paymentMethods={paymentMethods}
                    onUpdateMethods={setPaymentMethods}
                />;
            case 'favorites':
                return <FavoritesPage 
                    promoters={appPromoters} 
                    onSelectPromoter={(p) => handleNavigate('promoterProfile', { promoterId: p.id })} 
                    onToggleFavorite={(id) => handleToggleFavorite(id, 'promoter')} 
                    onNavigate={handleNavigate} 
                    favoriteVenueIds={currentUser.favoriteVenueIds || []} 
                    onToggleVenueFavorite={(id) => handleToggleFavorite(id, 'venue')} 
                    onViewVenueDetails={(v) => handleNavigate('venueDetails', { venueId: v.id })} 
                    currentUser={currentUser} 
                />;
            case 'venueDetails':
                const venue = appVenues.find(v => v.id === pageParams.venueId);
                if (!venue) return <div>Venue not found</div>;
                return <VenueDetailsPage 
                    venue={venue} 
                    onBack={() => handleNavigate('home')} 
                    onBookVenue={handleBookVenue} 
                    isFavorite={(currentUser.favoriteVenueIds || []).includes(venue.id)} 
                    onToggleFavorite={(id) => handleToggleFavorite(id, 'venue')} 
                    currentUser={currentUser} 
                    onUpdateVenue={(v) => setAppVenues(prev => prev.map(old => old.id === v.id ? v : old))} 
                    promoters={appPromoters} 
                    onBookWithSpecificPromoter={(p, v) => setActiveModal({ type: 'booking', promoter: p, venue: v })} 
                    onJoinGuestlist={(p, v) => handleOpenGuestlistModal({ promoter: p, venue: v })} 
                    guestlistJoinRequests={guestlistJoinRequests} 
                    onCheckIn={(vId, data) => {
                        console.log('Check in', vId, data);
                        showToast('Check-in successful! Welcome.', 'success');
                    }} 
                />;
            case 'help': return <HelpPage onNavigate={handleNavigate} />;
            case 'reportIssue': return <ReportIssuePage onNavigate={handleNavigate} />;
            case 'privacy': return <PrivacyPage onNavigate={handleNavigate} onDeleteAccountRequest={() => console.log('Delete account req')} />;
            case 'security': return <SecurityPage onNavigate={handleNavigate} />;
            case 'notificationsSettings': return <NotificationsSettingsPage settings={{ eventAnnouncements: true, bookingUpdates: true, recommendations: true }} onSettingsChange={(s) => console.log('Settings change', s)} onNavigate={handleNavigate} />;
            case 'cookieSettings': return <CookieSettingsPage onNavigate={handleNavigate} />;
            case 'dataExport': return <DataExportPage requests={mockDataExportRequests} onNewRequest={() => console.log('New data export')} onNavigate={handleNavigate} />;
            case 'tokenWallet': return <TokenWalletPage onNavigate={handleNavigate} transactions={[]} />;
            case 'editProfile': return <EditProfilePage 
                currentUser={currentUser} 
                onSave={handleUpdateUserWithRewardCheck} 
                onNavigate={handleNavigate} 
                showToast={showToast} 
            />;
            case 'referFriend': return <ReferFriendPage />;
            default: return <HomeScreen onNavigate={handleNavigate} currentUser={currentUser} onOpenMenu={() => setIsMenuOpen(true)} />;
        }
    };

    useEffect(() => {
        if (!hasOnboarded) {
            // Show onboarding
        }
    }, [hasOnboarded]);

    if (!currentUser) return null; // Render guard

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {!hasOnboarded ? (
                <OnboardingModal 
                    user={currentUser} 
                    onFinish={handleOnboardingFinish} 
                    onNavigate={handleNavigate} 
                    promoters={appPromoters} 
                    onSelectPromoter={handlePromoterSelection} 
                    onUpdateUser={handleUpdateUserWithRewardCheck}
                />
            ) : (
                <>
                    {currentPage !== 'home' && (
                        <Header 
                            title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} 
                            onOpenMenu={() => setIsMenuOpen(true)} 
                            onOpenNotifications={() => setIsNotificationsOpen(true)} 
                            onOpenGroupChat={() => handleNavigate('accessGroups')} 
                            currentUser={currentUser} 
                            onOpenCart={() => setIsCartOpen(true)} 
                            cartItemCount={cartItems.length} 
                            tokenBalance={userTokenBalance} 
                            balanceJustUpdated={false}
                            showMenu={true}
                        />
                    )}
                    
                    <main className="pb-20">
                        {renderPage()}
                    </main>

                    {currentUser.role === UserRole.PROMOTER ? (
                        <PromoterBottomNavBar currentPage={currentPage} onNavigate={handleNavigate} cartItemCount={cartItems.length} />
                    ) : (
                        <BottomNavBar 
                            currentUser={currentUser} 
                            currentPage={currentPage} 
                            onNavigate={handleNavigate} 
                            cartItemCount={cartItems.length} 
                            onOpenMenu={() => setIsMenuOpen(true)} 
                        />
                    )}

                    <SideMenu 
                        isOpen={isMenuOpen} 
                        onClose={() => setIsMenuOpen(false)} 
                        onNavigate={handleNavigate} 
                        currentPage={currentPage} 
                        currentUser={currentUser} 
                    />

                    <CartPanel 
                        isOpen={isCartOpen} 
                        onClose={() => setIsCartOpen(false)} 
                        cartItems={cartItems} 
                        onRemoveItem={handleRemoveCartItem} 
                        onNavigateToCheckout={() => {
                            setIsCartOpen(false);
                            handleCheckout();
                        }}
                        totalPrice={cartItems.reduce((sum, item) => sum + (item.paymentOption === 'full' ? (item.fullPrice || 0) : (item.depositPrice || 0)), 0)} 
                    />

                    <NotificationsPanel 
                        isOpen={isNotificationsOpen} 
                        onClose={() => setIsNotificationsOpen(false)} 
                        notifications={notifications} 
                        onNavigate={(link) => { 
                            setIsNotificationsOpen(false); 
                            if (link) handleNavigate(link.page, link.params); 
                        }} 
                    />

                    {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                    {onboardingReward !== null && (
                        <Modal isOpen={true} onClose={() => setOnboardingReward(null)} className="max-w-sm">
                            <div className="text-center p-6">
                                <div className="mx-auto w-20 h-20 bg-amber-400/10 rounded-full flex items-center justify-center mb-6 border border-amber-400/20">
                                    <TokenIcon className="w-10 h-10 text-amber-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Reward Received!</h2>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    You've earned <span className="text-amber-400 font-bold text-lg">{onboardingReward} TMKC</span> tokens for completing the tour.
                                </p>
                                <button 
                                    onClick={() => setOnboardingReward(null)}
                                    className="w-full bg-amber-400 text-black font-bold py-3.5 rounded-xl hover:bg-amber-300 transition-transform hover:scale-105 shadow-lg shadow-amber-400/20"
                                >
                                    Awesome!
                                </button>
                            </div>
                        </Modal>
                    )}

                    {/* Global Modals */}
                    {activeModal?.type === 'booking' && (
                        <BookingFlow 
                            promoter={activeModal.promoter} 
                            onClose={() => setActiveModal(null)} 
                            onAddToCart={handleAddToCart} 
                            currentUser={currentUser} 
                            initialVenue={activeModal.venue} 
                            initialDate={activeModal.date} 
                            tableBookings={{}} 
                            onNavigateToCheckout={() => {
                                setActiveModal(null);
                                handleNavigate('checkout');
                            }}
                            onKeepBooking={() => setActiveModal(null)} 
                            venues={appVenues} 
                        />
                    )}
                    
                    {activeModal?.type === 'experienceBooking' && (
                        <ExperienceBookingFlow 
                            experience={activeModal.experience} 
                            user={currentUser} 
                            onClose={() => setActiveModal(null)} 
                            onAddToCart={handleAddToCart} 
                            onNavigateToCheckout={() => {
                                setActiveModal(null);
                                handleNavigate('checkout');
                            }}
                            onKeepBooking={() => setActiveModal(null)} 
                        />
                    )}

                    {activeModal?.type === 'eventBooking' && (
                        <EventBookingFlow
                            event={activeModal.event}
                            currentUser={currentUser}
                            onClose={() => setActiveModal(null)} 
                            onAddToCart={handleAddToCart} 
                            onNavigateToCheckout={() => {
                                setActiveModal(null);
                                handleNavigate('checkout');
                            }}
                            onKeepBooking={() => setActiveModal(null)}
                        />
                    )}

                    {activeModal?.type === 'guestlist' && (
                        <GuestlistModal 
                            isOpen={true} 
                            onClose={() => setActiveModal(null)} 
                            context={{ promoter: activeModal.promoter, venue: activeModal.venue, date: activeModal.date }} 
                            onConfirmJoin={handleJoinGuestlistConfirm} 
                            currentUser={currentUser} 
                            bookedItems={bookedItems} 
                            onViewProfile={(u) => handleNavigate('userProfile')} 
                        />
                    )}

                    {activeModal?.type === 'guestlistSuccess' && (
                        <GuestlistJoinSuccessModal 
                            isOpen={true} 
                            onClose={() => setActiveModal(null)} 
                            onNavigateToPlans={() => {
                                setActiveModal(null);
                                handleNavigate('checkout');
                            }}
                            venueName={activeModal.venueName} 
                            date={activeModal.date} 
                            isVip={activeModal.isVip} 
                        />
                    )}

                    {activeModal?.type === 'promoterSelection' && (
                        <SelectPromoterModal
                            isOpen={true}
                            onClose={() => setActiveModal(null)} 
                            venue={activeModal.venue}
                            promoters={appPromoters}
                            onSelectPromoter={(promoter) => {
                                if (activeModal?.type === 'promoterSelection' && activeModal.venue) {
                                    const currentVenue = activeModal.venue;
                                    setActiveModal({ type: 'booking', promoter, venue: currentVenue });
                                }
                            }}
                        />
                    )}

                    <AdminAddUserModal 
                        isOpen={isAdminAddUserOpen}
                        onClose={() => setIsAdminAddUserOpen(false)}
                        onSave={handleAdminAddUser}
                    />
                    
                    {userToEdit && (
                        <AdminEditUserModal 
                            user={userToEdit}
                            isOpen={!!userToEdit}
                            onClose={() => setUserToEdit(null)}
                            onSave={handleAdminEditUser}
                        />
                    )}
                    
                    <AdminEditPromoterModal 
                        isOpen={!!promoterToEdit}
                        onClose={() => setPromoterToEdit(null)}
                        data={promoterToEdit}
                        onSave={handleAdminEditPromoter}
                    />
                    
                    <AdminEditEventModal 
                        isOpen={isAdminEditEventOpen}
                        onClose={() => setIsAdminEditEventOpen(false)}
                        event={eventToEdit}
                        venues={appVenues}
                        onSave={(e) => {
                            if (eventToEdit) {
                                setAppEvents(prev => prev.map(ev => ev.id === e.id ? e : ev));
                            } else {
                                setAppEvents(prev => [...prev, { ...e, id: Date.now() }]);
                            }
                            setIsAdminEditEventOpen(false);
                            showToast('Event saved successfully', 'success');
                        }}
                    />
                    
                    <AdminEditVenueModal 
                        isOpen={isAdminEditVenueOpen}
                        onClose={() => setIsAdminEditVenueOpen(false)}
                        venue={venueToEdit}
                        onSave={(v) => {
                             if (venueToEdit) {
                                setAppVenues(prev => prev.map(vn => vn.id === v.id ? v : vn));
                            } else {
                                setAppVenues(prev => [...prev, { ...v, id: Date.now() }]);
                            }
                            setIsAdminEditVenueOpen(false);
                            showToast('Venue saved successfully', 'success');
                        }}
                    />
                    
                    <AdminEditStoreItemModal 
                        isOpen={isAdminEditStoreItemOpen}
                        onClose={() => setIsAdminEditStoreItemOpen(false)}
                        item={storeItemToEdit}
                        onSave={(item) => {
                            if (storeItemToEdit) {
                                setAppStoreItems(prev => prev.map(it => it.id === item.id ? item : it));
                            } else {
                                setAppStoreItems(prev => [...prev, { ...item, id: `item-${Date.now()}` }]);
                            }
                            setIsAdminEditStoreItemOpen(false);
                            showToast('Store item saved', 'success');
                        }}
                    />
                    
                    <StoreItemPreviewModal 
                        isOpen={!!previewStoreItem}
                        onClose={() => setPreviewStoreItem(null)}
                        item={previewStoreItem}
                    />
                    
                    <UserProfilePreviewModal 
                        isOpen={!!previewUser}
                        onClose={() => setPreviewUser(null)}
                        user={previewUser}
                    />
