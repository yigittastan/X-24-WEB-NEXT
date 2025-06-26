import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto ml-[256px] mr-[50px]">
          {children}
        </main>
        <RightPanel />
      </div>
    </div>
  );
}