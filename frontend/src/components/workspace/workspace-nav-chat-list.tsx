"use client";

import {
  BotIcon,
  CalendarClock,
  MessagesSquare,
  Newspaper,
  TableProperties,
  Target,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAgentsApiEnabled } from "@/core/agents";
import { useI18n } from "@/core/i18n/hooks";

export function WorkspaceNavChatList() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { enabled: agentsEnabled } = useAgentsApiEnabled();
  return (
    <SidebarGroup className="pt-1">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/workspace/chats"} asChild>
            <Link
              className="font-medium tracking-wide text-white/70 hover:text-amber-400"
              href="/workspace/chats"
            >
              <MessagesSquare className="animate-pulse-slow text-amber-400/80" />
              <span>Chats</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={pathname.startsWith("/workspace/workflows")}
            asChild
          >
            <Link
              className="font-medium tracking-wide text-white/70 hover:text-amber-400"
              href="/workspace/workflows"
            >
              <Workflow className="animate-pulse-slow text-amber-400/80" />
              <span>Workflows</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          {agentsEnabled ? (
            <SidebarMenuButton
              isActive={pathname.startsWith("/workspace/agents")}
              asChild
            >
              <Link
                className="font-medium tracking-wide text-white/70 hover:text-amber-400"
                href="/workspace/agents"
              >
                <BotIcon className="animate-pulse-slow text-amber-400/80" />
                <span>Agents</span>
              </Link>
            </SidebarMenuButton>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block w-full cursor-not-allowed">
                  <SidebarMenuButton
                    className="text-white/30"
                    aria-disabled
                    aria-describedby="agents-disabled-reason"
                  >
                    <BotIcon className="opacity-50" />
                    <span>Agents</span>
                  </SidebarMenuButton>
                  <span id="agents-disabled-reason" className="sr-only">
                    {t.sidebar.agentsDisabledTooltip}
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t.sidebar.agentsDisabledTooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={pathname.startsWith("/workspace/scheduled-tasks")}
            asChild
          >
            <Link
              className="font-medium tracking-wide text-white/70 hover:text-amber-400"
              href="/workspace/scheduled-tasks"
            >
              <CalendarClock className="animate-pulse-slow text-amber-400/80" />
              <span>Business Order Schedule</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={pathname.startsWith("/workspace/data-studio")}
            asChild
          >
            <Link
              className="font-medium tracking-wide text-white/70 hover:text-amber-400"
              href="/workspace/data-studio"
            >
              <TableProperties className="animate-pulse-slow text-amber-400/80" />
              <span>Data Studio</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={pathname.startsWith("/workspace/planning")}
            asChild
          >
            <Link
              className="font-medium tracking-wide text-white/70 hover:text-amber-400"
              href="/workspace/planning"
            >
              <Target className="animate-pulse-slow text-amber-400/80" />
              <span>Strategic Planning</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={pathname.startsWith("/workspace/trends")}
            asChild
          >
            <Link
              className="font-medium tracking-wide text-white/70 hover:text-amber-400"
              href="/workspace/trends"
            >
              <Newspaper className="animate-pulse-slow text-amber-400/80" />
              <span>Trending News</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
