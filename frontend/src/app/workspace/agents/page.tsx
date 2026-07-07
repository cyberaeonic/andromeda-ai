"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useThreadStream } from "@/core/threads/hooks";
import { checkAgentName } from "@/core/agents/api";
import { uuid } from "@/core/utils/uuid";

import {
  WorkspaceBody,
  WorkspaceContainer,
  WorkspaceHeader,
} from "@/components/workspace/workspace-container";
import { useI18n } from "@/core/i18n/hooks";

export default function AgentsPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [agentName, setAgentName] = useState("");
  const [agentAspect, setAgentAspect] = useState("harvester");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [setupAgentStatus, setSetupAgentStatus] = useState<"idle" | "requested" | "completed">("idle");
  const threadId = useMemo(() => uuid(), []);

  const { thread, sendMessage } = useThreadStream({
    threadId: undefined,
    context: {
      mode: "flash",
      is_bootstrap: true,
    },
    onFinish() {
      if (setupAgentStatus === "requested") {
        setSetupAgentStatus("idle");
      }
    },
    onToolEnd({ name }) {
      if (name !== "setup_agent" || !agentName) return;
      setSetupAgentStatus("completed");
      toast.success("Agent forged successfully.");
      router.push("/workspace/chats");
    },
  });

  useEffect(() => {
    document.title = `Agents - ${t.pages.appName}`;
  }, [t.pages.appName]);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName || !agentPrompt) return;
    
    setIsCreating(true);
    try {
      const result = await checkAgentName(agentName);
      if (!result.available) {
        toast.error(t.agents.nameStepAlreadyExistsError);
        return;
      }
      
      setSetupAgentStatus("requested");
      toast.info("Forging new entity, please wait...");
      
      await sendMessage(
        threadId,
        {
          text: `Please save this custom agent now based on everything we have discussed so far. Treat this as my explicit confirmation to save. The agent's name is "${agentName}", aspect is "${agentAspect}", and its instructions are: ${agentPrompt}. Generate a concise first SOUL.md in English, and call setup_agent immediately without asking me for more confirmation.`,
          files: [],
        },
        { agent_name: agentName },
      );
    } catch (error) {
      console.error("Failed to check agent name", error);
      toast.error("Failed to verify entity nomenclature. See console for arcane details.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <WorkspaceContainer>
      <WorkspaceHeader />
      <WorkspaceBody>
        <div className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto w-full flex-grow flex flex-col xl:flex-row gap-6">
          {/* Agent Roster (Left Column) */}
          <section className="flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h2 className="font-headline-md text-3xl text-on-surface mb-2">
                  Active Homunculi
                </h2>
                <p className="font-body-md text-on-surface-variant">
                  Manage your conjured agents and their active directives.
                </p>
              </div>
            </div>

            {/* Grid of Enchanted Portraits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Agent Card */}
              <motion.div
                onClick={() => {
                  setAgentName("Aethelgard");
                  setAgentAspect("harvester");
                  setAgentPrompt("Currently scouring the arcane archives for mentions of the lost artifact. Compiling a preliminary report. Tags: #research, #deep-web");
                }}
                whileHover={{ y: -4 }}
                className="bg-black/35 backdrop-blur-2xl rounded-xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(212,160,23,0.15)] border border-primary/30"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden relative shadow-[0_0_10px_rgba(212,160,23,0.5)]">
                      <div className="absolute inset-0 bg-primary/20 animate-pulse-slow mix-blend-overlay"></div>
                      <img
                        alt="Agent Avatar"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt8L9m1gLDLx-EZuyW7bafiDHxfm7M65sYLu8lK-I3FjIPyrcNOgXa9_85cvR-LeGjS5wiEIE7YxxrZhI63bYmB5rVkqhK9bzZ6-jIjZnuTgLUdIX4-W0B3cwUOLO70ifx4lY9avD4f4ijXGOcMCfXb81Dbjc7CRQInjxmMZejCknBftrvQjVQcAO8tNIRikJJCTYSTP5W2tO6E6Zphf2ICA_1BxxIPTMbcF8yYVTVlTxSN2tprWuqS0VnOBQhM96t70yecqJitMpq"
                      />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-xl text-primary">
                        Aethelgard
                      </h3>
                      <span className="font-label-md text-on-surface-variant text-xs">
                        Data Harvester
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container/50 px-2 py-1 rounded-full border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"></div>
                    <span className="font-label-md text-primary text-[10px]">
                      Conjuring
                    </span>
                  </div>
                </div>
                <p className="font-body-md text-on-surface opacity-80 mb-4 line-clamp-2 relative z-10 text-sm">
                  Currently scouring the arcane archives for mentions of the
                  lost artifact. Compiling a preliminary report.
                </p>
                <div className="flex gap-2 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant font-label-md text-xs">
                    #research
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant font-label-md text-xs">
                    #deep-web
                  </span>
                </div>
              </motion.div>

              {/* Inactive Agent Card */}
              <motion.div
                onClick={() => {
                  setAgentName("Brimstone");
                  setAgentAspect("security");
                  setAgentPrompt("Awaiting triggering event. Monitors perimeter wards and incoming anomalous data packets. Tags: #defense");
                }}
                whileHover={{ scale: 1.01 }}
                className="bg-black/35 backdrop-blur-2xl rounded-xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 border border-primary/10 hover:border-primary/30"
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-outline-variant overflow-hidden opacity-60 grayscale group-hover:grayscale-0 transition-all duration-300">
                      <img
                        alt="Agent Avatar"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC-u7Of78awDhHdOhKIhi4sLroHBytROphBmAg7e5DxVg7IA4PUIyQuekuzp2jE08u5O5OHfAqsUVFV6VBvc4NTUJFZYeSmijvqW2hGuYZ-w665GEx4Y1sDYEmmkzhCNpxkW8KVIVN2gebc6D6muLs1SvICVw2Q5UFjMl_THuMHAVp1BFPDwe7AxtsrDSLPRjyfmwKD1gBwFm1kx3Bzc3BXNsh2kG2-XdqjJmf5yu5SliPnb31HKysawjdq6eUKgPHcriwQU0EVpSX"
                      />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-xl text-on-surface opacity-60 group-hover:opacity-100 transition-opacity">
                        Brimstone
                      </h3>
                      <span className="font-label-md text-on-surface-variant text-xs">
                        Security Protocol
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container/50 px-2 py-1 rounded-full border border-outline-variant">
                    <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                    <span className="font-label-md text-on-surface-variant text-[10px]">
                      Dormant
                    </span>
                  </div>
                </div>
                <p className="font-body-md text-on-surface opacity-50 mb-4 line-clamp-2 relative z-10 text-sm">
                  Awaiting triggering event. Monitors perimeter wards and
                  incoming anomalous data packets.
                </p>
                <div className="flex gap-2 relative z-10 opacity-50">
                  <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant font-label-md text-xs">
                    #defense
                  </span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Agent Builder (Right Column / Panel) */}
          <section className="w-full xl:w-[400px] shrink-0">
            <div className="bg-black/35 backdrop-blur-2xl border border-primary/20 rounded-xl p-6 h-full flex flex-col relative overflow-hidden shadow-[0_0_20px_rgba(212,160,23,0.05)]">
              {/* Parchment texture overlay */}
              <div className="absolute inset-0 parchment-overlay z-0"></div>
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <span className="material-symbols-outlined text-primary text-2xl">
                  add_circle
                </span>
                <h2 className="font-headline-sm text-2xl text-primary">
                  Forge New Entity
                </h2>
              </div>
              <form
                className="flex flex-col gap-5 flex-grow relative z-10"
                onSubmit={handleCreateAgent}
              >
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-sm text-on-surface-variant">
                    Entity Nomenclature
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(212,160,23,0.3)] transition-all duration-300"
                    placeholder="e.g. Scryer-01"
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-sm text-on-surface-variant">
                    Primary Aspect (Class)
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-surface-container-lowest/50 border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(212,160,23,0.3)] transition-all duration-300"
                      value={agentAspect}
                      onChange={(e) => setAgentAspect(e.target.value)}
                    >
                      <option value="harvester">
                        Data Harvester (Scraping)
                      </option>
                      <option value="weaver">Lore Weaver (Generation)</option>
                      <option value="sentinel">
                        Warding Sentinel (Monitoring)
                      </option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <label className="font-label-md text-sm text-on-surface-variant">
                    Initial Directives (Prompt)
                  </label>
                  <textarea
                    className="w-full h-full min-h-[120px] bg-surface-container-lowest/50 border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(212,160,23,0.3)] transition-all duration-300 resize-none"
                    placeholder="Inscribe the entity's purpose..."
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                  ></textarea>
                </div>
                  <button
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-on-primary font-label-lg text-base py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(212,160,23,0.3)] hover:shadow-[0_0_30px_rgba(212,160,23,0.5)] active:scale-[0.98]"
                    type="submit"
                    disabled={isCreating || setupAgentStatus === "requested"}
                  >
                    <span className="material-symbols-outlined font-light">
                      {(isCreating || setupAgentStatus === "requested") ? "hourglass_empty" : "magic_button"}
                    </span>
                    {(isCreating || setupAgentStatus === "requested") ? "Forging Entity..." : "Forge Entity"}
                  </button>
              </form>
            </div>
          </section>
        </div>
      </WorkspaceBody>
    </WorkspaceContainer>
  );
}
