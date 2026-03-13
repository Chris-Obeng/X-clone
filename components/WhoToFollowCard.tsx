import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import FollowAccoutCard from "./FollowAccoutCard";

const WhoToFollowCard = () => {
  return (
    <div className="border mb-1 border-gray-200/20 rounded-lg flex flex-col justify-center text-white w-80">
      <Card className="bg-black text-white w-full">
        <CardHeader>
          <CardTitle className="font-bold text-lg">Who to follow</CardTitle>
        </CardHeader>

        <CardContent className="w-full px-0">
          <div>
            <FollowAccoutCard
              name="Chris"
              username="Obengch"
              image="/profile_images/chris.png"
            />
            <FollowAccoutCard
              name="Lana Rhoades"
              username="lanarhoades"
              image="/profile_images/lana.jpg"
            />
            <FollowAccoutCard
              name="Elizabeth"
              username="lizzy"
              image="/profile_images/lana.jpg"
            />
          </div>

          <div className="flex items-center p-3 hover:bg-gray-100/4 w-full cursor-pointer px-3">
            <h3 className="text-sky-500 font-bold text-sm">Show more</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhoToFollowCard;
