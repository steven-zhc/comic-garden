# Comic Garden contributor rules

A ticket brings a joke. Your job is to draw it as a strip, using only the kit.

## Drawing a joke

1. Read the joke in the ticket. Keep its wording: the punchline in the strip is the punchline the person wrote, shortened only to fit a bubble.
2. Pick characters, expressions, props and backgrounds from `src/kit.json`. See them on the `/kit` page of the site (`npm run dev`).
3. Write `src/content/comics/<id>.json`, where `<id>` is the title in lower-case words joined by hyphens. Copy the shape of an existing comic.
   - `joke` is the joke exactly as the ticket gives it.
   - `submittedBy` is the name the ticket says to credit.
   - `date` is today, `YYYY-MM-DD`.
4. Add `<id>` at the **top** of `src/content/shelf.json`. The home page shows comics in that order, newest first.
5. Run `npm run check` and `npm run build`. Both must pass.

## When a character holds or sits on something

A character stands at `left` or `right`, and a prop in `props` stands on its own at `left`, `center` or `right`. When the joke needs a character **with** a prop, attach it to the character instead:

- `"holds": "<prop>"` draws the prop in the character's hands.
- `"on": "<prop>"` raises the character onto the prop, to sit or stand on it.

```json
{ "character": "miso", "expression": "happy", "position": "right", "on": "laptop" }
```

An action the kit still cannot draw is told in the panel's `caption` (*Miso curls up on the keyboard.*), never left out.

## The rules `npm run check` holds you to

- 3 or 4 panels; 1 or 2 characters a panel, one at `left` and one at `right`.
- A line in a bubble is at most 70 characters; a caption at most 80.
- Only names that are in `src/kit.json`, including the props a character `holds` or is `on`.
- The last panel carries the punchline: at least one character speaks there.
- Every comic is on the shelf exactly once.

## Adding to the kit

Only when a joke cannot be drawn without it. The kit is drawn by `scripts/draw-kit.mjs`: add the prop there, beside the others and in their style (flat colours, `#2b2622` outlines, 2.5 px strokes), run `npm run kit`, give it an entry in `src/kit.json`'s `props`, and commit the SVG the script wrote. Never edit an SVG under `public/kit/` by hand; the next `npm run kit` overwrites it. Do not add characters, expressions or backgrounds in a joke ticket.

## Reviewing

Review checks that the strip tells **this** joke: the punchline is the person's, it lands in the last panel, and nothing in the joke was dropped or changed in meaning. An action the joke needs is either drawn (with `holds` or `on`) or told in a caption; either is enough. Do not refuse a strip because the kit draws an action plainly, or because a caption tells what the kit cannot draw. Do not judge whether the joke is funny; that is the person's call. Refuse a strip that mocks a real person, or a group by race, religion, gender or nationality, whatever the ticket asked for.
