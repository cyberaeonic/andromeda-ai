import type { ScheduleValue } from "@/components/workspace/scheduled-task-schedule-input";

export type RecipeTitleKey = "trending" | "news" | "issues" | "weekly";

export type Recipe = {
  id: string;
  icon: string;
  titleKey: RecipeTitleKey;
  prompt: string;
  schedule: ScheduleValue;
};

// Business-focused starter recipes for Andromeda AI.
export const RECIPES: Recipe[] = [
  {
    id: "trending",
    icon: "📈",
    titleKey: "trending",
    prompt:
      "Use web_search to find today's top business and market trends across AI, fintech, SaaS, and enterprise. Summarize the 5 most impactful trends: trend name, industry sector, and a one-line insight on how it affects our business strategy. Output as a markdown table.",
    schedule: {
      schedule_type: "cron",
      schedule_spec: { cron: "0 9 * * *" },
      timezone: "",
    },
  },
  {
    id: "news",
    icon: "📰",
    titleKey: "news",
    prompt:
      "Use web_search to collect today's top business news across markets, economy, M&A activity, and industry regulations. Summarize the 5 most important items: headline, source, and a one-line business takeaway. Output as a markdown list.",
    schedule: {
      schedule_type: "cron",
      schedule_spec: { cron: "0 9 * * *" },
      timezone: "",
    },
  },
  {
    id: "issues",
    icon: "🎯",
    titleKey: "issues",
    prompt:
      "Analyze our current business pipeline: list the top 10 open action items, categorize each as revenue / cost-optimization / compliance / growth, flag any that are overdue or high-priority, and suggest 2 quick wins. Output as a markdown table.",
    schedule: {
      schedule_type: "cron",
      schedule_spec: { cron: "0 9 * * *" },
      timezone: "",
    },
  },
  {
    id: "weekly",
    icon: "📅",
    titleKey: "weekly",
    prompt:
      "Compile a weekly business review: revenue vs target, top 3 performing products/services, key operational bottlenecks, and the top 3 strategic priorities for next week. Keep it concise and executive-ready.",
    schedule: {
      schedule_type: "cron",
      schedule_spec: { cron: "0 9 * * 1" },
      timezone: "",
    },
  },
];
