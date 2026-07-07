"use client";

import { Globe, Newspaper, TrendingUp, Zap } from "lucide-react";
import { useEffect } from "react";

import {
  WorkspaceBody,
  WorkspaceContainer,
  WorkspaceHeader,
} from "@/components/workspace/workspace-container";
import { useI18n } from "@/core/i18n/hooks";

export default function TrendsPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `Trending News - ${t.pages.appName}`;
  }, [t.pages.appName]);

  return (
    <WorkspaceContainer>
      <WorkspaceHeader />
      <WorkspaceBody>
        <div className="flex size-full flex-col p-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Trends &amp; News
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time market intelligence, industry trends, and breaking
                business news powered by AI web search.
              </p>
            </div>

            {/* Live Trends Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 p-2.5 text-orange-600">
                    <TrendingUp className="size-5" />
                  </div>
                  <h3 className="font-semibold text-slate-800">
                    Market Trends
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <Zap className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        AI Agents reshaping enterprise SaaS
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Gartner forecasts 40% adoption by 2027
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <Zap className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Fintech consolidation wave accelerates
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        3 major acquisitions announced this week
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <Zap className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Supply chain AI optimization surges
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        22% cost reduction reported across early adopters
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2.5 text-blue-600">
                    <Newspaper className="size-5" />
                  </div>
                  <h3 className="font-semibold text-slate-800">
                    Breaking News
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <Globe className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Fed signals cautious rate path for H2
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Reuters · 2 hours ago
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <Globe className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        EU approves landmark AI regulation package
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Bloomberg · 5 hours ago
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <Globe className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        NVIDIA reports record Q2 datacenter revenue
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        CNBC · 8 hours ago
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-700">
                Want deeper analysis?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Open the Andromeda AI Chat and ask:{" "}
                <span className="font-mono text-blue-600">
                  &quot;Search the web for today&#39;s top AI market trends and
                  summarize them for my executive board.&quot;
                </span>
              </p>
            </div>
          </div>
        </div>
      </WorkspaceBody>
    </WorkspaceContainer>
  );
}
