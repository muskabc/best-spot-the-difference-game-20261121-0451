// main.js — boots the game, wires clicks and keys, runs the frame loop.
// The game is two canvas panels (left: original, right: altered) plus a DOM
// header for the timer, counter and buttons. All rules live in state.js,
// all drawing in scene.js and render.js.

import { PANEL_W, PANEL_H } from './scene.js';
import {
  createGame, startScene, markFound, registerWrongClick, useHint,
  clearHint, tickTimer, hasNextScene, nextScene,
} from './state.js';
import { panelPoint, handlePanelClick } from './input.js';
import { drawFrame, updateHud, showOverlay, hideOverlay } from './render.js';
import {
  playFound, playWrong, playHint, playWin, playLose, toggleMuted, isMuted,
} from './audio.js';
import { stageShot, runSelfTest } from './shots.js';

const game = createGame();
window.__game = game; // handy for a quick check in the console

const leftCanvas = document.getElementById('panel-left');
const rightCanvas = document.getElementById('panel-right');
leftCanvas.width = PANEL_W;
leftCanvas.height = PANEL_H;
rightCanvas.width = PANEL_W;
rightCanvas.height = PANEL_H;
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const els = {
  sceneTitle: document.getElementById('scene-title'),
  timerText: document.getElementById('timer-text'),
  timerFill: document.getElementById('timer-fill'),
  counterText: document.getElementById('counter-text'),
  hintButton: document.getElementById('hint-button'),
  soundButton: document.getElementById('sound-button'),
  restartButton: document.getElementById('restart-button'),
  messageText: document.getElementById('message-text'),
  accuracyText: document.getElementById('accuracy-text'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlay-title'),
  overlayStars: document.getElementById('overlay-stars'),
  overlayStats: document.getElementById('overlay-stats'),
  nextButton: document.getElementById('next-button'),
  againButton: document.getElementById('again-button'),
};

function onPanelClick(canvas) {
  return (event) => {
    const point = panelPoint(canvas, event);
    const result = handlePanelClick(game, game.scene, game.found, point);
    if (result.kind === 'found') {
      markFound(game, result.difference);
      playFound();
      if (game.won) {
        playWin();
        showOverlay(game, els);
      }
    } else if (result.kind === 'miss') {
      game.misses.push({ x: point.x, y: point.y, at: performance.now() });
      registerWrongClick(game);
      playWrong();
      if (game.over && !game.won) {
        playLose();
        showOverlay(game, els);
      }
    }
    updateHud(game, els);
  };
}

leftCanvas.addEventListener('click', onPanelClick(leftCanvas));
rightCanvas.addEventListener('click', onPanelClick(rightCanvas));

els.hintButton.addEventListener('click', () => {
  if (useHint(game, performance.now())) playHint();
  updateHud(game, els);
});

els.soundButton.addEventListener('click', () => {
  game.muted = toggleMuted();
  updateHud(game, els);
});

els.restartButton.addEventListener('click', () => {
  hideOverlay(els);
  startScene(game, game.sceneIndex);
  updateHud(game, els);
});

els.nextButton.addEventListener('click', () => {
  if (!hasNextScene(game)) return;
  hideOverlay(els);
  nextScene(game);
  updateHud(game, els);
});

els.againButton.addEventListener('click', () => {
  hideOverlay(els);
  if (game.won && !hasNextScene(game)) startScene(game, 0);
  else startScene(game, game.sceneIndex);
  updateHud(game, els);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') els.hintButton.click();
  if (event.key === 'r' || event.key === 'R') els.restartButton.click();
  if (event.key === 'm' || event.key === 'M') els.soundButton.click();
  if (event.key === 'Enter' && game.over && game.won && hasNextScene(game)) els.nextButton.click();
});

// The frame loop: tick the clock, clear stale hints, redraw, refresh the HUD.
let lastTick = performance.now();
function frame(now) {
  const dt = Math.min(0.25, (now - lastTick) / 1000);
  lastTick = now;
  tickTimer(game, dt);
  clearHint(game, now);
  if (game.over && !els.overlay.classList.contains('visible')) {
    if (game.won) playWin();
    else playLose();
    showOverlay(game, els);
  }
  drawFrame(game, leftCtx, rightCtx, now);
  updateHud(game, els);
  requestAnimationFrame(frame);
}

// Boot: a fresh first scene, unless ?shot= or ?selftest= stages something else.
startScene(game, 0);
const frozen = stageShot(game, els);
if (frozen) game.running = false;
updateHud(game, els);
if (new URLSearchParams(window.location.search).has('selftest')) {
  const clickAt = (point) => {
    const result = handlePanelClick(game, game.scene, game.found, point);
    if (result.kind === 'found') markFound(game, result.difference);
    else if (result.kind === 'miss') {
      game.misses.push({ x: point.x, y: point.y, at: performance.now() });
      registerWrongClick(game);
    }
  };
  // Let one frame draw first, then run the test against the real handlers.
  requestAnimationFrame(() => runSelfTest(game, clickAt));
}
requestAnimationFrame(frame);
