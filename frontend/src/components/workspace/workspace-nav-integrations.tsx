"use client";

import {
  CreditCard,
  MessageSquare,
  Mail,
  PieChart,
  Calendar,
  Cloud,
  CheckCircle2,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";

const integrations = [
  { name: "WhatsApp Business", icon: MessageSquare },
  { name: "Instagram", icon: PieChart },
  { name: "Gmail", icon: Mail },
  { name: "Google Calendar", icon: Calendar },
  { name: "Razorpay (UPI)", icon: CreditCard },
];

export function WorkspaceNavIntegrations() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Active Integrations</SidebarGroupLabel>
      <SidebarMenu>
        {integrations.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton tooltip={item.name}>
              <item.icon className="text-muted-foreground" />
              <span>{item.name}</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>
              <div className="flex items-center gap-1 font-bold tracking-wider text-green-500 uppercase">
                <CheckCircle2 className="size-4" />
              </div>
            </SidebarMenuBadge>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
