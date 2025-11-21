import React from 'react';
import { AccessGroup, GroupPost, User, UserRole, Promoter } from '../types';
import { promoters, users } from '../data/mockData';
import { GroupPostCard } from './GroupPostCard';
import { SendIcon } from './icons/SendIcon';

interface AccessGroupFeedPageProps {
    groupId: number;
    currentUser: User;
    allPosts: GroupPost[];
    allGroups: AccessGroup[];
    onToggleLike: (postId: number) => void;
}

const allAuthors = [...promoters, ...users.filter(u => u.role === UserRole.ADMIN)];

export const AccessGroupFeedPage: React.FC<AccessGroupFeedPageProps> = ({ groupId, currentUser, allPosts, allGroups, onToggleLike }) => {
    
    const group = allGroups.find(g => g.id === groupId);
    const posts = allPosts.filter(p => p.groupId === groupId).sort((a, b) => b.id - a.id);
    
    if (!group) {
        return <div className="p-8 text-center text-red-500">Group not found.</div>;
    }

    const canPost = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROMOTER;

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] animate-fade-in">
            <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                <div className="space-y-6">
                    {posts.map(post => {
                        const author = allAuthors.find(a => a.id === post.authorId);
                        return author ? (
                            <GroupPostCard 
                                key={post.id} 
                                post={post} 
                                author={author} 
                                currentUser={currentUser} 
                                onToggleLike={onToggleLike} 
                            />
                        ) : null;
                    })}
                </div>
            </div>

            {canPost && (
                 <div className="p-4 md:p-6 bg-black border-t border-gray-800">
                    <form className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Share an update..."
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:ring-amber-400 focus:border-amber-400"
                            aria-label="New post input"
                        />
                        <button
                            type="submit"
                            className="w-12 h-12 flex-shrink-0 bg-amber-400 rounded-full flex items-center justify-center text-black"
                            aria-label="Send message"
                        >
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};