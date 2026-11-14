# Easy AI revision: evidence and limits

The supplied main-branch ZIP identifies commit `379e8c1144e72a10f88ab619c2a4d74a1d444015`. This change is based on that snapshot, including v11, the five-step flight school, tactical map, and existing branding work. It does not use Flight Test 10 as the working base. Older releases are used only to generate historical test fixtures.

## Changes

- The rival's existing engagement scoring is retained. After six consecutive completed turns with no damage by either aircraft, it extends straight with Boost for up to three turns. Damage resets this pattern; otherwise six engagement turns separate later extensions. It holds its heading during an extension instead of choosing alternating escape turns.
- Hint considers each visible control over two turns. It extrapolates the last *completed* rival maneuver with weight 0.7 and a straight continuation with weight 0.3. These are heuristics, not measured probabilities. With no observed maneuver, it assumes straight flight. It values a future firing solution, exposure, angle, and distance.
- Hint cannot see the pending rival move, reroll it, consume AI/combat randomness, or guarantee a shot. The rival still commits before the player acts and does not read the player's selected control.
- These decisions live in a DOM-free `easy-pilot.cjs` module, embedded in both standalone HTML files. It can be reused by a future phone interface without moving policy into the replay reducer.

The v11 engine is byte-identical to the supplied snapshot. Movement, damage, cadence, hull, objectives, replay format, and save keys did not change. No rules-version bump is needed. Existing saved pending maneuvers are preserved; the new policy is used when the next rival decision is needed. Completed recordings store actual commands and still recompute under their original rules.

## Reproduce

```sh
npm test
npm run sim:easy
node tools/simulate-easy.cjs --baseline
```

The baseline is an explicit-argument transcription of the supplied snapshot's Easy policy, kept in `tests/fixtures/easy-before.cjs`. It is not a historical engine fixture. Both policies run against the same unchanged v11 engine.

There are 120 cases per policy, indexed `n = 0..119`. Combat and AI streams start at `12345 + 1237*n`. A separate random-control stream starts at `234+n`. The rival's initial x offset cycles `[45,-45,75][n%3]`; all other starting state matches standard Easy: Kestrel at `(0,150)` heading up with 10 hull, Swift at `(offset,-190)` heading down with 8 hull; both at middle altitude and energy 6, with 12 bursts. Classic flight/gunnery and the original 40-turn limit apply. The simulator calls the same policy module used in the UI. Twelve complete UI flights also compare every command and final state with simulation.

Policies are always Straight, independent random choice among the three controls, following Hint every turn, and `n%5` random opening moves followed by Hint. The last policy tests recovery after zero to four mistakes; it is not a model of beginner behavior.

| Policy | Before wins / losses / draws | After wins / losses / draws | After average turns |
| --- | --- | --- | --- |
| Straight | 0 / 86 / 34 | 5 / 53 / 62 | 37.86 |
| Random | 10 / 0 / 110 | 8 / 0 / 112 | 38.93 |
| Hint | 66 / 0 / 54 | 120 / 0 / 0 | 10.78 |
| Mistakes, then Hint | 31 / 0 / 89 | 120 / 0 / 0 | 14.68 |

Before, Hint games averaged 22.72 turns, with a 40-turn maximum, up to 39 repeated rival hard turns, and up to 40 consecutive damage-free turns. After, the maximum Hint game was 18 turns; the longest repeated rival turn run was 5, and the longest damage-free stretch was 11.

The rival damaged 120/120 Straight pilots (991 damage total), 112/120 Random pilots (353 total), 1/120 Hint pilots (1 total), and 27/120 pilots who made opening mistakes (30 total). Straight and Random do not win routinely. The combat cap remains one rival damage every second turn; the policy does not secretly increase it.

## Regression safeguards

Tests enforce a Hint draw rate no higher than 15% in this fixed sample, fewer than 20 average Hint turns, no long repeated-turn orbit, recovery after opening mistakes, and meaningful rival damage against poor steering. A genuine orbit from the baseline simulation is also fed into the extension policy. Separate checks cover deterministic results, no mutation/RNG consumption by hints, preserved pending moves on save/resume, legal maneuvers through the reducer, and UI/simulator parity.

The Intro test remains a scripted-route regression: its hint searches the known scripted path. Its 60 wins after zero to four wrong choices establish that this script and hint still work together. They do not establish human accessibility or enjoyment.

## Limits and playtest questions

These fixed cases are not independent human trials or a broad difficulty study. Strong Hint performance may make assisted Easy too safe; it is optional. Random steering still draws 112/120 games and can remain damage-free for 40 turns. The change breaks the specific pursuit orbit and makes Hint useful; it does not promise that every sequence of taps resolves quickly.

Whether the rival's extensions look deliberate rather than erratic needs observation in a real browser. Ask whether Hint teaches interception or feels like an answer button. Physical iPhone layout, accidental taps, the transition to Normal, Break Contact's difficulty, and cross-browser floating-point replay equality remain unverified. Break Contact balance and one-tap controls were deliberately left for playtesting.

Historical checks use 26 frozen recordings generated by genuine preserved v8/v10 engines (747 turns) and three actual v10 UI saves and a v8 escape save. No v9 recording is fabricated. See `tests/fixtures/README.md` for provenance and regeneration details.


## Easing update (rival hull 8 to 5)

Playtesters found Easy too hard, so the Easy rival now starts with 5 hull instead of 8. Only starting state changed; movement, damage, cadence, replay format and save keys are unchanged, and existing recordings and saves still load. The regression guard for passive straight flight was relaxed from 18 to 40 wins out of 120 to reflect this deliberate easing; Straight and Random pilots still mostly fail to win.
