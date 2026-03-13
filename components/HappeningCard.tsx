import React from "react";
import { Button } from "./ui/button";
import { Ellipsis } from "lucide-react";

type HappeningCardProps = {
  title: string;
  subject: string;
};

const HappeningCard = ({ title, subject }: HappeningCardProps) => {
  return (
    <div>
      <div className="flex justify-between hover:bg-gray-100/4 w-full p-3 cursor-pointer">
        <div className="flex flex-col justify-start">
          <h3 className="font-extralight text-[12px] text-gray-200/80">
            {title}
          </h3>
          <p className=" font-bold">{subject}</p>
        </div>
        <Button
          variant="ghost"
          className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-blue-500/15 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 hover:focus-visible:ring-blue-500/40 cursor-pointer"
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HappeningCard;
