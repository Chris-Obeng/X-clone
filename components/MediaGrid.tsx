"use client";

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface MediaItem {
  id?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
}

interface MediaGridProps {
  media: MediaItem[];
  onRemove?: (index: number) => void;
  editable?: boolean;
}

const MediaGrid = ({ media, onRemove, editable = false }: MediaGridProps) => {
  if (!media || media.length === 0) return null;

  const count = media.length;

  const renderItem = (item: MediaItem, index: number, containerClass: string) => {
    return (
      <div key={item.id || index} className={`relative group overflow-hidden bg-[#16181c] ${containerClass}`}>
        {item.type === "VIDEO" ? (
          <video 
            src={item.url} 
            className="w-full h-full object-cover" 
            controls={!editable} 
            muted 
            onClick={(e) => e.stopPropagation()} 
          />
        ) : (
          <img 
            src={item.url} 
            alt="Post media" 
            className="w-full h-full object-cover" 
          />
        )}
        
        {editable && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(index);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all z-10"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  };

  if (count === 1) {
    return (
      <div className="mt-3 rounded-2xl overflow-hidden border border-[#2f3336] max-h-[512px] flex justify-center bg-black">
        {media[0].type === "VIDEO" ? (
          <video 
            src={media[0].url} 
            className="max-w-full max-h-[512px] h-auto object-contain" 
            controls={!editable} 
            muted 
            onClick={(e) => e.stopPropagation()} 
          />
        ) : (
          <img 
            src={media[0].url} 
            alt="Post media" 
            className="max-w-full max-h-[512px] h-auto object-contain" 
          />
        )}
        {editable && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(0);
            }}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all z-10"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  // Grid for 2, 3, or 4 items
  return (
    <div className={`mt-3 grid gap-1 rounded-2xl overflow-hidden border border-[#2f3336] aspect-video ${
      count === 2 ? "grid-cols-2" : 
      count === 3 ? "grid-cols-2 grid-rows-2" : 
      "grid-cols-2 grid-rows-2"
    }`}>
      {count === 2 && media.map((item, i) => renderItem(item, i, "h-full"))}
      
      {count === 3 && (
        <>
          {renderItem(media[0], 0, "row-span-2 h-full")}
          <div className="grid grid-rows-2 gap-1 h-full">
            {renderItem(media[1], 1, "h-full")}
            {renderItem(media[2], 2, "h-full")}
          </div>
        </>
      )}
      
      {count === 4 && media.map((item, i) => renderItem(item, i, "h-full"))}
    </div>
  );
};

export default MediaGrid;
