import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "1GB" } })
    .middleware(async ({ req }) => {
      const user = await currentUser();

      if (!user) {
        throw new Error("You must be logged in to upload files");
      }
      console.log("user", user);
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;

      await db.file.create({
        data: {
          key: file.key,
          userId,
          name: file.name,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
