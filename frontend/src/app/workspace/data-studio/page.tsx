"use client";

import { CloudUpload, FileSpreadsheet, TableProperties } from "lucide-react";
import { useEffect } from "react";

import {
  WorkspaceBody,
  WorkspaceContainer,
  WorkspaceHeader,
} from "@/components/workspace/workspace-container";
import { useI18n } from "@/core/i18n/hooks";

export default function DataStudioPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `Data Studio - ${t.pages.appName}`;
  }, [t.pages.appName]);

  return (
    <WorkspaceContainer>
      <WorkspaceHeader />
      <WorkspaceBody>
        <div className="flex size-full flex-col p-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            {/* Header section */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Data Studio</h1>
              <p className="text-muted-foreground mt-2">
                Upload your CSV or Excel (.xlsx) files directly to inspect
                schemas and prepare for SQL analysis.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 py-16 transition-colors hover:bg-slate-100">
              <CloudUpload className="text-muted-foreground mb-4 size-12" />
              <h3 className="text-lg font-semibold text-slate-700">
                Drag & Drop your dataset here
              </h3>
              <p className="text-muted-foreground text-sm">
                or click to browse from your computer
              </p>
              <div className="mt-6 flex gap-4">
                <span className="flex items-center gap-2 rounded-md bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                  <FileSpreadsheet className="size-3.5" /> .xlsx
                </span>
                <span className="flex items-center gap-2 rounded-md bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                  <TableProperties className="size-3.5" /> .csv
                </span>
              </div>
            </div>

            {/* Mock Data Grid */}
            <div className="mt-8 rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold text-slate-800">
                  Recent Datasets
                </h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Filename</th>
                      <th className="px-6 py-3 font-medium">Records</th>
                      <th className="px-6 py-3 font-medium">Last Modified</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="flex items-center gap-2 px-6 py-4 font-medium">
                        <FileSpreadsheet className="size-4 text-green-600" />{" "}
                        Q3_Revenue_Final.xlsx
                      </td>
                      <td className="px-6 py-4">12,450</td>
                      <td className="px-6 py-4">2 hours ago</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-green-600">
                          Indexed
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="flex items-center gap-2 px-6 py-4 font-medium">
                        <TableProperties className="size-4 text-blue-600" />{" "}
                        user_demographics.csv
                      </td>
                      <td className="px-6 py-4">840,192</td>
                      <td className="px-6 py-4">Yesterday</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-green-600">
                          Indexed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </WorkspaceBody>
    </WorkspaceContainer>
  );
}
