import { AppSidebar } from "@/components/admin-components/ui/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserTableComponent } from "@/components/admin-components/table-componet/table-component";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
         < UserTableComponent/>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
