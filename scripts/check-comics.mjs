// Checks every comic script against the kit and the house rules.
// Run with `npm run check`. Exits 1 and prints every problem it found.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const kit = JSON.parse(readFileSync(join(root, 'src/kit.json'), 'utf8'))
const comicsDir = join(root, 'src/content/comics')
const shelfPath = join(root, 'src/content/shelf.json')
const { limits } = kit

const problems = []
const fail = (where, what) => problems.push(`${where}: ${what}`)

const checkProp = (name, at, what) => {
  const known = name in kit.props || existsSync(join(root, 'public/kit/props', `${name}.svg`))
  if (!known) fail(at, `${what} "${name}" has no public/kit/props/${name}.svg`)
  else if (!(name in kit.props)) fail(at, `${what} "${name}" has an SVG but no entry in src/kit.json`)
}

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

const files = readdirSync(comicsDir).filter((f) => f.endsWith('.json'))
const ids = files.map((f) => f.replace(/\.json$/, ''))

for (const file of files) {
  const id = file.replace(/\.json$/, '')
  const where = `src/content/comics/${file}`
  if (!ID.test(id)) fail(where, 'the file name must be lower-case words joined by hyphens, like watering-the-cat.json')

  let comic
  try {
    comic = JSON.parse(readFileSync(join(comicsDir, file), 'utf8'))
  } catch (e) {
    fail(where, `is not valid JSON (${e.message})`)
    continue
  }

  const text = (value, field, max, required = true, place = where) => {
    if (value === undefined && !required) return
    if (typeof value !== 'string' || value.trim() === '') return fail(place, `${field} must be a non-empty string`)
    if (max !== undefined && [...value].length > max)
      fail(place, `${field} is ${[...value].length} characters; the limit is ${max}`)
  }

  text(comic.title, 'title', limits.titleChars)
  text(comic.joke, 'joke')
  text(comic.submittedBy, 'submittedBy')
  if (typeof comic.date !== 'string' || !DATE.test(comic.date)) fail(where, 'date must be YYYY-MM-DD')
  if (!Array.isArray(comic.tags) || comic.tags.length === 0) fail(where, 'tags must list at least one tag')
  else
    for (const tag of comic.tags)
      if (!kit.tags.includes(tag)) fail(where, `tag "${tag}" is not one of: ${kit.tags.join(', ')}`)

  const panels = comic.panels
  if (!Array.isArray(panels)) {
    fail(where, 'panels must be a list')
    continue
  }
  if (panels.length < limits.panels.min || panels.length > limits.panels.max)
    fail(where, `has ${panels.length} panels; a strip has ${limits.panels.min} to ${limits.panels.max}`)

  panels.forEach((panel, i) => {
    const at = `${where} panel ${i + 1}`
    if (!(panel.background in kit.backgrounds))
      fail(at, `background "${panel.background}" is not in the kit (${Object.keys(kit.backgrounds).join(', ')})`)

    const cast = panel.cast
    if (!Array.isArray(cast) || cast.length < limits.castPerPanel.min || cast.length > limits.castPerPanel.max) {
      fail(at, `cast must have ${limits.castPerPanel.min} to ${limits.castPerPanel.max} characters`)
      return
    }
    const taken = new Set()
    for (const member of cast) {
      if (!(member.character in kit.characters))
        fail(at, `character "${member.character}" is not in the kit (${Object.keys(kit.characters).join(', ')})`)
      if (!kit.expressions.includes(member.expression))
        fail(at, `expression "${member.expression}" is not one of: ${kit.expressions.join(', ')}`)
      if (!kit.positions.includes(member.position)) fail(at, `position must be ${kit.positions.join(' or ')}`)
      else if (taken.has(member.position)) fail(at, `two characters stand at ${member.position}`)
      else taken.add(member.position)
      text(member.says, `${member.character}'s line`, limits.bubbleChars, false, at)
      for (const field of ['holds', 'on']) {
        const name = member[field]
        if (name === undefined) continue
        if (typeof name !== 'string' || name.trim() === '') fail(at, `${member.character}'s ${field} must name a prop`)
        else checkProp(name, at, `${member.character}'s ${field}`)
      }
    }
    for (const prop of panel.props ?? []) {
      checkProp(prop.prop, at, 'prop')
      if (!['left', 'center', 'right'].includes(prop.position)) fail(at, 'a prop position is left, center or right')
    }
    text(panel.caption, 'caption', limits.captionChars, false, at)
  })

  const last = panels.at(-1)
  if (last && !(last.cast ?? []).some((m) => typeof m.says === 'string' && m.says.trim() !== ''))
    fail(where, 'the last panel must carry the punchline: give at least one character a line there')
}

// The shelf is the home page's order, newest first. Every comic is on it exactly once.
let shelf = []
try {
  shelf = JSON.parse(readFileSync(shelfPath, 'utf8'))
} catch (e) {
  fail('src/content/shelf.json', `is not valid JSON (${e.message})`)
}
if (!Array.isArray(shelf)) fail('src/content/shelf.json', 'must be a list of comic ids')
else {
  const seen = new Set()
  for (const id of shelf) {
    if (seen.has(id)) fail('src/content/shelf.json', `lists "${id}" twice`)
    seen.add(id)
    if (!ids.includes(id)) fail('src/content/shelf.json', `lists "${id}", but src/content/comics/${id}.json does not exist`)
  }
  for (const id of ids) if (!seen.has(id)) fail('src/content/shelf.json', `does not list "${id}"; add it at the top`)
}

if (problems.length > 0) {
  console.error(`check-comics: ${problems.length} problem(s)\n`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(`check-comics: ${files.length} comic(s) ok`)
