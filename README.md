# Canvas Aces

A self-contained, turn-based dogfighting game for a desktop or mobile browser.

Canvas Aces is in development. The HTML game remains playable for Chrome testing and casual play while an iPhone version is explored. The game currently supports single-player play against the computer; two-device multiplayer is not implemented.

## Play in Chrome

Download the repository files and open `index.html` in Chrome. No installation or server is needed for local play. Browser storage availability determines whether a sortie can be saved; the game displays its save status.

For a shareable online testing link, enable GitHub Pages in **Settings → Pages**, choose **Deploy from a branch**, and select the `main` branch and `/(root)` folder. GitHub will show the site URL when publishing completes.

## Included features

- Simultaneous hidden maneuvers, cockpit and tactical views, and a rear-view camera.
- Easy, Normal, and Hard computer opponents.
- Dogfight, First blood, and Break contact objectives.
- Three guided practice exercises.
- Illustrated maneuver cards, altitude and energy management, and automatic firing.
- Last-turn replay, browser saves, and career totals.
- A hidden solo test console; assisted flights do not earn career credit.

### Solo cheat console

Press the backtick/tilde key (`~`) while no dialog is open, or tap the version line at the bottom five times in quick succession. The console is unavailable during movement or practice. It accepts:

| Code | Effect |
| --- | --- |
| `repair` | Restore hull to 10 |
| `energy` | Refill energy to 6 |
| `ammo` | Refill ammunition to 12 bursts |
| `god` | Toggle invulnerability |
| `reveal` | Toggle the rival's planned maneuver display |
| `win` | End the sortie with a test victory |

Using any valid cheat marks that sortie as assisted, including after saving and reopening it. Starting a new sortie clears the cheat state.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Complete game: HTML, CSS, JavaScript, and generated vector graphics |
| `tests/check-game.cjs` | Automated game-logic checks using Node.js built-ins |
| `package.json` | Provides the optional `npm test` command; no package dependencies |
| `BASELINE.md` | Source snapshot and validation notes |
| `SHA256SUMS` | Checksums of the packaged files |

## Optional developer checks

With Node.js 20 or newer installed, open a terminal in this directory and run:

```sh
npm test
```

Or run the checks directly:

```sh
node tests/check-game.cjs
```

No `npm install` is needed. The checks simulate the DOM and Canvas API to exercise game logic; they do not launch a real browser or prove the visual layout or iPhone compatibility.

## Validation and scope

Previous checks covered 225 regular-duel simulations and 72 short-objective simulations, with targeted checks for difficulty selection, practice preservation, save/restore, replay, and solo cheats. The included automated suite covers the regular duels and core state behavior; it is not the complete set of earlier targeted checks.

Canvas images were inspected during development. Full browser and physical iPhone testing remains outstanding. Save data belongs to the browser origin: opening a local file and opening a hosted site may use different saves.

No Fly Casual or Plane Tactics code, assets, archives, or dependencies are included. Those projects were reviewed as possible references for later development. Their proposed integrations have not been applied to the current game.
