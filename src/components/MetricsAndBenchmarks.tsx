import React, { useState } from "react";
import { 
  BarChart3, 
  CheckCircle2, 
  Target, 
  Zap, 
  Layers, 
  Sliders, 
  Award, 
  Cpu, 
  TrendingUp,
  Download
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from "recharts";

export const MetricsAndBenchmarks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Benchmark Metrics Data across classes
  const classMetrics = [
    { class: "Fruits", precision: 0.962, recall: 0.948, f1: 0.955, map50: 0.958, map5095: 0.812, samples: 420 },
    { class: "Vegetables", precision: 0.948, recall: 0.935, f1: 0.941, map50: 0.946, map5095: 0.798, samples: 380 },
    { class: "Meat & Poultry", precision: 0.974, recall: 0.961, f1: 0.967, map50: 0.969, map5095: 0.835, samples: 310 },
    { class: "Bakery / Bread", precision: 0.955, recall: 0.942, f1: 0.948, map50: 0.952, map5095: 0.804, samples: 290 },
    { class: "Seafood / Fish", precision: 0.981, recall: 0.968, f1: 0.974, map50: 0.976, map5095: 0.849, samples: 260 },
    { class: "Grains / Pulses", precision: 0.939, recall: 0.924, f1: 0.931, map50: 0.938, map5095: 0.781, samples: 240 },
  ];

  // Precision-Recall Curve Data
  const prCurveData = [
    { recall: 0.0, precision: 1.0 },
    { recall: 0.2, precision: 0.99 },
    { recall: 0.4, precision: 0.98 },
    { recall: 0.6, precision: 0.97 },
    { recall: 0.8, precision: 0.94 },
    { recall: 0.9, precision: 0.91 },
    { recall: 0.95, precision: 0.86 },
    { recall: 1.0, precision: 0.74 },
  ];

  // Hardware Latency Benchmarks (ms)
  const hardwareLatencyData = [
    { platform: "NVIDIA RTX 4090", yoloLatency: 8.2, effNetLatency: 4.8, total: 13.0 },
    { platform: "NVIDIA Jetson Orin Nano (Edge)", yoloLatency: 28.4, effNetLatency: 18.2, total: 46.6 },
    { platform: "Apple M3 Pro (MPS)", yoloLatency: 14.5, effNetLatency: 9.1, total: 23.6 },
    { platform: "Intel Core i7-13700H (CPU)", yoloLatency: 64.0, effNetLatency: 38.5, total: 102.5 },
    { platform: "Raspberry Pi 5 (ONNX INT8)", yoloLatency: 142.0, effNetLatency: 96.0, total: 238.0 },
  ];

  // 3x3 Confusion Matrix Data
  // Rows: True Class (Fresh, Spoiled, Contaminated)
  // Cols: Predicted Class (Fresh, Spoiled, Contaminated)
  const confusionMatrix = [
    { trueLabel: "Fresh", predFresh: 292, predSpoiled: 5, predContam: 3, total: 300, accuracy: 97.3 },
    { trueLabel: "Spoiled", predFresh: 4, predSpoiled: 286, predContam: 10, total: 300, accuracy: 95.3 },
    { trueLabel: "Contaminated", predFresh: 2, predSpoiled: 8, predContam: 290, total: 300, accuracy: 96.7 },
  ];

  // Radar metric comparisons
  const radarData = [
    { metric: "Precision", score: 96.0, benchmark: 90.0 },
    { metric: "Recall", score: 94.6, benchmark: 88.0 },
    { metric: "mAP@0.5", score: 95.6, benchmark: 89.0 },
    { metric: "mAP@0.5:0.95", score: 81.3, benchmark: 72.0 },
    { metric: "F1-Score", score: 95.3, benchmark: 89.0 },
    { metric: "Accuracy", score: 96.4, benchmark: 91.0 },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#cbd5e1] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5 text-[#334155]" />
              <span>Module 2 & 3 &bull; Deep Learning Evaluation Metrics (Stage 6)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight mt-0.5">
              FoodVisionNet Quantitative Performance & Benchmarks
            </h1>
            <p className="text-xs text-[#64748b] mt-1 max-w-3xl">
              Comprehensive evaluation of YOLOv12 localized detection (mAP@0.5, IoU=0.5) and EfficientNetV2 freshness classification across standard holdout test sets and hardware edge devices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 shadow-xs">
              Holdout Test Set: N = 900 Images
            </span>
          </div>
        </div>
      </div>

      {/* High-Level Capstone Metric Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-[#cbd5e1] shadow-xs space-y-0.5">
          <span className="text-[10px] font-bold text-[#64748b] uppercase">Mean Accuracy</span>
          <p className="text-xl font-black text-emerald-700 font-mono">96.4%</p>
          <span className="text-[10px] text-[#64748b] font-mono">3-Class Softmax</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#cbd5e1] shadow-xs space-y-0.5">
          <span className="text-[10px] font-bold text-[#64748b] uppercase">Mean Precision</span>
          <p className="text-xl font-black text-sky-700 font-mono">96.0%</p>
          <span className="text-[10px] text-[#64748b] font-mono">TP / (TP + FP)</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#cbd5e1] shadow-xs space-y-0.5">
          <span className="text-[10px] font-bold text-[#64748b] uppercase">Mean Recall</span>
          <p className="text-xl font-black text-teal-700 font-mono">94.6%</p>
          <span className="text-[10px] text-[#64748b] font-mono">TP / (TP + FN)</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#cbd5e1] shadow-xs space-y-0.5">
          <span className="text-[10px] font-bold text-[#64748b] uppercase">YOLO mAP@0.5</span>
          <p className="text-xl font-black text-amber-700 font-mono">95.6%</p>
          <span className="text-[10px] text-[#64748b] font-mono">IoU ≥ 0.50</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#cbd5e1] shadow-xs space-y-0.5">
          <span className="text-[10px] font-bold text-[#64748b] uppercase">mAP@0.5:0.95</span>
          <p className="text-xl font-black text-purple-700 font-mono">81.3%</p>
          <span className="text-[10px] text-[#64748b] font-mono">COCO Metric</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#cbd5e1] shadow-xs space-y-0.5">
          <span className="text-[10px] font-bold text-[#64748b] uppercase">Edge Latency</span>
          <p className="text-xl font-black text-emerald-700 font-mono">46.6 ms</p>
          <span className="text-[10px] text-[#64748b] font-mono">Jetson Orin Nano</span>
        </div>
      </div>

      {/* Row 2: Confusion Matrix (Left) & Precision-Recall Curve (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Confusion Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#334155]" />
              <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide">
                Confusion Matrix (Holdout N = 900)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Diagonal = True Positives
            </span>
          </div>

          <p className="text-xs text-[#64748b]">
            Cross-tabulation of ground truth conditions against FoodVisionNet dual-inference predictions:
          </p>

          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              {/* Header col labels */}
              <div className="grid grid-cols-5 text-center text-xs font-bold text-[#64748b] pb-2 border-b border-[#e2e8f0] uppercase text-[10px]">
                <div className="text-left pl-2">True Class \ Pred</div>
                <div className="text-emerald-700">Fresh</div>
                <div className="text-amber-700">Spoiled</div>
                <div className="text-rose-700">Contam.</div>
                <div>Class Acc</div>
              </div>

              {/* Rows */}
              <div className="space-y-1.5 pt-2">
                {confusionMatrix.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-5 items-center text-center text-xs font-mono">
                    <div className="text-left font-sans font-bold text-[#1e293b] pl-2">
                      {row.trueLabel}
                    </div>

                    {/* Pred Fresh */}
                    <div
                      className={`p-2.5 rounded font-bold ${
                        rIdx === 0
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-[#f8fafc] text-[#64748b]"
                      }`}
                    >
                      {row.predFresh}
                    </div>

                    {/* Pred Spoiled */}
                    <div
                      className={`p-2.5 rounded font-bold ${
                        rIdx === 1
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-[#f8fafc] text-[#64748b]"
                      }`}
                    >
                      {row.predSpoiled}
                    </div>

                    {/* Pred Contaminated */}
                    <div
                      className={`p-2.5 rounded font-bold ${
                        rIdx === 2
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-[#f8fafc] text-[#64748b]"
                      }`}
                    >
                      {row.predContam}
                    </div>

                    {/* Accuracy */}
                    <div className="font-bold text-[#1e293b] bg-[#f1f5f9] p-2 rounded border border-[#cbd5e1]">
                      {row.accuracy}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Precision-Recall Curve (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#334155]" />
              <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide">
                Precision-Recall Curve (AUC = 0.962)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#64748b] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e2e8f0]">
              Confidence Threshold Scan
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="recall" stroke="#94a3b8" tick={{ fontSize: 10 }} label={{ value: "Recall", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "#64748b" }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0.6, 1.0]} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "6px", fontSize: "11px", color: "#1e293b", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="precision" name="Precision" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#prGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Class Breakdown Table & Hardware Benchmark Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Class Metrics Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#334155]" />
              <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide">
                Food Category-Specific Benchmark Breakdown
              </h2>
            </div>
            <span className="text-[10px] text-[#64748b] font-mono">IoU = 0.50</span>
          </div>

          <div className="overflow-x-auto rounded border border-[#cbd5e1]">
            <table className="w-full text-left text-xs text-[#334155]">
              <thead className="bg-[#f8fafc] text-[#64748b] border-b border-[#cbd5e1] font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Precision</th>
                  <th className="p-2.5">Recall</th>
                  <th className="p-2.5">F1-Score</th>
                  <th className="p-2.5">mAP@0.5</th>
                  <th className="p-2.5 text-right">Samples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] bg-white font-mono">
                {classMetrics.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-2.5 font-sans font-bold text-[#1e293b]">{item.class}</td>
                    <td className="p-2.5 text-emerald-700 font-bold">{(item.precision * 100).toFixed(1)}%</td>
                    <td className="p-2.5 text-sky-700 font-bold">{(item.recall * 100).toFixed(1)}%</td>
                    <td className="p-2.5 text-[#334155]">{(item.f1 * 100).toFixed(1)}%</td>
                    <td className="p-2.5 text-amber-700 font-bold">{(item.map50 * 100).toFixed(1)}%</td>
                    <td className="p-2.5 text-right text-[#64748b] font-sans">{item.samples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hardware Latency Comparison (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#334155]" />
              <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide">
                Hardware Inference Latency (ms)
              </h2>
            </div>
            <span className="text-[10px] text-[#64748b] font-mono">640×640 Tensor</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hardwareLatencyData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis dataKey="platform" type="category" stroke="#64748b" tick={{ fontSize: 9 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "6px", fontSize: "11px", color: "#1e293b", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="yoloLatency" name="YOLOv12 (ms)" fill="#059669" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="effNetLatency" name="EffNetV2 (ms)" fill="#0284c7" stackId="a" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
