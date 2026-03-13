"use client";
import { useState } from "react";

const HomeHeader = () => {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");

  return (
    <div className="sticky top-0 z-20 -mx-4 w-[calc(100%+2rem)] border-b border-gray-200/20 bg-black/70 backdrop-blur-md">
      <div className="flex w-full text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("forYou")}
          aria-pressed={activeTab === "forYou"}
          className="relative flex flex-1 items-center justify-center py-3 text-gray-300 hover:bg-gray-200/10"
        >
          <span className={activeTab === "forYou" ? "text-white" : ""}>
            For you
          </span>
          {activeTab === "forYou" && (
            <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-sky-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("following")}
          aria-pressed={activeTab === "following"}
          className="relative flex flex-1 items-center justify-center py-3 text-gray-300 hover:bg-gray-200/10"
        >
          <span className={activeTab === "following" ? "text-white" : ""}>
            Following
          </span>
          {activeTab === "following" && (
            <span className="absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-sky-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;
