"use client";

import { useEffect } from "react";
import { trpc } from "../../_trpc/client";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  const d = trpc.getUserFiles.useQuery();
  console.log(d);

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  // TODO: Handle error in the trpc route
  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [data]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid border-opacity-75 h-16 w-16"></div>
      <div className="">Setting up your account...</div>
    </div>
  );
};

export default Page;
