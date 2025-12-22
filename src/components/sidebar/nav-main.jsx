import React, { useState, useEffect } from "react";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import QuickCreate from "@/app/common/QuickCreate";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavMain({ items }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { state } = useSidebar(); // Get sidebar state (collapsed or expanded)
  const isMobile = useIsMobile();
  const location = useLocation(); // Get current route
  const [openPopovers, setOpenPopovers] = useState({});

  // State to track which collapsible is open
  const [openCollapsibles, setOpenCollapsibles] = useState({});

  // Initialize collapsible state based on active route
  useEffect(() => {
    const initialOpenCollapsibles = {};
    items.forEach((item) => {
      if (item.items?.length > 0) {
        // Open if the current route matches the parent url or any sub-item url
        initialOpenCollapsibles[item.title] =
          item.url === location.pathname ||
          item.items.some((subItem) => subItem.url === location.pathname);
      }
    });
    setOpenCollapsibles(initialOpenCollapsibles);
  }, [items, location.pathname, state]);

  // Function to handle sub-item click and close popover
  const handleSubItemClick = (itemTitle) => {
    setOpenPopovers((prev) => ({ ...prev, [itemTitle]: false }));
  };

  // Function to toggle collapsible state
  const toggleCollapsible = (itemTitle) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            item.items?.length > 0 ? (
              <SidebarMenuItem key={item.title}>
                {state === "collapsed" && !isMobile ? (
                  <Popover
                    open={openPopovers[item.title] || false}
                    onOpenChange={(open) =>
                      setOpenPopovers((prev) => ({ ...prev, [item.title]: open }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          item.isActive && "text-accent-foreground",
                          "group/collapsible",
                          // Highlight if any sub-item is active
                          item.items.some((subItem) => location.pathname === subItem.url) && "bg-blue-100 dark:bg-blue-100/20 text-blue-700 dark:text-blue-300"
                        )}
                      >
                        {item.icon && <item.icon />}
                      </SidebarMenuButton>
                    </PopoverTrigger>
                    <PopoverContent align="end" sideOffset={-34} className="w-42 p-0 translate-x-14">
                      <Label className="bg-muted py-1 px-2">
                        {item.icon && <item.icon className="w-4 inline-block mr-2" />}
                        {item.title}
                      </Label>
                      <Separator className="mb-1" />
                      <ul className="flex flex-col gap-1">
                        {item.items.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              to={subItem.url}
                              onClick={() => handleSubItemClick(item.title)}
                            >
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  location.pathname === subItem.url && "bg-blue-100 dark:bg-blue-100/20 text-blue-700 dark:text-blue-300"
                                )}
                              >
                                <span className="block w-full text-left">
                                  <ChevronRight className="inline-block w-4 h-4 mr-1" /> {subItem.title}
                                </span>
                              </SidebarMenuSubButton>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Collapsible
                    open={openCollapsibles[item.title] || false}
                    onOpenChange={() => toggleCollapsible(item.title)}
                    className="group/collapsible"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          item.isActive && "text-foreground",
                          // Highlight if any sub-item is active
                          item.items.some((subItem) => location.pathname === subItem.url) && "bg-blue-100 dark:bg-blue-100/20 text-blue-700 dark:text-blue-300"
                        )}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                location.pathname === subItem.url && "bg-blue-100 dark:bg-blue-100/20 text-blue-700 dark:text-blue-300"
                              )}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    location.pathname === item.url && "bg-blue-100 dark:bg-blue-100/20 text-blue-700 dark:text-blue-300"
                  )}
                >
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}