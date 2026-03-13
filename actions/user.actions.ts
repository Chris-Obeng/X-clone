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

export async function getUserProfileAction(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfileAction(data: { name: string; bio: string | null }) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const updatedUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        name: data.name,
        bio: data.bio,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
