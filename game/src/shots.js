// shots.js — staging for screenshots and the built-in self-test.
// A screenshot is a real render of the game in the browser; the ?shot=
// parameter only chooses the game state the page opens in, the same way a
// player would reach it by playing:
//   ?shot=start   fresh scene, nothing found yet
//   ?shot=play    halfway through: 4 of 8 found, 4 still hiding
//   ?shot=almost  nearly done: 6 of 8 found, 2 still hiding
//   ?shot=win     every difference found, win overlay up
// The timer is frozen in shot mode so every capture shows the same frame.
// ?selftest=1 instead plays the whole scene with synthetic clicks through the
// real click path and reports PASS/FAIL into #selftest-result.

import { markFound, registerWrongClick, startScene } from './state.js';
import { playFound, playWin } from './audio.js';

const STAGES = {
  start: { found: 0, secondsLeft: 180 },
  play: { found: 4, secondsLeft: 143 },
  almost: { found: 6, secondsLeft: 87 },
  win: { found: 8, secondsLeft: 96 },
};

export function shotParam() {
  return new URLSearchParams(window.location.search).get('shot');
}

// Open the page in the staged state for a screenshot. Returns true when a
// shot was staged, so the main loop knows to freeze the timer.
export function stageShot(game, els) {
  const shot = shotParam();
  if (!shot || !STAGES[shot]) return false;
  const stage = STAGES[shot];
  startScene(game, 0);
  game.secondsLeft = stage.secondsLeft;
  game.running = false; // frozen frame for the screenshot
  const ids = game.scene.differences.slice(0, stage.found);
  for (const d of ids) {
    markFound(game, d);
    game.lastFoundAt = 0; // no fresh-find pulse in a still frame
  }
  if (game.won) playWin();
  else if (stage.found > 0) playFound();
  return true;
}

// Play the scene end to end through the real click handler and check the
// rules hold: a miss costs time, a find counts, the win fires at 8 of 8.
export function runSelfTest(game, clickAt) {
  const out = [];
  const check = (name, ok) => out.push(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  startScene(game, 0);
  const before = game.secondsLeft;
  clickAt({ x: 10, y: 390 }); // empty floor: a miss
  check('miss costs 5s', game.secondsLeft === before - 5 && game.wrongClicks === 1);
  check('miss recorded', game.misses.length === 1);
  for (const d of game.scene.differences) clickAt({ x: d.x, y: d.y });
  check('all 8 found', game.found.size === 8);
  check('counter reads 0 left', game.scene.differences.length - game.found.size === 0);
  check('win state triggers', game.won && game.over && !game.running);
  const foundBefore = game.found.size;
  clickAt({ x: game.scene.differences[0].x, y: game.scene.differences[0].y });
  check('click after win is ignored', game.found.size === foundBefore);
  const el = document.getElementById('selftest-result');
  if (el) el.textContent = out.join(' | ');
  document.title = out.every((line) => line.startsWith('PASS')) ? 'SELFTEST PASS' : 'SELFTEST FAIL';
  return out;
}
