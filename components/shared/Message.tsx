import { cn } from "@/lib/utils";

interface MessageProps {
  message: any;
  isNextMessageSamePerson: boolean;
}

const Message = ({ message, isNextMessageSamePerson }: MessageProps) => {
  // Display the user meesage on the right and the bot message on the left
  // Make use of the flex and isNextMessageSamePerson to display the messages properly

  return (
    <div>
      {/* Making flex work properly */}
      <div className="">
        <div
          className={cn(
            "h-[32px] w-[32px] rounded-lg flex justify-center items-center",
            {
              "bg-blue-600 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
            }
          )}
        >
          I
        </div>
        <div
          className={cn("px-4 py-2 rounded-lg ", {
            "bg-blue-600 text-white": message.isUserMessage,
            "bg-gray-200 text-gray-900": !message.isUserMessage,
          })}
        >
          {message.text}
          {message.id !== "loading-message" ? (
            <div
              className={cn("text-xs select-none mt-2 w-full text-right", {
                "text-zinc-500": !message.isUserMessage,
                "text-blue-300": message.isUserMessage,
              })}
            ></div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Message;
