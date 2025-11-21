
import React, { useMemo, useState } from 'react';
import { Experience, User, Venue } from '../types';
import { experiences as allExperiences } from '../data/mockData';
import { ExperienceCard } from './ExperienceCard';
import { ExperienceDetailModal } from './modals/ExperienceDetailModal';
import { CloseIcon } from './icons/CloseIcon';

interface ExclusiveExperiencesPageProps {
  currentUser: User;
  onBookExperience: (experience: Experience) => void;
  venueFilter: Venue | null;
  onClearFilter: () => void;
}

export const ExclusiveExperiencesPage: React.FC<ExclusiveExperiencesPageProps> = ({ currentUser, onBookExperience, venueFilter, onClearFilter }) => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const filteredExperiences = useMemo(() => {
    if (venueFilter) {
      return allExperiences.filter(exp => exp.venueId === venueFilter.id);
    }
    return allExperiences;
  }, [venueFilter]);

  const handleViewDetails = (experience: Experience) => {
    setSelectedExperience(experience);
  };

  const handleCloseModal = () => {
    setSelectedExperience(null);
  };

  const handleBookFromModal = (experience: Experience) => {
    setSelectedExperience(null);
    onBookExperience(experience);
  };

  return (
    <>
      <div className="p-4 md:p-8 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Exclusive <span className="text-white">Experiences</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Discover curated luxury experiences, from private yacht cruises to exclusive villa stays.
          </p>
        </div>

        {venueFilter && (
          <div className="mb-8 p-4 bg-gray-900/50 border border-gray-800 rounded-lg flex items-center justify-between">
            <p className="text-white">
              Showing experiences for: <span className="font-bold text-amber-400">{venueFilter.name}</span>
            </p>
            <button onClick={onClearFilter} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
              <CloseIcon className="w-4 h-4" />
              Clear Filter
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map(experience => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              currentUser={currentUser}
              onViewDetails={handleViewDetails}
              onBook={onBookExperience}
            />
          ))}
        </div>
      </div>
      {selectedExperience && (
        <ExperienceDetailModal
          experience={selectedExperience}
          currentUser={currentUser}
          onClose={handleCloseModal}
          onBook={handleBookFromModal}
        />
      )}
    </>
  );
};