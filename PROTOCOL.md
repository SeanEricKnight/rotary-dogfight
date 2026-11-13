# Rules and recording protocol

## Engine boundary

`flight-core.cjs` has no DOM or networking dependency. It exports rule version 8 and pure functions for movement, restrictions, firing solutions, seeded combat, state transitions, and recording validation. Its browser copy is embedded in `index.html` for offline single-file play.

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

- `rulesVersion: 8`;
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
