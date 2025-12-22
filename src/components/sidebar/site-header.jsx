import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import ModeToggle from "../theme/ModeToggle";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { BellDot, ThumbsUp, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export function SiteHeader({
  data = { navMain: [], documents: [], navSecondary: [] },
  onBeforeThemeChange,
}) {
  const [notifications, setNotifications] = useState([]);
  const { pathname } = useLocation();

  const markNotificationAsRead = async (notificationId) => {
    return;
  };

  const clearAllNotifications = async () => {
    return;
  };

  // 🧠 Safely handles missing data
  const findActiveItem = () => {
    if (pathname === "/account") {
      return { parent: "Account", parentUrl: "/account", child: null };
    }

    // Safely loop navMain
    for (const item of data?.navMain || []) {
      if (item.url === pathname) {
        return { parent: item.title, parentUrl: item.url, child: null };
      }
      if (item.items) {
        for (const subItem of item.items) {
          if (subItem.url === pathname) {
            return {
              parent: item.title,
              parentUrl: item.url || item.items[0]?.url || "#",
              child: subItem.title,
            };
          }
        }
      }
    }

    for (const item of data?.documents || []) {
      if (item.url === pathname) {
        return { parent: item.name, parentUrl: item.url, child: null };
      }
    }

    for (const item of data?.navSecondary || []) {
      if (item.url === pathname) {
        return { parent: item.title, parentUrl: item.url, child: null };
      }
    }

    return { parent: "Dashboard", parentUrl: "/", child: null };
  };

  const { parent, parentUrl, child } = findActiveItem();

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b sticky top-0 z-[15] bg-[var(--background)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className={child ? "hidden md:block" : ""}>
              <BreadcrumbLink asChild>
                <Link
                  to={parentUrl}
                  className={
                    child ? "text-muted-foreground" : "text-foreground"
                  }
                >
                  {parent}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {child && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{child}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-4">
          {/* 🔔 Notification Popover */}
         
          
          <ModeToggle onBeforeThemeChange={onBeforeThemeChange} />
          {/* <NavUser /> */}
        </div>
      </div>
    </header>
  );
}
