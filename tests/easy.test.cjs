const assert=require('assert'),{loadGame}=require('./harness.cjs');
const start=(h,level)=>{h.elements.get('level-'+level).onclick();h.elements.get('startLevel').onclick()};
const click=(h,id)=>{h.elements.get('moves').children[h.t.moves.findIndex(m=>m.id===id)].onclick();assert(h.t.get().busy);h.drain()};
let wins=0,totalTurns=0,maxTurns=0;
for(let n=0;n<60;n++){
 const h=loadGame(),{t,Core,elements}=h;start(h,'intro');for(let i=0;i<n%3;i++)t.reset();assert(t.get().simpleFlight);assert(t.isIntro());assert.equal(t.get().mission,'easy');assert.equal(t.get().activeSkill,'intro');assert.equal(t.get().flightRules,'classic');assert.equal(t.get().combatRules,'classic');
 const visible=elements.get('moves').children.filter(b=>!b.hidden);assert.equal(visible.length,3);assert.deepEqual(visible.map(b=>b.querySelector('b').textContent),['Turn left','Straight','Turn right']);
 let picker=1234+n;
 while(!t.get().over&&t.get().round<=25){let id;if(t.get().round<=n%5){const r=Core.random(picker);picker=r.seed;id=['left','cruise','right'][Math.floor(r.value*3)]}else id=t.easyHint().id;click(h,id);assert.equal(t.get().p.energy,6);assert.equal(t.get().p.alt,1);assert.equal(t.get().e.alt,1);assert(Core.validateLog(t.get().matchLog).ok);totalTurns++;}
 assert.equal(t.get().verdict,'win','Intro hint failed to recover from mistakes');assert(t.get().sortieStats.bursts>=3);wins++;maxTurns=Math.max(maxTurns,t.get().round);
}
const h=loadGame(),{t,elements,storage,Core}=h;
assert(t.isEasy());assert(!t.isIntro());assert.equal(t.get().activeSkill,'cadet');assert.equal(t.get().mission,'duel');assert.equal(t.get().e.hp,5);assert.equal(t.get().p.hp,10);assert(!t.get().hintRequested);assert(!elements.get('hintButton').hidden);
const beforeSeed=t.captureBattle().seed,committed=t.get().enemyMove;t.easyHint();t.easyHint();elements.get('hintButton').onclick();assert(t.get().hintRequested);assert.equal(t.captureBattle().seed,beforeSeed);assert.strictEqual(t.get().enemyMove,committed);click(h,'cruise');assert(!t.get().hintRequested);
// Easy is a full duel; three successful bursts do not end it while hull remains.
const state=t.captureBattle();state.stats.bursts=3;assert.equal(Core.verdictFor(state.p,state.e,state.stats,'duel',3),null);
// Rival attacks are infrequent and capped even with an ideal firing solution.
for(const training of [true,false])for(const round of [1,2,4]){
 const s=JSON.parse(JSON.stringify(state));Object.assign(s,{training,mission:training?'easy':'duel',round,stats:{dealt:0,taken:0,bursts:0,tailTurns:0}});s.p={...s.p,x:0,y:-150,h:0,hp:10,ammo:12};s.e={...s.e,x:0,y:0,h:0,hp:8,energy:6,ammo:12};const out=Core.resolveTurn(s,{version:1,type:'resolve-turn',turn:round,playerMove:'cruise',enemyMove:'cruise'});const expected=round%(training?4:2)===0?1:0;assert.equal(out.shots.enemy.damage,expected);
}
t.save();const key='canvas-aces-flight-v11';assert(storage.has(key));assert(!storage.has('canvas-aces-flight-v4'));assert(!storage.has('canvas-aces-flight-v9'));assert(!storage.has('canvas-aces-flight-v10'));
const old=t.snapshot();old.v=8;old.simpleFlight=false;old.mission='duel';old.flightRules='classic';old.combatRules='classic';old.matchLog=null;old.lastResult=null;old.sortieStats={dealt:0,taken:0,bursts:0,tailTurns:0};storage.set('canvas-aces-flight-v4',JSON.stringify(old));const oldText=storage.get('canvas-aces-flight-v4');
t.save();const saved=JSON.stringify(t.captureBattle());assert(t.restore());assert.equal(JSON.stringify(t.captureBattle()),saved);assert.equal(storage.get('canvas-aces-flight-v4'),oldText);
t.startPractice();for(const id of ['cruise','climb','cruise','cruise','reverseleft']){elements.get('moves').children[t.moves.findIndex(m=>m.id===id)].onclick();if(!t.get().busy)t.fly();h.drain();assert(t.get().practice.passed);t.nextLesson()}assert(t.get().simpleFlight);assert(!t.isIntro());assert.equal(JSON.stringify(t.captureBattle()),saved);
start(h,'normal');assert(!t.get().simpleFlight);assert.equal(t.get().activeSkill,'regular');assert.equal(t.get().mission,'duel');assert.equal(t.get().flightRules,'momentum');assert.equal(t.get().over,false);t.applyCheat('god');assert(Core.validateLog(t.get().matchLog).ok);
console.log('PASS Intro scripted-route regression:',wins+'/60 recoveries;',totalTurns,'turns; max',maxTurns,'(script-aware hints; not a human difficulty test)');
console.log('PASS simple UI: three controls, optional hints, full duel, attack limits, save isolation, practice and Normal transition.');
