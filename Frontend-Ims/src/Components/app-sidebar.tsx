/*
File: src/Components/managerNew/AppSidebar.tsx
Description: The main sidebar component with updated navigation URLs.
*/
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconTruck,
  IconAlertTriangle,
  IconClockExclamation,
  IconLogout,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar";

// --- Data with correct navigation routes ---
const data = {
  user: {
    name: "Owner",
    email: "Owner@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/manager", // Root manager route
      icon: IconDashboard,
    },
    {
      title: "Inventory",
      url: "/manager/inventory",
      icon: IconListDetails,
    },
    {
      title: "Product Catalog",
      url: "/manager/product-catalog",
      icon: IconFolder,
    },
    {
      title: "Analytics",
      url: "/manager/analytics",
      icon: IconChartBar,
    },
    {
      title: "Low Stock Alerts",
      url: "/manager/low-stock-alerts",
      icon: IconAlertTriangle,
    },
    {
      title: "Expiry Management",
      url: "/manager/expiry-management",
      icon: IconClockExclamation,
    },
    {
      title: "Pending Orders",
      url: "/manager/pending-orders",
      icon: IconTruck,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#", // Placeholder
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#", // Placeholder
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#", // Placeholder
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/manager">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Owner</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

/*
File: src/Components/nav-main.tsx
Description: Renders the main navigation items using NavLink for active styling.
*/
import { NavLink } from "react-router-dom";
import { type Icon as TablerIcon } from "@tabler/icons-react";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: TablerIcon;
  }[];
  className?: string;
}

export function NavMain({ items, className }: NavMainProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          end // Use `end` for the dashboard link to only match exactly
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/*
/*
File: src/Components/nav-secondary.tsx
Description: Renders the secondary/footer navigation items.
*/
import { Link } from "react-router-dom";

interface NavSecondaryProps {
  items: {
    title: string;
    url: string;
    icon: TablerIcon;
  }[];
  className?: string;
}

export function NavSecondary({ items, className }: NavSecondaryProps) {
    return (
        <nav className={cn("flex flex-col gap-1", className)}>
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      );
}


/*
File: src/Components/nav-user.tsx
/*
File: src/Components/nav-user.tsx
Description: Renders the user profile section in the sidebar footer.
*/
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "./ui/button";

interface NavUserProps {
    user: {
        name: string;
        email: string;
        avatar: string;
    }
}

export function NavUser({ user }: NavUserProps) {
    return (
        <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button  variant="ghost" size="icon"
             onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login"}}
              >
                <IconLogout className="h-5 w-5" />
            </Button>
        </div>
    )
}
