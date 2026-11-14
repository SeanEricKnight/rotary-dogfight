const assert=require('assert'),Core=require('../flight-core.cjs'),Pilot=require('../easy-pilot.cjs');
const Before=require('./fixtures/easy-before.cjs'),{simulate,summarize}=require('../tools/simulate-easy.cjs'),{loadGame}=require('./harness.cjs');
const before=summarize(120,Before),after=summarize(120);
assert(before.hint.draw>=40,'The frozen baseline no longer reproduces the orbit');
assert(before.hint.maxTurnRun>=30);
assert(after.hint.draw<=18,'Hint-following draw rate exceeded 15%');
assert(after.hint.averageTurns<20);assert(after.hint.maxQuiet<=15);
assert(after.hint.maxTurnRun<=10,'Hint follower and rival fell into repeated turns');
assert(after.mistakes.draw<=18,'Hints failed to recover after opening mistakes');
assert(after.straight.win<=18,'Passive straight flight wins too often');
assert(after.random.win<=30,'Random steering wins too often');
assert(after.straight.loss>=30);assert(after.straight.damagedFlights>=100);
assert(after.mistakes.damageTaken>0,'Rival never punished an opening mistake');
assert(after.hint.damageTaken>0,'This sample no longer exercises a rival hit against Hint');

// Force the known no-progress orbit using genuine baseline turns, not made-up positions.
let orbit;
for(let n=0;n<120&&!orbit;n++){const r=simulate(n,'hint',Before);if(r.maxTurnRun>=30)orbit=r.log;}
let checked=0;
for(let i=0;i<orbit.events.length;i++){
 const log={...orbit,events:orbit.events.slice(0,i)},s=i?orbit.events[i-1].after:orbit.initial;
 if(Pilot.phase(log)==='extend'){
  const seed=s.seed,unchanged=JSON.stringify(log);
  assert.equal(Pilot.rival(s,log,()=>{throw Error('Extension must not reroll')}).id,'boost');
  assert.equal(s.seed,seed);assert.equal(JSON.stringify(log),unchanged);checked++;
 }
}
assert(checked>=3);
const first=simulate(0,'hint',Before).log,observed={...first,events:first.events.slice(0,1)},s=observed.events[0].after;
assert.notEqual(Pilot.hint(s,observed),Before.hint(s),'Hint reverted to current bearing');
assert.deepEqual(simulate(17,'hint'),simulate(17,'hint'),'Policy is not deterministic');

// Exercise the real three-button UI and ensure it matches the DOM-free simulation.
for(let n=0;n<12;n++){
 const h=loadGame({seed:12345+n*1237}),t=h.t;for(let i=0;i<n%3;i++)t.reset();
 const pure=simulate(n,'hint');
 for(const event of pure.log.events){
  const saved=t.snapshot(),pending=t.get().enemyMove;
  t.easyHint();t.easyHint();
  assert.equal(t.snapshot().aiSeed,saved.aiSeed);assert.equal(t.captureBattle().seed,saved.rngSeed);
  assert.strictEqual(t.get().enemyMove,pending);
  const id=t.easyHint().id;h.elements.get('moves').children[t.moves.findIndex(m=>m.id===id)].onclick();h.drain();
  assert.deepEqual(JSON.parse(JSON.stringify(t.get().matchLog.events.at(-1).command)),event.command);
 }
 assert(Core.sameState(t.captureBattle(),pure.state));assert(Core.validateLog(t.get().matchLog).ok);
 t.save();const saved=t.snapshot();assert(t.restore());assert(Core.sameState(t.captureBattle(),pure.state));assert.equal(t.get().enemyMove.id,saved.enemyMove);assert.equal(t.snapshot().aiSeed,saved.aiSeed);
}
console.log('PASS Easy AI: 120 deterministic seeds per policy, all three standard offsets, plus UI/simulation parity, orbit extension, intercept, rival damage, RNG and save stability.');
console.log('Easy before:',JSON.stringify(before));console.log('Easy after:',JSON.stringify(after));
