import SidebarUsers from "./components/SidebarUsers";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="w-[256px] border-r border-gray-200 bg-gray-50 p-4">
          <SidebarUsers />
        </div>
        <main className="flex-1 overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
