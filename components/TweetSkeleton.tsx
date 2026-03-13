"use client";

import { Skeleton } from "./ui/skeleton";

export const TweetSkeleton = () => {
    return (
        <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-row p-4 border-b border-[#2f3336]">
                    <div className="mr-3 shrink-0">
                        <Skeleton className="w-10 h-10 rounded-full bg-[#333639]" />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24 bg-[#333639]" />
                            <Skeleton className="h-4 w-16 bg-[#333639]" />
                        </div>
                        <Skeleton className="h-4 w-full bg-[#333639]" />
                        <Skeleton className="h-4 w-3/4 bg-[#333639]" />
                        <Skeleton className="h-[200px] w-full rounded-2xl bg-[#333639] mt-2" />
                        <div className="flex justify-between mt-3 text-[#71767b] max-w-md w-full">
                            <Skeleton className="h-8 w-8 rounded-full bg-[#333639]" />
                            <Skeleton className="h-8 w-8 rounded-full bg-[#333639]" />
                            <Skeleton className="h-8 w-8 rounded-full bg-[#333639]" />
                            <Skeleton className="h-8 w-8 rounded-full bg-[#333639]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
