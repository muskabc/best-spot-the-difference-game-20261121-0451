// state.js — the game's state: which scene, what is found, the clock, hints.
// Nothing here touches the DOM; render.js reads this and draws it.

import { SCENES, sceneById } from './differences.js';

export const WRONG_CLICK_PENALTY_SEC = 5;
export const HINTS_PER_SCENE = 3;

export function createGame() {
  return {
    sceneIndex: 0,
    scene: SCENES[0],
    found: new Set(),
    foundOrder: [],
    lastFoundAt: 0,
    misses: [], // {x, y, at} recent wrong clicks, for the red X flash
    wrongClicks: 0,
    muted: false,
    hintsLeft: HINTS_PER_SCENE,
    hintTarget: null, // difference id the hint is pulsing on, or null
    hintUntil: 0,
    secondsLeft: SCENES[0].timeLimit,
    running: false,
    over: false, // true once the scene is won or the time runs out
    won: false,
    startedAt: 0,
    finishedAt: 0,
    totalFound: 0,
    totalWrong: 0,
    scenesCleared: 0,
    lastMessage: 'Find every difference — click it on either picture.',
  };
}

export function remainingCount(game) {
  return game.scene.differences.length - game.found.size;
}

export function startScene(game, sceneIndex) {
  game.sceneIndex = sceneIndex;
  game.scene = SCENES[sceneIndex];
  game.found = new Set();
  game.foundOrder = [];
  game.lastFoundAt = 0;
  game.misses = [];
  game.wrongClicks = 0;
  game.hintsLeft = HINTS_PER_SCENE;
  game.hintTarget = null;
  game.hintUntil = 0;
  game.secondsLeft = game.scene.timeLimit;
  game.running = true;
  game.over = false;
  game.won = false;
  game.startedAt = Date.now();
  game.lastMessage = `Scene ${sceneIndex + 1} of ${SCENES.length}: ${game.scene.differences.length} differences to find.`;
}

export function markFound(game, difference) {
  if (game.found.has(difference.id) || game.over) return false;
  game.found.add(difference.id);
  game.foundOrder.push(difference.id);
  game.lastFoundAt = Date.now();
  game.totalFound += 1;
  game.lastMessage = `Found it — ${difference.label}!`;
  if (game.found.size === game.scene.differences.length) {
    game.won = true;
    game.over = true;
    game.running = false;
    game.finishedAt = Date.now();
    game.scenesCleared += 1;
    game.lastMessage = 'Every difference found — beautiful eyes!';
  }
  return true;
}

export function registerWrongClick(game) {
  game.wrongClicks += 1;
  game.totalWrong += 1;
  game.secondsLeft = Math.max(0, game.secondsLeft - WRONG_CLICK_PENALTY_SEC);
  game.lastMessage = `Nothing there — ${WRONG_CLICK_PENALTY_SEC}s penalty.`;
  if (game.secondsLeft <= 0) timeUp(game);
}

export function useHint(game, now) {
  if (game.hintsLeft <= 0 || game.over) return null;
  const unfound = game.scene.differences.filter((d) => !game.found.has(d.id));
  if (unfound.length === 0) return null;
  game.hintsLeft -= 1;
  const target = unfound[Math.floor(Math.random() * unfound.length)];
  game.hintTarget = target.id;
  game.hintUntil = now + 2000;
  game.lastMessage = `Hint: ${target.hint}`;
  return target;
}

export function clearHint(game, now) {
  if (game.hintTarget && now > game.hintUntil) game.hintTarget = null;
}

export function tickTimer(game, dtSeconds) {
  if (!game.running || game.over) return;
  game.secondsLeft = Math.max(0, game.secondsLeft - dtSeconds);
  if (game.secondsLeft <= 0) timeUp(game);
}

function timeUp(game) {
  game.secondsLeft = 0;
  game.over = true;
  game.won = false;
  game.running = false;
  game.finishedAt = Date.now();
  game.lastMessage = 'Time ran out — the differences are still hiding.';
}

export function accuracy(game) {
  const total = game.totalFound + game.totalWrong;
  return total === 0 ? 100 : Math.round((game.totalFound / total) * 100);
}

export function starsFor(game) {
  if (!game.won) return 0;
  const used = game.scene.timeLimit - game.secondsLeft;
  const quick = used <= game.scene.timeLimit * 0.5;
  if (game.wrongClicks === 0 && quick) return 3;
  if (game.wrongClicks <= 2) return 2;
  return 1;
}

export function hasNextScene(game) {
  return game.sceneIndex + 1 < SCENES.length;
}

export function nextScene(game) {
  startScene(game, game.sceneIndex + 1);
}

export function sceneName(game) {
  return sceneById(game.scene.id).name;
}
