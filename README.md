# Comic Garden

You bring the joke; an agent draws the strip.

Comic Garden is a small Astro site of comic strips, built to practise working as a team with [Lingtai](https://lingtai.hczhang.com). Each strip starts as a GitHub issue with a joke in it. An agent turns the joke into a three- or four-panel strip from a fixed kit of characters, props and backgrounds, a check makes sure the strip follows the rules, and the change reaches `main` through a pull request.

## Make your own copy

Use **Use this template → Create a new repository** on GitHub. Do not fork: a fork starts with Issues turned off, and here every piece of work is an issue.

## Add a joke

Open an issue with the **New joke** form, write the joke, and assign the issue to yourself. The form labels it `feature`.

## Run it

```sh
npm ci
npm run dev      # http://localhost:4321, the kit at /kit
npm run check    # the comic rules, then astro check
npm run build
npm run kit      # redraw public/kit/ from scripts/draw-kit.mjs
```

## How a strip is made

A strip is a JSON script in `src/content/comics/`: which background, who stands where with which face, and what they say. A character can hold a prop or sit on one (`holds`, `on`). `src/components/Strip.astro` draws it from the SVGs in `public/kit/`, which `scripts/draw-kit.mjs` draws. The cast is Miso the cat, Rosa the gardener, Oak the tree, Pip the bird, Biscuit the dog and Beep the car. `src/content/shelf.json` is the home page's order, newest first. The rules for writing one are in [AGENTS.md](AGENTS.md).

## Labels

Lingtai takes issues by kind: `bug`, `feature`, `tech-debt`, `documentation`. A copy made from this template brings its files but not its labels; create those four in the new repository.
