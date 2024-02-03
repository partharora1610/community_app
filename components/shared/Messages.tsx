import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import React from "react";

const Messages = ({ fileId }: { fileId: string }) => {
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        limit: 10,
        fileId,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading",
    isUserMessage: false,
    text: (
      <span className="">
        <Loader2 className="h-4 w-4 animate-spin"></Loader2>
      </span>
    ),
  };

  const combinedMessages = [
    ...(true ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  // Rendering the messages in the container here...
  return <div>Messages</div>;
};

export default Messages;
