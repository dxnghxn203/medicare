import Sidebar from "@/components/Profile/sideBar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto pt-[130px] px-4 mb-8">
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
