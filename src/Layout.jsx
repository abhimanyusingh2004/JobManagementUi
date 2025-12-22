import React, {  } from "react";
import { AppSidebar, sidebarData } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const Layout = ({ children }) => {

  return (
    <ThemeProvider defaultTheme="light" defaultThemeSet="default" storageKey="vite-ui-theme">
      <SidebarProvider
        defaultOpen={false}
        style={{
          "--sidebar-width": "calc(var(--spacing) * 54)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <AppSidebar variant="inset" data={sidebarData} />
        <SidebarInset>
          <SiteHeader data={sidebarData} />
          <main>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;