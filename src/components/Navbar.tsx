import React from "react";
import { ActiveTab } from "../types";
import { 
  Scan, 
  Layers, 
  Cpu, 
  BarChart3, 
  FileText, 
  Code2, 
  CheckCircle2
} from "lucide-react";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNotebook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotebook,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; tag?: string }[] = [
    { id: "inspection", label: "Live Vision Inspection", icon: Scan, tag: "Dual-Engine" },
    { id: "preprocessing", label: "Module 1: Preprocessing", icon: Layers, tag: "640×640" },
    { id: "training", label: "Module 2: Training Studio", icon: Cpu, tag: "Stages 3 & 4" },
    { id: "metrics", label: "Evaluation & Benchmarks", icon: BarChart3, tag: "mAP / IoU" },
    { id: "presentation", label: "Capstone Defense & Report", icon: FileText, tag: "Deck" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#cbd5e1] text-[#1e293b] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand & Capstone Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("inspection")}>
            <div className="w-8 h-8 bg-[#334155] rounded flex items-center justify-center text-white font-bold text-xs italic tracking-wider shadow-sm">
              FVN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#1e293b]">
                  FoodVisionNet
                </span>
                <span className="text-[#64748b] font-normal text-[10px] uppercase tracking-widest border border-[#e2e8f0] bg-[#f8fafc] px-2 py-0.5 rounded">
                  Capstone v1.0
                </span>
              </div>
            </div>
          </div>

          {/* Model Status Indicators */}
          <div className="hidden xl:flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">
            <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>YOLOv12 Active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>EfficientNetV2 Ready</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#334155] text-white shadow-xs"
                      : "text-[#64748b] hover:text-[#1e293b] hover:bg-white"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#64748b]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action button: Colab Python Notebook */}
          <div className="flex items-center gap-2">
            <button
              id="open-colab-modal-btn"
              onClick={onOpenNotebook}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-semibold rounded transition-colors shadow-xs"
              title="Get PyTorch & Ultralytics YOLOv12 Training Code"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Colab / PyTorch</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation sub-bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-[#e2e8f0] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
                  isActive
                    ? "bg-[#334155] text-white font-bold"
                    : "text-[#64748b] hover:text-[#1e293b] bg-white border border-[#e2e8f0]"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label.split(":")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
