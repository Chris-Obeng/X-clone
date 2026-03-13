import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";

const SubscriptionCard = () => {
  return (
    <div>
      <Card className="bg-black border border-gray-200/20 rounded-xl flex flex-col justify-center text-white mb-1 w-80 h-36">
        <CardContent>
          <div className="">
            <div className="flex m-0.5 items-center">
              <h2 className="font-bold text-lg mr-1">Subscribe to Premium</h2>
              <span className="bg-green-400/30 text-green-200 px-1 rounded-sm ">
                50% off
              </span>
            </div>

            <div className="flex item-center m-0.5 font-medium text-sm text-gray-200/80">
              <p>
                <span className="text-nowrap">
                  Get rid of ads, see your analytics, boost your
                </span>{" "}
                replies and unlock 20+ features.
              </p>
            </div>
            <div className="flex justify-start">
              <Button className="bg-sky-500 font-bold rounded-full px-2 w-26 mt-2.5 cursor-pointer ">
                Subscribe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCard;
