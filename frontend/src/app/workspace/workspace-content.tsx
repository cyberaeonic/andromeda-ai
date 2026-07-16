import { cookies } from "next/headers";
import { Toaster } from "sonner";

import { QueryClientProvider } from "@/components/query-client-provider";
import { MilkyWayBackground } from "@/components/ui/milky-way-background";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CommandPalette } from "@/components/workspace/command-palette";
import { GatewayOfflineBanner } from "@/components/workspace/gateway-offline-banner";
import { GlobalEventToast } from "@/components/workspace/global-event-toast";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

function parseSidebarOpenCookie(
  value: string | undefined,
): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export async function WorkspaceContent({
  children,
  gatewayUnavailable = false,
}: Readonly<{
  children: React.ReactNode;
  gatewayUnavailable?: boolean;
}>) {
  const cookieStore = await cookies();
  const initialSidebarOpen = parseSidebarOpenCookie(
    cookieStore.get("sidebar_state")?.value,
  );

  return (
    <QueryClientProvider>
      {/* Milky Way starfield — fixed behind everything */}
      <MilkyWayBackground />
      <SidebarProvider
        className="relative z-10 h-screen bg-transparent"
        defaultOpen={initialSidebarOpen}
      >
        <WorkspaceSidebar className="border-r border-white/[0.06] bg-black/20 backdrop-blur-xl" />
        <SidebarInset className="min-w-0 bg-transparent">
          <GatewayOfflineBanner gatewayUnavailable={gatewayUnavailable} />
          {children}
        </SidebarInset>
      </SidebarProvider>
      <CommandPalette />
      <Toaster position="top-center" />
      <GlobalEventToast />
    </QueryClientProvider>
  );
}
