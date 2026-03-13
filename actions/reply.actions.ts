"use server";

import { prisma } from "@/db";
import { revalidatePath } from "next/cache";

export async function createReplyAction(data: {
  content: string;
  postId: string;
  userId: string;
}) {
  try {
    const reply = await prisma.reply.create({
      data: {
        content: data.content,
        postId: data.postId,
        userId: data.userId,
      },
      include: {
        user: true,
      }
    });

    revalidatePath(`/home/${data.postId}`);
    return { success: true, reply };
  } catch (error) {
    console.error("Error creating reply:", error);
    return { success: false, error: "Failed to create reply" };
  }
}
