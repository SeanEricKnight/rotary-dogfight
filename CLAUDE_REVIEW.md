# Claude review: Canvas Aces prototype

**Date:** November 13, 2026  
**Source:** Claude  
**Status:** Review and proposals only. No changes authorized or made from this review.

> The core idea is sound and the engineering is unusually clean for a prototype. The biggest fun risks are pacing, since stretches with no shooting are long, and teaching, since the best learning tool isn’t what new players see first. Both can be tuned cheaply. Don’t add trading or upgrades until a few humans have played this.

## Scope and method

Claude reports reading the README, protocol notes, engine, UI, AI, and tests. It changed nothing in the repo. It drove the game's real AI through its test harness with simple bots using temporary scripts. It ran about 30–60 games per setup and says differences under roughly 15 points are noise. These bots are not humans. Claude did not open the game in a browser and could not check whether GitHub Pages was live because outbound access was blocked.

Claude used these labels:

- **[Code]** supported by reading the code.
- **[Sim]** supported by bot simulations.
- **[Hyp]** needs human playtesting.

## What Claude says is working

- The rival commits its move before the player chooses, creating a turn-based outguessing loop suitable for browser and phone.
- Failed shots explain why they missed, and disabled maneuver cards explain why they are unavailable.
- The engine is pure and deterministic, with seeded combat and validated replays. Claude reports that the README test counts match its checks.
- The interface includes mobile CSS, 44 px tap targets, safe-area insets, no external assets, and a sticky Fly button on small screens.

## Prioritized suggestions from Claude

1. **Build a playtest kit first.** Add three post-sortie questions: fun (1–5), why the player lost or drew, and whether they want to play again. Export the recording with its settings. Keep an initial round of testers on one setup (Kestrel mirror, Momentum, Fixed gunnery, Normal) so feedback is comparable. **Cost:** low effort, low risk. **[Code]**

2. **Investigate stalled pacing.** In Claude’s Normal-duel simulations, its greedy bot had no shot for either side on 84% of turns; games averaged 25 turns and 28% were draws. Claude attributes this partly to the AI's exposure and attack weights and the requirements for a shot. Possible experiments: a 25–30 turn cap, a pressure mechanic, or a small altitude tolerance at close range. Validate with human players. **Cost:** low effort for tuning numbers; medium for a new mechanic. **[Sim] [Code] [Hyp]**

3. **Improve teaching and visibility.** The cockpit view is the default; the planning map shows the gold move path, following-turn paths, and rival firing cone. Consider making the map default for new players or adding a map inset, and add lessons for leading a turning target and escaping a rival’s cone. **Cost:** low effort, low risk. **[Code]**

4. **Explain the speed rule.** Energy affects speed, but the guide does not explain why it changes how far a plane travels. Show reach and explain the rule; consider an optional overlay of the rival’s possible end area. **Cost:** low for text, medium for an overlay. **[Code] [Hyp]**

5. **Revisit draws and ties.** In Fixed gunnery, damage depends on range tier and the aim label is cosmetic. Simultaneous fire can make head-on passes symmetric; Claude’s Normal First Blood simulations drew 32% of games. Consider a tie-break or making alignment matter in Fixed mode. **Cost:** low to medium. **[Code] [Sim] [Hyp]**

6. **Make Break Contact require evasion.** The current objective awards the win for having hull left at turn 8. Claude’s random bot survived 65–80% of the time and its greedy bot 75–100%. Consider an exit zone or scoring rival tail pressure. **Cost:** medium. **[Code] [Sim]**

7. **Smooth difficulty.** In Claude’s simulations against its greedy bot, Easy lost 80% of duels, Normal won 15%, and Hard won 0% (Hard lost 97%). A random-move bot never beat Easy. These are bot results, not human balance data. Use playtest evidence; possible adjustments include changing Easy’s noise or aggression and adding a middle level between Normal and Hard. **Cost:** low. **[Sim] [Hyp]**

8. **Recheck Swift balance.** Claude’s Swift bot won 0–13% against Lark and Kestrel rivals; its Kestrel bot beat a Swift rival 57% of the time. Consider giving Swift a clear edge, such as longer gun range, or making it shine in Break Contact if human tests confirm the problem. **Cost:** low. **[Sim] [Hyp]**

9. **Make ammunition matter or remove its gauge.** In Claude’s 270 simulations, no aircraft ended with fewer than six bursts. Since firing is automatic, ammunition did not create a decision. Consider lowering ammunition to 6–8 bursts or hiding the gauge, pending human tests. **Cost:** low. **[Sim] [Hyp]**

10. **Add replay hooks before trading or upgrades.** Claude notes that variety currently comes from starting setups and objectives, while career records are limited. Suggestions: a short fixed-mission ladder, seeded daily sortie, and distinct rival personalities. **Cost:** medium. **[Code] [Hyp]**

## Quick fix Claude identified

Claude reports that 'npm test' fails on the engine synchronization check because the embedded engine header in index.html says “independently written for Canvas Aces.” while flight-core.cjs says “independently written.” Claude says the rules code is identical and that 'npm run sync:core' should resolve the mismatch. It ran the other three suites individually, which it reports passed.

## Suggested human playtest

Claude suggests 5–8 players, ideally including a non-gamer and someone using an iPhone. Questions to measure:

- Can a first-time player explain why they lost by their third sortie?
- Do they start a third sortie without prompting?
- Which view do they use?
- Do draws annoy them?
- Do quiet stretches feel tense or dead?
- Does Hard feel fair?
- Do Lark and Swift feel distinct?

These are Claude’s proposed questions, not established benchmarks.

## Browser now, iPhone later

Claude's suggestions:

1. Enable GitHub Pages; .nojekyll and root index.html are already present.
2. Test portrait Safari on a real iPhone. The simulated tests do not prove this; the nine-plus-three card grid and thumb reach are possible risks.
3. Consider a web manifest and Apple meta tags for Add to Home Screen. Claude notes that Safari storage-retention behavior should be verified before relying on it.
4. Choose the native path based on playtesting. A Capacitor wrapper could keep the JavaScript engine; a Swift rewrite is possible but would need work.
5. Claude identifies a possible replay-portability risk: recordings compare floating-point values as JSON strings while the engine uses trigonometric functions. It suggests rounding positions in canonicalState before recordings are shared, which would require a rules-version change. This is a hypothesis to verify across engines.
6. Move AI, scenario setup, and scoring out of the UI script into a DOM-free module to make them easier to test and port.

Claude’s proposed next step was to do items 1–3 and the synchronization fix, then start playtesting. **No items in this review have been approved or implemented.**


## Selective follow-up

After the original review was recorded, Sean authorized applying recommendations that checked out. The changes in the follow-up commit:

- Added a small human playtest guide with a consistent first-round setup and debrief questions. This is a manual worksheet, not an in-game survey or automatic recording bundle.
- Clarified in the rules help that energy affects movement distance and that aim alignment does not alter damage in Fixed gunnery.
- Synchronized the embedded browser engine from the standalone engine to remove the documented header mismatch.

No balance or mission changes based only on bot simulations were made. The other suggestions remain proposals for human playtesting.
