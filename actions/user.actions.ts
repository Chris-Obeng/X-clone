"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/db";

export async function syncUserAction() {
  try {
    const user = await currentUser();
    if (!user) return null;

    // Check if user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (existingUser) return existingUser;

    // If not, create a new user record
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        username: user.username || `user_${user.id.slice(0, 8)}`,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User",
        profileImage: user.imageUrl,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}
