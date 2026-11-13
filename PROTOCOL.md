# Rules and recording protocol

## Engine boundary

`flight-core.cjs` has no DOM or networking dependency. It exports rule version 10 and pure functions for movement, restrictions, firing solutions, seeded combat, state transitions, and recording validation. Its browser copy is embedded in `index.html` for offline single-file play.

`resolveTurn(state, command)` validates state and command, checks both maneuvers, computes both final positions, resolves both firing opportunities, charges ammunition for fired bursts, applies simultaneous damage, updates statistics, and returns a new state. It does not mutate its input or update browser storage or career totals.

The command shape is:

```json
{
  "version": 1,
  "type": "resolve-turn",
  "turn": 1,
  "playerMove": "cruise",
  "enemyMove": "left"
}
```

Commands with the wrong turn number, unknown maneuvers, or illegal maneuvers are rejected. Already-ended matches reject further turn commands. The UI chooses its AI plan before the player selects a move; previews do not reroll that plan or consume combat randomness.

## Recordings

A `canvas-aces-replay` version 1 file contains:

- `rulesVersion: 10`;
- an initial canonical state, including aircraft, rules, objective, stats, cheat flags, and combat seed;
- ordered completed `turn` events with commands and resulting states;
- explicit `cheat` events when solo testing changes state.

The current pending AI choice is not part of an export. The UI separately stores that choice in its private local save for continuing a solo game.

The validator recomputes every event and compares resulting canonical states. Playback frames and shot results come from recomputation, not from trusting arbitrary imported results. The importer enforces a 2 MB file limit; the engine limits a recording to 500 total events. Normal games end within 40 turns.

Validation provides reproducibility, not a signature or proof of honest play. The importer does not resume imported states, award scores, replace the live game, or write imported state into the active save.

## Randomness

Variable gunnery uses a saved 32-bit PRNG state. Each projectile consumes a roll only when a valid shot is fired. Fixed gunnery uses no combat rolls. The AI has a separately initialized random stream; cosmetic previews and replay do not change either live stream.

The recording seed makes combat reproducible. A recording is not an appropriate secret-sharing mechanism for a competitive live game: seeds and future hidden choices should remain under the future authority's control until disclosure is appropriate.

## Future two-device adapter

A future host can use the engine to resolve a turn after both participants lock their legal maneuvers. The adapter still needs player/room identity, private submissions, turn ownership, duplicate handling, reconnection, and state synchronization. No hosted adapter is delivered here.

Keep unpublished choices on the authority until both are locked. A competitive adapter should not expose the solo `applyTestCode` operation. Career bookkeeping and replay import remain outside the authoritative rules reducer. Versioned commands and canonical state provide a useful interface; they do not supply authentication or network secrecy themselves.

Trading and upgrade rules can be added as separate systems with their own commands after the core flight loop is playtested. A native application would still need its own interface/integration work; the tested rules and record format keep that platform decision open.


## Simple modes and save migration

Canonical state includes `assist` and `training` booleans. `assist: true` selects automatic handling: Classic flight and gunnery, middle altitude, full player energy after each turn. `training: true` selects Intro, mission `easy`, slower scripted opponent at energy 1, attacks every fourth turn capped at 1 damage, and three valid player bursts to win. Missing `training` on legacy assisted state means Intro.

`assist: true, training: false` selects the real Easy duel, mission `duel`. The player starts with 10 hull; the Swift rival starts with 8 hull and full energy. It can attack every second turn, capped at 1 damage. Hull reaching zero determines the winner under ordinary duel end conditions. Normal and Hard use `assist: false` and their original rules.

Both simple modes display Left, Straight, and Right. A turn tap can map to a hard turn when the target is behind. Easy's Straight can map to Boost when distance exceeds 300. The recorder stores the actual engine maneuver. Easy's rival may use these same turn/cruise/boost maneuvers; Intro's scripted rival uses only ordinary left/cruise/right.

Intro's hint searches the scripted route. Easy's optional hint considers current bearing only and is cleared after every completed turn. Neither changes the committed opponent plan or consumes RNG. Easy's AI extrapolates the player's current straight course; it never inspects the selected player maneuver.

The browser uses `canvas-aces-flight-v10`. Older `canvas-aces-flight-v9` and `canvas-aces-flight-v4` slots remain intact. The previous build's assisted saves restore as Intro. Rule versions 8 (unassisted), 9, and 10 recordings remain readable. Imported recordings are still read-only.
