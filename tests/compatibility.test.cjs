const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto'),Core=require('../flight-core.cjs'),{loadGame}=require('./harness.cjs');
let logs=0,turns=0;
for(const version of [8,10]){
 const name='recordings-v'+version+'.json',data=require('./fixtures/'+name);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'fixtures',name))).digest('hex'),require('./fixtures/provenance.json').files[name]);
 assert.equal(data.provenance.rulesVersion,version);
 for(const log of data.recordings){
  assert.equal(log.rulesVersion,version);const out=Core.validateLog(log);assert(out.ok,out.reason);
  assert(Core.sameState(out.state,log.events.at(-1).after));turns+=out.frames.length;logs++;
  const bad=JSON.parse(JSON.stringify(log));bad.events[0].after.p.x+=1;assert(!Core.validateLog(bad).ok);
 }
}
const h=loadGame();
for(const [version,name] of [[10,'intro'],[10,'easy'],[10,'normal'],[8,'escape']]){
 const file='save-v'+version+'-'+name+'.json',bytes=fs.readFileSync(path.join(__dirname,'fixtures',file));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),require('./fixtures/provenance.json').files[file]);
 const save=JSON.parse(bytes);assert.equal(save.v,version);assert(h.t.restore(save),'Actual historical save failed: '+name);
 assert(Core.sameState(h.t.captureBattle(),save.matchLog.events.at(-1)?.after||save.matchLog.initial));
 assert.equal(h.t.get().enemyMove.id,save.enemyMove);assert.equal(h.t.snapshot().aiSeed,save.aiSeed);
 if(name==='intro'){assert(h.t.isIntro());assert.equal(h.t.get().activeSkill,'intro');assert.equal(h.elements.get('mission').value,'duel');}
 if(name==='easy')assert(h.t.isEasy()&&!h.t.isIntro());
 if(name==='escape'){assert.equal(h.t.get().mission,'escape');assert.equal(h.elements.get('mission').value,'duel');}
 const logBefore=JSON.stringify(h.t.get().matchLog);h.t.showRecorder();h.t.playRecording(false);h.drain();assert.equal(JSON.stringify(h.t.get().matchLog),logBefore);h.elements.get('recorder').close();
 if(!h.t.get().over){h.t.setMove(Core.getMove('cruise'));h.t.fly();h.drain();assert(Core.validateLog(h.t.get().matchLog).ok);}
 if(name==='escape'){h.t.reset();assert.equal(h.t.get().mission,'duel');}
}
console.log('PASS historical compatibility:',logs,'genuine v8/v10 recordings,',turns,'recomputed turns; actual v10 Intro/Easy/Normal and v8 escape saves, pending moves, playback and continuation. No v9 fixture is claimed.');
