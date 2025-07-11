import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AdminNav } from "../navigation/admin-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-semibold text-primary-foreground">A</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">Админ-панель</h2>
            <p className="text-xs text-muted-foreground">Управление магазином</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <AdminNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}