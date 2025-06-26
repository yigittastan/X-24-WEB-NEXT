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
        <main className="flex-1 overflow-y-auto ml-[128px] mr-[50px] bg-white">
          {children}
        </main>
        <RightPanel />
      </div>
    </div>
  );
}