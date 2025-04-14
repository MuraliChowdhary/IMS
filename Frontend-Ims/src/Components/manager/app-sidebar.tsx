import { Link } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "../ui/sidebar"
  
  import {
    Home,
    Boxes,
    PackageSearch,
    Repeat2,
    PackagePlus,
    LogOut, // for logout icon
  } from "lucide-react"
  
  const items = [
    {
      title: "Home",
      url: "/manager/inventory",
      icon: Home,
    },
    {
      title: "Viewing current inventory levels",
      url: "/manager/lowstocks",
      icon: Boxes,
    },
    {
      title: "Identifying low stock items",
      url: "/manager/productFilter",
      icon: PackageSearch,
    },
    {
      title: "Creating reorders to suppliers",
      url: "/manager/reorder",
      icon: Repeat2,
    },
    {
      title: "Adding new products",
      url: "/manager/add",
      icon: PackagePlus,
    },
    {
      title: "Analytics",
      url: "/manager/analytics",
      icon: PackagePlus,
    },
  ]
  
  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
  
                {/* Logout Button */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      onClick={()=>{window.localStorage.removeItem("token"); window.location.href="/signin"}}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }
  
  export default AppSidebar
  


  