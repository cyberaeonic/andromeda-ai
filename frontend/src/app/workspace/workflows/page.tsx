"use client";

import {
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  WorkspaceBody,
  WorkspaceContainer,
  WorkspaceHeader,
} from "@/components/workspace/workspace-container";
import { useI18n } from "@/core/i18n/hooks";

const WORKFLOWS = [
  {
    id: "data-pipeline",
    icon: BarChart3,
    color: "from-violet-600 to-purple-700",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
    title: "Data Intelligence Pipeline",
    subtitle: "Upload CSV → Autonomous Analysis → Executive Report",
    description:
      "Drop a dataset and watch Andromeda AI autonomously inspect, query, chart, and synthesize a full business intelligence report — no prompting required.",
    steps: [
      "Schema inspection & validation",
      "Statistical analysis with Python",
      "DuckDB SQL queries (top/bottom performers)",
      "Anomaly & outlier detection",
      "Chart generation",
      "Executive BI Report",
    ],
    inputLabel: "Dataset path or use sample data",
    inputPlaceholder: "Leave blank to use sample Q3 Revenue data",
    skillName: "data-pipeline",
    buildPrompt: (input: string) =>
      `@data-pipeline Autonomously run the full Data Intelligence Pipeline. ${
        input
          ? `Analyze the dataset at: ${input}`
          : "Use the sample dataset at /home/cyberaeonic/deer-flow/frontend/public/sample-data/q3_revenue.csv"
      }. Execute all 6 steps of the pipeline and deliver the Executive BI Report.`,
  },
  {
    id: "market-scout",
    icon: Search,
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
    title: "Market Intelligence Scout",
    subtitle: "Company/Industry → Web Research → Competitive Brief",
    description:
      "Enter a company or industry and the agent autonomously scouts the web across 4 dimensions — competitors, trends, funding, regulations — and writes a board-ready brief.",
    steps: [
      "Competitor landscape mapping",
      "Market size & growth trends",
      "Funding & M&A activity scan",
      "Regulatory & macro signals",
      "Competitive Intelligence Brief",
    ],
    inputLabel: "Company or industry to research",
    inputPlaceholder: 'e.g. "Salesforce CRM" or "B2B SaaS enterprise"',
    skillName: "market-scout",
    buildPrompt: (input: string) =>
      `@market-scout Autonomously execute the full Market Intelligence Scout for: "${
        input || "B2B SaaS enterprise software market"
      }". Run all 4 research phases and produce the complete Competitive Intelligence Brief.`,
  },
  {
    id: "exec-briefing",
    icon: TrendingUp,
    color: "from-emerald-600 to-teal-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    title: "Executive Weekly Briefing",
    subtitle: "Business Context → Research → Board-Ready Document",
    description:
      "Provide your business focus area and the agent researches industry pulse, KPI benchmarks, macro signals, and opportunities to generate a C-suite briefing document.",
    steps: [
      "Industry pulse check (this week)",
      "KPI benchmarking vs. industry",
      "Macro & regulatory signals",
      "Strategic opportunity scan",
      "Board-ready briefing document",
    ],
    inputLabel: "Business focus area",
    inputPlaceholder: 'e.g. "AI SaaS company" or "fintech payments startup"',
    skillName: "exec-briefing",
    buildPrompt: (input: string) =>
      `@exec-briefing Autonomously generate the Executive Weekly Briefing for: "${
        input || "AI enterprise software company"
      }". Complete all research phases and produce the full board-ready briefing document with decisions required and action items.`,
  },
];

export default function WorkflowsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [launching, setLaunching] = useState<string | null>(null);
  const [launched, setLaunched] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Autonomous Workflows - ${t.pages.appName}`;
  }, [t.pages.appName]);

  const handleLaunch = async (workflow: (typeof WORKFLOWS)[0]) => {
    setLaunching(workflow.id);
    const prompt = workflow.buildPrompt(inputs[workflow.id] ?? "");

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 800));

    setLaunching(null);
    setLaunched(workflow.id);

    // Navigate to chat with pre-filled prompt
    await new Promise((r) => setTimeout(r, 600));
    router.push(
      `/workspace/chats?prompt=${encodeURIComponent(prompt)}&mode=pro`,
    );
  };

  return (
    <WorkspaceContainer>
      <WorkspaceHeader />
      <WorkspaceBody>
        <div className="flex size-full flex-col overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-1.5">
                    <Bot className="size-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
                    Autonomous Agents
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Business Workflow Agents
                </h1>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Launch fully autonomous multi-step agents that research,
                  analyze, and deliver executive-grade outputs — without any
                  further input from you.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm lg:flex">
                <Sparkles className="size-4 text-violet-500" />
                <span className="text-slate-600">
                  Powered by Andromeda AI Agents
                </span>
              </div>
            </div>

            {/* Workflow Cards */}
            <div className="grid gap-6 lg:grid-cols-3">
              {WORKFLOWS.map((workflow) => {
                const Icon = workflow.icon;
                const isLaunching = launching === workflow.id;
                const isLaunched = launched === workflow.id;
                return (
                  <div
                    key={workflow.id}
                    className={`flex flex-col rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 hover:shadow-md ${workflow.borderColor}`}
                  >
                    {/* Card Header */}
                    <div
                      className={`rounded-t-xl bg-gradient-to-br p-5 ${workflow.color}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                          <Icon className="size-6 text-white" />
                        </div>
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                          Autonomous
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-white">
                        {workflow.title}
                      </h2>
                      <p className="mt-0.5 text-sm text-white/75">
                        {workflow.subtitle}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {workflow.description}
                      </p>

                      {/* Steps */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Agent executes:
                        </p>
                        {workflow.steps.map((step, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <div className="size-4 shrink-0 rounded-full bg-slate-100 text-center text-[10px] leading-4 font-bold text-slate-500">
                              {i + 1}
                            </div>
                            {step}
                          </div>
                        ))}
                      </div>

                      {/* Input */}
                      <div className="mt-auto space-y-2">
                        <label className="text-xs font-medium text-slate-600">
                          {workflow.inputLabel}
                        </label>
                        <input
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 focus:outline-none"
                          placeholder={workflow.inputPlaceholder}
                          value={inputs[workflow.id] ?? ""}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              [workflow.id]: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* Launch Button */}
                      <button
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 ${
                          isLaunched
                            ? "bg-green-500"
                            : isLaunching
                              ? "cursor-not-allowed bg-slate-400"
                              : `bg-gradient-to-r ${workflow.color} hover:opacity-90 active:scale-[0.98]`
                        }`}
                        disabled={isLaunching || isLaunched}
                        onClick={() => handleLaunch(workflow)}
                      >
                        {isLaunched ? (
                          <>
                            <CheckCircle2 className="size-4" />
                            Launching...
                          </>
                        ) : isLaunching ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Preparing Agent...
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet className="size-4" />
                            Launch Agent
                            <ChevronRight className="size-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6">
              <h3 className="mb-4 font-semibold text-slate-700">
                How Autonomous Workflows Work
              </h3>
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  {
                    step: "1",
                    label: "You set context",
                    desc: "Enter your company, dataset, or topic",
                  },
                  {
                    step: "2",
                    label: "Agent activates",
                    desc: "Andromeda AI loads the specialist skill",
                  },
                  {
                    step: "3",
                    label: "Autonomous execution",
                    desc: "Multi-step research, analysis & code runs",
                  },
                  {
                    step: "4",
                    label: "Executive output",
                    desc: "Board-ready report delivered to chat",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WorkspaceBody>
    </WorkspaceContainer>
  );
}
