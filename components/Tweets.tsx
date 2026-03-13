"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostsAction, getUserPostsAction, deletePostAction, searchPostsAction } from '@/actions/post.actions';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Share, Ellipsis, Trash2, Loader2 } from 'lucide-react';
import { Grok } from "@lobehub/icons";
import ReplyDialog from './ReplyDialog';
import MediaGrid from './MediaGrid';
import { useUser } from '@clerk/nextjs';

const Tweets = ({ userId, searchQuery }: { userId?: string, searchQuery?: string }) => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [replyPost, setReplyPost] = useState<any>(null);
    const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);

    const { data: posts, isLoading } = useQuery({
        queryKey: searchQuery ? ["posts", "search", searchQuery] : userId ? ["posts", userId] : ["posts"],
        queryFn: async () => {
            if (searchQuery) return await searchPostsAction(searchQuery);
            if (userId) return await getUserPostsAction(userId);
            return await getPostsAction();
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-[#1d9bf0]" />
            </div>
        );
    }

    const deleteMutation = useMutation({
        mutationFn: deletePostAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            setShowDeleteMenu(null);
        },
    });

    if (!posts || posts.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                No posts yet. Be the first to post!
            </div>
        );
    }

    return (
        <div className='flex flex-col'>
            {posts.map((post) => (
                <div key={post.id} className="relative border-b border-[#2f3336]">
                    <Link 
                        href={`/home/${post.id}`} 
                        className='flex flex-row p-4 hover:bg-white/5 transition-colors cursor-pointer'
                    >
                        {/* Profile avatar */}
                        <div className='mr-3 shrink-0 relative z-10'>
                            <Link 
                                href={`/profile/${post.user?.clerkId}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block"
                            >
                                <img 
                                    src={post.user?.profileImage || "/default-avatar.png"} 
                                    alt={post.user?.name || "User"} 
                                    className='w-10 h-10 rounded-full object-cover hover:brightness-90 transition-all' 
                                />
                            </Link>
                        </div>

                        {/* Content */}
                        <div className='flex flex-col flex-1 pb-1 min-w-0'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center text-[15px] whitespace-nowrap overflow-hidden text-ellipsis gap-1 relative z-10'>
                                    <Link 
                                        href={`/profile/${post.user?.clerkId}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1 min-w-0 overflow-hidden"
                                    >
                                        <span className='font-bold text-[#e7e9ea] hover:underline shrink-0 truncate'>{post.user?.name}</span>
                                        <span className='text-[#71767b] truncate'>@{post.user?.username}</span>
                                    </Link>
                                    <span className='text-[#71767b]'>·</span>
                                    <span className='text-[#71767b] hover:underline shrink-0'>
                                        {formatDistanceToNow(new Date(post.createdAt))}
                                    </span>
                                </div>
                                
                                <div className='flex items-center gap-2 relative'>
                                    <div className='text-[#71767b] hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] p-1.5 rounded-full transition-colors'>
                                        <Grok size={16} />
                                    </div>
                                    <div 
                                        className='text-[#71767b] hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] p-1.5 rounded-full transition-colors cursor-pointer group outline-none focus:outline-none'
                                        tabIndex={0}
                                        onBlur={(e) => {
                                            // Only close if focus is moving outside this container
                                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                                setShowDeleteMenu(null);
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowDeleteMenu(showDeleteMenu === post.id ? null : post.id);
                                        }}
                                    >
                                        <Ellipsis size={18} />
                                        
                                        {showDeleteMenu === post.id && user?.id === post.userId && (
                                            <div className='absolute right-0 top-0 mt-8 w-40 bg-black border border-[#2f3336] shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-xl overflow-hidden z-50'>
                                                <button 
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (confirm("Are you sure you want to delete this post?")) {
                                                            await deleteMutation.mutateAsync(post.id);
                                                        }
                                                    }}
                                                    className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-[#f4212e] font-bold transition-colors text-sm cursor-pointer'
                                                >
                                                    {deleteMutation.isPending ? <Loader2 className='animate-spin' size={16} /> : <Trash2 size={16} />}
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#e7e9ea] mt-0.5 text-[15px] leading-normal wrap-break-word whitespace-pre-wrap'>
                                {post.content}
                            </div>

                            {/* Media Grid */}
                            <MediaGrid media={post.media as any[]} />
                            
                            {/* Icons Row */}
                            <div className='flex justify-between mt-3 text-[#71767b] max-w-md w-full'>
                                {/* Replies */}
                                <div 
                                    className='flex items-center group cursor-pointer' 
                                    onClick={(e) => { 
                                        e.preventDefault();
                                        e.stopPropagation(); 
                                        setReplyPost(post); 
                                    }}
                                >
                                    <div className='p-2 -ml-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors'>
                                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-[18.75px] h-[18.75px]">
                                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
                                        </svg>
                                    </div>
                                    <span className='text-[13px] group-hover:text-[#1d9bf0] px-1'>{post.replies?.length || 0}</span>
                                </div>
                                
                                {/* Retweet */}
                                <div className='flex items-center group cursor-pointer' onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <div className='p-2 rounded-full group-hover:bg-[#00ba7c]/10 group-hover:text-[#00ba7c] transition-colors'>
                                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-[18.75px] h-[18.75px]">
                                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
                                        </svg>
                                    </div>
                                    <span className='text-[13px] group-hover:text-[#00ba7c] px-1'>0</span>
                                </div>

                                {/* Likes */}
                                <div className='flex items-center group cursor-pointer' onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <div className='p-2 rounded-full group-hover:bg-[#f91880]/10 group-hover:text-[#f91880] transition-colors'>
                                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-[18.75px] h-[18.75px]">
                                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                                        </svg>
                                    </div>
                                    <span className='text-[13px] group-hover:text-[#f91880] px-1'>0</span>
                                </div>

                                {/* Views */}
                                <div className='flex items-center group cursor-pointer' onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <div className='p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors'>
                                        <BarChart2 size={18} />
                                    </div>
                                    <span className='text-[13px] group-hover:text-[#1d9bf0] px-1'>0</span>
                                </div>

                                {/* Bookmark & Share */}
                                <div className='flex items-center gap-1' onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <div className='p-2 rounded-full group hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors cursor-pointer'>
                                        <Bookmark size={18} />
                                    </div>
                                    <div className='p-2 rounded-full group hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors cursor-pointer'>
                                        <Share size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            {replyPost && (
                <ReplyDialog 
                    isOpen={!!replyPost} 
                    onClose={() => setReplyPost(null)} 
                    post={replyPost} 
                />
            )}
        </div>
    );
};

export default Tweets;
;