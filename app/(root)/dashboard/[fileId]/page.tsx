import ChatWrapper from "@/components/shared/ChatWrapper";
import PdfRenderer from "@/components/shared/PdfRenderer";
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
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={dbFile.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={dbFile.id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
