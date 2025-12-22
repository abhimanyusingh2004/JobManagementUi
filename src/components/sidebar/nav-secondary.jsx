import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Bug } from 'lucide-react';
import { cn } from "@/lib/utils";

export function NavSecondary({ items, ...props }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const location = useLocation();

  return (
    <>
    
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              if (item.title === "Report a bug") {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip="Report a bug"
                      onClick={() => setIsDialogOpen(true)}
                      className={cn(
                        location.pathname === item.url && "bg-blue-100 text-blue-700"
                      )}
                    >
                      <Bug />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                   <div></div>
                  </SidebarMenuItem>
                );
              }
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={cn(
                      location.pathname === item.url && "bg-blue-100 dark:bg-blue-100/20 text-blue-700 dark:text-blue-300"
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}