function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function dataUrlToFile(dataUrl, filename) {
  const [meta, data] = dataUrl.split(',');
  const mime = (meta.match(/data:(.*?);base64/) || [])[1] || 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

function fillFittedText(ctx, text, x, y, maxWidth, weight, maxSize, minSize, family) {
  let size = maxSize;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth || size <= minSize) break;
    size -= 6;
  } while (size > minSize);
  ctx.fillText(text, x, y);
}

function makeScoreShareImage({ mode, score, scoreLabel, detail, bestLine, isNewBest }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, '#F7F2E8');
  bg.addColorStop(0.52, '#EAF7F0');
  bg.addColorStop(1, '#EDF2FF');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 205, 86, 0.32)';
  ctx.beginPath();
  ctx.arc(155, 155, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(79, 70, 229, 0.18)';
  ctx.beginPath();
  ctx.arc(965, 155, 250, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(22, 32, 42, 0.055)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= canvas.width; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 70) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  roundRect(ctx, 110, 170, 860, 1010, 34);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(22, 32, 42, 0.1)';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#16202A';
  ctx.font = '700 72px "Space Mono", monospace';
  ctx.fillText('ANAGRAM', 540, 305);

  ctx.fillStyle = '#047857';
  ctx.font = '700 34px "Space Mono", monospace';
  ctx.fillText(mode.toUpperCase(), 540, 405);

  ctx.fillStyle = '#16202A';
  fillFittedText(ctx, String(score), 540, 650, 740, 700, 210, 74, '"Space Mono", monospace');

  ctx.fillStyle = '#697586';
  ctx.font = '700 48px Inter, Arial, sans-serif';
  ctx.fillText(scoreLabel, 540, 730);

  ctx.fillStyle = isNewBest ? '#047857' : '#697586';
  ctx.font = '800 42px Inter, Arial, sans-serif';
  ctx.fillText(isNewBest ? 'New best score!' : bestLine, 540, 835);

  if (detail) {
    ctx.fillStyle = '#16202A';
    ctx.font = '700 34px "Space Mono", monospace';
    ctx.fillText(detail, 540, 925);
  }

  ctx.fillStyle = '#4F46E5';
  ctx.font = '700 30px "Space Mono", monospace';
  ctx.fillText('SHARE YOUR SCORE', 540, 1075);

  const dataUrl = canvas.toDataURL('image/png');
  return dataUrlToFile(dataUrl, `anagram-${mode.toLowerCase().replace(/\s+/g, '-')}-score.png`);
}

function downloadShareImage(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getGameShareUrl() {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url.href;
}

function withGameShareLink(text) {
  return `${text}\nPlay Anagram: ${getGameShareUrl()}`;
}
