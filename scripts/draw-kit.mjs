// Draws the kit: every character, prop and background under public/kit/.
// Run `npm run kit` after changing this file, and commit the SVGs it writes.
// A new name here also needs an entry in src/kit.json, or `npm run check` refuses it.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

const INK = '#2b2622'
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${body}\n</svg>\n`
const WOBBLE =
  '<defs><filter id="wobble" x="-10%" y="-10%" width="120%" height="120%">' +
  '<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7"/>' +
  '<feDisplacementMap in="SourceGraphic" scale="5.5"/></filter></defs>'
const shaky = (body) => `${WOBBLE}\n<g filter="url(#wobble)">\n${body}\n</g>`
const write = (rel, text) => {
  const p = join(root, 'public', 'kit', rel)
  mkdirSync(join(p, '..'), { recursive: true })
  writeFileSync(p, text)
}

// ---- faces ---------------------------------------------------------------
// (cx, cy) is the face centre, s the scale. Silly on purpose: googly eyes that
// never agree on where to look, a tongue when happy, shock lines, an anger mark.
function face(expr, cx, cy, s = 1, opts = {}) {
  const ink = INK
  const shock = opts.shock ?? -34
  const [ax, ay] = opts.anger ?? [24, -22]
  const [tx, ty] = opts.steam ?? [-30, -24]
  const e = (dx) => cx + dx * s
  const y = (dy) => cy + dy * s
  const sw = 2.6 * s
  const stroke = `stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none"`
  const googly = (dx, r, px, py, pr) =>
    `<circle cx="${e(dx)}" cy="${y(-4)}" r="${r * s}" fill="#fff" stroke="${ink}" stroke-width="${2.2 * s}"/>` +
    `<circle cx="${e(dx + px)}" cy="${y(-4 + py)}" r="${pr * s}" fill="${ink}"/>`
  const blush = `<ellipse cx="${e(-17)}" cy="${y(8)}" rx="${5 * s}" ry="${3 * s}" fill="#f28b8b" opacity="0.7"/><ellipse cx="${e(17)}" cy="${y(8)}" rx="${5 * s}" ry="${3 * s}" fill="#f28b8b" opacity="0.7"/>`
  switch (expr) {
    case 'neutral':
      // derp: one eye up-left, one down-right, a wobbly mouth
      return [
        // cross-eyed, one eye bigger than the other, tongue out (a blep)
        googly(-10, 6, 2.5, 1, 2.8),
        googly(11, 10, -5, -1, 3.4),
        `<path d="M${e(-8)} ${y(12)} Q${e(-4)} ${y(9)} ${e(0)} ${y(12)} Q${e(4)} ${y(15)} ${e(8)} ${y(12)}" ${stroke}/>`,
        `<path d="M${e(-1)} ${y(12.5)} L${e(-1)} ${y(17)} Q${e(2.5)} ${y(22)} ${e(6)} ${y(17)} L${e(6)} ${y(13.5)}" fill="#e86f7c" stroke="${ink}" stroke-width="${1.6 * s}" stroke-linejoin="round"/>`,
      ].join('\n')
    case 'happy':
      return [
        `<path d="M${e(-16)} ${y(-2)} Q${e(-10)} ${y(-11)} ${e(-4)} ${y(-2)}" ${stroke}/>`,
        `<path d="M${e(4)} ${y(-2)} Q${e(10)} ${y(-11)} ${e(16)} ${y(-2)}" ${stroke}/>`,
        `<path d="M${e(-15)} ${y(4)} Q${e(0)} ${y(34)} ${e(15)} ${y(4)} Z" fill="${ink}" stroke="${ink}" stroke-width="${2 * s}" stroke-linejoin="round"/>`,
        `<path d="M${e(-6)} ${y(16)} Q${e(0)} ${y(31)} ${e(7)} ${y(16)} Z" fill="#e86f7c"/>`,
        `<path d="M${e(-9)} ${y(5)} L${e(9)} ${y(5)} L${e(8)} ${y(9)} L${e(-8)} ${y(9)} Z" fill="#fff"/>`,
        blush,
      ].join('\n')
    case 'surprised':
      return [
        // eyes popping out, jaw on the floor, a sweat drop
        googly(-12, 12, 0, -2, 1.6),
        googly(12, 13, 0, 2, 1.6),
        `<ellipse cx="${e(0)}" cy="${y(20)}" rx="${5.5 * s}" ry="${11 * s}" fill="${ink}"/>`,
        `<path d="M${e(26)} ${y(-14)} Q${e(21)} ${y(-4)} ${e(26)} ${y(-2)} Q${e(31)} ${y(-4)} ${e(26)} ${y(-14)} Z" fill="#9fd3e8" stroke="${ink}" stroke-width="${1.4 * s}"/>`,
        `<path d="M${e(-22)} ${y(shock + 4)} L${e(-27)} ${y(shock - 4)} M${e(0)} ${y(shock)} L${e(0)} ${y(shock - 10)} M${e(22)} ${y(shock + 4)} L${e(27)} ${y(shock - 4)}" ${stroke}/>`,
      ].join('\n')
    case 'annoyed':
      return [
        // one eye twitching smaller than the other, teeth gritted, steam
        `<circle cx="${e(-10)}" cy="${y(-3)}" r="${5 * s}" fill="#fff" stroke="${ink}" stroke-width="${2.2 * s}"/>`,
        `<circle cx="${e(10)}" cy="${y(-3)}" r="${8 * s}" fill="#fff" stroke="${ink}" stroke-width="${2.2 * s}"/>`,
        `<rect x="${e(-10)}" y="${y(8)}" width="${18 * s}" height="${8 * s}" rx="${2 * s}" fill="#fff" stroke="${ink}" stroke-width="${1.8 * s}"/>`,
        `<path d="M${e(-4)} ${y(8)} L${e(-4)} ${y(16)} M${e(2)} ${y(8)} L${e(2)} ${y(16)}" stroke="${ink}" stroke-width="${1.2 * s}"/>`,
        `<g fill="#e6e6e6" stroke="${ink}" stroke-width="${1.2 * s}"><circle cx="${e(tx)}" cy="${y(ty)}" r="${4 * s}"/><circle cx="${e(tx - 6)}" cy="${y(ty - 8)}" r="${3 * s}"/><circle cx="${e(tx - 10)}" cy="${y(ty - 15)}" r="${2 * s}"/></g>`,
        `<path d="M${e(-17)} ${y(-5)} L${e(-3)} ${y(-2)} L${e(-3)} ${y(-10)} Q${e(-10)} ${y(-12)} ${e(-17)} ${y(-8)} Z" fill="${ink}"/>`,
        `<path d="M${e(17)} ${y(-5)} L${e(3)} ${y(-2)} L${e(3)} ${y(-10)} Q${e(10)} ${y(-12)} ${e(17)} ${y(-8)} Z" fill="${ink}"/>`,
        `<circle cx="${e(-10)}" cy="${y(0)}" r="${2.2 * s}" fill="${ink}"/><circle cx="${e(10)}" cy="${y(0)}" r="${2.2 * s}" fill="${ink}"/>`,
        // anger mark
        `<g stroke="#d93a3a" stroke-width="${2.6 * s}" stroke-linecap="round" fill="none">` +
          `<path d="M${e(ax - 4)} ${y(ay - 4)} Q${e(ax)} ${y(ay)} ${e(ax + 4)} ${y(ay - 4)}"/>` +
          `<path d="M${e(ax - 4)} ${y(ay + 4)} Q${e(ax)} ${y(ay)} ${e(ax + 4)} ${y(ay + 4)}"/>` +
          `<path d="M${e(ax - 4)} ${y(ay - 4)} Q${e(ax - 8)} ${y(ay)} ${e(ax - 4)} ${y(ay + 4)}"/>` +
          `<path d="M${e(ax + 4)} ${y(ay - 4)} Q${e(ax + 8)} ${y(ay)} ${e(ax + 4)} ${y(ay + 4)}"/></g>`,
      ].join('\n')
    default:
      throw new Error(`unknown expression ${expr}`)
  }
}

