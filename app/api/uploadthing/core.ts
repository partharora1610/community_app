import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

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

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();

        const pagesAmount = pageLevelDocs.length;

        // vectorixe and index the pages
        const pinecodeIndex = pinecone.Index("pdfgpt");

        // Need to get the api key from the environment
        // Set up the openai key
        const openaiEmbeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });
      } catch (error) {}
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
