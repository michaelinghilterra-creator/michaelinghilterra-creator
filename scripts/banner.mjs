// Regenerates assets/pipeline.svg: node scripts/banner.mjs assets/pipeline.svg
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const OUT = process.argv[2];
const W = 1200, H = 440, CELL = 8;

const FONT = {
  M: ['10001','11011','10101','10101','10001','10001','10001'],
  I: ['11111','00100','00100','00100','00100','00100','11111'],
  K: ['10001','10010','10100','11000','10100','10010','10001'],
  E: ['11111','10000','10000','11110','10000','10000','11111'],
  N: ['10001','11001','10101','10011','10001','10001','10001'],
  G: ['01110','10001','10000','10111','10001','10001','01110'],
  H: ['10001','10001','10001','11111','10001','10001','10001'],
  L: ['10000','10000','10000','10000','10000','10000','11111'],
  T: ['11111','00100','00100','00100','00100','00100','00100'],
  R: ['11110','10001','10001','11110','10100','10010','10001'],
  A: ['01110','10001','10001','11111','10001','10001','10001'],
};

// Pixel name
const NAME = 'MIKE INGHILTERRA';
const X0 = 64, Y0 = 64;
let cx = 0;
const px = [];
for (const ch of NAME) {
  if (ch === ' ') { cx += 3; continue; }
  FONT[ch].forEach((row, r) => [...row].forEach((b, c) => {
    if (b === '1') px.push(`<rect x="${X0 + (cx + c) * CELL}" y="${Y0 + r * CELL}" width="7" height="7"/>`);
  }));
  cx += 6;
}
const nameW = (cx - 1) * CELL;

// Funnel stages: centered on x=288, widths step down by 112
const CENTER = 288, TOP = 192, BAR_H = 40, GAP = 16;
const LABEL_X = 552, METRIC_X = 692;
const stages = [
  { w: 448, name: 'PIPELINE',   metric: '$54M sourced · 47-person SDR org', color: '#2dd4bf' },
  { w: 336, name: 'QUALIFIED',  metric: 'MEDDPICC live for 150+ sellers',   color: '#38bdf8' },
  { w: 224, name: 'FORECAST',   metric: '$850M org · exec reporting 10d → 36h', color: '#818cf8' },
  { w: 112, name: 'CLOSED-WON', metric: '',                                 color: '#4ade80' },
];

const bars = [], labels = [];
stages.forEach((s, i) => {
  const x = CENTER - s.w / 2, y = TOP + i * (BAR_H + GAP), mid = y + BAR_H / 2;
  bars.push(`<rect class="bar s${i + 1}" x="${x}" y="${y}" width="${s.w}" height="${BAR_H}" fill="${s.color}"/>`);
  labels.push(`<line class="lead" x1="${x + s.w + 12}" y1="${mid}" x2="${LABEL_X - 16}" y2="${mid}"/>`);
  labels.push(`<text class="stage" x="${LABEL_X}" y="${mid + 6}" fill="${s.color}">${s.name}</text>`);
  if (s.metric) labels.push(`<text class="metric" x="${METRIC_X}" y="${mid + 6}">${s.metric.replace(/&/g, '&amp;')}</text>`);
});
const won = stages.length - 1, wonMid = TOP + won * (BAR_H + GAP) + BAR_H / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">Mike Inghilterra</title>
<desc id="d">A pixel-art sales funnel. Pipeline: $54M sourced by a 47-person SDR org. Qualified: MEDDPICC live for 150+ sellers. Forecast: an $850M org, board reporting cut from 10 days to 36 hours. Closed-won.</desc>
<style>
  .mono { font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace; }
  .sub { font-size: 20px; fill: #c9d1d9; }
  .dim { fill: #6e7681; }
  .stage { font-size: 18px; font-weight: 700; letter-spacing: 1px; }
  .metric { font-size: 18px; fill: #c9d1d9; }
  .lead { stroke: #30363d; stroke-width: 2; stroke-dasharray: 2 6; }
  .bar { opacity: .45; animation: flow 4s ease-in-out infinite; }
  .s2 { animation-delay: .45s; } .s3 { animation-delay: .9s; } .s4 { animation-delay: 1.35s; }
  @keyframes flow { 0%, 40%, 100% { opacity: .45; } 12% { opacity: 1; } }
  .check { opacity: 0; transform-origin: ${LABEL_X + 150}px ${wonMid}px; animation: won 4s ease-out infinite; animation-delay: 1.35s; }
  @keyframes won { 0%, 6% { opacity: 0; transform: scale(.6); } 14% { opacity: 1; transform: scale(1.15); } 22%, 70% { opacity: 1; transform: scale(1); } 90%, 100% { opacity: 0; } }
  .cursor { animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .bar, .check, .cursor { animation: none; } .bar { opacity: .85; } .check { opacity: 1; } }
</style>
<defs>
  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1" fill="#161b22"/></pattern>
  <pattern id="px" width="${CELL}" height="${CELL}" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/></pattern>
  <mask id="pxm"><rect width="${W}" height="${H}" fill="url(#px)"/></mask>
  <linearGradient id="ng" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${X0 + nameW}" y2="0">
    <stop offset="0" stop-color="#2dd4bf"/><stop offset=".5" stop-color="#38bdf8"/><stop offset="1" stop-color="#a78bfa"/>
  </linearGradient>
</defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="16" fill="#0d1117" stroke="#30363d" stroke-width="2"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="16" fill="url(#dots)"/>
<circle cx="28" cy="26" r="6" fill="#ff5f57"/><circle cx="48" cy="26" r="6" fill="#febc2e"/><circle cx="68" cy="26" r="6" fill="#28c840"/>
<text class="mono dim" x="${W / 2}" y="31" font-size="14" text-anchor="middle">~/revops/pipeline</text>
<g fill="url(#ng)">
${px.join('\n')}
</g>
<text class="mono sub" x="${X0}" y="${Y0 + 7 * CELL + 36}">Revenue Operations &amp; Analytics leader <tspan class="dim">·</tspan> also ships software<tspan class="cursor" fill="#2dd4bf"> ▌</tspan></text>
<g mask="url(#pxm)">
${bars.join('\n')}
</g>
<g class="mono">
${labels.join('\n')}
<text class="check" x="${LABEL_X + 150}" y="${wonMid + 8}" font-size="26" fill="#4ade80">✓</text>
</g>
</svg>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg);
console.log(`wrote ${OUT}: ${svg.length} bytes, ${px.length} name pixels, name width ${nameW}px`);
