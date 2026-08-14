import React, { useState, useEffect } from "react";
import { SAMPLE_FOODS } from "../data/sampleDataset";
import { preprocessTo640, generateAugmentations, PreprocessedImageDetails } from "../utils/imageProcessing";
import { DatasetItem, FoodStatus } from "../types";
import { 
  Layers, 
  Crop, 
  Sliders, 
  BarChart, 
  Split, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Eye, 
  FileJson,
  Cpu,
  RefreshCw
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export const PreprocessingStudio: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_FOODS[0]);
  const [preprocessed, setPreprocessed] = useState<PreprocessedImageDetails | null>(null);
  const [augmentations, setAugmentations] = useState<{
    original: string;
    horizontalFlip: string;
    gaussianBlur: string;
    colorJitter: string;
    sobelEdge: string;
  } | null>(null);

  const [activeChannelView, setActiveChannelView] = useState<"rgb" | "edges" | "jitter" | "blur">("rgb");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 70 / 20 / 10 Split Dataset State
  const [datasetList, setDatasetList] = useState<DatasetItem[]>([
    { id: "ds-01", name: "Apple_Fresh_001.jpg", category: "Fruit", status: "Fresh", split: "train", resolution: "640x640", boxesCount: 1, image: SAMPLE_FOODS[0].previewUrl },
    { id: "ds-02", name: "Bread_Mold_002.jpg", category: "Bakery", status: "Spoiled", split: "train", resolution: "640x640", boxesCount: 3, image: SAMPLE_FOODS[1].previewUrl },
    { id: "ds-03", name: "Salad_Plastic_003.jpg", category: "Vegetable", status: "Contaminated", split: "train", resolution: "640x640", boxesCount: 2, image: SAMPLE_FOODS[2].previewUrl },
    { id: "ds-04", name: "Beef_Decay_004.jpg", category: "Meat", status: "Spoiled", split: "train", resolution: "640x640", boxesCount: 2, image: SAMPLE_FOODS[3].previewUrl },
    { id: "ds-05", name: "Salmon_Fresh_005.jpg", category: "Seafood", status: "Fresh", split: "train", resolution: "640x640", boxesCount: 1, image: SAMPLE_FOODS[4].previewUrl },
    { id: "ds-06", name: "Banana_Overripe_006.jpg", category: "Fruit", status: "Spoiled", split: "train", resolution: "640x640", boxesCount: 2, image: SAMPLE_FOODS[5].previewUrl },
    { id: "ds-07", name: "Rice_Weevil_007.jpg", category: "Grain", status: "Contaminated", split: "train", resolution: "640x640", boxesCount: 2, image: SAMPLE_FOODS[6].previewUrl },
    { id: "ds-08", name: "Pepper_Fresh_008.jpg", category: "Vegetable", status: "Fresh", split: "val", resolution: "640x640", boxesCount: 1, image: SAMPLE_FOODS[7].previewUrl },
    { id: "ds-09", name: "Apple_Fresh_009.jpg", category: "Fruit", status: "Fresh", split: "val", resolution: "640x640", boxesCount: 1, image: SAMPLE_FOODS[0].previewUrl },
    { id: "ds-10", name: "Bread_Mold_010.jpg", category: "Bakery", status: "Spoiled", split: "test", resolution: "640x640", boxesCount: 3, image: SAMPLE_FOODS[1].previewUrl },
  ]);

  const [activeSplitFilter, setActiveSplitFilter] = useState<"all" | "train" | "val" | "test">("all");

  useEffect(() => {
    processSample(selectedSample.previewUrl);
  }, [selectedSample]);

  const processSample = async (imgUrl: string) => {
    setIsProcessing(true);
    try {
      const details = await preprocessTo640(imgUrl, 640);
      setPreprocessed(details);
      const augs = await generateAugmentations(imgUrl);
      setAugmentations(augs);
    } catch (err) {
      console.error("Error in preprocessing studio:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-split dataset generator (70% Train, 20% Val, 10% Test)
  const autoRebalanceSplit = () => {
    const shuffled = [...datasetList].sort(() => 0.5 - Math.random());
    const total = shuffled.length;
    const trainCount = Math.round(total * 0.7);
    const valCount = Math.round(total * 0.2);

    const updated = shuffled.map((item, idx) => {
      let split: "train" | "val" | "test" = "train";
      if (idx >= trainCount && idx < trainCount + valCount) {
        split = "val";
      } else if (idx >= trainCount + valCount) {
        split = "test";
      }
      return { ...item, split };
    });

    setDatasetList(updated);
  };

  // Split Statistics
  const trainItems = datasetList.filter((d) => d.split === "train");
  const valItems = datasetList.filter((d) => d.split === "val");
  const testItems = datasetList.filter((d) => d.split === "test");

  const splitPieData = [
    { name: "Training (70%)", value: trainItems.length, color: "#10b981" },
    { name: "Validation (20%)", value: valItems.length, color: "#06b6d4" },
    { name: "Testing (10%)", value: testItems.length, color: "#f59e0b" },
  ];

  const classDistData = [
    { name: "Fresh", count: datasetList.filter((d) => d.status === "Fresh").length },
    { name: "Spoiled", count: datasetList.filter((d) => d.status === "Spoiled").length },
    { name: "Contaminated", count: datasetList.filter((d) => d.status === "Contaminated").length },
  ];

  // Filtered dataset list
  const filteredDataset = activeSplitFilter === "all" 
    ? datasetList 
    : datasetList.filter((d) => d.split === activeSplitFilter);

  // Export YOLO dataset YAML
  const downloadDatasetConfig = () => {
    const yamlContent = `# FoodVisionNet YOLOv12 & EfficientNetV2 Dataset Configuration
path: ./foodvisionnet_dataset
train: images/train  # 70% (n=${trainItems.length})
val: images/val      # 20% (n=${valItems.length})
test: images/test    # 10% (n=${testItems.length})

# Classes definition
nc: 3
names:
  0: Fresh
  1: Spoiled
  2: Contaminated

# Preprocessing Specs
input_shape: [640, 640, 3]
mean: [${preprocessed?.meanR.toFixed(3) || 0.485}, ${preprocessed?.meanG.toFixed(3) || 0.456}, ${preprocessed?.meanB.toFixed(3) || 0.406}]
std: [${preprocessed?.stdR.toFixed(3) || 0.229}, ${preprocessed?.stdG.toFixed(3) || 0.224}, ${preprocessed?.stdB.toFixed(3) || 0.225}]
augmentations:
  hflip: 0.5
  mosaic: 1.0
  color_jitter: 0.2
`;
    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.yaml";
    a.click();
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#cbd5e1] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#334155]" />
              <span>Module 1 &bull; Image Preprocessing & Dataset Partition</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight mt-0.5">
              640 × 640 Preprocessing, Normalization & 70/20/10 Split
            </h1>
            <p className="text-xs text-[#64748b] mt-1 max-w-3xl">
              Prepares high-resolution raw RGB food captures for YOLOv12 feature pyramid networks and EfficientNetV2 convolutional stages via letterbox scaling, RGB/HSV tensor normalization, and augmentation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadDatasetConfig}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-semibold rounded shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export data.yaml</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 640x640 Transformation Workbench (Top Half) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left 640x640 Interactive Preview (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Crop className="w-3.5 h-3.5 text-[#334155]" />
              <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide">
                Target Tensor View: 640 × 640 × 3 (RGB)
              </h2>
            </div>
            <div className="flex gap-1 bg-[#f1f5f9] p-0.5 rounded border border-[#e2e8f0] text-[11px]">
              <button
                onClick={() => setActiveChannelView("rgb")}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  activeChannelView === "rgb" ? "bg-[#334155] text-white" : "text-[#64748b] hover:text-[#1e293b]"
                }`}
              >
                RGB
              </button>
              <button
                onClick={() => setActiveChannelView("edges")}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  activeChannelView === "edges" ? "bg-[#334155] text-white" : "text-[#64748b] hover:text-[#1e293b]"
                }`}
              >
                Sobel Edges
              </button>
              <button
                onClick={() => setActiveChannelView("jitter")}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  activeChannelView === "jitter" ? "bg-[#334155] text-white" : "text-[#64748b] hover:text-[#1e293b]"
                }`}
              >
                Color Jitter
              </button>
              <button
                onClick={() => setActiveChannelView("blur")}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  activeChannelView === "blur" ? "bg-[#334155] text-white" : "text-[#64748b] hover:text-[#1e293b]"
                }`}
              >
                Gaussian Blur
              </button>
            </div>
          </div>

          {/* Main Visual Display */}
          <div className="relative aspect-square w-full rounded-md overflow-hidden bg-slate-900 border border-[#cbd5e1] flex items-center justify-center">
            {preprocessed ? (
              <img
                src={
                  activeChannelView === "edges" && augmentations
                    ? augmentations.sobelEdge
                    : activeChannelView === "jitter" && augmentations
                    ? augmentations.colorJitter
                    : activeChannelView === "blur" && augmentations
                    ? augmentations.gaussianBlur
                    : preprocessed.dataUrl
                }
                alt="Preprocessed food preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
            )}

            {/* Overlay grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/90 backdrop-blur-xs rounded text-[10px] font-mono text-emerald-400 border border-slate-700">
              Input Resized: 640×640 (Pad: #111827)
            </div>
          </div>

          {/* Sample Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SAMPLE_FOODS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSample(s)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium transition-all border ${
                  selectedSample.id === s.id
                    ? "bg-[#334155] text-white border-[#334155] font-bold shadow-xs"
                    : "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0] hover:bg-white hover:text-[#1e293b]"
                }`}
              >
                {s.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Normalization & Augmentations Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Normalization Tensor Statistics */}
          <div className="bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#334155]" />
                <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide">
                  Tensor Normalization (Mean & Std Dev)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#334155] bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#cbd5e1]">
                Range [0.0, 1.0]
              </span>
            </div>

            <p className="text-xs text-[#64748b]">
              Mean subtraction & standard deviation scaling calibrated for PyTorch ImageNet backbone compatibility:
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0]">
                <div className="flex items-center justify-between text-rose-700 font-bold text-[11px]">
                  <span>Channel R</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <p className="text-[10px] text-[#64748b] mt-1">
                  Mean: <span className="font-mono text-[#1e293b] font-bold">{preprocessed?.meanR.toFixed(3) || "0.485"}</span>
                </p>
                <p className="text-[10px] text-[#64748b]">
                  Std: <span className="font-mono text-[#1e293b] font-bold">{preprocessed?.stdR.toFixed(3) || "0.229"}</span>
                </p>
              </div>

              <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0]">
                <div className="flex items-center justify-between text-emerald-700 font-bold text-[11px]">
                  <span>Channel G</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] text-[#64748b] mt-1">
                  Mean: <span className="font-mono text-[#1e293b] font-bold">{preprocessed?.meanG.toFixed(3) || "0.456"}</span>
                </p>
                <p className="text-[10px] text-[#64748b]">
                  Std: <span className="font-mono text-[#1e293b] font-bold">{preprocessed?.stdG.toFixed(3) || "0.224"}</span>
                </p>
              </div>

              <div className="bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0]">
                <div className="flex items-center justify-between text-blue-700 font-bold text-[11px]">
                  <span>Channel B</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p className="text-[10px] text-[#64748b] mt-1">
                  Mean: <span className="font-mono text-[#1e293b] font-bold">{preprocessed?.meanB.toFixed(3) || "0.406"}</span>
                </p>
                <p className="text-[10px] text-[#64748b]">
                  Std: <span className="font-mono text-[#1e293b] font-bold">{preprocessed?.stdB.toFixed(3) || "0.225"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Computer Vision Data Augmentation Grid */}
          <div className="bg-white rounded-lg border border-[#cbd5e1] p-3 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#334155]" />
                <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wide">
                  Data Augmentation Pipeline Simulation
                </h3>
              </div>
              <span className="text-[10px] text-[#64748b] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e2e8f0]">
                YOLOv12 Online Transform
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <div className="aspect-square rounded overflow-hidden bg-slate-900 border border-[#cbd5e1]">
                  {augmentations && (
                    <img src={augmentations.horizontalFlip} alt="Flip" className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-[10px] text-center text-[#64748b] font-semibold">Horizontal Flip</p>
              </div>

              <div className="space-y-1">
                <div className="aspect-square rounded overflow-hidden bg-slate-900 border border-[#cbd5e1]">
                  {augmentations && (
                    <img src={augmentations.colorJitter} alt="Jitter" className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-[10px] text-center text-[#64748b] font-semibold">Color Jitter</p>
              </div>

              <div className="space-y-1">
                <div className="aspect-square rounded overflow-hidden bg-slate-900 border border-[#cbd5e1]">
                  {augmentations && (
                    <img src={augmentations.gaussianBlur} alt="Blur" className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-[10px] text-center text-[#64748b] font-semibold">Gaussian Blur</p>
              </div>

              <div className="space-y-1">
                <div className="aspect-square rounded overflow-hidden bg-slate-900 border border-[#cbd5e1]">
                  {augmentations && (
                    <img src={augmentations.sobelEdge} alt="Sobel" className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-[10px] text-center text-[#64748b] font-semibold">Sobel Gradient</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Half: 70% Train / 20% Val / 10% Test Dataset Partition Manager */}
      <div className="bg-white rounded-lg border border-[#cbd5e1] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
          <div>
            <div className="flex items-center gap-1.5">
              <Split className="w-3.5 h-3.5 text-[#334155]" />
              <h2 className="text-sm sm:text-base font-bold text-[#1e293b]">
                Dataset Partition: 70% Training / 20% Validation / 10% Testing
              </h2>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              Stratified split ensuring proportional distribution across Fresh, Spoiled, and Contaminated categories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="rebalance-dataset-split-btn"
              onClick={autoRebalanceSplit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] text-xs font-semibold rounded shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Re-Stratify 70/20/10</span>
            </button>
          </div>
        </div>

        {/* Charts & Partition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Training Set (70%) */}
          <div className="bg-[#f8fafc] p-3.5 rounded-lg border border-emerald-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Training Set (70%)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {trainItems.length} images ({((trainItems.length / datasetList.length) * 100).toFixed(0)}%)
              </span>
            </div>
            <p className="text-xs text-[#64748b]">
              Used for gradient backpropagation and loss minimization across YOLOv12 and EfficientNetV2 heads.
            </p>
            <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(trainItems.length / datasetList.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Validation Set (20%) */}
          <div className="bg-[#f8fafc] p-3.5 rounded-lg border border-sky-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                Validation Set (20%)
              </span>
              <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {valItems.length} images ({((valItems.length / datasetList.length) * 100).toFixed(0)}%)
              </span>
            </div>
            <p className="text-xs text-[#64748b]">
              Evaluates mAP@0.5 and validation loss to trigger early stopping and learning rate cosine decay.
            </p>
            <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500"
                style={{ width: `${(valItems.length / datasetList.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Testing Set (10%) */}
          <div className="bg-[#f8fafc] p-3.5 rounded-lg border border-amber-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Testing Set (10%)
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {testItems.length} images ({((testItems.length / datasetList.length) * 100).toFixed(0)}%)
              </span>
            </div>
            <p className="text-xs text-[#64748b]">
              Unseen holdout evaluation for reporting final Capstone precision, recall, and confusion matrix.
            </p>
            <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${(testItems.length / datasetList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dataset Table Filter & Explorer */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded border border-[#e2e8f0]">
              {(["all", "train", "val", "test"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveSplitFilter(filter)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold uppercase transition-all ${
                    activeSplitFilter === filter
                      ? "bg-[#334155] text-white shadow-xs"
                      : "text-[#64748b] hover:text-[#1e293b]"
                  }`}
                >
                  {filter === "all" ? "All Records" : `${filter} (${filter === "train" ? trainItems.length : filter === "val" ? valItems.length : testItems.length})`}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#64748b] font-mono">Resolution: 640×640 Preprocessed</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#cbd5e1]">
            <table className="w-full text-left text-xs text-[#334155]">
              <thead className="bg-[#f8fafc] text-[#64748b] border-b border-[#cbd5e1] font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Sample Specimen</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Ground Truth Class</th>
                  <th className="p-2.5">Dataset Partition</th>
                  <th className="p-2.5">Bounding Boxes</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] bg-white font-medium">
                {filteredDataset.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-2.5 flex items-center gap-2.5 font-bold text-[#1e293b]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-7 h-7 rounded object-cover border border-[#cbd5e1]"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="p-2.5 text-[#64748b]">{item.category}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "Fresh"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "Spoiled"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`uppercase font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.split === "train"
                            ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                            : item.split === "val"
                            ? "text-sky-800 bg-sky-50 border-sky-200"
                            : "text-amber-800 bg-amber-50 border-amber-200"
                        }`}
                      >
                        {item.split}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-xs">{item.boxesCount} annotations</td>
                    <td className="p-2.5 text-right">
                      <span className="text-emerald-700 font-mono text-[11px] font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 640×640 Normalized
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
