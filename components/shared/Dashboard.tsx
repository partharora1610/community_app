"use client";

import React from "react";
import { Button } from "../ui/button";
import ProjectContainer from "./dashboard/ProjectContainer";
import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";

const Dashboard = ({ user }: any) => {
  const { data, isLoading } = trpc.getUserFiles.useQuery();

  console.log(data);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl">
          Hello,
          <span className="text-indigo-700 font-semibold">
            {user.firstName}
          </span>
        </h2>
        <UploadButton isSubscribed={true} />
      </div>

      <div>
        <ProjectContainer data={JSON.stringify(data)} />
      </div>
    </div>
  );
};

export default Dashboard;
