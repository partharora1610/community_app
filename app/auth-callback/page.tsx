import React from "react";
import { trpc } from "../_trpc/client";
import { useRouter } from "next/navigation";

const page = async () => {
  const router = useRouter();
  const { data } = trpc.authCallback.useQuery(undefined);

  if (data?.success) {
    // user is synced to the database
    router.push("/dashboard");
  }

  return <div>page</div>;
};

export default page;
