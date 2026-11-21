// scene.js — draws the two hand-drawn scenes onto a canvas.
// Every picture is drawn with plain canvas 2D calls: no images, no network.
// Each scene takes an `altered` Set of difference ids; the left panel is always
// drawn with an empty set, the right panel with every difference applied, so the
// two pictures differ in exactly the places the differences list names.

export const PANEL_W = 560;
export const PANEL_H = 400;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function disc(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function blob(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, width, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Scene 1: the Corner Café — a warm room with a window, a clock, a lamp,
// a shelf, and a table set for coffee and cake.
// ---------------------------------------------------------------------------
export function drawCafe(ctx, altered) {
  // Wall and floor.
  ctx.fillStyle = '#f3e3c2';
  ctx.fillRect(0, 0, PANEL_W, 320);
  ctx.fillStyle = '#c08a5e';
  ctx.fillRect(0, 320, PANEL_W, 80);
  ctx.fillStyle = '#a9764b';
  ctx.fillRect(0, 312, PANEL_W, 8);
  line(ctx, 0, 352, PANEL_W, 352, 2, '#a9764b');
  line(ctx, 0, 382, PANEL_W, 382, 2, '#a9764b');

  // Rug on the floor.
  blob(ctx, 300, 366, 150, 22, '#b8574a');
  blob(ctx, 300, 366, 118, 16, '#e8c98f');
  blob(ctx, 300, 366, 84, 11, '#b8574a');

  drawCafeWindow(ctx, altered);
  drawCafeClock(ctx, altered);
  drawCafePicture(ctx, altered);
  drawCafeLamp(ctx, altered);
  drawCafeShelf(ctx);
  drawCafeTable(ctx, altered);
}

function drawCafeWindow(ctx, altered) {
  // Frame and sky.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(36, 36, 228, 184);
  const sky = ctx.createLinearGradient(0, 44, 0, 212);
  sky.addColorStop(0, '#a8d8f0');
  sky.addColorStop(1, '#e8f4d8');
  ctx.fillStyle = sky;
  ctx.fillRect(44, 44, 212, 168);
  // Sun and clouds outside.
  disc(ctx, 224, 76, 20, '#ffd94d');
  blob(ctx, 90, 74, 30, 12, '#ffffff');
  blob(ctx, 108, 66, 22, 10, '#ffffff');
  blob(ctx, 190, 120, 26, 10, '#ffffff');
  // A tree outside the window.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(66, 150, 12, 62);
  blob(ctx, 72, 132, 40, 34, '#5da24a');
  blob(ctx, 46, 148, 24, 20, '#6fb457');
  blob(ctx, 98, 148, 24, 20, '#4c8f3e');
  // Window crossbars.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(146, 44, 8, 168);
  ctx.fillRect(44, 124, 212, 8);
  // Windowsill.
  ctx.fillStyle = '#8a5a35';
  ctx.fillRect(28, 216, 244, 12);
  // The cat asleep on the sill — difference 2: gone on the right.
  if (!altered.has('cat')) {
    ctx.fillStyle = '#e8e0d0';
    blob(ctx, 205, 200, 26, 15, '#e8e0d0');
    disc(ctx, 224, 188, 11, '#e8e0d0');
    poly(ctx, [[218, 180], [221, 170], [226, 179]], '#e8e0d0');
    poly(ctx, [[230, 179], [234, 170], [236, 180]], '#e8e0d0');
    line(ctx, 232, 204, 252, 196, 3, '#e8e0d0');
    disc(ctx, 227, 187, 1.6, '#3a2e22');
    disc(ctx, 206, 198, 8, '#d8cdb8');
  }
  // A little bird on a branch outside — difference 1: flown away on the right.
  if (!altered.has('bird')) {
    line(ctx, 128, 96, 172, 88, 3, '#6b4a2f');
    disc(ctx, 150, 82, 8, '#4a7ec2');
    disc(ctx, 156, 80, 5, '#4a7ec2');
    poly(ctx, [[160, 80], [168, 82], [160, 84]], '#e8a13c');
    line(ctx, 144, 76, 138, 68, 2, '#4a7ec2');
    disc(ctx, 158, 78, 1.4, '#1c2733');
  }
}

function drawCafeClock(ctx, altered) {
  disc(ctx, 452, 78, 36, '#ffffff');
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#7a4a2b';
  ctx.beginPath();
  ctx.arc(452, 78, 36, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    disc(ctx, 452 + Math.sin(a) * 29, 78 - Math.cos(a) * 29, i % 3 === 0 ? 2.4 : 1.2, '#3a2e22');
  }
  // Difference 3: three o'clock on the left, half past four on the right.
  if (altered.has('clock')) {
    line(ctx, 452, 78, 452, 56, 3, '#3a2e22');
    line(ctx, 452, 78, 470, 92, 3, '#3a2e22');
  } else {
    line(ctx, 452, 78, 452, 56, 3, '#3a2e22');
    line(ctx, 452, 78, 474, 78, 3, '#3a2e22');
  }
  disc(ctx, 452, 78, 3.5, '#b8574a');
}

function drawCafePicture(ctx, altered) {
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(318, 118, 104, 74);
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(324, 124, 92, 62);
  if (altered.has('picture')) {
    // A sunset over the sea on the right.
    const sea = ctx.createLinearGradient(0, 124, 0, 186);
    sea.addColorStop(0, '#f2a65e');
    sea.addColorStop(1, '#c96f4a');
    ctx.fillStyle = sea;
    ctx.fillRect(324, 124, 92, 62);
    disc(ctx, 370, 158, 14, '#ffd94d');
    ctx.fillStyle = '#5e7fa8';
    ctx.fillRect(324, 162, 92, 24);
    line(ctx, 324, 170, 416, 170, 2, '#8fb4d8');
    line(ctx, 324, 178, 416, 178, 2, '#8fb4d8');
  } else {
    // Mountains under a blue sky on the left.
    ctx.fillStyle = '#a8d8f0';
    ctx.fillRect(324, 124, 92, 38);
    disc(ctx, 396, 138, 9, '#ffd94d');
    poly(ctx, [[324, 186], [352, 140], [380, 186]], '#7a9a6b');
    poly(ctx, [[356, 186], [388, 132], [416, 186]], '#5d7f57');
    poly(ctx, [[344, 152], [352, 140], [360, 152]], '#ffffff');
    poly(ctx, [[380, 146], [388, 132], [396, 146]], '#ffffff');
  }
}

function drawCafeLamp(ctx, altered) {
  line(ctx, 300, 0, 300, 52, 3, '#3a2e22');
  poly(ctx, [[278, 52], [322, 52], [312, 76], [288, 76]], '#b8574a');
  disc(ctx, 300, 80, 7, '#ffe9a8');
  // Difference 5: the lamp glows on the left and is dark on the right.
  if (!altered.has('lamp')) {
    const glow = ctx.createRadialGradient(300, 82, 4, 300, 82, 46);
    glow.addColorStop(0, 'rgba(255, 220, 120, 0.55)');
    glow.addColorStop(1, 'rgba(255, 220, 120, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(300, 82, 46, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 300, 80, 7, '#fff3c4');
  }
}

function drawCafeShelf(ctx) {
  ctx.fillStyle = '#8a5a35';
  ctx.fillRect(330, 208, 210, 8);
  // Books.
  ctx.fillStyle = '#4a7ec2';
  ctx.fillRect(344, 172, 16, 36);
  ctx.fillStyle = '#b8574a';
  ctx.fillRect(362, 166, 16, 42);
  ctx.fillStyle = '#5da24a';
  ctx.fillRect(380, 176, 16, 32);
  ctx.fillStyle = '#e8a13c';
  ctx.fillRect(398, 170, 14, 38);
  line(ctx, 344, 182, 360, 182, 2, '#ffffff');
  line(ctx, 362, 176, 378, 176, 2, '#ffffff');
  // A potted plant.
  ctx.fillStyle = '#c96f4a';
  ctx.fillRect(486, 188, 28, 20);
  blob(ctx, 500, 176, 8, 16, '#4c8f3e');
  blob(ctx, 488, 182, 8, 12, '#5da24a');
  blob(ctx, 512, 182, 8, 12, '#6fb457');
}

function drawCafeTable(ctx, altered) {
  // Tabletop and legs.
  ctx.fillStyle = '#8a5a35';
  ctx.fillRect(40, 300, 480, 12);
  ctx.fillRect(64, 312, 10, 88);
  ctx.fillRect(486, 312, 10, 88);
  // Coffee cup with saucer — difference 7: steam rises on the left only.
  ctx.fillStyle = '#fdf6e3';
  blob(ctx, 120, 292, 26, 5, '#fdf6e3');
  ctx.fillStyle = '#4a7ec2';
  rr(ctx, 100, 258, 40, 32, 6);
  ctx.fill();
  ctx.fillStyle = '#4a7ec2';
  ctx.beginPath();
  ctx.arc(142, 272, 9, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = '#4a7ec2';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(104, 260, 32, 6);
  if (!altered.has('steam')) {
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(112, 252);
    ctx.quadraticCurveTo(106, 240, 112, 230);
    ctx.moveTo(124, 252);
    ctx.quadraticCurveTo(130, 240, 124, 230);
    ctx.stroke();
  }
  // Cake stand with a slice of cake.
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(232, 286, 44, 4);
  ctx.fillRect(252, 290, 4, 12);
  blob(ctx, 254, 302, 16, 3, '#fdf6e3');
  poly(ctx, [[238, 286], [254, 262], [270, 286]], '#f2c9d8');
  poly(ctx, [[238, 286], [254, 262], [246, 286]], '#e8a13c');
  disc(ctx, 254, 260, 3, '#b8574a');
  // Plate of cookies — difference 8: three cookies on the left, two on the right.
  ctx.fillStyle = '#fdf6e3';
  blob(ctx, 380, 288, 30, 7, '#fdf6e3');
  disc(ctx, 366, 282, 9, '#c89b6a');
  disc(ctx, 384, 280, 9, '#c89b6a');
  if (!altered.has('cookies')) disc(ctx, 396, 284, 9, '#c89b6a');
  disc(ctx, 364, 280, 2, '#5a3a22');
  disc(ctx, 368, 284, 2, '#5a3a22');
  disc(ctx, 382, 278, 2, '#5a3a22');
  disc(ctx, 386, 282, 2, '#5a3a22');
  // Vase with flowers — difference 6: red blooms on the left, blue on the right.
  const petal = altered.has('flowers') ? '#4a7ec2' : '#d94f4f';
  ctx.fillStyle = '#7fb069';
  ctx.fillRect(468, 252, 4, 34);
  ctx.fillRect(460, 258, 4, 28);
  ctx.fillRect(476, 258, 4, 28);
  disc(ctx, 470, 246, 10, petal);
  disc(ctx, 460, 254, 8, petal);
  disc(ctx, 480, 254, 8, petal);
  disc(ctx, 470, 246, 3.5, '#ffd94d');
  disc(ctx, 460, 254, 3, '#ffd94d');
  disc(ctx, 480, 254, 3, '#ffd94d');
  ctx.fillStyle = '#7a9ac2';
  poly(ctx, [[462, 286], [478, 286], [474, 308], [466, 308]], '#7a9ac2');
}

// ---------------------------------------------------------------------------
// Scene 2: the Park at Dusk — a tree, a bench, a pond, a lamppost and a kite.
// ---------------------------------------------------------------------------
export function drawPark(ctx, altered) {
  // Dusk sky and stars.
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#2e2a55');
  sky.addColorStop(0.6, '#7a4a7a');
  sky.addColorStop(1, '#e8825a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 260);
  for (const [sx, sy] of [[60, 40], [120, 24], [200, 52], [330, 30], [420, 48], [500, 26], [260, 20]]) {
    disc(ctx, sx, sy, 2, '#fff6d8');
  }
  // Low sun.
  disc(ctx, 470, 210, 26, '#ffd94d');
  disc(ctx, 470, 210, 34, 'rgba(255, 217, 77, 0.25)');
  // Grass and path.
  ctx.fillStyle = '#3f7a44';
  ctx.fillRect(0, 260, PANEL_W, 140);
  ctx.fillStyle = '#c9a86a';
  poly(ctx, [[210, 400], [250, 260], [310, 260], [350, 400]], '#c9a86a');
  line(ctx, 0, 300, PANEL_W, 300, 2, '#356b3a');
  line(ctx, 0, 350, PANEL_W, 350, 2, '#356b3a');

  drawParkTree(ctx, altered);
  drawParkKite(ctx, altered);
  drawParkBench(ctx, altered);
  drawParkPond(ctx, altered);
  drawParkLamp(ctx, altered);
  drawParkFlowers(ctx, altered);
  drawParkDog(ctx, altered);
}

function drawParkTree(ctx, altered) {
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(72, 170, 18, 96);
  line(ctx, 81, 200, 52, 168, 7, '#5a3a22');
  line(ctx, 81, 190, 112, 158, 7, '#5a3a22');
  blob(ctx, 82, 132, 62, 52, '#2f6b34');
  blob(ctx, 40, 152, 36, 30, '#3f7a44');
  blob(ctx, 124, 152, 36, 30, '#356b3a');
  blob(ctx, 82, 104, 34, 26, '#4c8f3e');
  // The bicycle leans on the trunk — difference 6: basket on the left only.
  ctx.strokeStyle = '#d8d8d8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(140, 288, 14, 0, Math.PI * 2);
  ctx.arc(178, 288, 14, 0, Math.PI * 2);
  ctx.stroke();
  line(ctx, 140, 288, 158, 262, 3, '#d8d8d8');
  line(ctx, 178, 288, 158, 262, 3, '#d8d8d8');
  line(ctx, 158, 262, 150, 250, 3, '#d8d8d8');
  line(ctx, 150, 250, 168, 250, 3, '#d8d8d8');
  if (!altered.has('basket')) {
    ctx.fillStyle = '#a9764b';
    ctx.fillRect(160, 252, 18, 12);
    line(ctx, 160, 256, 178, 256, 1, '#7a4a2b');
    line(ctx, 160, 260, 178, 260, 1, '#7a4a2b');
  }
}

function drawParkKite(ctx, altered) {
  // Difference 1: a kite flies on the left and is gone on the right.
  if (altered.has('kite')) return;
  ctx.strokeStyle = '#e8e0d0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(300, 92);
  ctx.quadraticCurveTo(280, 150, 252, 210);
  ctx.stroke();
  poly(ctx, [[300, 60], [330, 84], [300, 104], [272, 82]], '#d94f4f');
  line(ctx, 300, 60, 300, 104, 2, '#ffd94d');
  line(ctx, 272, 82, 330, 84, 2, '#ffd94d');
  poly(ctx, [[300, 104], [306, 116], [298, 118]], '#4a7ec2');
}

function drawParkBench(ctx, altered) {
  // Bench: difference 4 is the cushion's colour.
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(214, 292, 8, 26);
  ctx.fillRect(318, 292, 8, 26);
  ctx.fillStyle = '#8a5a35';
  ctx.fillRect(206, 276, 128, 8);
  ctx.fillRect(206, 262, 128, 8);
  ctx.fillRect(206, 244, 8, 40);
  ctx.fillRect(326, 244, 8, 40);
  ctx.fillRect(206, 244, 128, 8);
  const cushion = altered.has('cushion') ? '#2f8f8a' : '#d94f4f';
  rr(ctx, 236, 250, 68, 22, 6);
  ctx.fillStyle = cushion;
  ctx.fill();
  line(ctx, 250, 252, 250, 270, 2, 'rgba(255,255,255,0.5)');
  line(ctx, 270, 252, 270, 270, 2, 'rgba(255,255,255,0.5)');
  line(ctx, 290, 252, 290, 270, 2, 'rgba(255,255,255,0.5)');
}

function drawParkPond(ctx, altered) {
  blob(ctx, 425, 335, 95, 32, '#5e8fc2');
  blob(ctx, 425, 335, 78, 24, '#7fb0d8');
  line(ctx, 360, 330, 400, 330, 2, 'rgba(255,255,255,0.6)');
  line(ctx, 440, 344, 490, 344, 2, 'rgba(255,255,255,0.6)');
  // Ducks — difference 2: two ducks on the left, three on the right.
  drawDuck(ctx, 392, 332);
  drawDuck(ctx, 448, 340);
  if (altered.has('ducks')) drawDuck(ctx, 420, 322);
}

function drawDuck(ctx, x, y) {
  blob(ctx, x, y, 12, 8, '#ffffff');
  disc(ctx, x + 10, y - 7, 6, '#ffffff');
  poly(ctx, [[x + 15, y - 7], [x + 21, y - 5], [x + 15, y - 4]], '#e8a13c');
  disc(ctx, x + 11, y - 8, 1.4, '#1c2733');
}

function drawParkLamp(ctx, altered) {
  line(ctx, 484, 150, 484, 300, 5, '#2b2b33');
  disc(ctx, 484, 146, 12, '#2b2b33');
  disc(ctx, 484, 150, 8, '#ffe9a8');
  // Difference 3: the lamp glows at dusk on the left, dark on the right.
  if (!altered.has('lamp')) {
    const glow = ctx.createRadialGradient(484, 150, 4, 484, 150, 52);
    glow.addColorStop(0, 'rgba(255, 220, 120, 0.6)');
    glow.addColorStop(1, 'rgba(255, 220, 120, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(484, 150, 52, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 484, 150, 8, '#fff3c4');
  }
  ctx.fillStyle = '#2b2b33';
  ctx.fillRect(468, 296, 32, 6);
}

function drawParkFlowers(ctx, altered) {
  // Flower bed — difference 5: red tulips on the left, yellow on the right.
  const petal = altered.has('flowers') ? '#e8c93c' : '#d94f4f';
  ctx.fillStyle = '#5a3a22';
  blob(ctx, 110, 372, 78, 14, '#5a3a22');
  for (const fx of [58, 86, 114, 142, 170]) {
    line(ctx, fx, 372, fx, 348, 3, '#4c8f3e');
    disc(ctx, fx, 342, 8, petal);
    disc(ctx, fx, 342, 3, '#ffd94d');
  }
  // A butterfly over the grass — difference 8: there on the left, gone on the right.
  if (!altered.has('butterfly')) {
    disc(ctx, 210, 340, 4, '#e8a13c');
    blob(ctx, 204, 336, 6, 8, '#b857a8');
    blob(ctx, 216, 336, 6, 8, '#b857a8');
    blob(ctx, 204, 344, 5, 6, '#d94f9e');
    blob(ctx, 216, 344, 5, 6, '#d94f9e');
  }
}

function drawParkDog(ctx, altered) {
  // A small dog by the bench, watching its ball.
  // Difference 7: the ball is red on the left, blue on the right.
  ctx.fillStyle = '#c89b6a';
  blob(ctx, 392, 296, 16, 10, '#c89b6a');
  disc(ctx, 406, 288, 8, '#c89b6a');
  poly(ctx, [[402, 282], [404, 274], [408, 281]], '#c89b6a');
  line(ctx, 382, 302, 378, 312, 3, '#c89b6a');
  line(ctx, 402, 302, 406, 312, 3, '#c89b6a');
  line(ctx, 380, 292, 372, 286, 3, '#c89b6a');
  disc(ctx, 408, 286, 1.4, '#1c2733');
  const ball = altered.has('ball') ? '#4a7ec2' : '#d94f4f';
  disc(ctx, 424, 306, 8, ball);
  line(ctx, 418, 302, 430, 310, 2, 'rgba(255,255,255,0.7)');
}

// Draw one scene by id, with the given altered differences.
export function drawScene(ctx, sceneId, altered) {
  if (sceneId === 'park') drawPark(ctx, altered);
  else drawCafe(ctx, altered);
}