const EXPRESSIONS = ['neutral', 'happy', 'surprised', 'annoyed']

// ---- characters (120 x 160, standing on y = 156) --------------------------
// Chibi: the head is most of the character, the body a bean with stubby feet.
const CHARACTERS = {
  miso: (expr) =>
    [
      `<path d="M84 140 Q118 132 108 104 Q104 94 112 90" stroke="#e08a3c" stroke-width="8" stroke-linecap="round" fill="none"/>`,
      `<ellipse cx="60" cy="136" rx="24" ry="20" fill="#f0a050" stroke="${INK}" stroke-width="2.5"/>`,
      `<ellipse cx="60" cy="140" rx="11" ry="11" fill="#fbe3c4"/>`,
      `<ellipse cx="42" cy="154" rx="15" ry="6" fill="#f0a050" stroke="${INK}" stroke-width="2"/>`,
      `<ellipse cx="78" cy="154" rx="15" ry="6" fill="#f0a050" stroke="${INK}" stroke-width="2"/>`,
      `<path d="M24 60 L26 16 L52 40 Z" fill="#f0a050" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<path d="M96 60 L98 22 L70 40 Z" fill="#f0a050" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<path d="M30 46 L31 28 L43 40 Z" fill="#f7c2c2"/>`,
      `<circle cx="60" cy="72" r="40" fill="#f0a050" stroke="${INK}" stroke-width="2.5"/>`,
      `<path d="M50 34 L52 46 M60 32 L60 45 M70 34 L68 46" stroke="#c96f28" stroke-width="3.5" stroke-linecap="round"/>`,
      `<path d="M16 82 L34 80 M16 92 L34 87 M104 80 L86 80 M106 90 L86 86" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`,
      face(expr, 60, 72, 1.15, { steam: [6, -40] }),
      `<path d="M56 78 L64 78 L60 82 Z" fill="#d9646a"/>`,
      // the snaggle tooth
      expr === 'happy' || expr === 'surprised' ? '' : `<path d="M63 86 L63 91 L66 86 Z" fill="#fff" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`,
    ].join('\n'),

  rosa: (expr) =>
    [
      `<rect x="48" y="138" width="9" height="15" rx="3" fill="#4b5d7a"/>`,
      `<rect x="63" y="138" width="9" height="15" rx="3" fill="#4b5d7a"/>`,
      `<ellipse cx="50" cy="155" rx="10" ry="4.5" fill="${INK}"/>`,
      `<ellipse cx="70" cy="155" rx="10" ry="4.5" fill="${INK}"/>`,
      `<path d="M38 142 Q38 108 60 106 Q82 108 82 142 Z" fill="#e9e2cf" stroke="${INK}" stroke-width="2.5"/>`,
      `<path d="M47 142 L49 116 L71 116 L73 142 Z" fill="#5f9e5a" stroke="${INK}" stroke-width="2"/>`,
      `<path d="M40 116 Q22 120 24 108 Q26 96 12 94" stroke="#e9e2cf" stroke-width="7" stroke-linecap="round" fill="none"/>`,
      `<path d="M80 116 Q92 110 98 100" stroke="#e9e2cf" stroke-width="8" stroke-linecap="round" fill="none"/>`,
      `<circle cx="11" cy="93" r="5" fill="#f2c9a5" stroke="${INK}" stroke-width="1.5"/>`,
      `<circle cx="99" cy="98" r="5" fill="#f2c9a5" stroke="${INK}" stroke-width="1.5"/>`,
      `<path d="M24 66 Q18 104 34 108 L86 108 Q102 104 96 66 Z" fill="#6b3f26"/>`,
      `<circle cx="60" cy="70" r="36" fill="#f2c9a5" stroke="${INK}" stroke-width="2.5"/>`,
      // the hat, enormous and a little crooked
      `<g transform="rotate(-8 60 40)">`,
      `<ellipse cx="60" cy="42" rx="56" ry="11" fill="#e8c46a" stroke="${INK}" stroke-width="2.5"/>`,
      `<path d="M34 42 Q36 6 60 6 Q84 6 86 42 Z" fill="#e8c46a" stroke="${INK}" stroke-width="2.5"/>`,
      `<path d="M35 34 Q60 42 85 34" stroke="#c0504d" stroke-width="5" fill="none"/>`,
      `<path d="M82 30 Q96 14 90 4" stroke="#5f9e5a" stroke-width="3" fill="none"/><circle cx="90" cy="4" r="4" fill="#f2c94c" stroke="${INK}" stroke-width="1.5"/>`,
      `</g>`,
      face(expr, 60, 72, 1.05, { shock: -62, anger: [28, -2] }),
      // the nose
      `<ellipse cx="60" cy="80" rx="8" ry="6.5" fill="#e8a882" stroke="${INK}" stroke-width="1.8"/>`,
      expr === 'neutral' ? `<path d="M56 88 L56 95 L60 95 L60 88 M60 88 L60 95 L64 95 L64 88" fill="#fff" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>` : '',
    ].join('\n'),

  oak: (expr) =>
    [
      `<circle cx="28" cy="50" r="24" fill="#6fae5c" stroke="${INK}" stroke-width="2.5"/>`,
      `<circle cx="92" cy="50" r="24" fill="#6fae5c" stroke="${INK}" stroke-width="2.5"/>`,
      `<circle cx="60" cy="38" r="28" fill="#7dbb68" stroke="${INK}" stroke-width="2.5"/>`,
      `<circle cx="60" cy="60" r="26" fill="#6fae5c"/>`,
      // a nest, and a bird who does not care
      `<path d="M46 14 Q60 24 74 14 L72 20 Q60 28 48 20 Z" fill="#a3734c" stroke="${INK}" stroke-width="1.8"/>`,
      `<circle cx="64" cy="9" r="7" fill="#7aa7c7" stroke="${INK}" stroke-width="1.8"/>`,
      `<path d="M70 8 L76 10 L70 12 Z" fill="#f2c94c" stroke="${INK}" stroke-width="1"/>`,
      `<circle cx="66" cy="7" r="3" fill="#fff" stroke="${INK}" stroke-width="1"/><circle cx="67" cy="8" r="1.3" fill="${INK}"/>`,
      // trunk, wide enough for a big face
      `<path d="M30 156 Q38 118 34 70 L86 70 Q82 118 90 156 Z" fill="#a3734c" stroke="${INK}" stroke-width="2.5"/>`,
      `<path d="M30 156 Q18 148 10 156 M90 156 Q102 148 110 156" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      // twig arms
      `<path d="M34 96 Q18 92 10 78 M14 84 L8 86" stroke="#7d5536" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      `<path d="M86 96 Q102 92 110 80 M106 86 L112 88" stroke="#7d5536" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      `<path d="M46 140 Q50 132 46 126 M76 144 Q72 136 76 130" stroke="#7d5536" stroke-width="2" fill="none"/>`,
      face(expr, 60, 104, 1.1, { shock: -32, anger: [24, -18] }),
      expr === 'surprised' || expr === 'happy' ? '' : `<path d="M60 112 Q50 106 40 114 Q46 118 52 114 Q56 112 60 116 Q64 112 68 114 Q74 118 80 114 Q70 106 60 112 Z" fill="#5a3a22" stroke="${INK}" stroke-width="1.4"/>`,
    ].join('\n'),

  pip: (expr) =>
    [
      // a round little bird, mostly head, two stick legs and enormous feet
      `<path d="M50 136 L48 152 M70 136 L72 152" stroke="#e0a030" stroke-width="3.5" stroke-linecap="round"/>`,
      `<path d="M36 154 L48 152 L44 146 M48 152 L52 146 M84 154 L72 152 L76 146 M72 152 L68 146" stroke="#e0a030" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
      `<path d="M22 96 Q4 88 8 70 Q20 80 28 84 Z" fill="#5b8fc7" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<circle cx="60" cy="92" r="44" fill="#7aa7c7" stroke="${INK}" stroke-width="2.5"/>`,
      `<ellipse cx="60" cy="112" rx="28" ry="22" fill="#e9f2f8"/>`,
      `<path d="M98 96 Q116 92 114 76 Q104 86 94 84 Z" fill="#5b8fc7" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      // the tuft
      `<path d="M58 50 Q50 30 60 34 Q62 22 68 36 Q78 30 66 50" fill="#5b8fc7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`,
      face(expr, 60, 88, 1.05, { shock: -42, anger: [30, -24], steam: [-26, -30] }),
      // the beak, too big for the face
      `<path d="M51 86 L69 86 L60 98 Z" fill="#f2b33d" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,
    ].join('\n'),

  biscuit: (expr) =>
    [
      // a sausage of a dog sitting up, tail going
      `<path d="M86 138 Q110 130 104 108" stroke="#d9b27c" stroke-width="7" stroke-linecap="round" fill="none"/>`,
      `<path d="M98 110 L106 104 M100 118 L110 116" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
      `<ellipse cx="60" cy="134" rx="28" ry="22" fill="#e8c99b" stroke="${INK}" stroke-width="2.5"/>`,
      `<ellipse cx="44" cy="154" rx="12" ry="5" fill="#e8c99b" stroke="${INK}" stroke-width="2"/>`,
      `<ellipse cx="76" cy="154" rx="12" ry="5" fill="#e8c99b" stroke="${INK}" stroke-width="2"/>`,
      // floppy ears, one inside out
      `<path d="M28 52 Q8 60 14 100 Q24 104 30 84 Z" fill="#8a5a36" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<circle cx="60" cy="76" r="38" fill="#e8c99b" stroke="${INK}" stroke-width="2.5"/>`,
      `<path d="M92 52 Q114 46 112 70 Q104 76 94 66 Z" fill="#f2b9b9" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      // the patch over one eye
      `<ellipse cx="72" cy="64" rx="15" ry="13" fill="#8a5a36"/>`,
      face(expr, 60, 68, 1.1, { shock: -40, anger: [-30, -24], steam: [36, -30] }),
      `<ellipse cx="60" cy="74" rx="7" ry="4.5" fill="${INK}"/>`,
      `<ellipse cx="58" cy="72.5" rx="2" ry="1.2" fill="#fff"/>`,
      `<path d="M46 112 Q60 120 74 112" stroke="#c0504d" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      `<circle cx="60" cy="120" r="4" fill="#f2c94c" stroke="${INK}" stroke-width="1.5"/>`,
    ].join('\n'),

  beep: (expr) =>
    [
      // a small round car with a face for a windscreen, one wheel smaller than the other
      `<path d="M30 76 Q32 40 60 38 Q88 40 92 76 Z" fill="#c8e4ef" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<path d="M8 120 Q6 82 30 76 L92 76 Q114 80 114 120 Z" fill="#e4574f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<path d="M60 38 L60 22" stroke="${INK}" stroke-width="2"/><circle cx="60" cy="19" r="4.5" fill="#f2c94c" stroke="${INK}" stroke-width="1.8"/>`,
      `<circle cx="104" cy="96" r="7" fill="#fff6c8" stroke="${INK}" stroke-width="2"/>`,
      `<rect x="2" y="108" width="12" height="7" rx="3" fill="#c9ced6" stroke="${INK}" stroke-width="1.8"/>`,
      `<rect x="104" y="108" width="14" height="7" rx="3" fill="#c9ced6" stroke="${INK}" stroke-width="1.8"/>`,
      `<path d="M50 86 L50 118" stroke="#b8403a" stroke-width="2"/>`,
      `<circle cx="32" cy="130" r="18" fill="${INK}"/><circle cx="32" cy="130" r="8" fill="#c9ced6"/>`,
      `<circle cx="90" cy="135" r="13" fill="${INK}"/><circle cx="90" cy="135" r="5.5" fill="#c9ced6"/>`,
      `<path d="M2 152 Q14 146 22 152 M6 146 L0 144" stroke="#9a8f84" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      face(expr, 60, 64, 0.95, { shock: -34, anger: [32, -18], steam: [-34, -12] }),
    ].join('\n'),
}

for (const [id, draw] of Object.entries(CHARACTERS)) {
  for (const expr of EXPRESSIONS) write(`characters/${id}/${expr}.svg`, svg(120, 160, shaky(draw(expr))))
}

// ---- props (64 x 64) -----------------------------------------------------
const PROPS = {
  'watering-can': [
    `<path d="M14 26 L44 26 L48 54 L10 54 Z" fill="#7aa7c7" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    `<path d="M44 34 L58 18" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
    `<path d="M44 34 L58 18" stroke="#7aa7c7" stroke-width="2.5" stroke-linecap="round"/>`,
    `<path d="M18 26 Q29 6 40 26" stroke="${INK}" stroke-width="3" fill="none"/>`,
    `<circle cx="59" cy="14" r="2" fill="#7aa7c7"/><circle cx="62" cy="20" r="2" fill="#7aa7c7"/>`,
  ],
  umbrella: [
    `<path d="M6 32 Q32 2 58 32 Q50 26 45 32 Q38 26 32 32 Q26 26 19 32 Q14 26 6 32 Z" fill="#c0504d" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    `<path d="M32 32 L32 54 Q32 60 26 58" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  ],
  'coffee-cup': [
    `<path d="M14 24 L46 24 L42 56 L18 56 Z" fill="#f4efe6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    `<path d="M46 30 Q58 32 44 46" stroke="${INK}" stroke-width="3" fill="none"/>`,
    `<path d="M24 18 Q20 12 24 6 M32 18 Q28 12 32 6 M40 18 Q36 12 40 6" stroke="#9a8f84" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  ],
  laptop: [
    `<rect x="12" y="14" width="40" height="28" rx="3" fill="#3d4a5c" stroke="${INK}" stroke-width="2.5"/>`,
    `<rect x="16" y="18" width="32" height="20" fill="#9fd3e8"/>`,
    `<path d="M4 50 L60 50 L54 42 L10 42 Z" fill="#c9ced6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
  ],
  'flower-pot': [
    `<path d="M18 38 L46 38 L42 58 L22 58 Z" fill="#c9774a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    `<path d="M32 38 L32 20" stroke="#4d8549" stroke-width="3"/>`,
    `<path d="M32 30 Q22 26 22 18 Q30 20 32 28" fill="#5f9e5a"/>`,
    `<circle cx="32" cy="14" r="7" fill="#f2c94c" stroke="${INK}" stroke-width="2"/>`,
    `<circle cx="32" cy="14" r="2.5" fill="#c96f28"/>`,
  ],
  sign: [
    `<rect x="8" y="10" width="48" height="28" rx="3" fill="#f4e1b5" stroke="${INK}" stroke-width="2.5"/>`,
    `<path d="M32 38 L32 60" stroke="#8a6040" stroke-width="5"/>`,
    `<path d="M16 20 L48 20 M16 28 L40 28" stroke="#8a6040" stroke-width="2.5" stroke-linecap="round"/>`,
  ],
}
for (const [id, parts] of Object.entries(PROPS)) write(`props/${id}.svg`, svg(64, 64, shaky(parts.join('\n'))))

// ---- backgrounds (400 x 300) ---------------------------------------------
const BACKGROUNDS = {
  garden: [
    `<rect width="400" height="300" fill="#cfe8f3"/>`,
    `<circle cx="340" cy="54" r="26" fill="#f6d365"/>`,
    `<path d="M0 210 Q100 180 200 205 Q300 230 400 200 L400 300 L0 300 Z" fill="#9ccc7a"/>`,
    `<rect y="236" width="400" height="64" fill="#8fbf6b"/>`,
    `<path d="M20 236 L20 206 M40 236 L40 206 M60 236 L60 206 M80 236 L80 206 M100 236 L100 206" stroke="#b08a62" stroke-width="5"/>`,
    `<path d="M14 214 L106 214" stroke="#b08a62" stroke-width="4"/>`,
    `<circle cx="300" cy="230" r="6" fill="#e86f6f"/><circle cx="318" cy="238" r="6" fill="#f2c94c"/><circle cx="336" cy="228" r="6" fill="#b07cd8"/>`,
  ],
  kitchen: [
    `<rect width="400" height="300" fill="#f4ead8"/>`,
    `<rect x="40" y="40" width="110" height="80" fill="#cfe8f3" stroke="#a89a85" stroke-width="6"/>`,
    `<path d="M95 40 L95 120 M40 80 L150 80" stroke="#a89a85" stroke-width="4"/>`,
    `<rect x="230" y="50" width="130" height="50" fill="#d9c2a0" stroke="#a89a85" stroke-width="3"/>`,
    `<rect y="226" width="400" height="74" fill="#c9a77c"/>`,
    `<rect y="220" width="400" height="10" fill="#a8835a"/>`,
  ],
  office: [
    `<rect width="400" height="300" fill="#e6e9ef"/>`,
    `<rect x="250" y="36" width="110" height="74" fill="#ffffff" stroke="#9aa3b1" stroke-width="4"/>`,
    `<path d="M262 92 L286 70 L304 84 L330 56 L348 70" stroke="#5f9e5a" stroke-width="4" fill="none"/>`,
    `<rect x="30" y="40" width="70" height="90" fill="#f2c94c" opacity="0.5"/>`,
    `<rect y="236" width="400" height="64" fill="#b9c0cc"/>`,
  ],
  night: [
    `<rect width="400" height="300" fill="#26304a"/>`,
    `<circle cx="320" cy="60" r="24" fill="#f4efd0"/>`,
    `<circle cx="331" cy="52" r="22" fill="#26304a"/>`,
    `<circle cx="60" cy="40" r="2" fill="#fff"/><circle cx="140" cy="70" r="1.6" fill="#fff"/><circle cx="220" cy="34" r="2" fill="#fff"/><circle cx="260" cy="96" r="1.4" fill="#fff"/>`,
    `<path d="M0 220 Q120 196 240 218 Q330 234 400 214 L400 300 L0 300 Z" fill="#33463a"/>`,
  ],
}
for (const [id, parts] of Object.entries(BACKGROUNDS)) write(`backgrounds/${id}.svg`, svg(400, 300, parts.join('\n')))

console.log(`kit drawn in ${join(root, 'public', 'kit')}`)
