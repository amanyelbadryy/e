export interface ColoringTemplate {
  id: string;
  title: string;
  icon: string;
  category: string;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const BUILTIN_TEMPLATES: ColoringTemplate[] = [
  {
    id: 'lion',
    title: '🦁 الأسد الشجاع',
    icon: '🦁',
    category: 'حيوانات',
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#1E293B';
      ctx.fillStyle = '#1E293B';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cx = w / 2;
      const cy = h / 2 - 20;

      // Mane (شعيرات الأسد)
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const rx = cx + Math.cos(angle) * (w * 0.35);
        const ry = cy + Math.sin(angle) * (h * 0.35);
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.stroke();

      // Ears
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, cy - h * 0.18, w * 0.08, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.18, cy - h * 0.18, w * 0.08, 0, Math.PI * 2);
      ctx.stroke();

      // Face head circle
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      ctx.beginPath();
      ctx.arc(cx - w * 0.08, cy - h * 0.04, w * 0.03, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.08, cy - h * 0.04, w * 0.03, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.04, cy + h * 0.03);
      ctx.lineTo(cx + w * 0.04, cy + h * 0.03);
      ctx.lineTo(cx, cy + h * 0.08);
      ctx.closePath();
      ctx.stroke();

      // Mouth
      ctx.beginPath();
      ctx.moveTo(cx, cy + h * 0.08);
      ctx.lineTo(cx, cy + h * 0.12);
      ctx.arc(cx - w * 0.04, cy + h * 0.12, w * 0.04, 0, Math.PI, false);
      ctx.moveTo(cx, cy + h * 0.12);
      ctx.arc(cx + w * 0.04, cy + h * 0.12, w * 0.04, 0, Math.PI, false);
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.36, w * 0.18, Math.PI * 0.8, Math.PI * 2.2, false);
      ctx.stroke();

      // Paws
      ctx.beginPath();
      ctx.arc(cx - w * 0.1, cy + h * 0.42, w * 0.06, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.1, cy + h * 0.42, w * 0.06, 0, Math.PI * 2);
      ctx.stroke();

      // Text Header
      ctx.font = 'bold 36px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('أ - أَسَد', cx, h - 30);
    },
  },
  {
    id: 'car',
    title: '🚗 السيارة السريعة',
    icon: '🚗',
    category: 'مركبات',
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#1E293B';
      ctx.fillStyle = '#1E293B';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cx = w / 2;
      const cy = h / 2;

      // Car Body
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.4, cy + h * 0.1);
      ctx.lineTo(cx - w * 0.4, cy - h * 0.05);
      ctx.lineTo(cx - w * 0.2, cy - h * 0.08);
      ctx.lineTo(cx - w * 0.1, cy - h * 0.25);
      ctx.lineTo(cx + w * 0.15, cy - h * 0.25);
      ctx.lineTo(cx + w * 0.3, cy - h * 0.08);
      ctx.lineTo(cx + w * 0.4, cy - h * 0.05);
      ctx.lineTo(cx + w * 0.4, cy + h * 0.1);
      ctx.closePath();
      ctx.stroke();

      // Windows
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.08, cy - h * 0.22);
      ctx.lineTo(cx - w * 0.18, cy - h * 0.08);
      ctx.lineTo(cx - w * 0.02, cy - h * 0.08);
      ctx.lineTo(cx - w * 0.02, cy - h * 0.22);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + w * 0.02, cy - h * 0.22);
      ctx.lineTo(cx + w * 0.02, cy - h * 0.08);
      ctx.lineTo(cx + w * 0.25, cy - h * 0.08);
      ctx.lineTo(cx + w * 0.12, cy - h * 0.22);
      ctx.closePath();
      ctx.stroke();

      // Wheels
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy + h * 0.1, w * 0.09, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy + h * 0.1, w * 0.09, 0, Math.PI * 2);
      ctx.stroke();

      // Wheel Rims
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy + h * 0.1, w * 0.04, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy + h * 0.1, w * 0.04, 0, Math.PI * 2);
      ctx.stroke();

      // Headlight
      ctx.beginPath();
      ctx.arc(cx - w * 0.38, cy - h * 0.01, w * 0.025, 0, Math.PI * 2);
      ctx.stroke();

      // Ground Line
      ctx.beginPath();
      ctx.moveTo(w * 0.05, cy + h * 0.19);
      ctx.lineTo(w * 0.95, cy + h * 0.19);
      ctx.stroke();

      // Text
      ctx.font = 'bold 36px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('س - سَيَّارَة', cx, h - 30);
    },
  },
  {
    id: 'cat',
    title: '🐱 القطة اللطيفة',
    icon: '🐱',
    category: 'حيوانات',
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#1E293B';
      ctx.fillStyle = '#1E293B';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cx = w / 2;
      const cy = h / 2 - 20;

      // Cat Head
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Ears
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.18, cy - h * 0.08);
      ctx.lineTo(cx - w * 0.14, cy - h * 0.26);
      ctx.lineTo(cx - w * 0.05, cy - h * 0.18);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + w * 0.18, cy - h * 0.08);
      ctx.lineTo(cx + w * 0.14, cy - h * 0.26);
      ctx.lineTo(cx + w * 0.05, cy - h * 0.18);
      ctx.stroke();

      // Eyes
      ctx.beginPath();
      ctx.arc(cx - w * 0.07, cy - h * 0.02, w * 0.025, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.07, cy - h * 0.02, w * 0.025, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.03, w * 0.018, 0, Math.PI * 2);
      ctx.fill();

      // Whiskers
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.08, cy + h * 0.03);
      ctx.lineTo(cx - w * 0.25, cy + h * 0.01);
      ctx.moveTo(cx - w * 0.08, cy + h * 0.04);
      ctx.lineTo(cx - w * 0.24, cy + h * 0.07);

      ctx.moveTo(cx + w * 0.08, cy + h * 0.03);
      ctx.lineTo(cx + w * 0.25, cy + h * 0.01);
      ctx.moveTo(cx + w * 0.08, cy + h * 0.04);
      ctx.lineTo(cx + w * 0.24, cy + h * 0.07);
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.3, w * 0.16, Math.PI * 0.8, Math.PI * 2.2, false);
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.14, cy + h * 0.35);
      ctx.quadraticCurveTo(cx + w * 0.32, cy + h * 0.2, cx + w * 0.26, cy + h * 0.1);
      ctx.stroke();

      // Text
      ctx.font = 'bold 36px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ق - قِطَّة', cx, h - 30);
    },
  },
  {
    id: 'butterfly',
    title: '🦋 الفراشة الزاهية',
    icon: '🦋',
    category: 'طبيعة',
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#1E293B';
      ctx.fillStyle = '#1E293B';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cx = w / 2;
      const cy = h / 2 - 10;

      // Butterfly Body
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.035, h * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.22, w * 0.04, 0, Math.PI * 2);
      ctx.stroke();

      // Antennae
      ctx.beginPath();
      ctx.moveTo(cx, cy - h * 0.25);
      ctx.quadraticCurveTo(cx - w * 0.12, cy - h * 0.38, cx - w * 0.1, cy - h * 0.38);
      ctx.moveTo(cx, cy - h * 0.25);
      ctx.quadraticCurveTo(cx + w * 0.12, cy - h * 0.38, cx + w * 0.1, cy - h * 0.38);
      ctx.stroke();

      // Top Wings
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.22, cy - h * 0.1, w * 0.18, h * 0.14, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.22, cy - h * 0.1, w * 0.18, h * 0.14, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Bottom Wings
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.18, cy + h * 0.12, w * 0.14, h * 0.11, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.18, cy + h * 0.12, w * 0.14, h * 0.11, -Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Wing Patterns
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy - h * 0.1, w * 0.06, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy - h * 0.1, w * 0.06, 0, Math.PI * 2);
      ctx.stroke();

      // Text
      ctx.font = 'bold 36px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ف - فَرَاشَة', cx, h - 30);
    },
  },
];
