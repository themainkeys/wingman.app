import React, { useState } from 'react';
import { Page, ConfirmedBookingDetails, Experience } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ChatIcon } from './icons/ChatIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface BookingConfirmedPageProps {
    details: ConfirmedBookingDetails;
    experience?: Experience;
    onNavigate: (page: Page, params?: Record<string, any>) => void;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className="font-semibold text-right text-white">{value}</span>
    </div>
);

export const BookingConfirmedPage: React.FC<BookingConfirmedPageProps> = ({ details, experience, onNavigate }) => {
    const { venue, date, tableOption, event, numberOfGuests, promoter, totalPrice, bookingId, guestDetails, experience: bookedExperience } = details;
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const currentExperience = experience || bookedExperience;

    const qrCodeUrl = bookingId 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingId)}&bgcolor=111827&color=ffffff&qzone=1`
      : '';

    // Date and time logic
    let arrivalDate: Date | null = null;
    let departureDate: Date | null = null;
    let startTime: string | null = null;

    if (currentExperience && currentExperience.category === 'Stays' && date) {
        arrivalDate = new Date(date + 'T00:00:00');
        const durationMatch = currentExperience.duration.match(/(\d+)\s*Night/);
        if (durationMatch) {
            const nights = parseInt(durationMatch[1], 10);
            departureDate = new Date(arrivalDate);
            departureDate.setDate(arrivalDate.getDate() + nights);
        }
    } else if (event) {
        startTime = "10:00 PM"; // Mock start time
    } else if (currentExperience) {
        startTime = "TBD"; // Placeholder for other experiences
    }

    const title = event ? event.title : (currentExperience ? currentExperience.title : venue?.name || 'Booking');

    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start md:justify-center p-4 md:p-8 pt-8 pb-24 animate-fade-in text-white text-center">
            <div className="w-full max-w-lg">
                <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-gray-400 mb-8">Your spot for <span className="font-semibold text-white">{title}</span> is secured.</p>
                
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-left space-y-4">
                    {qrCodeUrl && (
                        <div className="bg-[#1a1a1a] p-4 rounded-lg flex flex-col items-center justify-center mb-4 border border-gray-700">
                            <img src={qrCodeUrl} alt="Booking QR Code" className="w-48 h-48 rounded-md" />
                            <p className="text-center text-xs text-gray-500 mt-2">Show this QR code at the entrance.</p>
                        </div>
                    )}

                    {venue && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Venue:</span>
                            <span className="font-bold">{venue.name}</span>
                        </div>
                    )}
                    
                    <div className="border-t border-gray-700 my-4"></div>

                    <div className="flex justify-between text-lg">
                        <span className="text-gray-300 font-semibold">Total Paid:</span>
                        <span className="font-bold text-amber-400">${totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>

                    {/* Collapsible Details Section */}
                    <div className="border-t border-gray-700 pt-4">
                        <button onClick={() => setIsDetailsVisible(!isDetailsVisible)} className="w-full flex justify-between items-center text-left">
                            <span className="font-semibold text-white">View Details</span>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isDetailsVisible ? 'rotate-180' : ''}`} />
                        </button>
                        {isDetailsVisible && (
                            <div className="mt-4 space-y-2 animate-fade-in">
                                {arrivalDate && <DetailRow label="Arrival Date" value={arrivalDate.toLocaleDateString()} />}
                                {departureDate && <DetailRow label="Departure Date" value={departureDate.toLocaleDateString()} />}
                                {!arrivalDate && <DetailRow label="Date" value={new Date(date + 'T00:00:00').toLocaleDateString()} />}
                                {startTime && <DetailRow label="Start Time" value={startTime} />}
                                <div className="border-t border-gray-800 my-2"></div>
                                {guestDetails && (
                                    <>
                                        <DetailRow label="Booked For" value={guestDetails.name} />
                                        <DetailRow label="Email" value={guestDetails.email} />
                                        {guestDetails.phone && <DetailRow label="Phone" value={guestDetails.phone} />}
                                    </>
                                )}
                                <DetailRow label="Guests" value={String(numberOfGuests)} />
                                {tableOption && <DetailRow label="Table" value={tableOption.name} />}
                                {promoter && <DetailRow label="Your Wingman" value={promoter.name} />}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => onNavigate('checkout', { initialTab: 'purchased' })}
                        className="w-full sm:w-auto bg-gray-800 text-white font-bold py-3 px-6 rounded-lg"
                    >
                        View All Bookings
                    </button>
                    <button 
                        onClick={() => onNavigate('startBookingChat', { details })}
                        disabled={!promoter && !event}
                        className="w-full sm:w-auto flex-1 bg-amber-400 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <ChatIcon className="w-5 h-5" />
                        Chat with your Wingman
                    </button>
                </div>
            </div>
        </div>
    );
};