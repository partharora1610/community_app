import ChatInput from "@/components/shared/ChatInput";
import PdfRenderer from "@/components/shared/PdfRenderer";
import { ChatContextProvider } from "@/context/ChatContext";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: any) => {
  const { fileId } = params;

  const user = await currentUser();

  if (!user) {
    redirect("/auth-callback");
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback");
  }

  const dbFile = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!dbFile) {
    return <div>No File Found</div>;
  }

  return (
    <ChatContextProvider fileId={dbFile.id}>
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2 bg-red-100">
          <PdfRenderer url={dbFile.url} />
        </div>

        <div>
          <ChatInput />
        </div>
      </div>
    </ChatContextProvider>
  );
};

export default Page;
