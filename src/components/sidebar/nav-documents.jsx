import { IconDots, IconFolder, IconShare3, IconTrash } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavDocuments({ items }) {
  const { isMobile } = useSidebar();
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Others</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              tooltip={item.name}
              asChild
              className={cn(
                location.pathname === item.url && "bg-blue-100 dark:bg-blue-100/20 text-blue-700 dark:text-blue-300"
              )}
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}