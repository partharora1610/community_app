import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MaxWidthWrapper>{children}</MaxWidthWrapper>
    </div>
  );
}
