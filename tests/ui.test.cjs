const assert=require('assert'),{loadGame}=require('./harness.cjs');
async function main(){
 const h=loadGame(),{t,Core,elements,storage}=h;
 assert.equal(elements.get('moves').children.length,12);assert.equal(t.get().flightRules,'momentum');assert(elements.get('futureSummary').textContent.includes('12'));
 const committed=t.get().enemyMove,seed=t.captureBattle().seed;t.setMove(Core.getMove('hardleft'));t.draw();elements.get('futureToggle').onclick();assert.strictEqual(t.get().enemyMove,committed);assert.equal(t.captureBattle().seed,seed);t.fly();h.drain();assert(Core.validateLog(t.get().matchLog).ok);
 assert(!t.legal(t.get().p,Core.getMove('hardright')));assert(t.legal(t.get().p,Core.getMove('cruise')));
 t.save();const saved=JSON.stringify(t.captureBattle()),recorded=t.recordingText();assert(t.restore());assert.equal(JSON.stringify(t.captureBattle()),saved);assert.equal(t.recordingText(),recorded);
 const beforePractice=t.recordingText(),career=JSON.stringify(t.get().career),beforePracticeState=JSON.stringify(t.captureBattle());
 t.startPractice();for(const id of ['cruise','climb','cruise']){elements.get('moves').children[t.moves.findIndex(m=>m.id===id)].onclick();t.fly();h.drain();assert(t.get().practice.passed);t.nextLesson();}
 assert.equal(t.get().practice,null);assert.equal(JSON.stringify(t.captureBattle()),beforePracticeState);assert.equal(t.recordingText(),beforePractice);assert.equal(JSON.stringify(t.get().career),career);
 const initialLog=t.recordingText();assert(!Object.hasOwn(JSON.parse(initialLog),'enemyMove'));assert.equal(JSON.parse(initialLog).events.length,t.get().history.length);
 // A replayed recording cannot alter the live battle, pending plan, save or record.
 const beforeReplay=JSON.stringify({state:t.captureBattle(),career:t.get().career,pending:t.get().enemyMove.id,log:t.get().matchLog});t.showRecorder();t.playRecording(false);assert(t.get().replaying);h.drain();assert.equal(JSON.stringify({state:t.captureBattle(),career:t.get().career,pending:t.get().enemyMove.id,log:t.get().matchLog}),beforeReplay);
 // Import a consistent recording into a separate viewer; reject tampering.
 const other=loadGame();other.t.fly();other.drain();const otherText=other.t.recordingText();t.showRecorder();await t.importRecording({size:otherText.length,text:async()=>otherText});const currentBeforeImport=t.recordingText();t.playRecording(false);h.drain();assert.equal(t.recordingText(),currentBeforeImport);const bad=JSON.parse(otherText);bad.events[0].after.p.hp=0;await t.importRecording({size:1000,text:async()=>JSON.stringify(bad)});assert(elements.get('recordMessage').textContent.includes('Could not open'));
 // Record cheats too, so replayed damage and assisted state stay consistent.
 elements.get('recorder').close();t.applyCheat('god');t.applyCheat('energy');assert(Core.validateLog(t.get().matchLog).ok);t.setMove(Core.getMove('cruise'));t.fly();h.drain();assert(Core.validateLog(t.get().matchLog).ok);const oldCount=t.get().career.sorties;t.applyCheat('win');assert.equal(t.get().career.sorties,oldCount);assert(Core.validateLog(t.get().matchLog).ok);t.save();assert(t.restore());assert(t.get().cheatState.assisted);
 // Start a clean sortie with aircraft/rule selections; the pending move is fixed until resolution.
 elements.get('aircraft').value='swift';elements.get('rivalAircraft').value='lark';elements.get('combatRules').value='quality';elements.get('level-hard').onclick();elements.get('startLevel').onclick();assert.equal(t.get().p.craft,'swift');assert.equal(t.get().e.craft,'lark');assert.equal(t.get().combatRules,'quality');assert(!t.get().cheatState.assisted);
 for(let i=0;i<6&&!t.get().over;i++){t.setMove(Core.getMove('cruise'));t.fly();h.drain();assert(Core.validateLog(t.get().matchLog).ok)}
 t.save();const newState=t.captureBattle();const legacy=JSON.parse(storage.get('canvas-aces-flight-v4'));legacy.v=7;delete legacy.flightRules;delete legacy.combatRules;delete legacy.rngSeed;delete legacy.aiSeed;delete legacy.matchLog;for(const q of [legacy.p,legacy.e]){delete q.craft;delete q.bank;delete q.throttle;}legacy.lastResult=null;assert(t.restore(legacy));assert.equal(t.get().flightRules,'classic');assert.equal(t.get().combatRules,'classic');assert.equal(t.get().p.craft,'kestrel');assert.equal(t.get().p.hp,newState.p.hp);
 console.log('PASS UI: aircraft and rules, next-turn limits, hidden-choice/RNG stability, deterministic recording, full replay and import isolation, cheat logs, saves, legacy migration, and three practice lessons.');
}
main().catch(error=>{console.error(error);process.exitCode=1});
