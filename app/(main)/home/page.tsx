import CreatePost from "@/components/CreatePost";
import HomeHeader from "@/components/HomeHeader";
import Tweets from "@/components/Tweets";
import { syncUserAction } from "@/actions/user.actions";
import { Suspense } from "react";
import { TweetSkeleton } from "@/components/TweetSkeleton";

const Home = async () => {
  await syncUserAction();

  return (
    <div>
      <HomeHeader />
      <CreatePost />
      <Suspense fallback={<TweetSkeleton />}>
        <Tweets />
      </Suspense>
    </div>
  );
};

export default Home;
