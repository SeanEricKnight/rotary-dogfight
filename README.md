# Rotary Dogfight

The guided learning flight is **Intro**. **Easy** is a separate, reactive duel with the same three controls. The HTML build is the quick-to-test and fun-to-play version; the rules engine stays platform independent so an iPhone app remains a future option.

This is an independent tribute to Alfred Leonardi and Douglas Kaufmann, the creators of Ace of Aces, and Nova Game Designs, the publisher behind the series. It is not affiliated with or endorsed by them.

## Play

For quick Chrome testing, download [Canvas-Aces.html](Canvas-Aces.html) and open it in Chrome. Or download and extract the repository ZIP, then open **index.html**. There is no install, build step, account, or timer.

| Level | Controls | Challenge |
| --- | --- | --- |
| Intro | Three direction buttons, automatic hints | Slow scripted rival; three successful bursts win |
| Easy | Three direction buttons, hints on request | Reactive rival with 8 hull; bring it down while protecting your 10 hull |
| Normal | Full maneuver selection, then Fly | Energy, altitude, aircraft choice, and tactical opponent |
| Hard | Full maneuver selection, then Fly | Opponent also considers patterns and a following-turn response |

Choose Intro, Easy, Normal, or Hard, then press **Start flight**. Changing the level starts a new sortie.

**In Intro and Easy, every direction tap flies a turn immediately.** Your plane points up on screen. Keep the red rival ahead; your guns fire automatically when lined up. Left and Right turn your plane. Straight keeps flying forward. Speed and altitude are automatic, and turns strengthen when the rival is behind. In Easy, Straight also closes a large gap automatically.

Easy gives you an advantage: you have 10 hull against the rival's 8. The rival can attack only every second turn and deals at most one damage per attack. It chooses a move before your input, using your position rather than reading your selected button. Tap **Hint** for a suggested direction; it clears after your next move. Hints do not know the rival's committed maneuver.

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

Tests cover the rules engine, Normal/Hard opponents, recordings, saves, migration, flight-school goals, and the marked exit objective. Intro recovered to a win in 60/60 cases after zero to four deliberately wrong opening choices, within 15 turns.

A deterministic sample of 12 Easy flights per policy produced:

| Policy | Wins | Losses | Draws |
| --- | --- | --- | --- |
| Always Straight | 0 | 6 | 6 |
| Random direction | 0 | 0 | 12 |
| Basic bearing-based steering (the optional Hint) | 8 | 0 | 4 |

This sample checks that positioning matters; it does not establish human difficulty or fun. Draws remain possible, especially with aimless steering. Canvas views were rendered and inspected. Full browser layout and physical iPhone testing remain outstanding.

See `PROTOCOL.md`, `SOURCE_NOTES.md`, `BASELINE.md`, and `CLAUDE_REVIEW.md` for technical details, review suggestions, and preserved snapshots. This is single-player; two-device hosting is not included.
