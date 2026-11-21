// render.js — draws everything the player sees: the two panels with their
// markers, the header bar (timer, counter, hints), and the end-of-scene
// overlay. The scenes themselves live in scene.js; this file only frames them.

import { PANEL_W, PANEL_H, drawScene } from './scene.js';
import { alteredSet } from './differences.js';
import { remainingCount, starsFor, accuracy, hasNextScene } from './state.js';

const MARKER = '#2f9e44';
const MARKER_SOFT = 'rgba(47, 158, 68, 0.35)';

// One animation frame: redraw both panels from the scene, then the markers.
export function drawFrame(game, leftCtx, rightCtx, now) {
  const leftAltered = new Set();
  const rightAltered = alteredSet(game.scene);
  drawScene(leftCtx, game.scene.id, leftAltered);
  drawScene(rightCtx, game.scene.id, rightAltered);
  for (const ctx of [leftCtx, rightCtx]) {
    drawFoundMarkers(ctx, game, now);
    drawHintPulse(ctx, game, now);
    drawMissMarks(ctx, game, now);
  }
}

function drawFoundMarkers(ctx, game, now) {
  game.foundOrder.forEach((id, i) => {
    const d = game.scene.differences.find((x) => x.id === id);
    if (!d) return;
    const fresh = i === game.foundOrder.length - 1 && now - (game.lastFoundAt ?? 0) < 500;
    const pulse = fresh ? 1 + 0.25 * Math.sin(((now - (game.lastFoundAt ?? 0)) / 500) * Math.PI) : 1;
    const r = d.r * 0.62 * pulse;
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = MARKER;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.fillStyle = MARKER_SOFT;
    ctx.fill();
    // Check mark.
    ctx.beginPath();
    ctx.moveTo(d.x - r * 0.45, d.y);
    ctx.lineTo(d.x - r * 0.12, d.y + r * 0.38);
    ctx.lineTo(d.x + r * 0.5, d.y - r * 0.4);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = MARKER;
    ctx.stroke();
  });
}

function drawHintPulse(ctx, game, now) {
  if (!game.hintTarget || now > game.hintUntil) return;
  const d = game.scene.differences.find((x) => x.id === game.hintTarget);
  if (!d) return;
  const phase = (now % 600) / 600;
  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r * (0.55 + 0.35 * phase), 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = `rgba(232, 161, 60, ${1 - phase * 0.6})`;
  ctx.stroke();
}

function drawMissMarks(ctx, game, now) {
  for (const miss of game.misses ?? []) {
    const age = now - miss.at;
    if (age > 700) continue;
    const alpha = 1 - age / 700;
    const s = 10;
    ctx.beginPath();
    ctx.moveTo(miss.x - s, miss.y - s);
    ctx.lineTo(miss.x + s, miss.y + s);
    ctx.moveTo(miss.x + s, miss.y - s);
    ctx.lineTo(miss.x - s, miss.y + s);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(217, 79, 79, ${alpha})`;
    ctx.stroke();
  }
}

// The header: title, timer bar, found counter, hint and sound buttons.
export function updateHud(game, els) {
  const total = game.scene.differences.length;
  els.sceneTitle.textContent = `${game.scene.name} — Scene ${game.sceneIndex + 1} of 2`;
  els.timerText.textContent = formatTime(game.secondsLeft);
  const frac = game.secondsLeft / game.scene.timeLimit;
  els.timerFill.style.width = `${Math.max(0, frac * 100)}%`;
  els.timerFill.classList.toggle('low', frac < 0.25);
  els.counterText.textContent = `Found ${game.found.size} / ${total} · ${remainingCount(game)} left`;
  els.hintButton.textContent = `💡 Hint (${game.hintsLeft})`;
  els.hintButton.disabled = game.hintsLeft <= 0 || game.over;
  els.soundButton.textContent = game.muted ? '🔇 Sound off' : '🔊 Sound on';
  els.messageText.textContent = game.lastMessage;
  els.accuracyText.textContent = `Accuracy ${accuracy(game)}% · ${game.totalFound} found · ${game.totalWrong} misses`;
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// The end-of-scene overlay: stars, stats, and the next step.
export function showOverlay(game, els) {
  const total = game.scene.differences.length;
  const used = game.scene.timeLimit - game.secondsLeft;
  els.overlayTitle.textContent = game.won ? 'Every difference found!' : 'Time ran out!';
  els.overlayStars.textContent = game.won ? '★'.repeat(starsFor(game)) + '☆'.repeat(3 - starsFor(game)) : '—';
  els.overlayStats.textContent = game.won
    ? `You found all ${total} differences in ${formatTime(used)} with ${game.wrongClicks} miss${game.wrongClicks === 1 ? '' : 'es'} · accuracy ${accuracy(game)}%.`
    : `You found ${game.found.size} of ${total} differences. ${remainingCount(game)} still hiding.`;
  const lastScene = !hasNextScene(game);
  els.nextButton.style.display = game.won && !lastScene ? '' : 'none';
  els.nextButton.textContent = 'Next scene →';
  els.againButton.textContent = game.won && lastScene ? 'Play both scenes again' : 'Try this scene again';
  els.overlay.classList.add('visible');
}

export function hideOverlay(els) {
  els.overlay.classList.remove('visible');
}
