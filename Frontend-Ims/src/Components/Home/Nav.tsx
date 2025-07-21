"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import { Button } from "../ui/button"

export function NavigationMenuDemo() {
  return (
    <div className="flex justify-between items-center w-full h-16 border-b  border-gray-800 bg-black px-6">
      
      <Link to="/" className="flex items-center space-x-2 mr-8">
        <span className="text-xl font-bold text-white">Primemart</span>
      </Link>

      
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-black text-white hover:bg-black data-[state=open]:bg-black">
              Dashboard
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[300px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-gray-900 text-white">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-800 to-gray-900 p-6 no-underline outline-none focus:shadow-md border border-gray-700">
                      <div className="mb-2 mt-4 text-lg font-medium text-white">
                        Inventory Overview
                      </div>
                      <p className="text-sm leading-tight text-gray-200">
                        Real-time insights into your stock levels, movements, and alerts.
                      </p>
                    </div>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/" title="Summary" className="hover:bg-gray-800 hover:text-white">
                  Quick view of your inventory health metrics
                </ListItem>
                <ListItem href="/" title="Alerts" className="hover:bg-gray-800 hover:text-gray-200">
                  Active alerts requiring your attention
                </ListItem>
                 
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-black text-white hover:bg-black data-[state=open]:bg-black">
              Inventory
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-gray-900 text-white">
                <ListItem
                  href="/"
                  title="All Items"
                  className="hover:bg-gray-800"
                >
                  Browse and manage all inventory items
                </ListItem>
                <ListItem
                  href="/"
                  title="Categories"
                  className="hover:bg-gray-800"
                >
                  Organize items by categories
                </ListItem>
                <ListItem
                  href="/"
                  title="Low Stock"
                  className="hover:bg-gray-800 text-amber-400"
                >
                  Items below reorder threshold
                </ListItem>
                <ListItem
                  href="/"
                  title="Expiring Soon"
                  className="hover:bg-gray-800 text-red-400"
                >
                  Items nearing expiration date
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/HowItWorksPage">
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-gray-black text-white   ")}>
                 HowItWorksPage
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

        
        </NavigationMenuList>
      </NavigationMenu>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-2 ml-auto">
         <Button variant="outline" className="hidden lg:block  bg-blue-500 border-none text-white"  onClick={() => window.location.href = "/login"}>
          Sign In
        </Button>
        <Button variant="outline" className="hidden lg:block bg-gray-900 text-white border-none" onClick={() => window.location.href = "/signup"}>Join Us</Button>
      </div>
    </div>
  )
}

interface ListItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  title: string;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-white focus:bg-gray-800 focus:text-white text-gray-300",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"

export const LandingPage2 = () => {
  return (
    <div className="bg-black flex flex-col min-h-screen text-white">
      <header className="w-full border-b border-gray-800">
        <NavigationMenuDemo />
      </header>
     
    </div>
  )
}