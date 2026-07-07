"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

import {
  WorkspaceBody,
  WorkspaceContainer,
  WorkspaceHeader,
} from "@/components/workspace/workspace-container";
import { useI18n } from "@/core/i18n/hooks";
import { useInfiniteThreads } from "@/core/threads/hooks";
import {
  channelSourceOfThread,
  pathOfThread,
  titleOfThread,
} from "@/core/threads/utils";
import { formatTimeAgo } from "@/core/utils/datetime";

export default function ChatsPage() {
  const { t } = useI18n();
  const {
    data: infiniteThreads,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteThreads();
  const threads = useMemo(
    () => infiniteThreads?.pages.flat() ?? [],
    [infiniteThreads]
  );
  const [search, setSearch] = useState("");
  const isSearching = search.trim().length > 0;

  useEffect(() => {
    document.title = `${t.pages.chats} - ${t.pages.appName}`;
  }, [t.pages.chats, t.pages.appName]);

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      return titleOfThread(thread).toLowerCase().includes(search.toLowerCase());
    });
  }, [threads, search]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !hasNextPage || isSearching) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSearching]);

  return (
    <WorkspaceContainer>
      <WorkspaceHeader />
      <WorkspaceBody>
        <div className="flex size-full flex-col p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto pb-32 md:pb-12">
          <header className="mb-12">
            <h2 className="font-display-lg text-4xl md:text-5xl text-primary mb-2">
              Grimoire of Invocations
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
              Consult the archives of your past conjurations and conversations
              with the homunculi.
            </p>
          </header>

          <div className="flex shrink-0 items-center justify-center mb-8 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur opacity-30 group-focus-within:opacity-100 group-focus-within:from-primary/60 group-focus-within:to-primary/30 transition duration-500"></div>
            <div className="relative flex items-center w-full max-w-2xl bg-surface-container-lowest/80 backdrop-blur-2xl border border-primary/30 rounded-xl p-2 shadow-[0_0_20px_rgba(212,160,23,0.1)]">
              <span className="material-symbols-outlined text-primary/50 ml-2">
                search
              </span>
              <input
                type="search"
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-lg px-4 py-2 placeholder:text-on-surface-variant/40 outline-none"
                placeholder={t.chats.searchChats || "Search the Grimoire..."}
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <main className="min-h-0 flex-1 w-full max-w-4xl mx-auto overflow-y-auto">
            <div className="flex flex-col gap-4">
              {filteredThreads.map((thread, index) => {
                const channelSource = channelSourceOfThread(thread);
                return (
                  <motion.div
                    key={thread.thread_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={pathOfThread(thread)}>
                      <div className="bg-black/35 backdrop-blur-2xl rounded-xl border border-primary/20 p-5 group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(212,160,23,0.15)] hover:scale-[1.01] relative overflow-hidden flex items-center gap-4">
                        <div className="absolute inset-0 parchment-overlay z-0"></div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(212,160,23,0.2)] group-hover:bg-primary/20 transition-colors z-10 shrink-0">
                          <span className="material-symbols-outlined">
                            auto_awesome
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 z-10">
                          <h4 className="font-headline-sm text-lg text-inverse-surface group-hover:text-primary transition-colors truncate">
                            {titleOfThread(thread)}
                          </h4>
                          {thread.updated_at && (
                            <div className="text-on-surface-variant/60 text-sm mt-1">
                              {formatTimeAgo(thread.updated_at)}
                            </div>
                          )}
                          {thread.values?.goal?.objective && (
                            <div className="mt-2 text-sm text-on-surface-variant/80 italic line-clamp-2 border-l-2 border-primary/30 pl-3 group-hover:border-primary/60 transition-colors">
                              "{thread.values.goal.objective}"
                            </div>
                          )}
                        </div>
                        <div className="z-10 text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transform duration-300">
                          <span className="material-symbols-outlined">
                            arrow_forward
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {filteredThreads.length === 0 && !isFetchingNextPage && (
                <div className="text-center py-12 text-on-surface-variant opacity-60">
                  <span className="material-symbols-outlined text-4xl mb-4 opacity-50">
                    auto_awesome_motion
                  </span>
                  <p>The archives yield no such prophecies.</p>
                </div>
              )}

              {hasNextPage && !isSearching && (
                <div
                  ref={sentinelRef}
                  aria-hidden="true"
                  className="h-px w-full"
                  data-testid="chats-page-sentinel"
                />
              )}
              {hasNextPage && isSearching && (
                <div className="flex justify-center p-4">
                  <button
                    className="px-6 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => void fetchNextPage()}
                    disabled={isFetchingNextPage}
                    data-testid="chats-page-load-more"
                  >
                    {isFetchingNextPage
                      ? t.chats.loadingMore
                      : t.chats.loadMoreToSearch}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </WorkspaceBody>
    </WorkspaceContainer>
  );
}
