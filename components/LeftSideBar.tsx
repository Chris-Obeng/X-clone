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
import { Show, UserButton } from "@clerk/nextjs";
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
    href: "/",
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
    href: "/Premium",
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

        <div className="flex hover:bg-gray-200/14 rounded-full mt-12 ml-13 p-2 gap-x-2 cursor-pointer w-60">
          <div className="rounded-full p-4.5 size-6 font-mono cursor-pointer flex items-center text-lg justify-center">
            <Show when={"signed-in"}>
              <UserButton
                appearance={{
                  elements: { avatarBox: { width: 40, height: 40 } },
                }} />
            </Show>
          </div>
          <div className="flex flex-1 justify-between ">
            <div className="flex flex-col justify-start ">
              <p className="font-semibold text-sm">Chris</p>
              <p className="text-sm font-light text-gray-200/30">@Obengch</p>
            </div>

            <div className="flex items-center">
              <Ellipsis className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
