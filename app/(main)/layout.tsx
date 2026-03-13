import LeftSideBar from "@/components/LeftSideBar";
import RightSidebar from "@/components/RightSidebar";
import CreatePostDialog from "@/components/CreatePostDialog";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <LeftSideBar />

      <main className="min-h-screen ml-77 mr-106 text-white">
        <div className="min-h-screen w-full border-x border-gray-200/16 px-4">
          {children}
        </div>
      </main>
      <RightSidebar />
      <CreatePostDialog />
    </div>
  );
};

export default layout;
