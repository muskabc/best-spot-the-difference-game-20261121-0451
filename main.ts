// Spot the Difference — make.fun hand-in program (Node 22, standard library only).
//
// It assembles the entry in the output directory: the static game under game/,
// the maker's screenshots under screenshots/, and dossier.json, the summary
// the judge reads, written by the kit's vendored library from exactly those
// files. The grader runs this program twice and requires both runs to write
// the same bytes; copying files and calling buildDossier is deterministic, so
// they do.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from an empty output directory so a stale file can never leak in.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });

cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The gate's caps, as the kit documents them: at most 4 screenshots of at
// most 256 KiB each, at most 993 files / 48 MiB under game/, and a dossier
// text capped at 160 KiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(`Wrote ${outDir}/game, ${outDir}/screenshots and ${outDir}/dossier.json`);
