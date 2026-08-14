export type FoodStatus = "Fresh" | "Spoiled" | "Contaminated";

export interface BoundingBoxDetection {
  label: string;
  category: "food_item" | "defect" | "foreign_contamination";
  confidence: number;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  severity?: "low" | "medium" | "high" | "critical";
}

export interface EfficientNetOutput {
  freshProbability: number;
  spoiledProbability: number;
  contaminatedProbability: number;
  topFeatureMaps?: string[];
}

export interface PhysicalIndicator {
  indicator: string;
  status: string;
  detail: string;
}

export interface BenchmarkMetrics {
  totalLatencyMs: number;
  preprocessingLatencyMs: number;
  yoloV12LatencyMs: number;
  efficientNetV2LatencyMs: number;
  inputResolution: string;
  iouThreshold: number;
  confidenceThreshold: number;
  engine: string;
}

export interface GradCamHotspot {
  y: number;
  x: number;
  intensity?: number;
  description?: string;
}

export interface FoodAnalysisResult {
  foodItem: string;
  foodCategory: string;
  status: FoodStatus;
  qualityScore: number;
  confidence: number;
  efficientNetV2: EfficientNetOutput;
  yoloV12Detections: BoundingBoxDetection[];
  physicalIndicators: PhysicalIndicator[];
  recommendation: string;
  haccpSeverity: "None" | "Low" | "Medium" | "High" | "Critical";
  gradCamHotspot?: GradCamHotspot;
  benchmarks: BenchmarkMetrics;
}

export interface SampleFoodImage {
  id: string;
  name: string;
  category: string;
  groundTruthStatus: FoodStatus;
  groundTruthScore: number;
  description: string;
  previewUrl: string;
  detectedDefects: string[];
}

export type ActiveTab = "inspection" | "preprocessing" | "training" | "metrics" | "presentation";

export interface DatasetItem {
  id: string;
  name: string;
  category: string;
  status: FoodStatus;
  split: "train" | "val" | "test";
  resolution: string;
  boxesCount: number;
  image: string;
}
