import React, { useState, useMemo } from 'react';
import { AccessGroup, User, UserRole, Page, UserAccessLevel } from '../types';
import { FeaturedGroupCard } from './FeaturedGroupCard';
import { BellIcon } from './icons/BellIcon';
import { LeaveIcon } from './icons/LeaveIcon';
import { PlusIcon } from './icons/PlusIcon';

interface AccessGroupsPageProps {
    currentUser: User;
    allGroups: AccessGroup[];
    onViewGroup: (groupId: number) => void;
    onJoinGroup: (groupId: number) => void;
    onLeaveGroup: (group: AccessGroup) => void;
    groupNotificationSettings: Record<number, boolean>;
    onToggleGroupNotification: (groupId: number) => void;
    onNavigate: (page: Page) => void;
}

type FilterOption = 'all' | 'popular' | 'newest';

const GroupCard: React.FC<{ group: AccessGroup, onSelect: () => void, isMyGroup: boolean, isNotifOn?: boolean, onToggleNotif?: () => void, onLeave?: () => void }> = ({ group, onSelect, isMyGroup, isNotifOn, onToggleNotif, onLeave }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden text-left w-full transition-colors hover:bg-gray-800 flex flex-col">
        <button onClick={onSelect} className="w-full text-left flex-grow">
          <img src={group.coverImage} alt={group.name} className="w-full h-32 object-cover" />
          <div className="p-4">
              <h3 className="font-bold text-white text-lg">{group.name}</h3>
              {group.status === 'pending' && <p className="text-xs font-semibold text-yellow-500">(Pending Approval)</p>}
              <p className="text-gray-400 text-sm mt-1 line-clamp-2 h-10">{group.description}</p>
          </div>
        </button>
        <div className="px-4 pb-3 flex justify-between items-center mt-auto">
            <p className="text-xs text-gray-500">{group.memberIds.length} members</p>
            {isMyGroup && onToggleNotif && (
                <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); onLeave?.(); }} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Leave group">
                        <LeaveIcon className="w-5 h-5 text-gray-500 hover:text-red-500" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onToggleNotif(); }} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label={isNotifOn ? 'Disable notifications' : 'Enable notifications'}>
                        <BellIcon className={`w-5 h-5 ${isNotifOn ? 'text-yellow-400' : 'text-gray-500'}`} isFilled={isNotifOn} />
                    </button>
                </div>
            )}
        </div>
    </div>
);

export const AccessGroupsPage: React.FC<AccessGroupsPageProps> = ({ currentUser, allGroups, onViewGroup, onJoinGroup, onLeaveGroup, groupNotificationSettings, onToggleGroupNotification, onNavigate }) => {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterOption>('all');
    
    const myGroupIds = currentUser.accessGroupIds || [];
    const myGroups = allGroups.filter(g => myGroupIds.includes(g.id) || (g.creatorId === currentUser.id && g.status === 'pending'));
    
    const approvedGroups = allGroups.filter(g => g.status === 'approved');
    const featuredGroups = approvedGroups.filter(g => g.isFeatured && !myGroupIds.includes(g.id));

    const discoverGroups = useMemo(() => {
        let groups = approvedGroups.filter(g => !myGroupIds.includes(g.id) && !g.isFeatured);
        
        if (searchTerm) {
          groups = groups.filter(g => 
            g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            g.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (filter === 'popular') {
          groups.sort((a, b) => b.memberIds.length - a.memberIds.length);
        } else if (filter === 'newest') {
          groups.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        }

        return groups;
    }, [approvedGroups, myGroupIds, searchTerm, filter]);

    const canCreateGroup = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROMOTER;
    
    const isApprovedUser = currentUser.accessLevel === UserAccessLevel.ACCESS_MALE || currentUser.accessLevel === UserAccessLevel.APPROVED_GIRL;
    const canJoinGroups = isApprovedUser || currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROMOTER;
    
    return (
        <div className="p-4 md:p-8 animate-fade-in text-white space-y-12">
             <div>
                <h2 className="text-2xl font-bold mb-4">Featured Groups</h2>
                <div className="overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
                    <div className="flex space-x-4">
                        {featuredGroups.length > 0 ? featuredGroups.map(group => (
                            <FeaturedGroupCard key={group.id} group={group} onJoin={onJoinGroup} canJoin={canJoinGroups} />
                        )) : <p className="text-gray-500 text-sm">No featured groups to show right now.</p>}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">My Groups</h2>
                    {canCreateGroup && (
                        <button onClick={() => onNavigate('createGroup')} className="flex items-center gap-2 bg-white text-blue-600 font-bold py-2 px-4 rounded-lg text-sm transition-transform hover:scale-105">
                            <PlusIcon className="w-5 h-5" />
                            Create Group
                        </button>
                    )}
                </div>
                {myGroups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myGroups.map(group => (
                             <GroupCard 
                                key={group.id} 
                                group={group} 
                                onSelect={() => onViewGroup(group.id)}
                                isMyGroup={true}
                                isNotifOn={!!groupNotificationSettings[group.id]}
                                onToggleNotif={() => onToggleGroupNotification(group.id)}
                                onLeave={() => onLeaveGroup(group)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">You haven't joined any groups yet.</p>
                )}
            </div>
            
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Discover Groups</h2>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <input
                            type="search"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:flex-grow bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:ring-white focus:border-white"
                        />
                        <div className="flex-shrink-0 flex gap-2">
                             <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-white text-blue-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>All</button>
                             <button onClick={() => setFilter('popular')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'popular' ? 'bg-white text-blue-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>Popular</button>
                             <button onClick={() => setFilter('newest')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'newest' ? 'bg-white text-blue-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>Newest</button>
                        </div>
                    </div>
                </div>
                 {discoverGroups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {discoverGroups.map(group => (
                            <div key={group.id} className="relative group">
                                <GroupCard 
                                    group={group} 
                                    onSelect={() => onViewGroup(group.id)}
                                    isMyGroup={false}
                                />
                                {canJoinGroups && (
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onJoinGroup(group.id)}
                                            className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg text-sm transition-transform hover:scale-105"
                                        >
                                            Join
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No matching groups found.</p>
                )}
            </div>
        </div>
    );
};