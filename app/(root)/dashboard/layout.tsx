import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import ChatContext, { ChatContextProvider } from "@/context/ChatContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* <ChatContextProvider> */}
      <MaxWidthWrapper>{children}</MaxWidthWrapper>
      {/* </ChatContextProvider> */}
    </div>
  );
}
