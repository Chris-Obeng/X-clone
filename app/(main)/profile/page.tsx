import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ProfileRedirect = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  redirect(`/profile/${user.id}`);
};

export default ProfileRedirect;
