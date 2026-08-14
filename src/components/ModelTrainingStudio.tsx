import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Code2, 
  Zap, 
  Flame, 
  Sliders, 
  CheckCircle2, 
  Activity,
  Layers
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface TrainingEpochData {
  epoch: number;
  yoloTrainLoss: number;
  yoloValLoss: number;
  yoloMap50: number;
  effNetTrainLoss: number;
  effNetValLoss: number;
  effNetAccuracy: number;
  learningRate: number;
}

export const ModelTrainingStudio: React.FC<{ onOpenNotebook: () => void }> = ({ onOpenNotebook }) => {
  // Hyperparameters
  const [selectedModel, setSelectedModel] = useState<"both" | "yolov12" | "efficientnetv2">("both");
  const [epochsTotal, setEpochsTotal] = useState<number>(50);
  const [batchSize, setBatchSize] = useState<number>(16);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [optimizer, setOptimizer] = useState<"AdamW" | "SGD" | "RMSprop">("AdamW");
  const [imgSize, setImgSize] = useState<number>(640);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(35);

  // Simulated Training Curve History
  const [trainingHistory, setTrainingHistory] = useState<TrainingEpochData[]>([]);

  // Initialize simulated training history up to epoch 35
  useEffect(() => {
    const history: TrainingEpochData[] = [];
    for (let ep = 1; ep <= currentEpoch; ep++) {
      const progress = ep / epochsTotal;
      // Exponential decay curves
      const yoloTrainLoss = 0.05 + 0.95 * Math.exp(-progress * 3.8) + (Math.random() * 0.02 - 0.01);
      const yoloValLoss = 0.08 + 0.92 * Math.exp(-progress * 3.4) + (Math.random() * 0.03 - 0.015);
      const yoloMap50 = Math.min(0.965, 0.42 + 0.54 * (1 - Math.exp(-progress * 4.2)) + (Math.random() * 0.01 - 0.005));

      const effNetTrainLoss = 0.04 + 0.96 * Math.exp(-progress * 4.0) + (Math.random() * 0.02 - 0.01);
      const effNetValLoss = 0.07 + 0.93 * Math.exp(-progress * 3.6) + (Math.random() * 0.02 - 0.01);
      const effNetAccuracy = Math.min(0.978, 0.48 + 0.49 * (1 - Math.exp(-progress * 4.5)) + (Math.random() * 0.01 - 0.005));

      // Cosine annealing lr
      const lr = learningRate * 0.5 * (1 + Math.cos((Math.PI * ep) / epochsTotal));

      history.push({
        epoch: ep,
        yoloTrainLoss: parseFloat(yoloTrainLoss.toFixed(4)),
        yoloValLoss: parseFloat(yoloValLoss.toFixed(4)),
        yoloMap50: parseFloat(yoloMap50.toFixed(4)),
        effNetTrainLoss: parseFloat(effNetTrainLoss.toFixed(4)),
        effNetValLoss: parseFloat(effNetValLoss.toFixed(4)),
        effNetAccuracy: parseFloat(effNetAccuracy.toFixed(4)),
        learningRate: parseFloat(lr.toFixed(6)),
      });
    }
    setTrainingHistory(history);
  }, [epochsTotal, learningRate]);

  // Live training simulation loop
  useEffect(() => {
    let interval: any;
    if (isTraining && currentEpoch < epochsTotal) {
      interval = setInterval(() => {
        setCurrentEpoch((prev) => {
          if (prev >= epochsTotal) {
            setIsTraining(false);
            return prev;
          }
          const ep = prev + 1;
          const progress = ep / epochsTotal;

          const yoloTrainLoss = 0.05 + 0.95 * Math.exp(-progress * 3.8) + (Math.random() * 0.02 - 0.01);
          const yoloValLoss = 0.08 + 0.92 * Math.exp(-progress * 3.4) + (Math.random() * 0.03 - 0.015);
          const yoloMap50 = Math.min(0.965, 0.42 + 0.54 * (1 - Math.exp(-progress * 4.2)) + (Math.random() * 0.01 - 0.005));

          const effNetTrainLoss = 0.04 + 0.96 * Math.exp(-progress * 4.0) + (Math.random() * 0.02 - 0.01);
          const effNetValLoss = 0.07 + 0.93 * Math.exp(-progress * 3.6) + (Math.random() * 0.02 - 0.01);
          const effNetAccuracy = Math.min(0.978, 0.48 + 0.49 * (1 - Math.exp(-progress * 4.5)) + (Math.random() * 0.01 - 0.005));

          const lr = learningRate * 0.5 * (1 + Math.cos((Math.PI * ep) / epochsTotal));

          setTrainingHistory((old) => [
            ...old,
            {
              epoch: ep,
              yoloTrainLoss: parseFloat(yoloTrainLoss.toFixed(4)),
              yoloValLoss: parseFloat(yoloValLoss.toFixed(4)),
              yoloMap50: parseFloat(yoloMap50.toFixed(4)),
              effNetTrainLoss: parseFloat(effNetTrainLoss.toFixed(4)),
              effNetValLoss: parseFloat(effNetValLoss.toFixed(4)),
              effNetAccuracy: parseFloat(effNetAccuracy.toFixed(4)),
              learningRate: parseFloat(lr.toFixed(6)),
            },
          ]);

          return ep;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isTraining, currentEpoch, epochsTotal, learningRate]);

  const latestStats = trainingHistory[trainingHistory.length - 1] || {
    yoloTrainLoss: 0.12,
    yoloValLoss: 0.15,
    yoloMap50: 0.942,
    effNetTrainLoss: 0.09,
    effNetValLoss: 0.11,
    effNetAccuracy: 0.964,
  };

  const handleReset = () => {
    setIsTraining(false);
    setCurrentEpoch(1);
    setTrainingHistory([]);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#cbd5e1] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-[#334155]" />
              <span>Module 2 &bull; Deep Learning Fine-Tuning Studio (Stages 3 & 4)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight mt-0.5">
              YOLOv12 & EfficientNetV2 Training Pipeline
            </h1>
            <p className="text-xs text-[#64748b] mt-1 max-w-3xl">
              Fine-tune the YOLOv12 bounding-box localization backbone alongside the EfficientNetV2 deep quality classifier with PyTorch, cosine learning rate schedules, and real-time loss tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotebook}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-semibold rounded shadow-xs transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Get Colab Python Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Selector & Live Control Toolbar */}
      <div className="bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
          {/* Model toggle pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#64748b] uppercase">Architecture:</span>
            <div className="flex gap-1 bg-[#f1f5f9] p-0.5 rounded border border-[#e2e8f0] text-xs">
              <button
                onClick={() => setSelectedModel("both")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedModel === "both"
                    ? "bg-[#334155] text-white shadow-xs"
                    : "text-[#64748b] hover:text-[#1e293b]"
                }`}
              >
                Dual Backbone (YOLOv12 + EffNetV2)
              </button>
              <button
                onClick={() => setSelectedModel("yolov12")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedModel === "yolov12"
                    ? "bg-[#334155] text-white shadow-xs"
                    : "text-[#64748b] hover:text-[#1e293b]"
                }`}
              >
                Stage 3: YOLOv12 Object & Contamination
              </button>
              <button
                onClick={() => setSelectedModel("efficientnetv2")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedModel === "efficientnetv2"
                    ? "bg-[#334155] text-white shadow-xs"
                    : "text-[#64748b] hover:text-[#1e293b]"
                }`}
              >
                Stage 4: EfficientNetV2 Classifier
              </button>
            </div>
          </div>

          {/* Play / Pause / Reset Simulation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold transition-all shadow-xs ${
                isTraining
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white"
              }`}
            >
              {isTraining ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Training</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{currentEpoch >= epochsTotal ? "Restart Training" : "Resume Training"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f8fafc] text-[#334155] border border-[#cbd5e1] rounded text-xs font-semibold shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Hyperparameter Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0] space-y-1">
            <label className="text-[#64748b] font-bold block text-[10px] uppercase">Epochs Total</label>
            <input
              type="number"
              value={epochsTotal}
              onChange={(e) => setEpochsTotal(parseInt(e.target.value) || 50)}
              className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-[#1e293b] font-mono font-bold text-xs"
            />
          </div>

          <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0] space-y-1">
            <label className="text-[#64748b] font-bold block text-[10px] uppercase">Batch Size</label>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-[#1e293b] font-mono font-bold text-xs"
            >
              <option value={8}>8 (Edge device)</option>
              <option value={16}>16 (Standard)</option>
              <option value={32}>32 (Workstation)</option>
              <option value={64}>64 (Multi-GPU)</option>
            </select>
          </div>

          <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0] space-y-1">
            <label className="text-[#64748b] font-bold block text-[10px] uppercase">Learning Rate (lr0)</label>
            <input
              type="number"
              step="0.0001"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.001)}
              className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-[#1e293b] font-mono font-bold text-xs"
            />
          </div>

          <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0] space-y-1">
            <label className="text-[#64748b] font-bold block text-[10px] uppercase">Optimizer</label>
            <select
              value={optimizer}
              onChange={(e) => setOptimizer(e.target.value as any)}
              className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-[#1e293b] font-mono font-bold text-xs"
            >
              <option value="AdamW">AdamW (Decoupled)</option>
              <option value="SGD">SGD (Nesterov)</option>
              <option value="RMSprop">RMSprop</option>
            </select>
          </div>

          <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0] space-y-1">
            <label className="text-[#64748b] font-bold block text-[10px] uppercase">Input Size (px)</label>
            <select
              value={imgSize}
              onChange={(e) => setImgSize(parseInt(e.target.value))}
              className="w-full bg-white border border-[#cbd5e1] rounded px-2 py-1 text-[#1e293b] font-mono font-bold text-xs"
            >
              <option value={640}>640 × 640 (Standard)</option>
              <option value={512}>512 × 512 (Fast)</option>
              <option value={800}>800 × 800 (High-Res)</option>
            </select>
          </div>

          <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0] space-y-1">
            <label className="text-[#64748b] font-bold block text-[10px] uppercase">Epoch Progress</label>
            <div className="flex items-center justify-between text-emerald-700 font-mono font-bold pt-0.5">
              <span>{currentEpoch} / {epochsTotal}</span>
              <span className="text-[10px] text-[#64748b]">{((currentEpoch / epochsTotal) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${(currentEpoch / epochsTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Metrics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-[#cbd5e1] shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs text-[#64748b]">
            <span className="font-bold text-[11px] uppercase">YOLOv12 mAP@0.5</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
            {(latestStats.yoloMap50 * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-[#64748b]">Box localization mean avg precision</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#cbd5e1] shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs text-[#64748b]">
            <span className="font-bold text-[11px] uppercase">EfficientNetV2 Accuracy</span>
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-sky-700 font-mono">
            {(latestStats.effNetAccuracy * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-[#64748b]">3-Class freshness classification accuracy</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#cbd5e1] shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs text-[#64748b]">
            <span className="font-bold text-[11px] uppercase">YOLOv12 Val Loss</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700 font-mono">
            {latestStats.yoloValLoss}
          </p>
          <p className="text-[10px] text-[#64748b]">Box + Class + DFL combined loss</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#cbd5e1] shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs text-[#64748b]">
            <span className="font-bold text-[11px] uppercase">EfficientNetV2 Loss</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-700 font-mono">
            {latestStats.effNetValLoss}
          </p>
          <p className="text-[10px] text-[#64748b]">Cross-entropy classification loss</p>
        </div>
      </div>

      {/* Real-Time Interactive Loss & Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Training & Validation Loss Curves */}
        <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#334155]" /> Loss Convergence Curves (Epoch 1 &ndash; {currentEpoch})
            </h3>
            <span className="text-[10px] font-mono text-[#64748b]">Lower is better</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="epoch" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 1.1]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "6px", fontSize: "11px", color: "#1e293b", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Line type="monotone" dataKey="yoloTrainLoss" name="YOLO Train Loss" stroke="#059669" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="yoloValLoss" name="YOLO Val Loss" stroke="#d97706" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="effNetValLoss" name="EffNet Val Loss" stroke="#9333ea" dot={false} strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: mAP@0.5 & Accuracy Progression */}
        <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#334155]" /> mAP@0.5 & Top-1 Accuracy Progression
            </h3>
            <span className="text-[10px] font-mono text-[#64748b]">Higher is better</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="epoch" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0.3, 1.0]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "6px", fontSize: "11px", color: "#1e293b", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Line type="monotone" dataKey="yoloMap50" name="YOLOv12 mAP@0.5" stroke="#0284c7" dot={false} strokeWidth={2.5} />
                <Line type="monotone" dataKey="effNetAccuracy" name="EffNet Accuracy" stroke="#059669" dot={false} strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
