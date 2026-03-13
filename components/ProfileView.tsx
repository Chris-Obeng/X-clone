"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfileAction } from "@/actions/user.actions";
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "./EditProfileModal";
import { TweetSkeleton } from "./TweetSkeleton";
import Tweets from "./Tweets";
import { Suspense } from "react";

interface ProfileViewProps {
  clerkId: string;
  isOwnProfile: boolean;
  initialData: any;
}

export default function ProfileView({ clerkId, isOwnProfile, initialData }: ProfileViewProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile", clerkId],
    queryFn: () => getUserProfileAction(clerkId),
    initialData,
  });

  if (isLoading && !user) return <TweetSkeleton />;
  if (!user) return <div>User not found</div>;

  return (
    <div className="flex flex-col min-h-screen border-x border-[#2f3336]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-6 px-4 py-1 bg-black/70 backdrop-blur-md">
        <Link 
          href="/home" 
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <span className="text-[13px] text-[#71767b]">{user._count.posts} posts</span>
        </div>
      </div>

      {/* Hero / Cover */}
      <div className="h-48 bg-[#333639] w-full relative">
        {user.bannerImage ? (
            <img src={user.bannerImage} alt="Banner" className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full bg-[#333639]" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 relative mb-4">
        {/* Avatar */}
        <div className="absolute -top-16 left-4 border-4 border-black rounded-full overflow-hidden w-32 h-32 bg-black">
          <img 
            src={user.profileImage || "/default-avatar.png"} 
            alt={user.name || "User"} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end pt-3">
          {isOwnProfile ? (
            <EditProfileModal user={user} />
          ) : (
            <Button className="rounded-full bg-white text-black hover:bg-white/90 font-bold h-9">
              Follow
            </Button>
          )}
        </div>

        {/* User Details */}
        <div className="mt-8">
          <h2 className="text-xl font-bold leading-tight">{user.name}</h2>
          <span className="text-[#71767b]">@{user.username}</span>
          
          {user.bio && (
            <p className="mt-3 text-[15px] text-[#e7e9ea] whitespace-pre-wrap">
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[#71767b] text-[15px]">
            <div className="flex items-center gap-1">
              <Calendar size={18} />
              <span>Joined {format(new Date(user.createdAt), "MMMM yyyy")}</span>
            </div>
          </div>

          <div className="flex gap-5 mt-3 text-[15px]">
            <div className="flex gap-1 hover:border-b border-white cursor-pointer transition-all">
              <span className="font-bold text-white">0</span>
              <span className="text-[#71767b]">Following</span>
            </div>
            <div className="flex gap-1 hover:border-b border-white cursor-pointer transition-all">
              <span className="font-bold text-white">0</span>
              <span className="text-[#71767b]">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2f3336]">
        <div className="flex-1 flex justify-center hover:bg-white/10 transition-colors cursor-pointer relative group py-4">
            <span className="font-bold text-white">Posts</span>
            <div className="absolute bottom-0 h-1 w-14 bg-[#1d9bf0] rounded-full"></div>
        </div>
        <div className="flex-1 flex justify-center hover:bg-white/10 transition-colors cursor-pointer py-4 text-[#71767b] font-medium">
            <span>Replies</span>
        </div>
        <div className="flex-1 flex justify-center hover:bg-white/10 transition-colors cursor-pointer py-4 text-[#71767b] font-medium">
            <span>Highlights</span>
        </div>
        <div className="flex-1 flex justify-center hover:bg-white/10 transition-colors cursor-pointer py-4 text-[#71767b] font-medium">
            <span>Media</span>
        </div>
        <div className="flex-1 flex justify-center hover:bg-white/10 transition-colors cursor-pointer py-4 text-[#71767b] font-medium">
            <span>Likes</span>
        </div>
      </div>

      {/* User's Tweets */}
      <Suspense fallback={<TweetSkeleton />}>
        <Tweets userId={clerkId} />
      </Suspense>
    </div>
  );
}
