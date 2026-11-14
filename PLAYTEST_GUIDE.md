# Rotary Dogfight human playtest guide

## Goal

Find out whether the flying and combat loop is understandable and fun before adding larger systems such as trading or upgrades. Treat browser play as a useful game in its own right; the native iPhone decision remains open.

## First-round setup

Use the same setup for the first few testers so their feedback is comparable:

- Your aircraft: Kestrel
- Rival aircraft: Match my aircraft
- Flight rules: Momentum
- Gunnery: Fixed
- Objective: Dogfight
- Difficulty: Normal
- Starting situation: The merge

Ask 5–8 people to play, including people with different levels of game experience. If possible, include someone playing on an iPhone browser. Let each person play up to three sorties. Don't coach them during the first sortie; note where they pause, ask questions, or misunderstand a rule.

After the baseline sorties, ask each tester to try **Practice flight** and one **Break contact** sortie. For Break contact, use Kestrel, Normal, Momentum, Fixed gunnery, and the marked exit lane. Observe whether the map makes the goal and rival threat clear without explanation.

## Easy and phone follow-up

Add two Easy sorties: one without hints, then one with Hint available. Record whether the player uses it, whether a straight rival extension looks purposeful or random, and how many turns pass with no damage. Ask whether Hint explains a useful intercept or merely supplies a winning button. Our bot can win all 120 tested cases with Hint; that is not a target human win rate. Random steering still produces many draws.

On a real iPhone, note accidental taps and whether a confirmation step would help or slow the game down. Keep the current one-tap controls during this round. Observe the transition from three Easy buttons to Normal's energy and altitude decisions.

Break Contact's starting distance and 250 m escape requirement remain balance questions. Record success by the third attempt and whether early shots feel unavoidable. Do not treat bot losses or suspected mobile mis-taps as confirmed human usability bugs.

## Ask after each sortie

1. How fun was that sortie, from 1 to 5?
2. If you lost or drew, what do you think caused it?
3. Do you want to play another sortie? Why or why not?

After the third sortie, ask:

- Did the quiet turns feel tense or boring?
- Could you predict how much distance a move would cover?
- Did you understand what energy, altitude, and the firing indicators meant?
- Did the aircraft or map/cockpit views change how you played?
- Did the tactical map make your next move and the rival's firing threat clear?
- In Break contact, could you tell where the exit lane was and what you needed to do to win?
- Did the short practice exercises help you make a better choice in a real sortie?
- Did a draw feel fair? Did Hard feel fair? (Only ask about Hard if they tried it.)

## Record observations

Record the chosen settings, how many sorties they completed, whether they chose another without prompting, and their exact explanations for confusion or frustration. If they agree, download the flight recorder JSON for a sortie worth reviewing. Write down the setup alongside the file; the recording may not capture every interface or pilot setting.

Keep notes anonymous. Separate what the player said or did from your interpretation. These small playtests are directional feedback, not proof that a feature will work for everyone.

## Decide what to change

Look for repeated problems across players. Prioritize a change when multiple people misunderstand the same rule, stop for the same reason, or independently ask for the same improvement. Change one important thing at a time, then replay the same setup. Avoid tuning balance from a handful of bot simulations alone.
