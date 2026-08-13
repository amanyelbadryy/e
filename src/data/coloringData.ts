export interface LetterColoringItem {
  id: string;
  letter: string;
  name: string;
  word: string;
  wordClean: string;
  image: string;
  emoji: string;
  key: string;
}

export const ARABIC_LETTERS_COLORING: LetterColoringItem[] = [
  {
    id: 'alif',
    letter: 'أ',
    name: 'أَلِف',
    word: 'أَسَد',
    wordClean: 'أسد',
    image: '/coloring/alif.png',
    emoji: '🦁',
    key: 'alif'
  }
];

/**
 * Draw crisp black-and-white vector line-art for any of the 28 letter items
 * if the PNG file is not yet dropped in public/coloring/
 */
export function drawLetterVectorLineArt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  item: LetterColoringItem
) {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#0F172A';
  ctx.fillStyle = '#0F172A';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = w / 2;
  const cy = h / 2 - 20;

  // Draw Big Letter Header Frame at top
  ctx.font = 'bold 120px Tajawal, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(item.letter, cx, 30);

  // Draw Line Art outline illustration based on letter key
  const key = item.key;

  if (key === 'alif') {
    // Lion Head & Mane
    ctx.beginPath();
    ctx.arc(cx, cy + 20, 110, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const rx = cx + Math.cos(angle) * 160;
      const ry = (cy + 20) + Math.sin(angle) * 160;
      ctx.beginPath();
      ctx.arc(rx, ry, 35, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx - 35, cy, 12, 0, Math.PI * 2);
    ctx.arc(cx + 35, cy, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 30);
    ctx.lineTo(cx + 20, cy + 30);
    ctx.lineTo(cx, cy + 50);
    ctx.closePath();
    ctx.stroke();
  } else if (key === 'baa') {
    // Duck
    ctx.beginPath();
    ctx.ellipse(cx, cy + 40, 140, 90, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 80, cy - 60, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 140, cy - 70);
    ctx.lineTo(cx - 210, cy - 50);
    ctx.lineTo(cx - 140, cy - 30);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 95, cy - 75, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (key === 'taa') {
    // Apple
    ctx.beginPath();
    ctx.arc(cx - 55, cy + 20, 95, 0, Math.PI * 2);
    ctx.arc(cx + 55, cy + 20, 95, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - 60);
    ctx.quadraticCurveTo(cx + 20, cy - 120, cx + 40, cy - 140);
    ctx.stroke();

    // Leaf
    ctx.beginPath();
    ctx.ellipse(cx + 55, cy - 110, 45, 22, -Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'thaa') {
    // Fox
    ctx.beginPath();
    ctx.moveTo(cx, cy + 120);
    ctx.lineTo(cx - 140, cy - 40);
    ctx.lineTo(cx - 90, cy - 140);
    ctx.lineTo(cx, cy - 50);
    ctx.lineTo(cx + 90, cy - 140);
    ctx.lineTo(cx + 140, cy - 40);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 50, cy - 10, 12, 0, Math.PI * 2);
    ctx.arc(cx + 50, cy - 10, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (key === 'jeem') {
    // Camel
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 90, Math.PI, 0, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 90, cy - 30);
    ctx.lineTo(cx - 140, cy + 100);
    ctx.moveTo(cx + 90, cy - 30);
    ctx.lineTo(cx + 140, cy + 100);
    ctx.stroke();
  } else if (key === 'haa') {
    // Horse Head
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy + 120);
    ctx.lineTo(cx - 70, cy - 80);
    ctx.lineTo(cx + 60, cy - 140);
    ctx.lineTo(cx + 120, cy - 40);
    ctx.lineTo(cx + 40, cy + 120);
    ctx.closePath();
    ctx.stroke();
  } else if (key === 'khaa') {
    // Sheep
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 140, 100, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 130, cy - 30, 50, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'dal') {
    // Bear
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 95, cy - 95, 45, 0, Math.PI * 2);
    ctx.arc(cx + 95, cy - 95, 45, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'thal') {
    // Corn
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 65, 150, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'raa') {
    // Pomegranate
    ctx.beginPath();
    ctx.arc(cx, cy + 20, 120, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'zaay') {
    // Flower
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const rx = cx + Math.cos(angle) * 80;
      const ry = cy + Math.sin(angle) * 80;
      ctx.beginPath();
      ctx.arc(rx, ry, 45, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'seen') {
    // Fish
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy, 140, 85, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 100, cy);
    ctx.lineTo(cx + 180, cy - 70);
    ctx.lineTo(cx + 180, cy + 70);
    ctx.closePath();
    ctx.stroke();
  } else if (key === 'sheen') {
    // Tree
    ctx.beginPath();
    ctx.rect(cx - 30, cy + 40, 60, 120);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy - 40, 110, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'saad') {
    // Falcon / Bird Head
    ctx.beginPath();
    ctx.arc(cx - 20, cy, 100, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 70, cy - 20);
    ctx.lineTo(cx + 160, cy + 30);
    ctx.lineTo(cx + 65, cy + 60);
    ctx.stroke();
  } else if (key === 'daad') {
    // Frog
    ctx.beginPath();
    ctx.ellipse(cx, cy + 30, 130, 80, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 65, cy - 40, 45, 0, Math.PI * 2);
    ctx.arc(cx + 65, cy - 40, 45, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'taa_heavy') {
    // Airplane
    ctx.beginPath();
    ctx.ellipse(cx, cy, 160, 45, -Math.PI / 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 20);
    ctx.lineTo(cx - 60, cy - 120);
    ctx.lineTo(cx + 30, cy - 20);
    ctx.stroke();
  } else if (key === 'zaa_heavy') {
    // Envelope
    ctx.beginPath();
    ctx.rect(cx - 150, cy - 80, 300, 180);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 150, cy - 80);
    ctx.lineTo(cx, cy + 10);
    ctx.lineTo(cx + 150, cy - 80);
    ctx.stroke();
  } else if (key === 'ain') {
    // Bird
    ctx.beginPath();
    ctx.arc(cx - 30, cy - 20, 75, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + 40, cy + 40, 100, 60, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'ghain') {
    // Gazelle / Deer
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 80);
    ctx.lineTo(cx - 110, cy - 180);
    ctx.moveTo(cx + 40, cy - 80);
    ctx.lineTo(cx + 110, cy - 180);
    ctx.stroke();
  } else if (key === 'faa') {
    // Strawberry
    ctx.beginPath();
    ctx.moveTo(cx, cy + 160);
    ctx.bezierCurveTo(cx - 150, cy + 60, cx - 130, cy - 60, cx, cy - 70);
    ctx.bezierCurveTo(cx + 130, cy - 60, cx + 150, cy + 60, cx, cy + 160);
    ctx.stroke();
  } else if (key === 'qaaf') {
    // Cat
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 50);
    ctx.lineTo(cx - 70, cy - 140);
    ctx.lineTo(cx - 20, cy - 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 80, cy - 50);
    ctx.lineTo(cx + 70, cy - 140);
    ctx.lineTo(cx + 20, cy - 90);
    ctx.stroke();
  } else if (key === 'kaaf') {
    // Dog
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx - 100, cy, 40, 80, Math.PI / 8, 0, Math.PI * 2);
    ctx.ellipse(cx + 100, cy, 40, 80, -Math.PI / 8, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'lam') {
    // Lemon
    ctx.beginPath();
    ctx.ellipse(cx, cy, 130, 85, -Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'meem') {
    // Banana
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy - 100);
    ctx.quadraticCurveTo(cx - 20, cy + 140, cx + 140, cy + 40);
    ctx.quadraticCurveTo(cx - 10, cy + 70, cx - 120, cy - 100);
    ctx.stroke();
  } else if (key === 'noon') {
    // Bee
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 110, 70, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx - 30, cy - 70, 50, 70, -Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(cx + 30, cy - 70, 50, 70, Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
  } else if (key === 'haa_light') {
    // Crescent Moon & Star
    ctx.beginPath();
    ctx.arc(cx - 20, cy, 110, Math.PI * 0.2, Math.PI * 1.8, false);
    ctx.quadraticCurveTo(cx + 50, cy, cx - 20, cy + 110);
    ctx.stroke();
  } else if (key === 'waw') {
    // Rose / Flower
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy + 80);
    ctx.lineTo(cx, cy + 190);
    ctx.stroke();
  } else {
    // Hand (yaa)
    ctx.beginPath();
    ctx.rect(cx - 70, cy + 20, 140, 120);
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.rect(cx - 65 + i * 35, cy - 100, 30, 120);
      ctx.stroke();
    }
  }

  // Draw Word Clean Text at bottom
  ctx.font = 'bold 50px Tajawal, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(item.wordClean, cx, h - 80);
}
