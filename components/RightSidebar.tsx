import React from "react";
import SubscriptionCard from "./SubscriptionCard";
import WhoToFollowCard from "./WhoToFollowCard";
import WhatsHappening from "./WhatsHappening";
import SearchBar from "./SearchBar";


const RightSidebar = () => {
  return (
    <aside className="fixed top-0 right-0 h-screen w-[26.5rem] bg-black/95 text-white border-l border-sky-500/10 backdrop-blur-sm">
      <div className="flex h-full flex-col px-6 pt-0 pb-6 overflow-y-auto scrollbar-hide">
        {/* search bar */}
        <div className="sticky top-0 z-10 -mx-6 bg-black/95 px-6 pb-3 pt-3.5 backdrop-blur-md">
          <SearchBar />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {/* subscribtion card */}
          <SubscriptionCard />

          {/* who to follow */}
          <WhoToFollowCard />

          {/* what's happening? */}
          <WhatsHappening />
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
