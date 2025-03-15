import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { whatsappItems } from "./sidebar-items"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <SidebarProvider className="w-full min-h-full">
        <AppSidebar items={whatsappItems} />
        <div className="h-full w-full">
          {children}
        </div>
      </SidebarProvider>
  )
}