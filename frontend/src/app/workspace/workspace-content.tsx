import { cookies } from "next/headers";
import { Toaster } from "sonner";

import { QueryClientProvider } from "@/components/query-client-provider";
import { FableShaderBackground } from "@/components/ui/FableShaderBackground";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CommandPalette } from "@/components/workspace/command-palette";
import { GatewayOfflineBanner } from "@/components/workspace/gateway-offline-banner";
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
      {/* Fable magical shader fireflies — fixed behind everything */}
      <FableShaderBackground />
      <SidebarProvider
        className="relative z-10 h-screen bg-transparent"
        defaultOpen={initialSidebarOpen}
      >
        <WorkspaceSidebar className="border-r border-amber-500/15 bg-black/35 shadow-[4px_0_24px_rgba(212,160,23,0.03)] backdrop-blur-2xl" />
        <SidebarInset className="min-w-0 bg-transparent">
          <GatewayOfflineBanner gatewayUnavailable={gatewayUnavailable} />
          {children}
        </SidebarInset>
      </SidebarProvider>
      <CommandPalette />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
