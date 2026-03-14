import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

type FollowAccoutCardProps = {
  name: string;
  username: string;
  image: string;
};

const FollowAccoutCard = ({ name, username, image }: FollowAccoutCardProps) => {
  return (
    <>
      <div className="flex items-center p-3 hover:bg-gray-100/4 w-full cursor-pointer px-3">
        <div className="mr-1.5">
          <Image
            src={image}
            alt="profile_icon"
            width={48}
            height={48}
            className="rounded-full object-contain"
          />
        </div>

        <div className="flex  items-center justify-between w-full">
          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-1 text-nowrap">
              <h3 className="font-bold">{name}</h3>
              <Image
                src="/Twitter_Verified_Badge.png"
                alt="verified"
                width={16}
                height={16}
              />
            </div>
            <div>
              <p className="text-gray-200/80 text-sm">@{username}</p>
            </div>
          </div>
          <div>
            <Button className="bg-white rounded-full w-20 cursor-pointer text-black font-semibold text-[13px]">
              Follow
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FollowAccoutCard;
