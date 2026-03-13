export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { getUserProfileAction } from "@/actions/user.actions";
import { notFound } from "next/navigation";
import ProfileView from "@/components/ProfileView";

interface PageProps {
  params: Promise<{ clerkId: string }>;
}

const ProfilePage = async ({ params }: PageProps) => {
  const { clerkId } = await params;
  const loggedInUser = await currentUser();
  const isOwnProfile = loggedInUser?.id === clerkId;

  const user = await getUserProfileAction(clerkId);
  if (!user) {
    return notFound();
  }

  return (
    <ProfileView 
      clerkId={clerkId} 
      isOwnProfile={isOwnProfile} 
      initialData={user} 
    />
  );
};

export default ProfilePage;
