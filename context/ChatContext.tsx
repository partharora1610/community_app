"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import React from "react";

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

  // React Query Mutation
  const { mutate: sendMessage } = useMutation({
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

      return response.body;
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

// Create a custom hook to use the ChatContext

export default ChatContext;
