import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "@langchain/pinecone";

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

      const dbFile = await db.file.create({
        data: {
          key: file.key,
          userId,
          name: file.name,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      // Indexing the File
      try {
        const response = await fetch(dbFile.url);
        const blob = await response.blob();

        // Load the pdf in the memory
        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();

        // getting the amount of pages to check if the type of user is valid or not
        const pagesAmount = pageLevelDocs.length;

        // vectorize and index the pages
        const pineconeIndex = pinecone.Index("pdfgpt");

        // creating openai embeddings
        const openaiEmbeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        // creating vector embeddings for the pages
        await PineconeStore.fromDocuments(pageLevelDocs, openaiEmbeddings, {
          pineconeIndex,
          namespace: dbFile.id,
        });

        // updating the file status in our db
        await db.file.update({
          where: {
            id: dbFile.id,
          },
          data: {
            uploadStatus: "DONE",
          },
        });
      } catch (error) {
        // updating the file status in our db
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
