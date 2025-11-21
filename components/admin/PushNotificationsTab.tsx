import React, { useState } from 'react';
import { Event, Venue, User, AppNotification } from '../../types';

interface PushNotificationsTabProps {
    events: Event[];
    venues: Venue[];
    users: User[];
    onSend: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
}

export const PushNotificationsTab: React.FC<PushNotificationsTabProps> = ({ events, venues, onSend }) => {
    const [type, setType] = useState<'event' | 'venue' | 'guestlist' | 'general'>('general');
    const [itemId, setItemId] = useState<string>('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            alert('Message cannot be empty.');
            return;
        }
        if ((type === 'event' || type === 'venue') && !itemId) {
            alert(`Please select an ${type}.`);
            return;
        }

        const notification: Omit<AppNotification, 'id' | 'time' | 'read'> = {
            text: message,
            isPush: true,
        };

        if (type === 'event') {
            const event = events.find(e => String(e.id) === itemId);
            if (event) {
                notification.itemType = 'event';
                notification.itemId = event.id;
                notification.link = { page: 'eventTimeline' };
            }
        } else if (type === 'venue') {
            const venue = venues.find(v => String(v.id) === itemId);
            if (venue) {
                notification.itemType = 'venue';
                notification.itemId = venue.id;
                notification.link = { page: 'venueDetails', params: { venueId: venue.id } };
            }
        } else if (type === 'guestlist') {
            notification.link = { page: 'bookATable' };
        }
        
        onSend(notification);
        alert('Notification sent!');
        // Reset form
        setType('general');
        setItemId('');
        setMessage('');
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Send a Push Notification</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Notification Type</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3">
                        <option value="general">General Announcement</option>
                        <option value="event">Event Promotion</option>
                        <option value="venue">Venue Highlight</option>
                        <option value="guestlist">Guestlist Announcement</option>
                    </select>
                </div>

                {(type === 'event' || type === 'venue') && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select {type}</label>
                        <select value={itemId} onChange={e => setItemId(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3">
                            <option value="">-- Select an item --</option>
                            {type === 'event' && events.map(e => <option key={e.id} value={String(e.id)}>{e.title}</option>)}
                            {type === 'venue' && venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Notification Message</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 resize-none" required />
                </div>
                
                <button type="submit" className="w-full bg-amber-400 text-black font-bold py-3 px-4 rounded-lg">Send Notification</button>
            </form>
        </div>
    );
};
