"use client";

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";

interface ChatContextProps {
  message: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  addMessage: () => void;
}

const ChatContext = React.createContext<ChatContextProps>({
  message: "",
  handleInputChange: () => {},
  isLoading: false,
  addMessage: () => {},
});

interface ChatContextProviderProps {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({
  fileId,
  children,
}: ChatContextProviderProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const { toast } = useToast();

  const utils = trpc.useContext();

  const backupMessgae = useRef<string>("");

  const { mutate: sendMessage } = useMutation({
    // Hitting our nextjs api route to send the message to the api
    mutationFn: async ({
      message,
      fileId,
    }: {
      message: string;
      fileId: string;
    }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setIsLoading(false);
      return response.body;
    },

    // Setting up the optimistic updates on the client
    onMutate: async ({ message }) => {
      setIsLoading(true);
      backupMessgae.current = message;

      await utils.getFileMessages.cancel();

      const prevMessage = utils.getFileMessages.getInfiniteData();

      utils.getFileMessages.setInfiniteData({ fileId, limit: 10 }, (old) => {
        if (!old) {
          return {
            pages: [],
            pageParams: [],
          };
        }

        let newPages = [...old.pages];

        let latestPage = newPages[0];

        latestPage.messages = [
          {
            id: "temp",
            text: message,
            isUserMessage: true,
            createdAt: new Date().toISOString(),
          },
          ...latestPage.messages,
        ];

        // updating the new page
        newPages[0] = latestPage;

        // returning the value
        return {
          ...old,
          pages: newPages,
        };
      });

      setIsLoading(true);

      return {
        previousMessage:
          prevMessage?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    // Setting up the realtime response on the client
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "Error",
          description: "Something went wrong try reloading the page",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accReponse = "";

      while (!done) {
        const { value, done: isDone } = await reader.read();

        if (isDone) {
          done = true;
        }

        if (value) {
          accReponse += decoder.decode(value, { stream: true });
        }

        utils.getFileMessages.setInfiniteData({ fileId, limit: 10 }, (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          //
          let isAiCreated = old.pages.some((page) =>
            page.messages.some((message) => message.id === "ai-response")
          );

          let updatedPages = old.pages.map((page) => {
            if (page == old.pages[0]) {
              let updatedMessage;

              if (!isAiCreated) {
                updatedMessage = [
                  {
                    id: "ai-response",
                    text: accReponse,
                    isUserMessage: false,
                    createdAt: new Date().toISOString(),
                  },
                  ...page.messages,
                ];
              } else {
                updatedMessage = page.messages.map((message) => {
                  if (message.id === "ai-response") {
                    return {
                      ...message,
                      text: accReponse,
                    };
                  }
                  return message;
                });
              }

              return {
                ...page,
                messages: updatedMessage,
              };
            }

            return page;
          });

          // Final return
          return {
            ...old,
            pages: updatedPages,
          };
          //
        });
      }
    },
  });

  // Calls the api
  const addMessage = () => {
    sendMessage({ message, fileId });
  };

  // Handles the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setMessage(value);
  };

  return (
    <ChatContext.Provider
      value={{
        isLoading,
        message,
        addMessage,
        handleInputChange,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
