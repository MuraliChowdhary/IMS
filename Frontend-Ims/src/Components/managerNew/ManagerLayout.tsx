import { Outlet } from "react-router-dom"; // 👈 Import Outlet
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/app-sidebar";

export default function ManagerLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-grow p-2">
          <SidebarTrigger />
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
  );
}