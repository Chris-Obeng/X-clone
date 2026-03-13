import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

import { prisma } from "@/db";

const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { clerkId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { clerkId: metadata.clerkId },
        data: { profileImage: file.ufsUrl },
      });
      return { uploadedBy: metadata.clerkId, url: file.ufsUrl };
    }),

  bannerImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { clerkId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { clerkId: metadata.clerkId },
        data: { bannerImage: file.ufsUrl },
      });
      return { uploadedBy: metadata.clerkId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
