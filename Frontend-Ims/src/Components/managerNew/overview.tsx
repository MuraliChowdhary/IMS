import { Sidebar } from "@/Components/ui/sidebar" 


export default function Overview() {
    return (
        <div className="overview">
            <h1 className="text-2xl font-bold mb-4">Overview</h1>
         {/* <AppSidebar/> */}
         <Sidebar/>
        </div>
    );
}