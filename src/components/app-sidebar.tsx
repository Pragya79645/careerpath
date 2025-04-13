"use client"

import { Home, LayoutDashboard, FileText, Mic, Map, LogIn, Menu } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resume Analyzer",
    url: "/resume",
    icon: FileText,
  },
  {
    title: "Voice Assistant",
    url: "/voice",
    icon: Mic,
  },
  {
    title: "Roadmap",
    url: "/roadmap",
    icon: Map,
  },
  {
    title: "Login / Register",
    url: "/login",
    icon: LogIn,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <>
      <div className="md:hidden fixed top-3 left-3 z-50">
        <SidebarTrigger />
      </div>
      <Sidebar variant="floating" className="border-r border-border">
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>CP</AvatarFallback>
            </Avatar>
            <div className="font-medium">Career Path</div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="text-xs text-muted-foreground">© 2025 Career Path Navigator</div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
