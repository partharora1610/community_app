import React from "react";
import { Button } from "../ui/button";
import ProjectContainer from "./dashboard/ProjectContainer";
import { trpc } from "@/app/_trpc/client";

const Dashboard = ({ user }: any) => {
  // const { data, isLoading } = trpc.getUserFiles.useQuery();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl">
          Hello,
          <span className="text-indigo-700 font-semibold">
            {user.firstName}
          </span>
        </h2>
        <Button>Upload Pdf</Button>
      </div>

      <div>
        <ProjectContainer />
      </div>
    </div>
  );
};

export default Dashboard;
