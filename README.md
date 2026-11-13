# Canvas Aces

A single-player dogfighting prototype for fast playtesting in Chrome or another modern browser. The long-term choice between a browser game and an iPhone app remains open.

## Play

For quick Chrome testing, download [Canvas-Aces.html](Canvas-Aces.html) and open it in Chrome. Or download the repository ZIP, extract it, and open **index.html**. No installation, build step, package download, or account is needed. Start with **Practice flight** or **How to play**.

Choose Easy, Normal, or Hard, then **Start flight**. Aircraft, rules, objective, and encounter choices in **Choose your next flight** apply when you start a new sortie.

## What's new

| System | What to try |
| --- | --- |
| Following-turn preview | Select a hard bank, then **Plan next turn**. Gold shows your selected move; faint teal paths show your following-turn options. Open the options list for restrictions. |
| Momentum | A hard bank prevents a hard turn the opposite way until you ease out. Speed changes happen gradually. Cruise always remains legal. Choose Classic flight to remove these extra limits. |
| Aircraft | Lark is slow and agile; Kestrel is balanced; Swift is fast with wider ordinary turns and slower acceleration. All have 10 hull and the same guns. |
| AI evaluation | Pilots weigh shot opportunities, exposure, energy, positioning, and future maneuver options. Hard also considers recent player patterns and a second-turn response. |
| Shot quality | Fixed gunnery keeps guaranteed listed damage when lined up. Optional Variable gunnery uses a displayed hit chance for each projectile. Misses still spend a burst. |
| Flight recorder | Replay one completed turn or the entire recording; export or open a JSON recording. Imported replays never replace your active flight or award career credit. |

Both pilots commit before moves resolve. The AI does not read the maneuver you are selecting. Movement previews and firing checks describe possibilities, not a guarantee about the rival's next position.

### Aircraft and rules

- **Lark:** 82% of Kestrel's speed, 118% of its ordinary turn angle, speed adjustment up to 0.65 throttle units per turn.
- **Kestrel:** baseline speed and turn angle, speed adjustment up to 0.45 units per turn.
- **Swift:** 124% of baseline speed, 78% of its ordinary turn angle, speed adjustment up to 0.30 units per turn.
- Special 150° and 180° reversals keep their stated angles. Speed still changes their radius.
- These are original game archetypes, not historical aircraft performance claims. They need human balance testing.

With Variable gunnery, a close, centered shot is more likely to hit than one at long range or the edge of the firing cone. The displayed percentage is **per projectile**. Combat uses a saved random seed, so replay reproduces the original results without rerolling.

## Controls

| Key | Action |
| --- | --- |
| Q W E / A S D / Z X C | Nine main maneuver cards |
| 1 2 3 | Reversals |
| M | Cockpit / tactical map |
| B | Rear / forward cockpit view |
| R | Replay the last turn |

Use **Flight recorder** for full playback, import, and export. **Stop replay** returns immediately to the unchanged live flight.

### Solo test console

Press the backtick/tilde key (`~`), or tap the version line at the bottom five times quickly. Codes: `repair`, `energy`, `ammo`, `god`, `reveal`, `win`.

Assisted sorties earn no career credit. Cheats and resulting state changes are included in recordings so those recordings remain reproducible. Cheats reset with a new sortie and are unavailable during practice or playback.

## GitHub and browser testing

For local Chrome testing, use the standalone `Canvas-Aces.html` file or the ZIP's root `index.html`. If GitHub Pages is enabled, its site serves the same game for shareable browser testing. No build service is required.

Official instructions: [file uploads](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) and [Pages publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Development

```sh
npm test
```

Requires Node.js 20 or newer. There are no package dependencies and no `npm install` step.

| File | Purpose |
| --- | --- |
| `index.html` | Website and local Chrome entry point |
| `Canvas-Aces.html` | Standalone HTML download, kept in sync with `index.html` |
| `flight-core.cjs` | The same independently written rules engine, usable from Node without a DOM |
| `tools/embed-core.cjs` | Copies changes in the standalone engine into the offline HTML |
| `tests/` | Engine, UI-state, opponent, recording, migration, and synchronization checks |
| `SOURCE_NOTES.md` | Reuse boundaries and reference-project treatment |
| `PROTOCOL.md` | Command/log design and future multiplayer considerations |
| `BASELINE.md` | Previous game snapshot and validation notes |
| `SHA256SUMS` | Checksums of the release files |

After changing `flight-core.cjs`, run `npm run sync:core`, then `npm test`. The synchronization test fails if the embedded and standalone engines differ.

## Saved games and recordings

Existing saves from earlier builds are migrated to the balanced Kestrel, Classic flight, and fixed gunnery. New aircraft and momentum rules apply to new sorties. A legacy save has no full command history: its recorder starts at the resumed turn; its existing last-turn replay remains available when present.

Browser saves are tied to the browser/origin. Local-file saves may differ from the hosted site's saves. The game displays whether a save succeeded.

Replay files contain the initial recording state, completed commands, and resulting states. They do not export the rival's pending maneuver. Import checks reproduce the commands through the engine; this verifies consistency, not authorship or competitive legitimacy. Replays are read-only.

## Validation and next steps

Automated checks cover 36 engine profile/rule/objective combinations and 54 complete AI sorties, plus targeted tests for momentum, seeded gunnery, simultaneous damage, aircraft, practice preservation, full replay/import isolation, cheats, save migration, and command-log validation. Game Canvas views were rendered and inspected.

The tests use a simulated DOM and Canvas API; they do not prove full browser layout or physical iPhone compatibility. Full browser and real-device testing, balance, and fun still need human playtests.

This is a solo prototype. The command engine and recordings are a foundation for future two-device play; hosting, matchmaking, authoritative hidden choices, and network synchronization are not implemented. Trading and upgrades remain future prototype layers. No native platform decision has been made.
