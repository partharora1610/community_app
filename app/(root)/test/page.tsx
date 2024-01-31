import { trpc } from "@/app/_trpc/client";
import React from "react";

const Page = () => {
  const data = trpc.getUserFiles.useQuery();
  console.log(data);

  return <div>Page</div>;
};

export default Page;
