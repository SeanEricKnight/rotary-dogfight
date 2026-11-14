# Rotary Dogfight

The guided learning flight is **Intro**. **Easy** is a separate, reactive duel with the same three controls. The HTML build is the quick-to-test and fun-to-play version; the rules engine stays platform independent so an iPhone app remains a future option.

This is an independent tribute to Alfred Leonardi and Douglas Kaufmann, the creators of Ace of Aces, and Nova Game Designs, the publisher behind the series. It is not affiliated with or endorsed by them.

## Play

For quick Chrome testing, download [the standalone game](Canvas-Aces.html) and open it in Chrome. Or download and extract the repository ZIP, then open **index.html**. There is no install, build step, account, or timer.

| Level | Controls | Challenge |
| --- | --- | --- |
| Intro | Three direction buttons, automatic hints | Slow scripted rival; three successful bursts win |
| Easy | Three direction buttons, hints on request | Reactive rival with 8 hull; bring it down while protecting your 10 hull |
| Normal | Full maneuver selection, then Fly | Energy, altitude, aircraft choice, and tactical opponent |
| Hard | Full maneuver selection, then Fly | Opponent also considers patterns and a following-turn response |

Choose Intro, Easy, Normal, or Hard, then press **Start flight**. Changing the level starts a new sortie.

**In Intro and Easy, every direction tap flies a turn immediately.** Your plane points up on screen. Keep the red rival ahead; your guns fire automatically when lined up. Left and Right turn your plane. Straight keeps flying forward. Speed and altitude are automatic, and turns strengthen when the rival is behind. In Easy, Straight also closes a large gap automatically.

Easy gives you an advantage: you have 10 hull against the rival's 8. The rival can attack only every second turn and deals at most one damage per attack. It chooses a move before your input, using your position rather than reading your selected button. Tap **Hint** for a suggested direction; it clears after your next move. Hint leads the rival using its last observed maneuver and a possible straight continuation; it never reads the rival's committed next move. If six turns pass without either plane dealing damage, the rival extends straight for up to three turns before re-engaging. This changes the solo pilot's decisions, not the combat rules.

Intro retains the slower scripted rival, automatic guidance, and three-burst goal. Its rival can attack only every fourth turn. Intro's guidance uses the scripted route to make learning forgiving.

In a duel, both planes down together, 40 turns, or both out of ammunition ends in a draw.

## Advanced modes

Normal and Hard retain aircraft selection, momentum, energy, altitude, optional variable gunnery, planning previews, and the flight recorder. New flights open on the tactical map, which shows your selected path, following-turn options, and the rival's current firing direction while keeping its committed move hidden. Select a maneuver, then press the gold Fly button. Intro and Easy each use one tap instead.

**Practice flight** is now a five-step flight school: line up a shot, match altitude, recover energy, lead a turning target, and escape a rival's firing line. Each is a short, replayable exercise that does not affect the live sortie or career record.

**Break contact** starts with a pursuer behind you. Reach the marked exit lane on the tactical map while opening at least 250 m of separation. Shooting down the rival still wins. The previous eight-turn survival objective is preserved for old saved flights and recordings.

## Previous saves

The current build uses a new browser save slot and preserves older slots. In Normal or Hard, open **Choose your next flight** and use **Resume a previous-version save** to restore a v10, v9, or v4 save. Previous flights keep their original rules and recordings. Start a new flight to use the current objectives.

Browser save/origin limits still apply. A local file and a hosted site may have different saved data.

## Browser testing

Open the standalone `Canvas-Aces.html` or root `index.html` locally in Chrome. For a shareable browser link, GitHub Pages serves the root `index.html` from the repository branch and root folder; no build step is required.

## Solo cheats

Press the backtick/tilde key (`~`) or tap the bottom status line five times quickly. Codes: `repair`, `energy`, `ammo`, `god`, `reveal`, `win`. Cheat-assisted flights do not earn career credit.

## Human playtesting

Use [PLAYTEST_GUIDE.md](PLAYTEST_GUIDE.md) for a consistent first round of human feedback before adding major systems.

## Developer checks

With Node.js 20 or newer, run `npm test`. No `npm install` is required. The offline HTML and standalone `flight-core.cjs` engine are kept in sync with `npm run sync:core`.

Tests cover the rules engine, Normal/Hard opponents, recordings, saves, migration, flight school, Easy policies, entry-point synchronization, and all project checksums. The Intro recovery check follows a hint that knows the scripted route after zero to four wrong opening moves. Its 60/60 result is a scripted-route regression check, **not evidence that human beginners find the game easy**.

A paired deterministic Easy simulation uses 120 cases per policy across all three standard starting offsets. Each before/after pair uses the same seeds and original v11 combat rules:

| Policy | Before: win / loss / draw | Revised: win / loss / draw |
| --- | --- | --- |
| Always Straight | 0 / 86 / 34 | 5 / 53 / 62 |
| Random direction | 10 / 0 / 110 | 8 / 0 / 112 |
| Follow Hint | 66 / 0 / 54 | 120 / 0 / 0 |
| 0–4 random opening moves, then Hint | 31 / 0 / 89 | 120 / 0 / 0 |

Following Hint averaged 10.78 turns after the change (22.72 before), with a maximum of 18. The longest damage-free stretch in those games fell from 40 turns to 11. The rival damaged all 120 Straight-only pilots and 27 pilots who made opening mistakes. Hint-followers took just one damage across all 120 flights: hints are powerful assistance, and the rival may still feel too safe to skilled players.

Random steering still drew 112/120 revised games. The orbit fix does not guarantee a quick resolution for every policy. Bot results do not establish human difficulty, predict human win rates, or demonstrate fun. See [EASY_AI_VALIDATION.md](EASY_AI_VALIDATION.md) for the exact setup, safeguards, limitations, and reproduction commands.

Historical compatibility checks use 26 frozen recordings actually generated by preserved v8/v10 engines and three actual v10 UI saves and a v8 escape save. They recompute 747 old turns. No v9 historical fixture is claimed. Current generated recordings use the current rules version rather than masquerading as old ones.

`npm run sync:core` synchronizes both embedded modules and the two HTML entry points. Run `npm run checksums` after project changes; `npm test` verifies the complete manifest. The legacy standalone filename and internal identifiers remain for compatibility.

Full browser layout, cross-browser floating-point replay behavior, and physical iPhone testing remain unverified in this change. Break Contact balance, mobile mis-taps/confirmation, and the jump from Easy to Normal remain human playtest questions. No Break Contact or mobile input rules changed.

See `PROTOCOL.md`, `SOURCE_NOTES.md`, `BASELINE.md`, and `CLAUDE_REVIEW.md` for technical details, review suggestions, and preserved snapshots. This is single-player; two-device hosting is not included.
