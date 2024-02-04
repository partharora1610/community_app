import { trpc } from "@/app/_trpc/client";
import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectContainer = ({ data }: any) => {
  const files = JSON.parse(data);

  return (
    <div>
      <h2>{files?.length}</h2>
      <div className="flex gap-16">
        {files?.map((file: any, index: any) => {
          return (
            <ProjectCard
              key={index}
              name={file.name}
              url={file.url}
              id={file.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectContainer;
