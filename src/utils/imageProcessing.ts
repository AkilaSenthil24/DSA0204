/**
 * Module 1: Preprocessing & Augmentation Engine
 * Handles 640x640 letterbox scaling, color spaces (RGB, HSV, Sobel edge),
 * pixel normalization, and computer vision augmentations.
 */

export interface PreprocessedImageDetails {
  dataUrl: string;
  originalWidth: number;
  originalHeight: number;
  targetWidth: number;
  targetHeight: number;
  meanR: number;
  meanG: number;
  meanB: number;
  stdR: number;
  stdG: number;
  stdB: number;
  histogram: { r: number[]; g: number[]; b: number[] };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Letterbox resize to exact 640x640 preserving aspect ratio with pad (standard YOLOv12 / EfficientNet input)
 */
export async function preprocessTo640(
  imgSource: string | HTMLImageElement,
  targetSize = 640,
  padColor = "#111827"
): Promise<PreprocessedImageDetails> {
  const img = typeof imgSource === "string" ? await loadImage(imgSource) : imgSource;

  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not create 2D canvas context");

  // Fill background padding
  ctx.fillStyle = padColor;
  ctx.fillRect(0, 0, targetSize, targetSize);

  // Compute aspect ratio letterbox
  const scale = Math.min(targetSize / img.naturalWidth, targetSize / img.naturalHeight);
  const nw = img.naturalWidth * scale;
  const nh = img.naturalHeight * scale;
  const dx = (targetSize - nw) / 2;
  const dy = (targetSize - nh) / 2;

  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, nw, nh);

  // Extract pixel statistics
  const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
  const data = imgData.data;

  let sumR = 0, sumG = 0, sumB = 0;
  let sqSumR = 0, sqSumG = 0, sqSumB = 0;
  const histR = new Array(32).fill(0);
  const histG = new Array(32).fill(0);
  const histB = new Array(32).fill(0);

  const totalPixels = targetSize * targetSize;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    sumR += r;
    sumG += g;
    sumB += b;

    sqSumR += r * r;
    sqSumG += g * g;
    sqSumB += b * b;

    histR[Math.floor(r / 8)]++;
    histG[Math.floor(g / 8)]++;
    histB[Math.floor(b / 8)]++;
  }

  const meanR = (sumR / totalPixels) / 255;
  const meanG = (sumG / totalPixels) / 255;
  const meanB = (sumB / totalPixels) / 255;

  const stdR = Math.sqrt(sqSumR / totalPixels - (sumR / totalPixels) ** 2) / 255;
  const stdG = Math.sqrt(sqSumG / totalPixels - (sumG / totalPixels) ** 2) / 255;
  const stdB = Math.sqrt(sqSumB / totalPixels - (sumB / totalPixels) ** 2) / 255;

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    originalWidth: img.naturalWidth || 640,
    originalHeight: img.naturalHeight || 640,
    targetWidth: targetSize,
    targetHeight: targetSize,
    meanR,
    meanG,
    meanB,
    stdR,
    stdG,
    stdB,
    histogram: { r: histR, g: histG, b: histB },
  };
}

/**
 * Generate augmented variations of input image for YOLO/EfficientNet training simulation
 */
export async function generateAugmentations(imgSource: string): Promise<{
  original: string;
  horizontalFlip: string;
  gaussianBlur: string;
  colorJitter: string;
  sobelEdge: string;
}> {
  const img = await loadImage(imgSource);
  const size = 320;

  // 1. Original 320
  const c1 = document.createElement("canvas");
  c1.width = size;
  c1.height = size;
  const ctx1 = c1.getContext("2d")!;
  ctx1.drawImage(img, 0, 0, size, size);
  const original = c1.toDataURL("image/jpeg", 0.9);

  // 2. Horizontal Flip
  const c2 = document.createElement("canvas");
  c2.width = size;
  c2.height = size;
  const ctx2 = c2.getContext("2d")!;
  ctx2.translate(size, 0);
  ctx2.scale(-1, 1);
  ctx2.drawImage(img, 0, 0, size, size);
  const horizontalFlip = c2.toDataURL("image/jpeg", 0.9);

  // 3. Gaussian Blur / Smoothing
  const c3 = document.createElement("canvas");
  c3.width = size;
  c3.height = size;
  const ctx3 = c3.getContext("2d")!;
  ctx3.filter = "blur(3px)";
  ctx3.drawImage(img, 0, 0, size, size);
  const gaussianBlur = c3.toDataURL("image/jpeg", 0.9);

  // 4. Color Jitter / HSV shift
  const c4 = document.createElement("canvas");
  c4.width = size;
  c4.height = size;
  const ctx4 = c4.getContext("2d")!;
  ctx4.filter = "contrast(135%) brightness(110%) saturate(140%) hue-rotate(20deg)";
  ctx4.drawImage(img, 0, 0, size, size);
  const colorJitter = c4.toDataURL("image/jpeg", 0.9);

  // 5. Sobel Edge Gradient Filter (Structural inspection)
  const c5 = document.createElement("canvas");
  c5.width = size;
  c5.height = size;
  const ctx5 = c5.getContext("2d")!;
  ctx5.drawImage(img, 0, 0, size, size);
  const imgData = ctx5.getImageData(0, 0, size, size);
  const d = imgData.data;
  const gray = new Float32Array(size * size);

  for (let i = 0; i < d.length; i += 4) {
    gray[i / 4] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  }

  const outputData = ctx5.createImageData(size, size);
  const outD = outputData.data;

  // Sobel 3x3
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = y * size + x;
      const gx =
        -gray[idx - size - 1] +
        gray[idx - size + 1] -
        2 * gray[idx - 1] +
        2 * gray[idx + 1] -
        gray[idx + size - 1] +
        gray[idx + size + 1];

      const gy =
        -gray[idx - size - 1] -
        2 * gray[idx - size] -
        gray[idx - size + 1] +
        gray[idx + size - 1] +
        2 * gray[idx + size] +
        gray[idx + size + 1];

      const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy) * 1.5);
      const outIdx = (y * size + x) * 4;
      outD[outIdx] = Math.min(255, mag * 0.8 + 20); // Cyan/Green tint
      outD[outIdx + 1] = Math.min(255, mag * 1.2);
      outD[outIdx + 2] = Math.min(255, mag * 1.4 + 40);
      outD[outIdx + 3] = 255;
    }
  }
  ctx5.putImageData(outputData, 0, 0);
  const sobelEdge = c5.toDataURL("image/jpeg", 0.9);

  return {
    original,
    horizontalFlip,
    gaussianBlur,
    colorJitter,
    sobelEdge,
  };
}
