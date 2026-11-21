// audio.js — tiny synthesized sounds through WebAudio, no audio files.
// A short chime for a find, a low buzz for a miss, a little fanfare for a win.

let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  return muted;
}

function ctx() {
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(freq, at, dur, type, vol) {
  const ac = ctx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + at);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function playFound() {
  tone(660, 0, 0.16, 'sine', 0.16);
  tone(880, 0.09, 0.22, 'sine', 0.16);
}

export function playWrong() {
  tone(160, 0, 0.2, 'sawtooth', 0.07);
}

export function playHint() {
  tone(520, 0, 0.12, 'triangle', 0.1);
  tone(620, 0.08, 0.12, 'triangle', 0.1);
}

export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'sine', 0.16));
}

export function playLose() {
  tone(330, 0, 0.25, 'sine', 0.12);
  tone(247, 0.2, 0.4, 'sine', 0.12);
}
