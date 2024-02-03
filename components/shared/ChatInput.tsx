"use client";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ChatContext from "@/context/ChatContext";

const ChatInput = () => {
  const { message, addMessage, isLoading, handleInputChange } =
    useContext(ChatContext);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          addMessage();
        }}
      >
        <Textarea
          rows={1}
          placeholder="Type a message..."
          ref={textareaRef}
          autoFocus
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addMessage();
              textareaRef.current?.focus();
            }
          }}
          onChange={(e) => handleInputChange(e)}
        ></Textarea>

        <Button disabled={!isLoading} type="submit">
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
