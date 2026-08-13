import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ARABIC_LETTERS_COLORING, LetterColoringItem, drawLetterVectorLineArt } from '../data/coloringData';
import { ArrowRight, RotateCcw, Download, Trash2, Palette, Paintbrush, Eraser, Check, PaintBucket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playButtonClickSFX } from '../utils/mp3Player';

const PALETTE_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Yellow
  '#10B981', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#78350F', // Brown
  '#000000', // Black
  '#FFFFFF', // White
];

type ToolType = 'brush' | 'bucket' | 'eraser';

export const ColoringView: React.FC = () => {
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<LetterColoringItem | null>(null);

  // Tools state
  const [activeTool, setActiveTool] = useState<ToolType>('bucket');
  const [activeColor, setActiveColor] = useState<string>('#EF4444');
  const [brushSize, setBrushSize] = useState<number>(18);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseLineArtCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Canvas Resolution
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 800;

  // Filtered items based on navigation selection (All 28 or selected letter)
  const displayItems = selectedLetterId
    ? ARABIC_LETTERS_COLORING.filter((item) => item.id === selectedLetterId)
    : ARABIC_LETTERS_COLORING;

  // Initialize Canvas with Line Art when an item is chosen
  const initCanvasImage = useCallback((item: LetterColoringItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Offscreen mask canvas for keeping line art crisp
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = CANVAS_WIDTH;
    baseCanvas.height = CANVAS_HEIGHT;
    const baseCtx = baseCanvas.getContext('2d', { willReadFrequently: true });
    baseLineArtCanvasRef.current = baseCanvas;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const renderLoadedArt = (loadedImg?: HTMLImageElement) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (baseCtx) {
        baseCtx.fillStyle = '#FFFFFF';
        baseCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (loadedImg) {
        const scale = Math.min(CANVAS_WIDTH / loadedImg.width, CANVAS_HEIGHT / loadedImg.height) * 0.85;
        const x = (CANVAS_WIDTH - loadedImg.width * scale) / 2;
        const y = (CANVAS_HEIGHT - loadedImg.height * scale) / 2;

        ctx.drawImage(loadedImg, x, y, loadedImg.width * scale, loadedImg.height * scale);
        if (baseCtx) {
          baseCtx.drawImage(loadedImg, x, y, loadedImg.width * scale, loadedImg.height * scale);
        }
      } else {
        // Fallback vector drawing
        drawLetterVectorLineArt(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, item);
        if (baseCtx) {
          drawLetterVectorLineArt(baseCtx, CANVAS_WIDTH, CANVAS_HEIGHT, item);
        }
      }

      // Save initial state to history stack
      const initialData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      setHistory([initialData]);
    };

    img.onload = () => renderLoadedArt(img);
    img.onerror = () => renderLoadedArt(undefined);
    img.src = item.image;
  }, []);

  useEffect(() => {
    if (activeItem) {
      initCanvasImage(activeItem);
    }
  }, [activeItem, initCanvasImage]);

  // Save current state to history stack
  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHistory((prev) => [...prev.slice(-15), data]);
  };

  // Undo stroke
  const handleUndo = () => {
    if (history.length <= 1) return;
    playButtonClickSFX();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop();
    const previousState = newHistory[newHistory.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      setHistory(newHistory);
    }
  };

  // Clear/Reset user coloring back to original line art
  const handleClear = () => {
    playButtonClickSFX();
    if (activeItem) {
      initCanvasImage(activeItem);
    }
  };

  // Get pointer coordinates relative to canvas internal scale
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  };

  // Flood fill algorithm for paint bucket
  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imgData.data;

    const r = parseInt(fillColorHex.slice(1, 3), 16);
    const g = parseInt(fillColorHex.slice(3, 5), 16);
    const b = parseInt(fillColorHex.slice(5, 7), 16);
    const targetR = r, targetG = g, targetB = b, targetA = 255;

    const startIndex = (startY * CANVAS_WIDTH + startX) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];

    // Don't flood fill dark border lines
    if (startR < 50 && startG < 50 && startB < 50) return;

    // Don't flood fill if color is already identical
    if (
      Math.abs(startR - targetR) < 10 &&
      Math.abs(startG - targetG) < 10 &&
      Math.abs(startB - targetB) < 10
    ) {
      return;
    }

    const colorMatch = (idx: number) => {
      const dr = Math.abs(data[idx] - startR);
      const dg = Math.abs(data[idx + 1] - startG);
      const db = Math.abs(data[idx + 2] - startB);
      return dr < 40 && dg < 40 && db < 40;
    };

    const pixelStack: [number, number][] = [[startX, startY]];
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    while (pixelStack.length > 0) {
      const [x, y] = pixelStack.pop()!;
      let currentY = y;

      let idx = (currentY * width + x) * 4;
      while (currentY >= 0 && colorMatch(idx)) {
        currentY--;
        idx -= width * 4;
      }

      currentY++;
      idx += width * 4;

      let reachLeft = false;
      let reachRight = false;

      while (currentY < height && colorMatch(idx)) {
        data[idx] = targetR;
        data[idx + 1] = targetG;
        data[idx + 2] = targetB;
        data[idx + 3] = targetA;

        if (x > 0) {
          if (colorMatch(idx - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, currentY]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < width - 1) {
          if (colorMatch(idx + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, currentY]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        currentY++;
        idx += width * 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Overlay black line art base back on top so line art borders stay crisp!
    const baseCanvas = baseLineArtCanvasRef.current;
    if (baseCanvas) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(baseCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    }

    saveStateToHistory();
  };

  // Drawing Handlers
  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoords(e);

    if (activeTool === 'bucket') {
      floodFill(coords.x, coords.y, activeColor);
      return;
    }

    isDrawingRef.current = true;
    lastPosRef.current = coords;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = activeTool === 'eraser' ? '#FFFFFF' : activeColor;
    ctx.fill();
  };

  const handleMoveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || activeTool === 'bucket') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || !lastPosRef.current) return;

    const coords = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : activeColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = coords;
  };

  const handleEndDraw = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;

    // Overlay line art base on top after drawing so borders stay clean
    const canvas = canvasRef.current;
    const baseCanvas = baseLineArtCanvasRef.current;
    if (canvas && baseCanvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(baseCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    saveStateToHistory();
  };

  // Save drawing as PNG
  const handleSave = () => {
    playButtonClickSFX();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `تلوين_حرف_${activeItem?.letter || 'رسمتي'}.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28 space-y-6 dir-rtl">
      <AnimatePresence mode="wait">
        {!activeItem ? (
          /* ============================================================ */
          /* SECTION VIEW: Alphabet Letter Navigation & Cards Grid        */
          /* ============================================================ */
          <motion.div
            key="alphabet-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Main Header Title */}
            <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-teal-200 border-4 border-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-right">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs md:text-sm font-black border border-white/30">
                  <Palette className="w-4 h-4 text-amber-300" />
                  <span>اختبار التلوين: حرف الألف 🎨</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black">🎨 التلوين - حرف الألف</h2>
                <p className="text-base md:text-xl font-bold opacity-90">
                  لوّن الرسمة الخاصة بحرف الألف (أسد)
                </p>
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center text-5xl shadow-inner shrink-0 border border-white/30">
                🦁
              </div>
            </div>

            {/* Letter 'Alif' Test Card */}
            <div className="max-w-md mx-auto">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border-4 border-teal-200 p-6 md:p-8 shadow-xl hover:border-teal-500 transition-all flex flex-col items-center text-center space-y-5"
                >
                  {/* 1. Big Letter (Top) */}
                  <div className="text-6xl md:text-7xl font-black text-teal-600 bg-teal-50 w-24 h-24 rounded-3xl flex items-center justify-center border-4 border-teal-200 shadow-inner">
                    {item.letter}
                  </div>

                  {/* 2. Drawing Image (Line Art - Object Fit Contain) */}
                  <div className="w-full aspect-square bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-center justify-center p-3 relative overflow-hidden">
                    <PreviewCanvas item={item} />
                  </div>

                  {/* 3. Word directly BELOW the drawing */}
                  <div className="space-y-1">
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                      {item.wordClean} {item.emoji}
                    </h3>
                  </div>

                  {/* 4. Start Coloring Button */}
                  <button
                    onClick={() => {
                      playButtonClickSFX();
                      setActiveItem(item);
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl text-lg shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Palette className="w-6 h-6" />
                    <span>🎨 ابدأ التلوين</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ============================================================ */
          /* CANVAS VIEW: Interactive Coloring Page                       */
          /* ============================================================ */
          <motion.div
            key="canvas-mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            {/* Top Toolbar */}
            <div className="bg-white rounded-3xl p-4 border-4 border-teal-200 shadow-md flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  playButtonClickSFX();
                  setActiveItem(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <ArrowRight className="w-5 h-5 text-teal-600" />
                <span>العودة لقائمة الحروف</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-teal-600 bg-teal-100 px-3 py-1 rounded-2xl">
                  {activeItem.letter}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {activeItem.wordClean} {activeItem.emoji}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={history.length <= 1}
                  className="bg-teal-50 hover:bg-teal-100 disabled:opacity-40 text-teal-800 p-2.5 rounded-2xl font-black text-xs flex items-center gap-1 border border-teal-200 transition-all cursor-pointer"
                  title="تراجع"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">تراجع</span>
                </button>

                <button
                  onClick={handleClear}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-2.5 rounded-2xl font-black text-xs flex items-center gap-1 border border-rose-200 transition-all cursor-pointer"
                  title="مسح التلوين"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">مسح التلوين</span>
                </button>

                <button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-200 transition-all cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>حفظ 💾</span>
                </button>
              </div>
            </div>

            {/* Save Toast Notification */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-500 text-white font-black px-4 py-3 rounded-2xl text-center shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>تم حفظ صورتك بنجاح في جهازك! 🎈</span>
              </motion.div>
            )}

            {/* Main Interactive Canvas Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
              {/* Tools & Palette Panel */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-4 border-4 border-teal-200 shadow-md space-y-4">
                {/* Tool Selection */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 text-right">
                    🛠️ اختر أداة الرسم:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        playButtonClickSFX();
                        setActiveTool('bucket');
                      }}
                      className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                        activeTool === 'bucket'
                          ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <PaintBucket className="w-5 h-5" />
                      <span>سكب ألوان</span>
                    </button>

                    <button
                      onClick={() => {
                        playButtonClickSFX();
                        setActiveTool('brush');
                      }}
                      className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                        activeTool === 'brush'
                          ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Paintbrush className="w-5 h-5" />
                      <span>فرشاة</span>
                    </button>

                    <button
                      onClick={() => {
                        playButtonClickSFX();
                        setActiveTool('eraser');
                      }}
                      className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                        activeTool === 'eraser'
                          ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Eraser className="w-5 h-5" />
                      <span>ممحاة</span>
                    </button>
                  </div>
                </div>

                {/* Brush Size Slider */}
                {activeTool !== 'bucket' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black text-slate-700">
                      <span>حجم الخط:</span>
                      <span className="text-teal-700">{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="40"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                  </div>
                )}

                {/* Color Palette Grid */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 text-right">
                    🎨 ألوان زاهية للأطفال:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                    {PALETTE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          playButtonClickSFX();
                          setActiveColor(color);
                          if (activeTool === 'eraser') setActiveTool('bucket');
                        }}
                        className={`w-full aspect-square rounded-2xl border-4 transition-transform cursor-pointer ${
                          activeColor === color && activeTool !== 'eraser'
                            ? 'scale-110 border-slate-900 shadow-lg ring-2 ring-teal-400'
                            : 'border-white shadow-sm hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Canvas Interactive Area */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-3 md:p-4 border-4 border-teal-200 shadow-xl flex flex-col items-center justify-center overflow-hidden">
                <div className="relative w-full aspect-square max-w-[650px] bg-white rounded-2xl border-2 border-slate-200 shadow-inner overflow-hidden touch-none select-none">
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onMouseDown={handleStartDraw}
                    onMouseMove={handleMoveDraw}
                    onMouseUp={handleEndDraw}
                    onMouseLeave={handleEndDraw}
                    onTouchStart={handleStartDraw}
                    onTouchMove={handleMoveDraw}
                    onTouchEnd={handleEndDraw}
                    className="w-full h-full cursor-crosshair block"
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 mt-2 text-center">
                  💡 اضغط على المساحة البيضاء لسكب اللون أو استخدم الفرشاة للتلوين بكل سهولة!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for clean line-art grid thumbnail previews
const PreviewCanvas: React.FC<{ item: LetterColoringItem }> = ({ item }) => {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 300, 300);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 300, 300);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(300 / img.width, 300 / img.height) * 0.85;
      const x = (300 - img.width * scale) / 2;
      const y = (300 - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    img.onerror = () => {
      drawLetterVectorLineArt(ctx, 300, 300, item);
    };
    img.src = item.image;
  }, [item]);

  return (
    <canvas
      ref={previewCanvasRef}
      width={300}
      height={300}
      className="w-full h-full object-contain rounded-xl"
    />
  );
};
