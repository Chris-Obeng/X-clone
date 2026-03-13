"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/db";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData: {
  content: string;
  media: { url: string; type: "IMAGE" | "VIDEO" }[];
  userId: string;
}) {
  try {
    const post = await prisma.post.create({
      data: {
        content: formData.content,
        userId: formData.userId,
        media: {
          create: formData.media.map((m) => ({
            url: m.url,
            type: m.type as any, // Cast to any to avoid conflict with generated types if they are tricky
          })),
        },
      },
    });

    revalidatePath("/home");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPostsAction() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        media: true,
        replies: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostByIdAction(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        media: true,
        replies: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return post;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}

export async function deletePostAction(postId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== user.id) {
      throw new Error("Unauthorized or post not found");
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

