// input.js — turns a mouse click on either panel into a game event.
// The click is mapped into panel coordinates (560 x 400), then tested against
// the unfound differences; the nearest one inside its radius wins. A click
// that lands on nothing is a miss. This module knows nothing about rendering.

import { PANEL_W, PANEL_H } from './scene.js';

// Where a pointer event lands inside a panel, in panel coordinates.
export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
  };
}

// The unfound difference under a point, or null. Nearest wins when circles
// overlap, so close differences stay fair.
export function findDifferenceAt(scene, found, point) {
  let best = null;
  let bestDist = Infinity;
  for (const d of scene.differences) {
    if (found.has(d.id)) continue;
    const dist = Math.hypot(point.x - d.x, point.y - d.y);
    if (dist <= d.r && dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return best;
}

// Handle one click; returns 'found' with the difference, 'miss', or 'idle'
// when the scene is already over.
export function handlePanelClick(game, scene, found, point) {
  if (game.over) return { kind: 'idle' };
  const hit = findDifferenceAt(scene, found, point);
  if (hit) return { kind: 'found', difference: hit };
  return { kind: 'miss', point };
}
