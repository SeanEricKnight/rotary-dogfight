# Sources and reuse boundaries

This release was implemented independently in JavaScript, extending the original Canvas Aces prototype. No source code, artwork, fonts, models, music, scenes, prefabs, or networking libraries from the two supplied reference projects are bundled.

## Plane Tactics reference

The supplied `PlaneTactics-master.zip` was reviewed for its movement and attack-preview concepts, aircraft data, and movement-history restrictions. The archive did not contain a clear project-level license. Its screenshot entries were Git LFS pointers rather than image bytes.

Canvas Aces independently implements following-turn paths, bank commitment, gradual acceleration, three original aircraft archetypes, and aim-quality feedback. It preserves hidden simultaneous turns rather than adopting the reference project's alternating team turns.

## Fly Casual reference

The supplied `FlyCasual-development.zip` was reviewed for virtual-position evaluation, maneuver scoring, phase-aware commands, and replay organization. It contains an MIT license at project level and a README identifying Star Wars content and third-party asset sources.

No Fly Casual code was copied. No Star Wars or third-party models, images, fonts, music, Unity components, or Mirror networking code were used. The new browser engine, command records, AI features, and read-only replay viewer are original implementations of general concepts.

## Other design references

Earlier UI work considered simultaneous maneuver planning in Wings of Glory and readable maneuver choices and mission variety in Ace Patrol. Links remain in the game's guide and the prior development record. Their assets and rulebook text are not included.

## Original graphics and engine

Graphics are drawn by the existing Canvas Aces Canvas renderer and inline vector paths. The engine's numeric aircraft characteristics are invented game parameters. No historical flight-performance accuracy is claimed.
