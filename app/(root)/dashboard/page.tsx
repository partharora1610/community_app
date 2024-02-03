import Dashboard from "@/components/shared/Dashboard";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
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

  return <Dashboard user={JSON.stringify(user)} />;
};

export default Page;
