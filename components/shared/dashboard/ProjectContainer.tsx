import { trpc } from "@/app/_trpc/client";
import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectContainer = () => {
  // const text = trpc.getUserFiles.useQuery(undefined, {});

  // console.log(text);

  return (
    <div>
      {/* <h2>{totalProjects}</h2> */}
      {/* {files?.map((file) => {
        return <ProjectCard />;
      })} */}
    </div>
  );
};

export default ProjectContainer;
