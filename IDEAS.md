# Ideas and future plans

## Two-player play across two phones (wanted, not started)

Sean wants Rotary Dogfight to be playable between two phones at some point.

Notes for when this is picked up:
- The rules engine is already platform-independent and deterministic (seeded, with a replay log), which suits a turn-by-turn two-player match: each phone sends its chosen move, both apply the same rules.
- Hidden simultaneous choices already exist in Normal and Hard, so the "both pick, then reveal" turn maps onto a simple exchange of moves.
- Needs a way to connect the two phones: a share code or link, with either a small relay server or direct peer-to-peer. A static site alone cannot relay moves.
- Open questions: asynchronous play (take your turn when ready) or live; how to handle a dropped connection (the saved log can resume); whether Intro and Easy stay single-player.
