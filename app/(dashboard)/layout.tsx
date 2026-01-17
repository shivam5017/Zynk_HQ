import AppSidebarServer from "@/components/server/appSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {  requireVerifiedEmail } from "@/lib/server/auth-utils";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireVerifiedEmail();

  return (
    <SidebarProvider>
      <AppSidebarServer />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
