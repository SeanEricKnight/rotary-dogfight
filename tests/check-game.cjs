const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
let code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
code=code.replace('\n})();',`\nglobalThis.test={get:()=>({p,e,round,over,busy,enemyMove,history,anim,lastTrack,replaying,career,sortieStats,lastSummary,moveMemory,lookBack,lastOutcome,lastResult,selected,practice,advanced,mission,verdict,cheatState,activeSkill}),set:(v)=>{if(v.p)p=v.p;if(v.e)e=v.e;if(v.round)round=v.round;if(v.enemyMove)enemyMove=v.enemyMove},setMove:m=>{selected=m},moves,legal,unavailable,path,move,relative,shot,damage,fly,reset,finish,draw,tick,chooseEnemy,replay,save,restore,savePreferences,loadPreferences,snapshot,startPractice,nextLesson,exitPractice,resolveVerdict,showHelp,maneuverArt,openCheats,applyCheat};\n})();`);
const elements=new Map();
const canvas=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const n of args)if(typeof n==='number')assert(Number.isFinite(n),'Non-finite canvas coordinate')},set:(o,k,v)=>(o[k]=v,true)});
function el(){return {children:[],value:'',style:{},classList:{toggle(){},remove(){}},setAttribute(){},replaceChildren(){this.children=[]},appendChild(c){this.children.push(c)},querySelector(){return this.span||(this.span=el())},getContext:()=>canvas,getBoundingClientRect:()=>({width:640,height:400}),showModal(){this.open=true},close(){this.open=false}}}
for(const [,id] of html.matchAll(/id="([^"]+)"/g))elements.set(id,el());
elements.get('scenario').value='merge';elements.get('skill').value='regular';
const document={getElementById:id=>{assert(elements.has(id),'Unknown DOM ID '+id);return elements.get(id)},createElement:()=>el()};
const sandbox={document,window:{devicePixelRatio:1,addEventListener(){}},performance:{now:()=>100},requestAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){}},console,Math};
vm.createContext(sandbox);vm.runInContext(code,sandbox);const t=sandbox.test;
assert.equal(elements.get('moves').children.length,12);
assert.equal(elements.get('view').textContent,'Tactical map');
assert.equal(elements.get('fly').textContent,'Fly: Cruise');
assert(elements.get('plan').children.length>=3);
const a={x:0,y:0,h:0,alt:1,energy:4,ammo:12,hp:10};
assert.equal(t.damage(a,{...a,y:-100}),3);
assert.equal(t.damage(a,{...a,y:-150}),2);
assert.equal(t.damage(a,{...a,y:-220}),1);
assert.equal(t.damage(a,{...a,y:-281}),0);
assert.equal(t.damage(a,{...a,y:100}),0);
assert.equal(t.damage(a,{...a,y:-100,alt:2}),0);
assert.equal(t.damage({...a,ammo:0},{...a,y:-100}),0);
assert(t.shot(a,{...a,y:500,alt:2}).reason.includes('Different altitude'));
assert(t.unavailable({...a,energy:1},t.moves[3]).includes('energy'));
assert(!t.legal({...a,energy:2},t.moves[9]));assert(t.legal({...a,energy:3},t.moves[9]));assert(!t.legal({...a,alt:0},t.moves[10]));
assert(t.unavailable({...a,alt:2},t.moves[4]).includes('highest'));
for(const m of t.moves){const end=t.move(a,m),pathEnd=t.path(a,m,1),start=t.path(a,m,0);assert.equal(start.x,a.x);assert.equal(start.y,a.y);assert.equal(end.x,pathEnd.x);assert.equal(end.y,pathEnd.y);assert.equal(end.h,pathEnd.h)}
// Symmetric simultaneous lethal fire must draw, and both shots spend ammunition.
t.reset();t.set({p:{...a,hp:1,ammo:1},e:{...a,y:-200,h:Math.PI,hp:1,ammo:1},enemyMove:t.moves[1]});t.setMove(t.moves[1]);t.fly();t.finish();assert(t.get().over);assert.equal(t.get().p.hp,0);assert.equal(t.get().e.hp,0);assert.equal(t.get().p.ammo,0);assert.equal(t.get().e.ammo,0);
const beforeReplay=JSON.stringify(t.get());t.replay();assert(t.get().replaying);t.draw(600);t.tick(1500);t.tick(2200);assert(!t.get().busy);assert(!t.get().replaying);assert.equal(t.get().p.hp,0);assert.equal(t.get().e.ammo,0);assert.equal(t.get().history.length,1);
let turns=0,games=0;
for(const scenario of ['merge','crossing','pursuit','ambush','altitude'])for(const skill of ['cadet','regular','veteran'])for(let game=0;game<15;game++){
 elements.get('scenario').value=scenario;elements.get('skill').value=skill;t.reset();
 while(!t.get().over){
  const before=t.get(),choices=t.moves.filter(m=>t.legal(before.p,m));
  const m=choices[Math.floor(Math.random()*choices.length)],committed=before.enemyMove;
  assert(t.legal(before.e,committed));t.setMove(m);assert.strictEqual(t.get().enemyMove,committed);
  t.fly();assert(t.get().busy);const next=t.get().anim,dp=t.damage(next.p1,next.e1),de=t.damage(next.e1,next.p1);
  // Render midway and switch views using the actual button handler.
  t.draw(600);elements.get('view').onclick();t.draw(600);elements.get('view').onclick();
  t.finish();t.draw();const after=t.get();
  assert.equal(after.p.hp,Math.max(0,before.p.hp-de));assert.equal(after.e.hp,Math.max(0,before.e.hp-dp));
  assert.equal(after.p.ammo,before.p.ammo-(dp?1:0));assert.equal(after.e.ammo,before.e.ammo-(de?1:0));
  assert.equal(after.history.length,before.round);assert.equal(elements.get('log').children.length,after.history.length);
  for(const q of [after.p,after.e]){assert(q.energy>=1&&q.energy<=6);assert(q.alt>=0&&q.alt<=2);assert(q.hp>=0&&q.hp<=10);assert(q.ammo>=0&&q.ammo<=12);assert(Number.isFinite(q.x))}
  assert(after.round<=40);turns++;
 }games++;
}
elements.get('help').onclick();assert(elements.get('manual').open);elements.get('close').onclick();assert(!elements.get('manual').open);
assert(!/<(?:script|link|img)[^>]+(?:src|href)="https?:/i.test(html));
console.log(`PASS: ${games} completed sorties / ${turns} turns; all 15 setup combinations; turn controls, shot geometry, ammunition, simultaneous kills, energy, altitude, curved path endpoints, both canvas views, debrief history, hidden commitments, and help dialog. No external assets.`);

const saved=new Map();sandbox.localStorage.getItem=k=>saved.get(k)||null;sandbox.localStorage.setItem=(k,v)=>saved.set(k,v);t.reset();t.setMove(t.moves[3]);t.fly();t.finish();t.save();const state=JSON.stringify({p:t.get().p,e:t.get().e,round:t.get().round,enemyMove:t.get().enemyMove.id,history:t.get().history});assert(t.restore());assert.equal(JSON.stringify({p:t.get().p,e:t.get().e,round:t.get().round,enemyMove:t.get().enemyMove.id,history:t.get().history}),state);saved.set('canvas-aces-flight-v4','corrupted');assert(!t.restore());console.log('PASS: reversals, harmless replay, exact mid-sortie save/restore including hidden commitment, and corrupt-save fallback.');

const completed=t.get();if(completed.over){assert(completed.lastSummary);assert.equal(completed.lastSummary.stats.dealt,completed.sortieStats.dealt)}

// The scorecard and career advance once, and replay/resume must not award extra credit.
t.reset();const oldCount=t.get().career.sorties;t.set({p:{...a,hp:10},e:{...a,y:-200,h:Math.PI,hp:1},enemyMove:t.moves[1]});t.setMove(t.moves[1]);t.fly();t.finish();assert(t.get().over);assert(t.get().lastSummary.won);assert.equal(t.get().career.sorties,oldCount+1);assert(!elements.get('summary').hidden);const endSnapshot=JSON.stringify({p:t.get().p,e:t.get().e,career:t.get().career,summary:t.get().lastSummary});t.replay();t.tick(3000);t.tick(3700);assert.equal(JSON.stringify({p:t.get().p,e:t.get().e,career:t.get().career,summary:t.get().lastSummary}),endSnapshot);t.save();assert(t.restore());assert.equal(JSON.stringify({p:t.get().p,e:t.get().e,career:t.get().career,summary:t.get().lastSummary}),endSnapshot);console.log('PASS: scorecard, career bookkeeping, and no double credit on replay or restore.');
