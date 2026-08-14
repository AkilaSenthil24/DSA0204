import React, { useState } from "react";
import { ActiveTab } from "./types";
import { Navbar } from "./components/Navbar";
import { LiveInspection } from "./components/LiveInspection";
import { PreprocessingStudio } from "./components/PreprocessingStudio";
import { ModelTrainingStudio } from "./components/ModelTrainingStudio";
import { MetricsAndBenchmarks } from "./components/MetricsAndBenchmarks";
import { PresentationAndReport } from "./components/PresentationAndReport";
import { ColabNotebookModal } from "./components/ColabNotebookModal";
import { ShieldCheck, Cpu, Database, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("inspection");
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1e293b] flex flex-col font-sans selection:bg-[#334155] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotebook={() => setIsNotebookModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 py-4">
        {activeTab === "inspection" && <LiveInspection />}
        {activeTab === "preprocessing" && <PreprocessingStudio />}
        {activeTab === "training" && (
          <ModelTrainingStudio onOpenNotebook={() => setIsNotebookModalOpen(true)} />
        )}
        {activeTab === "metrics" && <MetricsAndBenchmarks />}
        {activeTab === "presentation" && <PresentationAndReport />}
      </main>

      {/* Training Script & Jupyter Notebook Modal */}
      <ColabNotebookModal
        isOpen={isNotebookModalOpen}
        onClose={() => setIsNotebookModalOpen(false)}
      />

      {/* High Density Global Footer */}
      <footer className="h-10 bg-[#1e293b] text-[#94a3b8] border-t border-[#0f172a] flex items-center justify-between px-6 text-[10px] uppercase font-bold tracking-widest mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-white">FoodVisionNet</span>
            <span className="text-[#64748b]">v1.0 Capstone</span>
          </div>
          <span className="hidden md:inline text-[#64748b]">|</span>
          <div className="hidden md:flex items-center gap-3">
            <span>Architecture: Module 1-3 Functional</span>
            <span className="text-[#64748b]">&bull;</span>
            <span>Dataset Split: 70% | 20% | 10%</span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span className="hidden sm:inline text-emerald-400">YOLOv12 + EfficientNetV2</span>
          <span className="text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            Node: #0422-X9
          </span>
        </div>
      </footer>
    </div>
  );
}
