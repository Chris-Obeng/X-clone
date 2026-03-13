"use client";

import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Grok } from "@lobehub/icons";
import {
  Home,
  UserPlus,
  User,
  CircleEllipsis,
  Ellipsis,
  Search,
  Mail,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, Show, UserButton } from "@clerk/nextjs";
import { usePostDialog } from "@/hooks/use-post-dialog";

type IconComponent = React.ComponentType<{ className?: string }>;

const fa = (icon: IconDefinition): IconComponent => {
  const FaIcon = ({ className }: { className?: string }) => (
    <FontAwesomeIcon icon={icon} className={className} />
  );
  FaIcon.displayName = "FaIcon";
  return FaIcon;
};

const sidebarLinks = [
  {
    name: "Home",
    icon: Home,
    href: "/home",
  },
  {
    name: "Explore",
    icon: Search,
    href: "/explore",
  },
  {
    name: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    name: "Follow",
    icon: UserPlus,
    href: "/follow",
  },
  {
    name: "Chat",
    icon: Mail,
    href: "/chat",
  },
  {
    name: "Grok",
    icon: Grok,
    href: "/grok",
  },
  {
    name: "Premium",
    icon: fa(faXTwitter),
    href: "/premium",
  },
  {
    name: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    name: "More",
    icon: CircleEllipsis,
    href: "/more",
  },
];

const LeftSideBar = () => {
  const { onOpen } = usePostDialog();
  const { user, isLoaded } = useUser();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[19.25rem] bg-black text-white">
      <div className="flex h-full flex-col items-center pt-3">
        <Link
          href="/home"
          className="flex w-full pl-12 max-w-[16rem] justify-start gap-x-4 cursor-pointer"
        >
          <FontAwesomeIcon
            icon={faXTwitter}
            className="text-[1.5rem] text-white"
          />
        </Link>

        <div className="pt-4 pb-2 flex flex-col justify-start pr-3.5 cursor-pointer">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex max-w-[16rem] items-center gap-x-4 mb-[2] py-2 px-4 cursor-pointer w-fit hover:bg-gray-200/12 rounded-full transition-colors duration-200"
            >
              <link.icon className="text-[1.3rem] text-white" />
              <span className="text-lg font-stretch-condensed font-medium">
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        <Button 
          onClick={onOpen}
          className="text-center cursor-pointer bg-white text-black font-bold p-6 ml-4 w-52 rounded-full"
        >
          Post
        </Button>

        <Link 
          href="/profile"
          className="flex hover:bg-gray-200/14 rounded-full mt-auto mb-4 ml-13 p-3 gap-x-2 cursor-pointer w-60 items-center"
        >
          <div className="rounded-full size-10 font-mono cursor-pointer flex items-center text-lg justify-center overflow-hidden shrink-0">
            {isLoaded && user ? (
              <img src={user.imageUrl} alt={user.fullName || ""} className="w-full h-full object-cover" />
            ) : (
              <User size={24} />
            )}
          </div>
          <div className="flex flex-1 justify-between min-w-0">
            <div className="flex flex-col justify-start overflow-hidden">
              <p className="font-semibold text-sm truncate">{user?.fullName || user?.username || "User"}</p>
              <p className="text-sm font-light text-gray-200/30 truncate">@{user?.username || user?.firstName?.toLowerCase() || "user"}</p>
            </div>

            <div className="flex items-center">
              <Ellipsis size={18} className="cursor-pointer text-gray-500" />
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default LeftSideBar;
