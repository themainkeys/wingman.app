import React, { useMemo, useState } from 'react';
import { CartItem, Venue, User, UserRole, UserAccessLevel } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { KeyIcon } from './icons/KeyIcon';
import { ChatIcon } from './icons/ChatIcon';

interface CartItemCardProps {
    item: CartItem;
    venues: Venue[];
    onRemove: (itemId: string) => void;
    onUpdatePaymentOption: (itemId: string, option: 'deposit' | 'full') => void;
    onCompleteBooking?: (item: CartItem) => void;
    isBooked?: boolean;
    onViewReceipt?: (item: CartItem) => void;
    onStartChat?: (item: CartItem) => void;
    isSelected?: boolean;
    onToggleSelection?: (itemId: string) => void;
    currentUser?: User;
    onCancelRsvp?: (item: CartItem) => void;
}

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="font-semibold text-white text-right">{value}</p>
    </div>
);


export const CartItemCard: React.FC<CartItemCardProps> = ({ item, venues, onRemove, onUpdatePaymentOption, onCompleteBooking, isBooked, onViewReceipt, onStartChat, isSelected, onToggleSelection, currentUser, onCancelRsvp }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const canCancelRsvp = currentUser && onCancelRsvp && (
        currentUser.role === UserRole.ADMIN ||
        currentUser.role === UserRole.PROMOTER ||
        currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL
    );

    if (item.isPlaceholder) {
        return (
            <div className="bg-gray-900 rounded-lg p-4 border border-dashed border-gray-700 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pre-selection</p>
                        <h3 className="text-lg font-bold text-white mt-1 leading-tight">{item.name}</h3>
                        {item.date && <p className="text-sm text-gray-400">{item.date}</p>}
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="self-start text-gray-500 hover:text-red-500"
                        aria-label={`Remove ${item.name} from itinerary`}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
                <button
                    onClick={() => onCompleteBooking?.(item)}
                    className="w-full bg-[#EC4899] text-white font-bold py-2 rounded-lg text-sm hover:bg-[#d8428a]"
                >
                    Complete Booking
                </button>
            </div>
        )
    }

    const eventVenue = useMemo(() => {
        if (item.type === 'event' && item.eventDetails) {
            return venues.find(v => v.id === item.eventDetails.event.venueId);
        }
        return undefined;
    }, [item, venues]);

    const isFullPayment = item.paymentOption === 'full';
    
    const priceText = useMemo(() => {
        if (item.type === 'guestlist') return 'Complimentary';
        if (item.type === 'storeItem') return `$${(item.fullPrice ?? 0).toFixed(2)}`;
        
        return item.paymentOption === 'full' ? `$${item.fullPrice?.toFixed(2)}` : `$${item.depositPrice?.toFixed(2)} Deposit`;
    }, [item]);

    return (
        <div className={`bg-gray-900 rounded-lg p-4 border transition-colors ${isSelected ? 'border-[#EC4899]' : 'border-gray-800'}`}>
            <div className="flex gap-4">
                {!isBooked && onToggleSelection && (
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelection(item.id)}
                            className="w-6 h-6 bg-gray-700 border-gray-600 text-[#EC4899] focus:ring-[#EC4899] rounded"
                            aria-label={`Select item ${item.name}`}
                        />
                    </div>
                )}
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                <div className="flex-grow">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">{item.type}</p>
                    <h3 className="text-lg font-bold text-white mt-1 leading-tight">{item.name}</h3>
                    {item.date && <p className="text-sm text-gray-400">{item.date}</p>}
                     {item.tableDetails && item.tableDetails.tableOption && (
                        <p className="text-xs text-gray-500 mt-1">{item.tableDetails.tableOption.name}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">{priceText}</p>
                </div>
            </div>

            {isDetailsOpen && (
              <div className="animate-fade-in border-t border-gray-700 pt-4 mt-4 text-sm space-y-2">
                {item.type === 'table' && item.tableDetails && (
                    <>
                        {item.tableDetails.promoter && <DetailRow label="Promoter" value={item.tableDetails.promoter.name} />}
                        {item.tableDetails.numberOfGuests && <DetailRow label="Guests" value={item.tableDetails.numberOfGuests} />}
                        {item.tableDetails.guestDetails && (
                            <>
                                <DetailRow label="Booked for" value={item.tableDetails.guestDetails.name} />
                                {item.tableDetails.guestDetails.email && <DetailRow label="Guest Email" value={item.tableDetails.guestDetails.email} />}
                                {item.tableDetails.guestDetails.phone && <DetailRow label="Guest Phone" value={item.tableDetails.guestDetails.phone} />}
                            </>
                        )}
                        {item.tableDetails.selectedBottles && item.tableDetails.selectedBottles.length > 0 && (
                            <div className="pt-2">
                                <p className="text-gray-400 mb-1">Selected Bottles:</p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    {item.tableDetails.selectedBottles.map(bottle => (
                                        <li key={bottle.id} className="text-white">
                                            {bottle.quantity}x {bottle.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
                {item.type === 'event' && (
                    <>
                        {eventVenue && <DetailRow label="Venue" value={`${eventVenue.name}, ${eventVenue.location}`} />}
                        <DetailRow label="Price per person" value={`$${(item.fullPrice ?? 0).toLocaleString()}`} />
                    </>
                )}
                 {item.type === 'guestlist' && item.guestlistDetails && (
                    <>
                        <DetailRow label="Promoter" value={item.guestlistDetails.promoter.name} />
                        <DetailRow label="Guests" value={item.guestlistDetails.numberOfGuests} />
                    </>
                )}
                {item.type === 'storeItem' && item.storeItemDetails && (
                    <>
                        <DetailRow label="Category" value={item.storeItemDetails.item.category} />
                        <DetailRow label="Price (USD)" value={`$${item.storeItemDetails.item.priceUSD.toFixed(2)}`} />
                        <DetailRow label="Price (Tokens)" value={`${item.storeItemDetails.item.price.toLocaleString()} TMKC`} />
                    </>
                )}
              </div>
            )}
            
            <div className="mt-4 space-y-2">
                {isBooked ? (
                     <div className="space-y-2">
                        <button
                            onClick={() => onViewReceipt?.(item)}
                            className="w-full bg-[#EC4899] text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-[#d8428a]"
                        >
                            <KeyIcon className="w-4 h-4" />
                            {item.type === 'guestlist' ? 'View Details' : 'View Receipt / QR'}
                        </button>
                        {(item.type === 'event' && canCancelRsvp) || item.type === 'guestlist' ? (
                            <button
                                onClick={() => onCancelRsvp?.(item)}
                                className="w-full bg-red-900/50 text-red-400 font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-red-900/80"
                            >
                                <TrashIcon className="w-4 h-4" />
                                {item.type === 'event' ? 'Cancel RSVP' : 'Cancel Spot'}
                            </button>
                        ): null}
                    </div>
                ) : item.type === 'table' ? (
                    <div className="bg-gray-800 rounded-lg p-1 flex">
                        <button
                            onClick={() => onUpdatePaymentOption(item.id, 'deposit')}
                            className={`w-1/2 rounded-md py-2 text-sm font-semibold transition-colors ${!isFullPayment ? 'bg-amber-400 text-black' : 'text-gray-300'}`}
                        >
                            Deposit: ${(item.depositPrice ?? 0).toLocaleString()}
                        </button>
                        <button
                            onClick={() => onUpdatePaymentOption(item.id, 'full')}
                            className={`w-1/2 rounded-md py-2 text-sm font-semibold transition-colors ${isFullPayment ? 'bg-amber-400 text-black' : 'text-gray-300'}`}
                        >
                            Pay Full: ${(item.fullPrice ?? 0).toLocaleString()}
                        </button>
                    </div>
                ) : null}

                <div className="flex items-center justify-between pt-1">
                     {isBooked ? (
                         <button
                            onClick={() => onStartChat?.(item)}
                            disabled={!item.tableDetails?.promoter && !item.eventDetails && !item.guestlistDetails}
                            className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed"
                         >
                            <ChatIcon className="w-4 h-4" />
                            Chat with Wingman
                         </button>
                     ) : (
                        <button
                            onClick={() => onRemove(item.id)}
                            className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-red-500"
                        >
                            <TrashIcon className="w-4 h-4" /> Remove
                        </button>
                     )}
                     <button
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline"
                    >
                        <span>{isDetailsOpen ? 'Hide Details' : 'View Details'}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};