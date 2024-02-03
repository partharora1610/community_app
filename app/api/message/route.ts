import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { sendMessageValidator } from "@/lib/validators";
import { db } from "@/db";

// Here we not using trpc since we want to stream the response to the client

export const POST = async (req: NextRequest, res: NextResponse) => {
  // Asking a question to the pdf file
  const body = await req.json();

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // This is the zod valdiation
  const { fileId, message } = sendMessageValidator.parse(body);

  // Getting the file from the user
  const dbFile = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!dbFile) {
    return new Response("Not Found", { status: 400 });
  }

  // Creating the message
  const dbMessage = await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: user.id,
      fileId: dbFile.id,
    },
  });

  // Answer the question ==> Using the AI
};
