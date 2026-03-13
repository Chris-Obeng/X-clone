import React, { Suspense } from "react";
import Tweets from "@/components/Tweets";
import { TweetSkeleton } from "@/components/TweetSkeleton";
import SearchBar from "@/components/SearchBar";
import { Settings, Search } from "lucide-react";

interface ExplorePageProps {
  searchParams: Promise<{ q?: string }>;
}

const ExplorePage = async ({ searchParams }: ExplorePageProps) => {
  const { q } = await searchParams;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Header for Mobile/Explore Only */}
      <div className="sticky top-0 z-20 bg-black/70 backdrop-blur-md px-4 py-2 flex items-center gap-4">
        <div className="flex-1">
          <Suspense fallback={<div className="h-10 w-full bg-gray-200/5 rounded-full animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2f3336] mt-1 overflow-x-auto scrollbar-hide">
        {["For you", "Trending", "News", "Sports", "Entertainment"].map((tab, i) => (
          <div 
            key={tab} 
            className="flex-1 min-w-fit px-4 flex justify-center hover:bg-white/10 transition-colors cursor-pointer relative py-4 group"
          >
            <span className={`font-bold ${i === 0 && !q ? "text-white" : "text-[#71767b]"}`}>{tab}</span>
            {i === 0 && !q && <div className="absolute bottom-0 h-1 w-14 bg-[#1d9bf0] rounded-full"></div>}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {q ? (
          <div className="flex flex-col">
            <div className="p-4 border-b border-[#2f3336]">
              <h2 className="text-xl font-bold">Search results for "{q}"</h2>
            </div>
            <Suspense fallback={<TweetSkeleton />}>
              <Tweets searchQuery={q} />
            </Suspense>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Trending Section Placeholder */}
            <div className="p-4 border-b border-[#2f3336] hover:bg-white/5 cursor-pointer transition-colors">
              <span className="text-[13px] text-[#71767b]">Trending in Technology</span>
              <h3 className="font-bold text-[15px]">#NextJS</h3>
              <span className="text-[13px] text-[#71767b]">1,234 posts</span>
            </div>
            <div className="p-4 border-b border-[#2f3336] hover:bg-white/5 cursor-pointer transition-colors">
              <span className="text-[13px] text-[#71767b]">Entertainment · Trending</span>
              <h3 className="font-bold text-[15px]">Oscar 2026</h3>
              <span className="text-[13px] text-[#71767b]">45.6K posts</span>
            </div>
            
            <div className="p-4 border-b border-[#2f3336]">
              <h2 className="text-xl font-bold">What's happening</h2>
            </div>
            
            <Suspense fallback={<TweetSkeleton />}>
              <Tweets />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
