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
    <div className="grid grid-cols-3 gap-12">
      <div className="col-span-2 bg-red-100">
        <PdfRenderer url={dbFile.url} />
      </div>

      <div>hello</div>
    </div>
  );
};

export default Page;
