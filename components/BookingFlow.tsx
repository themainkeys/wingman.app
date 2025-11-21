
import React, { useState, useMemo, useEffect } from 'react';
import { Promoter, Venue, TableOption, UserAccessLevel, Bottle, User, CartItem, UserRole } from '../types';
import { venues, bottles } from '../data/mockData';
import { CloseIcon } from './icons/CloseIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { UsersIcon } from './icons/UsersIcon';
import { AddedToPlansModal } from './modals/AddedToPlansModal';

interface BookingFlowProps {
  promoter: Promoter;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  currentUser: User;
  initialVenue?: Venue;
  initialDate?: string;
  tableBookings: Record<string, number>;
  onNavigateToCheckout: () => void;
  onKeepBooking: () => void;
}

const TAX_SERVICE_RATE = 0.36;
const DEPOSIT_AMOUNT = 50;
const LARGE_GROUP_MAX_GUESTS = 20;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="font-semibold text-white text-right">{value}</p>
    </div>
);


export const BookingFlow: React.FC<BookingFlowProps> = ({ promoter, onClose, onAddToCart, currentUser, initialVenue, initialDate, tableBookings, onNavigateToCheckout, onKeepBooking }) => {
  const [step, setStep] = useState(initialVenue ? 2 : 1);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(initialVenue || null);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || '');
  const [selectedTable, setSelectedTable] = useState<TableOption | null>(null);
  const isPrivilegedUser = useMemo(() => currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL || currentUser.role === UserRole.ADMIN, [currentUser.accessLevel, currentUser.role]);

  const [numberOfMaleGuests, setNumberOfMaleGuests] = useState<number | ''>(isPrivilegedUser ? 0 : 1);
  const [numberOfFemaleGuests, setNumberOfFemaleGuests] = useState<number | ''>(isPrivilegedUser ? 1 : 0);
  const [selectedBottles, setSelectedBottles] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<{ date?: string; guests?: string }>({});

  const [bookingFor, setBookingFor] = useState<'self' | 'guest'>('self');
  const [guestDetails, setGuestDetails] = useState({ name: '', email: '', phone: '' });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const promoterVenues = useMemo(() => venues.filter(v => promoter.assignedVenueIds.includes(v.id)), [promoter.assignedVenueIds]);

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (step === 2 && !selectedDate) {
        setSelectedDate(minDate);
    }
  }, [step, minDate, selectedDate]);

  const totalGuests = useMemo(() => Number(numberOfMaleGuests || 0) + Number(numberOfFemaleGuests || 0), [numberOfMaleGuests, numberOfFemaleGuests]);

  const bottlesCost = useMemo(() => Object.entries(selectedBottles).reduce((total: number, [bottleId, quantity]) => {
      const bottle = bottles.find(b => b.id === bottleId);
      return total + (bottle ? bottle.price * Number(quantity) : 0);
    }, 0), [selectedBottles]);

  const totalWithTaxAndService = useMemo(() => {
    const totalMinSpend = Math.max(selectedTable?.minSpend || 0, bottlesCost);
    return totalMinSpend * (1 + TAX_SERVICE_RATE);
  }, [selectedTable, bottlesCost]);

  const handleVenueSelect = (venue: Venue) => { setSelectedVenue(venue); setStep(2); };
  const handleTableSelect = (table: TableOption) => { setSelectedTable(table); setStep(4); };

  const validateAndProceed = () => {
    if (step === 2 && totalGuests === 0) {
      setErrors({ guests: "Please specify the number of guests." });
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  };
  
  const handleConfirmBooking = () => {
    if (!selectedVenue || !selectedTable || !selectedDate) return;
    
    if (bookingFor === 'guest' && (!guestDetails.name || !guestDetails.email)) {
        alert("Please enter the guest's name and email.");
        return;
    }

    const cartItem: CartItem = {
      id: `table-${selectedVenue.id}-${selectedDate}-${selectedTable.id}`,
      type: 'table',
      name: selectedVenue.name,
      image: selectedVenue.coverImage,
      date: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      sortableDate: selectedDate,
      quantity: 1,
      fullPrice: totalWithTaxAndService,
      depositPrice: DEPOSIT_AMOUNT,
      paymentOption: 'full',
      tableDetails: {
        venue: selectedVenue, tableOption: selectedTable, promoter: promoter, numberOfGuests: totalGuests,
        guestDetails: bookingFor === 'guest' ? guestDetails : { name: currentUser.name, email: currentUser.email, phone: currentUser.phoneNumber || ''},
        selectedBottles: Object.keys(selectedBottles).map((id) => {
          const bottle = bottles.find(b => b.id === id);
          return { id, name: bottle?.name || 'Unknown', price: bottle?.price || 0, quantity: selectedBottles[id] };
        }),
      }
    };
    
    onAddToCart(cartItem);
    setShowSuccessModal(true);
  };

  const renderStepContent = () => {
    switch (step) {
        case 1: // Select Venue
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Select a Venue</h2>
                    <div className="space-y-3">
                        {promoterVenues.map(venue => (
                            <button key={venue.id} onClick={() => handleVenueSelect(venue)} className="w-full flex items-center gap-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                <img src={venue.coverImage} alt={venue.name} className="w-20 h-14 object-cover rounded-md" />
                                <div className="text-left">
                                    <p className="font-bold text-white">{venue.name}</p>
                                    <p className="text-sm text-gray-400">{venue.location}</p>
                                    <p className="text-xs text-gray-500 mt-1">Open: {venue.operatingDays.join(', ')}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 2: // Date & Guests
            const dayOfWeek = selectedDate ? WEEKDAYS[new Date(selectedDate + 'T00:00:00').getDay()] : '';
            const isVenueOpen = selectedVenue ? selectedVenue.operatingDays.includes(dayOfWeek) : false;
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Date & Guests</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="booking-date" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                            <input type="date" id="booking-date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={minDate} className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-[#EC4899] focus:border-[#EC4899]" />
                             {!isVenueOpen && selectedDate && <p className="text-red-400 text-sm mt-2">{selectedVenue?.name} is not open on {dayOfWeek}s.</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Number of Guests</label>
                            <div className="flex gap-4">
                                <div className="relative w-1/2">
                                    <UsersIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                                    <input type="number" value={numberOfMaleGuests} onChange={e => setNumberOfMaleGuests(e.target.value === '' ? '' : parseInt(e.target.value, 10))} placeholder="Males" className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-[#EC4899] focus:border-[#EC4899]" min="0" max={LARGE_GROUP_MAX_GUESTS} />
                                </div>
                                <div className="relative w-1/2">
                                    <UsersIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                                    <input type="number" value={numberOfFemaleGuests} onChange={e => setNumberOfFemaleGuests(e.target.value === '' ? '' : parseInt(e.target.value, 10))} placeholder="Females" className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-[#EC4899] focus:border-[#EC4899]" min="0" max={LARGE_GROUP_MAX_GUESTS} />
                                </div>
                            </div>
                            {errors.guests && <p className="text-red-400 text-sm mt-2">{errors.guests}</p>}
                        </div>
                    </div>
                    <button onClick={validateAndProceed} disabled={!isVenueOpen || totalGuests === 0} className="mt-8 w-full bg-[#EC4899] text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-[#d8428a] disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            );
        case 3: // Select Table
            const tablesForVenue = selectedVenue?.tableOptions || [];
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Select a Table</h2>
                    <div className="space-y-3">
                        {tablesForVenue.map(table => {
                           const tableKey = `${table.id}-${selectedDate}`;
                           const bookingsForTable = tableBookings[tableKey] || 0;
                           const isAvailable = table.totalAvailable === undefined || bookingsForTable < table.totalAvailable;

                           return (
                                <button 
                                    key={table.id} 
                                    onClick={() => handleTableSelect(table)} 
                                    disabled={!isAvailable} 
                                    className="w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-800/50 disabled:cursor-not-allowed flex flex-col"
                                >
                                    <div className="w-full text-left">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-white">{table.name}</p>
                                                <p className="text-sm text-gray-400 mt-1">{table.description}</p>
                                            </div>
                                            {!isAvailable && <span className="text-xs font-bold text-red-400 mt-1 flex-shrink-0 ml-2">SOLD OUT</span>}
                                        </div>

                                        <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-700">
                                            <div className="flex items-center gap-2 text-sm">
                                                <UsersIcon className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Capacity</p>
                                                    <p className="font-semibold text-white">{table.capacityHint}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Min Spend</p>
                                                <p className="font-bold text-lg text-amber-400">${table.minSpend.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {table.notes && <p className="text-xs text-amber-300/80 mt-2 text-left bg-amber-900/30 p-2 rounded-md w-full">Note: {table.notes}</p>}
                                </button>
                           );
                        })}
                    </div>
                </div>
            );
        case 4: // Confirmation
            if (!selectedVenue || !selectedTable) return null;
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Confirm Your Booking</h2>
                    
                    <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
                        <DetailRow label="Venue" value={selectedVenue.name} />
                        <DetailRow label="Date" value={new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
                        <DetailRow label="Table" value={selectedTable.name} />
                        <DetailRow label="Guests" value={totalGuests} />
                        <div className="border-t border-gray-700 !mt-4 pt-3">
                            <DetailRow label="Min Spend" value={`$${selectedTable.minSpend.toLocaleString()}`} />
                            <DetailRow label="Tax & Service (36%)" value={`$${(selectedTable.minSpend * TAX_SERVICE_RATE).toLocaleString()}`} />
                            <DetailRow label="Total Est." value={`$${(selectedTable.minSpend * (1 + TAX_SERVICE_RATE)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Who are you booking for?</h3>
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => setBookingFor('self')} className={`w-1/2 p-3 rounded-lg border-2 font-semibold ${bookingFor === 'self' ? 'bg-pink-500/10 border-pink-500 text-white' : 'bg-gray-800 border-gray-800 text-gray-300'}`}>Myself</button>
                            <button onClick={() => setBookingFor('guest')} className={`w-1/2 p-3 rounded-lg border-2 font-semibold ${bookingFor === 'guest' ? 'bg-pink-500/10 border-pink-500 text-white' : 'bg-gray-800 border-gray-800 text-gray-300'}`}>A Guest</button>
                        </div>

                        {bookingFor === 'guest' && (
                            <div className="space-y-3 animate-fade-in">
                                 <input type="text" value={guestDetails.name} onChange={e => setGuestDetails({...guestDetails, name: e.target.value})} placeholder="Guest Full Name" className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-pink-500 focus:border-pink-500" required />
                                 <input type="email" value={guestDetails.email} onChange={e => setGuestDetails({...guestDetails, email: e.target.value})} placeholder="Guest Email" className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-pink-500 focus:border-pink-500" required />
                                 <input type="tel" value={guestDetails.phone} onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})} placeholder="Guest Phone (Optional)" className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-pink-500 focus:border-pink-500" />
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleConfirmBooking} 
                        className="mt-8 w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
                    >
                        Confirm & Add to Plans
                    </button>
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div 
                className="bg-[#121212] border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-4 relative flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">{selectedVenue?.name || 'Book a Table'}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close booking flow">
                    <CloseIcon className="w-6 h-6" />
                </button>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto">
                {renderStepContent()}
                </div>
                
                {step > 1 && (
                    <div className="flex-shrink-0 p-4 border-t border-gray-800">
                        <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                            <ChevronLeftIcon className="w-5 h-5"/>
                            Back
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        {showSuccessModal && selectedVenue && (
            <AddedToPlansModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                venueName={selectedVenue.name}
                onCheckout={onNavigateToCheckout}
                onKeepBooking={onKeepBooking}
                keepBookingLabel="Keep booking"
            />
        )}
    </>
  );
};
