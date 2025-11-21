import React, { useState } from 'react';
import { Booking, Page } from '../types';
import { bookingHistory } from '../data/mockData';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface BookingsPageProps {
  onNavigate: (page: Page) => void;
}

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const renderBookingStatus = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed':
                return <span className="text-blue-400 font-semibold">{status}</span>;
            case 'Completed':
                return <span className="text-green-400 font-semibold">{status}</span>;
            case 'Cancelled':
                return <span className="text-red-400 font-semibold">{status}</span>;
            default:
                return <span className="text-gray-400 font-semibold">{status}</span>;
        }
    };

    return (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-white text-lg">{booking.venueName}</p>
                    <p className="text-sm text-gray-400">with {booking.promoterName}</p>
                </div>
                {renderBookingStatus(booking.status)}
            </div>
            <div className="border-t border-gray-800 mt-3 pt-3 flex justify-between items-center text-sm">
                <p className="text-gray-400">{booking.date}</p>
                <p className="text-gray-300">Table: <span className="font-semibold text-white">{booking.tableTier}</span></p>
            </div>
        </div>
    );
};

export const BookingsPage: React.FC<BookingsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingBookings = bookingHistory.filter(b => b.status === 'Confirmed');
  const pastBookings = bookingHistory.filter(b => b.status !== 'Confirmed');

  return (
    <div className="p-4 md:p-8 animate-fade-in text-white">
      <button onClick={() => onNavigate('userProfile')} className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 text-sm font-semibold">
        <ChevronLeftIcon className="w-5 h-5"/>
        Back to Profile
      </button>

      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'upcoming' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'past' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400'}`}
        >
          Past
        </button>
      </div>

      <div>
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <p className="text-gray-400 text-center py-8">You have no upcoming bookings.</p>
            )}
          </div>
        )}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <p className="text-gray-400 text-center py-8">You have no past bookings.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};