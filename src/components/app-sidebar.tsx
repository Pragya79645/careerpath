"use client"

import { Home, LayoutDashboard, FileText, Mic, Map, LogIn, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
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
    title: "Profile",
    url: "/profile",
    icon: Home,
  },
  {
    title: "Company Targeted",
    url: "/company-target",
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
  const { toggleSidebar, openMobile, setOpenMobile } = useSidebar()

  return (
    <>
      <div className="fixed left-3 top-3 z-50 md:hidden">
        <SidebarTrigger className="bg-black/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-purple-500/20" />
      </div>
      <Sidebar
        variant="floating"
        className="border-r border-purple-200/20 bg-gradient-to-b from-purple-50/90 to-teal-50/90 backdrop-blur-sm transition-all duration-300 dark:from-purple-950/90 dark:to-teal-950/90"
      >
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Avatar className="border-2 border-teal-400 transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-teal-400 text-white">CP</AvatarFallback>
            </Avatar>
            <div className="bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text font-medium text-transparent transition-all duration-300 hover:from-teal-400 hover:to-purple-500">
              Career Path
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpenMobile(false)}>
            {openMobile ? <X className="h-5 w-5 text-purple-500" /> : <Menu className="h-5 w-5 text-purple-500" />}
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-teal-100/50 dark:hover:from-purple-900/30 dark:hover:to-teal-900/30"
                >
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon
                      className={`h-5 w-5 transition-all duration-300 ${
                        pathname === item.url
                          ? "text-gradient-to-r from-purple-500 to-teal-400"
                          : "text-gray-600 group-hover:text-purple-500 dark:text-gray-300"
                      }`}
                    />
                    <span
                      className={`transition-all duration-300 ${
                        pathname === item.url
                          ? "bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text font-medium text-transparent"
                          : "text-gray-600 group-hover:text-purple-500 dark:text-gray-300"
                      }`}
                    >
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="bg-gradient-to-r from-purple-500/70 to-teal-400/70 bg-clip-text text-xs text-transparent transition-all duration-300 hover:from-teal-400/70 hover:to-purple-500/70">
            © 2025 Career Path Navigator
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
