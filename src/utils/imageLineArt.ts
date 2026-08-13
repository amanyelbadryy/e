export type LineArtPreset = 'fine' | 'medium' | 'bold';

export interface LineArtResult {
  dataUrl: string;
  width: number;
  height: number;
  preset: LineArtPreset;
}

/**
 * Loads an image from a user-selected file with full validation.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // 1. Validate file existence and type
    if (!file) {
      reject(new Error('لم يتم اختيار أي ملف.'));
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      reject(new Error('يرجى اختيار صورة بتمتداد صحبح (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('لم نتمكن من قراءة الصورة، جربي صورة أخرى.'));
    };

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('فشل تحميل بيانات الصورة.'));
        return;
      }

      const img = new Image();
      // Ensure crossOrigin if needed
      img.crossOrigin = 'anonymous';

      img.onerror = () => {
        reject(new Error('الصورة تالفة أو غير مدعومة، جربي صورة أخرى.'));
      };

      img.onload = () => {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          reject(new Error('أبعاد الصورة غير صالحة.'));
          return;
        }
        resolve(img);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Converts an HTMLImageElement to a clean kids' line art coloring page locally via HTML Canvas.
 */
export async function processImageToLineArt(
  image: HTMLImageElement,
  preset: LineArtPreset = 'medium'
): Promise<LineArtResult> {
  const maxDim = 1000;
  let w = image.naturalWidth || image.width;
  let h = image.naturalHeight || image.height;

  if (w <= 0 || h <= 0) {
    throw new Error('أبعاد الصورة غير صالحة.');
  }

  // Preserve aspect ratio and downscale safely if oversized
  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('تعذر إنشاء محرك معالجة الصور.');

  // White background (handles transparent PNGs nicely)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;
  const numPixels = w * h;

  // Convert to Grayscale
  const gray = new Float32Array(numPixels);
  for (let i = 0; i < numPixels; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
  }

  // Box blur to suppress high frequency texture noise
  const blurRadius = preset === 'bold' ? 2 : 1;
  const blurred = boxBlur(gray, w, h, blurRadius);

  // Sobel Edge Detection
  const edges = new Float32Array(numPixels);
  let maxGrad = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;

      const gx =
        -1 * blurred[idx - w - 1] + 1 * blurred[idx - w + 1] +
        -2 * blurred[idx - 1]     + 2 * blurred[idx + 1] +
        -1 * blurred[idx + w - 1] + 1 * blurred[idx + w + 1];

      const gy =
        -1 * blurred[idx - w - 1] - 2 * blurred[idx - w] - 1 * blurred[idx - w + 1] +
         1 * blurred[idx + w - 1] + 2 * blurred[idx + w] + 1 * blurred[idx + w + 1];

      const grad = Math.sqrt(gx * gx + gy * gy);
      edges[idx] = grad;
      if (grad > maxGrad) maxGrad = grad;
    }
  }

  // Preset sensitivity levels
  let thresholdRatio = 0.14; // Default medium
  let lineDilation = false;

  if (preset === 'fine') {
    thresholdRatio = 0.08;
  } else if (preset === 'bold') {
    thresholdRatio = 0.20;
    lineDilation = true;
  }

  const threshold = maxGrad * thresholdRatio;
  const binaryEdges = new Uint8Array(numPixels);

  for (let i = 0; i < numPixels; i++) {
    binaryEdges[i] = edges[i] >= threshold ? 1 : 0;
  }

  const finalEdges = lineDilation ? dilate(binaryEdges, w, h) : binaryEdges;

  const outData = ctx.createImageData(w, h);
  const outPixels = outData.data;

  for (let i = 0; i < numPixels; i++) {
    const idx = i * 4;
    if (finalEdges[i] === 1) {
      // Crisp black line
      outPixels[idx] = 15;
      outPixels[idx + 1] = 15;
      outPixels[idx + 2] = 15;
      outPixels[idx + 3] = 255;
    } else {
      // White background
      outPixels[idx] = 255;
      outPixels[idx + 1] = 255;
      outPixels[idx + 2] = 255;
      outPixels[idx + 3] = 255;
    }
  }

  ctx.putImageData(outData, 0, 0);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: w,
    height: h,
    preset,
  };
}

function boxBlur(src: Float32Array, w: number, h: number, r: number): Float32Array {
  const dst = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            sum += src[ny * w + nx];
            count++;
          }
        }
      }
      dst[y * w + x] = sum / count;
    }
  }
  return dst;
}

function dilate(src: Uint8Array, w: number, h: number): Uint8Array {
  const dst = new Uint8Array(src.length);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (
        src[idx] === 1 ||
        src[idx - 1] === 1 ||
        src[idx + 1] === 1 ||
        src[idx - w] === 1 ||
        src[idx + w] === 1
      ) {
        dst[idx] = 1;
      }
    }
  }
  return dst;
}
