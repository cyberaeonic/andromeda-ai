"use client";

import { Target, TrendingUp, Users } from "lucide-react";
import { useEffect } from "react";

import {
  WorkspaceBody,
  WorkspaceContainer,
  WorkspaceHeader,
} from "@/components/workspace/workspace-container";
import { useI18n } from "@/core/i18n/hooks";

export default function PlanningPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t.sidebar.strategicPlanning} - ${t.pages.appName}`;
  }, [t.sidebar.strategicPlanning, t.pages.appName]);

  return (
    <WorkspaceContainer>
      <WorkspaceHeader />
      <WorkspaceBody>
        <div className="flex size-full flex-col p-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            {/* Header section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Strategic Planning
                </h1>
                <p className="text-muted-foreground mt-2">
                  High-level business objectives, KPIs, and roadmap alignment.
                </p>
              </div>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                + New Initiative
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <TrendingUp className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Q3 Revenue Target
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800">$4.2M</h3>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <Target className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Market Share Growth
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800">+12%</h3>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                    <Users className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Enterprise Clients
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800">184</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanban Placeholder */}
            <div className="mt-4 grid grid-cols-3 gap-6">
              {/* Backlog */}
              <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-700">In Planning</h3>
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <h4 className="font-medium">EU Market Expansion</h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Analyze regulatory requirements and initial setup costs.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <h4 className="font-medium">Q4 Pricing Overhaul</h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Run pricing elasticity models in Data Studio.
                  </p>
                </div>
              </div>
              {/* In Progress */}
              <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-700">Executing</h3>
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <h4 className="border-l-4 border-blue-500 pl-2 font-medium">
                    Enterprise Upsell Campaign
                  </h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Targeting top 20% of users with new BI features.
                  </p>
                </div>
              </div>
              {/* Completed */}
              <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-700">Completed</h3>
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <h4 className="font-medium text-slate-500 line-through">
                    AWS Cost Optimization
                  </h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Reduced compute costs by 22% in July.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WorkspaceBody>
    </WorkspaceContainer>
  );
}
