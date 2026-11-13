const assert=require('assert'),{loadGame}=require('./harness.cjs');
let games=0,turns=0;
for(const craft of ['lark','kestrel','swift'])for(const skill of ['regular','veteran'])for(const combat of ['classic','quality'])for(const mission of ['duel','first','escape','breakout']){
 const h=loadGame(),{t,Core,elements}=h;elements.get('aircraft').value=craft;elements.get('rivalAircraft').value=craft==='swift'?'lark':'swift';elements.get('skill').value=skill;elements.get('combatRules').value=combat;elements.get('mission').value=mission;t.reset();
 let picker=1234567+games;
 while(!t.get().over){const state=t.get(),choices=t.moves.filter(m=>t.legal(state.p,m));assert(choices.length);assert(t.legal(state.e,state.enemyMove),'Rival committed an illegal move');const r=Core.random(picker);picker=r.seed;t.setMove(choices[Math.floor(r.value*choices.length)]);t.fly();h.drain();assert(Core.validState(t.captureBattle()));assert(t.get().history.length<=40);turns++;}
 const recording=Core.validateLog(t.get().matchLog);assert(recording.ok,recording.reason);assert(Core.sameState(recording.state,t.captureBattle()));assert.equal(recording.frames.length,t.get().history.length);assert.equal(t.get().career.sorties,1);t.save();assert(t.restore());assert(Core.sameState(recording.state,t.captureBattle()));games++;
}
console.log(`PASS opponents: ${games} complete AI sorties / ${turns} turns across all aircraft, Normal/Hard, gunnery choices, and objectives; legal plans, logs, saves, and career results.`);
