import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { Document } from "@langchain/core/documents";
// import { OpenAIEmbeddings } from "@langchain/openai";

// This is deprecated ==> WARNING
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "@langchain/pinecone";
// import { getPineconeClient } from "@/lib/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "1GB" } })
    .middleware(async ({ req }) => {
      const user = await currentUser();

      if (!user) {
        throw new Error("You must be logged in to upload files");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;

      const dbFile = await db.file.create({
        data: {
          key: file.key,
          userId,
          name: file.name,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(file.url);

        const blob = await response.blob();
        console.log(blob);

        const loader = new PDFLoader(blob);

        const docs = await loader.load();

        // const pagesAmount = docs.length;
        // console.log("pagesAmount", pagesAmount);

        const pineconeIndex = pinecone.Index("pdfgpt");

        const openaiEmbeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        await PineconeStore.fromDocuments(docs, openaiEmbeddings, {
          pineconeIndex,
          namespace: dbFile.id,
        });

        await db.file.update({
          where: {
            id: dbFile.id,
          },
          data: {
            uploadStatus: "DONE",
          },
        });
      } catch (error) {
        await db.file.update({
          where: {
            id: dbFile.id,
          },
          data: {
            uploadStatus: "FAILED",
          },
        });

        console.error("Error indexing the file", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
