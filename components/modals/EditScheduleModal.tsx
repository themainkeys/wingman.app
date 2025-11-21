
import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Venue } from '../../types';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchedule: { day: string; venueId: number }[];
  venues: Venue[];
  onSave: (newSchedule: { day: string; venueId: number }[]) => void;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ isOpen, onClose, currentSchedule, venues, onSave }) => {
  const [schedule, setSchedule] = useState<{ [key: string]: string }>(
    WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: '' }), {})
  );

  useEffect(() => {
    if (isOpen) {
      const initialSchedule: { [key: string]: string } = WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: '' }), {});
      currentSchedule.forEach(item => {
        initialSchedule[item.day] = item.venueId.toString();
      });
      setSchedule(initialSchedule);
    }
  }, [isOpen, currentSchedule]);

  const handleChange = (day: string, value: string) => {
    setSchedule(prev => ({ ...prev, [day]: value }));
  };

  const handleSave = () => {
    const newSchedule = Object.entries(schedule)
      .filter(([_, venueId]) => venueId !== '')
      .map(([day, venueId]) => ({
        day,
        venueId: parseInt(venueId as string, 10)
      }));
    onSave(newSchedule);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Weekly Schedule">
      <div className="space-y-4">
        {WEEKDAYS.map(day => (
          <div key={day} className="flex items-center gap-4">
            <label className="w-24 font-semibold text-gray-300">{day}</label>
            <div className="flex-grow">
                <Select 
                    value={schedule[day]} 
                    onChange={(e) => handleChange(day, e.target.value)}
                    className="py-2"
                >
                    <option value="">Off</option>
                    {venues.map(venue => (
                        <option key={venue.id} value={venue.id.toString()}>
                            {venue.name}
                        </option>
                    ))}
                </Select>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Schedule</Button>
      </div>
    </Modal>
  );
};
