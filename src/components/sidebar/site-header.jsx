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
import { BellDot, ThumbsUp, X, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const markNotificationAsRead = async (notificationId) => {
    return;
  };

  const clearAllNotifications = async () => {
    return;
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    // Remove the login flag from localStorage
    localStorage.removeItem("adminLoggedIn");

    // Show success toast
    toast.success("Logged out successfully");

    // Close dialog
    setLogoutDialogOpen(false);

    // Redirect to login page (adjust the route as needed)
    navigate("/");
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
    <>
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

            {/* Logout Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogoutClick}
                  className="h-9 w-9"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>

            <ModeToggle onBeforeThemeChange={onBeforeThemeChange} />
            {/* <NavUser /> */}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent onInteractOutside={() => setLogoutDialogOpen(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page and will need to sign in again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}