import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import HappeningCard from "./HappeningCard";
import Link from "next/link";

const WhatsHappening = () => {
  return (
    <div className="border mb-1 border-gray-200/20 rounded-lg flex flex-col justify-center text-white w-80">
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle className="font-bold text-lg">What's happening</CardTitle>
        </CardHeader>
        <CardContent className="w-full px-0">
          <div>
            <HappeningCard title="Technology · Trending" subject="#AI" />
            <HappeningCard title="Software · Trending" subject="#TypeScript" />
            <HappeningCard title="Startups · Trending" subject="#OpenSource" />
            <HappeningCard title="Devices · Trending" subject="#Pixel" />

            <Link href="/explore" className="flex justify-start hover:bg-gray-100/4 w-full p-3 cursor-pointer">
              <div className="flex justify-start">
                <p className=" font-semibold text-blue-600">Show more</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsHappening;
