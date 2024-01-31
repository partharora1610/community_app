"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Delete,
  DeleteIcon,
  Loader,
  MessageCircleCodeIcon,
  Plus,
  Trash,
  Trash2,
  User,
} from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";

type ProjectCardProps = {
  id: string;
  userId?: string;
  name?: string;
  url?: string;
  key?: string;
  createdAt?: string;
  updatedAt?: string;
};

const ProjectCard = (data: ProjectCardProps) => {
  const { name, url, id } = data;
  const [currentlyDeleting, setCurrentlyDeleting] =
    React.useState<String | null>(null);

  // This is deprecated need to find a better solution to solve this
  const utils = trpc.useContext();

  // This is the api call
  const { mutate: deleteFile } = trpc.deleteUserFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeleting(id);
    },
    onSettled: () => {
      setCurrentlyDeleting(null);
    },
  });

  return (
    <Link href={`/dashboard/${id}`}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex gap-6 items-center ">
              <div className="h-[50px] w-[50px] bg-slate-100 rounded-full"></div>
              <p>{name}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 justify-center items-center">
            <div className="flex gap-2 items-center px-4 py-2 rounded-sm">
              <Plus size={20} className="text-slate-400" />
              <p className="text-sm">DATE</p>
            </div>

            <div className="flex gap-2 items-center  px-4 py-2 rounded-sm">
              <MessageCircleCodeIcon size={20} className="text-slate-400" />
              <p className="text-sm">mocked</p>
            </div>

            <Button
              className="bg-red-50 hover:bg-red-50 text-red-700"
              onClick={() => deleteFile({ id: id })}
            >
              {currentlyDeleting === id ? (
                <Loader size={20} className="mr-2" />
              ) : (
                <>
                  <Trash size={20} className="mr-2" />
                  <p>Delete</p>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
