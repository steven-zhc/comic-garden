import kit from './kit.json'
import shelf from './content/shelf.json'

export interface CastMember {
  character: string
  expression: string
  position: 'left' | 'right'
  says?: string
  /** A prop from the kit drawn in this character's hands. */
  holds?: string
  /** A prop from the kit this character sits or stands on; the character is raised onto it. */
  on?: string
}
export interface Prop {
  prop: string
  position: 'left' | 'center' | 'right'
}
export interface Panel {
  background: string
  cast: CastMember[]
  props?: Prop[]
  caption?: string
}
export interface Comic {
  id: string
  title: string
  joke: string
  submittedBy: string
  date: string
  tags: string[]
  panels: Panel[]
}

const files = import.meta.glob<{ default: Omit<Comic, 'id'> }>('./content/comics/*.json', { eager: true })

const all: Comic[] = Object.entries(files).map(([path, mod]) => ({
  id: path.replace(/^.*\/(.+)\.json$/, '$1'),
  ...mod.default,
}))

/** Comics in the shelf's order, newest first. `npm run check` keeps the shelf complete. */
export function shelved(): Comic[] {
  const byId = new Map(all.map((c) => [c.id, c]))
  return (shelf as string[]).map((id) => byId.get(id)).filter((c): c is Comic => c !== undefined)
}

export const characterName = (id: string): string =>
  (kit.characters as Record<string, { name: string }>)[id]?.name ?? id

/** Splits a line into rows that fit a bubble; text without spaces (Chinese, Japanese) breaks anywhere. */
export function wrap(text: string, width: number): string[] {
  const rows: string[] = []
  const words = /\s/.test(text) ? text.split(/\s+/) : [...text]
  const joiner = /\s/.test(text) ? ' ' : ''
  let row = ''
  for (const word of words) {
    const next = row === '' ? word : row + joiner + word
    if ([...next].length > width && row !== '') {
      rows.push(row)
      row = word
    } else row = next
  }
  if (row !== '') rows.push(row)
  return rows
}

export const asset = (path: string): string => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/kit/${path}`
