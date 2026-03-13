"use client";

import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPostByIdAction } from '@/actions/post.actions';
import { format } from 'date-fns';
import { Loader2, MessageCircle, Repeat2, Heart, Share, Bookmark, BarChart2 } from 'lucide-react';
import CreateReply from '@/components/CreateReply';
import MediaGrid from '@/components/MediaGrid';

export default function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const unwrappedParams = React.use(params);
  const postId = unwrappedParams.postId;

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => await getPostByIdAction(postId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-[#1d9bf0]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center px-4 py-3 sticky top-0 bg-black/80 backdrop-blur-md z-50 border-b border-[#2f3336]">
        <Link href="/home" className="hover:bg-white/10 p-2 rounded-full transition-colors mr-4">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5 text-white">
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
          </svg>
        </Link>
        <h2 className="text-xl font-bold text-white">Post</h2>
      </div>

      {/* Tweet Details */}
      {post ? (
        <div className="p-4 border-b border-[#2f3336]">
          <div className="flex items-center mb-4">
            <img 
              src={post.user?.profileImage || "/default-avatar.png"} 
              alt={post.user?.name || ""} 
              className='w-11 h-11 rounded-full object-cover mr-3' 
            />
            <div className="flex flex-col">
              <span className='font-bold text-[#e7e9ea] hover:underline cursor-pointer leading-5'>{post.user?.name}</span>
              <span className='text-[#71767b] text-[15px]'>@{post.user?.username}</span>
            </div>
          </div>

          <div className="text-[#e7e9ea] text-[17px] leading-normal mb-4 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Media Grid */}
          <MediaGrid media={post.media as any[]} />

          <div className="text-[#71767b] text-[15px] border-b border-[#2f3336] pb-4 mb-4">
            <span className="hover:underline cursor-pointer">
                {post.createdAt ? format(new Date(post.createdAt), 'h:mm a') : ''}
            </span>
            <span className="mx-1">·</span>
            <span className="hover:underline cursor-pointer">
                {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : ''}
            </span>
            <span className="mx-1">·</span>
            <span className="text-white font-bold mx-1">0</span> Views
          </div>

          {/* Interaction Icons (X-style single row with borders) */}
          <div className="flex justify-between items-center text-[#71767b] py-1 border-b border-[#2f3336]">
            <div className="flex items-center group cursor-pointer p-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors">
              <MessageCircle size={20} />
            </div>
            <div className="flex items-center group cursor-pointer p-2 rounded-full hover:bg-[#00ba7c]/10 hover:text-[#00ba7c] transition-colors">
              <Repeat2 size={22} />
            </div>
            <div className="flex items-center group cursor-pointer p-2 rounded-full hover:bg-[#f91880]/10 hover:text-[#f91880] transition-colors">
              <Heart size={20} />
            </div>
            <div className="flex items-center group cursor-pointer p-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors">
              <Bookmark size={20} />
            </div>
            <div className="flex items-center group cursor-pointer p-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors">
              <Share size={20} />
            </div>
          </div>

          <CreateReply postId={postId} />

          {/* Replies Section could go here */}
          <div className="mt-4">
             {post.replies?.length === 0 ? (
                 <div className="p-8 text-center text-[#71767b]">
                     Be the first to reply!
                 </div>
             ) : (
                 <div className="flex flex-col">
                     {post.replies?.map((reply: any) => (
                         <div key={reply.id} className="flex p-4 border-b border-[#2f3336]">
                             <img 
                                src={reply.user?.profileImage || "/default-avatar.png"} 
                                className="w-10 h-10 rounded-full mr-3" 
                                alt="" 
                             />
                             <div className="flex flex-col flex-1">
                                 <div className="flex items-center gap-1">
                                     <span className="font-bold text-[#e7e9ea]">{reply.user?.name}</span>
                                     <span className="text-[#71767b]">@{reply.user?.username}</span>
                                 </div>
                                 <div className="text-[#e7e9ea]">
                                     {reply.content}
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-[#71767b] mb-4">Post not found or has been deleted.</p>
          <Link href="/home" className="bg-white text-black font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
            Go back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
