/* Canvas Aces flight engine, independently written.
   No code or assets from Fly Casual or Plane Tactics are included. */
(function(root,factory){const core=factory();if(typeof module==='object'&&module.exports)module.exports=core;else root.CanvasAcesCore=core;})(globalThis,function(){
'use strict';
const version=8,R=Math.PI/180;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const norm=x=>Math.atan2(Math.sin(x),Math.cos(x));
const clone=x=>JSON.parse(JSON.stringify(x));
const profiles=Object.freeze({
 lark:Object.freeze({name:'Lark',role:'Agile biplane',speed:.82,turn:1.18,ramp:.65,description:'Tight turns and quick speed changes; slower in a chase.'}),
 kestrel:Object.freeze({name:'Kestrel',role:'Balanced fighter',speed:1,turn:1,ramp:.45,description:'A balanced starting aircraft with predictable handling.'}),
 swift:Object.freeze({name:'Swift',role:'Fast fighter',speed:1.24,turn:.78,ramp:.30,description:'Fast in a straight line; wider turns and gradual speed changes.'})
});
const moves=Object.freeze([
 {id:'left',name:'↖ Bank left',label:'Bank left',hint:'30° · steady',turn:-30,speed:1,cost:0},
 {id:'cruise',name:'↑ Cruise',label:'Cruise',hint:'Straight · +1 energy',turn:0,speed:1,cost:-1},
 {id:'right',name:'↗ Bank right',label:'Bank right',hint:'30° · steady',turn:30,speed:1,cost:0},
 {id:'hardleft',name:'↶ Hard left',label:'Hard left',hint:'65° · −1 energy',turn:-65,speed:.8,cost:1},
 {id:'climb',name:'⇡ Climb',label:'Climb',hint:'Up a level · −1 energy',turn:0,speed:.8,cost:1,alt:1},
 {id:'hardright',name:'↷ Hard right',label:'Hard right',hint:'65° · −1 energy',turn:65,speed:.8,cost:1},
 {id:'brake',name:'≋ Brake',label:'Brake',hint:'Gradual slowing · +1 energy',turn:0,speed:.48,cost:-1},
 {id:'dive',name:'⇣ Dive',label:'Dive',hint:'Down a level · +1 energy',turn:0,speed:1.2,cost:-1,alt:-1},
 {id:'boost',name:'⇈ Boost',label:'Boost',hint:'Accelerate · −1 energy',turn:0,speed:1.55,cost:1},
 {id:'reverseleft',name:'⤶ Reverse left',label:'Reverse left',hint:'150° · −2 energy',turn:-150,speed:.85,cost:2},
 {id:'divereverse',name:'⤵ Diving reversal',label:'Diving reversal',hint:'180° · down one level',turn:180,speed:1.1,cost:0,alt:-1},
 {id:'reverseright',name:'⤷ Reverse right',label:'Reverse right',hint:'150° · −2 energy',turn:150,speed:.85,cost:2}
].map(Object.freeze));
const getMove=id=>moves.find(m=>m.id===(typeof id==='string'?id:id&&id.id));
const hasProfile=id=>typeof id==='string'&&Object.prototype.hasOwnProperty.call(profiles,id);
const profile=a=>hasProfile(a.craft)?profiles[a.craft]:profiles.kestrel;
function normalisePlane(a){return {...a,craft:a.craft||'kestrel',bank:a.bank||0,throttle:a.throttle===undefined?1:a.throttle};}
function validPlane(a){return !!a&&['x','y','h','alt','energy','hp','ammo','bank','throttle'].every(k=>Number.isFinite(a[k]))&&hasProfile(a.craft)&&Math.abs(a.x)<=1e7&&Math.abs(a.y)<=1e7&&Math.abs(a.h)<=Math.PI+.001&&Math.abs(a.bank)<=180&&a.throttle>=.48&&a.throttle<=1.55&&['alt','energy','hp','ammo'].every(k=>Number.isInteger(a[k]))&&a.alt>=0&&a.alt<=2&&a.energy>=1&&a.energy<=6&&a.hp>=0&&a.hp<=10&&a.ammo>=0&&a.ammo<=12;}
function restriction(a,input,flight='classic'){
 const m=getMove(input);if(!m)return 'Unknown maneuver';
 if(a.alt+(m.alt||0)>2)return 'Already at highest altitude';
 if(a.alt+(m.alt||0)<0)return 'Already at lowest altitude';
 if(a.energy-m.cost<1)return 'Need at least '+(m.cost+1)+' energy';
 if(flight==='momentum'&&Math.abs(a.bank||0)>=45&&Math.abs(m.turn)>=50&&Math.sign(a.bank)!==Math.sign(m.turn))return 'Level out before a hard turn the other way';
 return '';
}
function motion(a,input,flight='classic'){
 const m=getMove(input);if(!m)throw new Error('Unknown maneuver');const craft=profile(a);
 const throttle=flight==='momentum'?clamp(m.speed,(a.throttle===undefined?1:a.throttle)-craft.ramp,(a.throttle===undefined?1:a.throttle)+craft.ramp):m.speed;
 const turn=Math.abs(m.turn)>=120?m.turn:m.turn*craft.turn;
 return {throttle,turn,speed:(52+a.energy*7)*throttle*craft.speed};
}
function path(a,input,t,flight='classic'){
 const m=getMove(input),v=motion(a,m,flight),yaw=v.turn*R;let dx,dy;t=clamp(t,0,1);
 if(Math.abs(yaw)<1e-8){dx=Math.sin(a.h)*v.speed*t;dy=-Math.cos(a.h)*v.speed*t;}
 else{dx=(Math.cos(a.h)-Math.cos(a.h+yaw*t))*v.speed/yaw;dy=-(Math.sin(a.h+yaw*t)-Math.sin(a.h))*v.speed/yaw;}
 return {...a,x:a.x+dx,y:a.y+dy,h:norm(a.h+yaw*t),alt:a.alt+(m.alt||0)*t};
}
function move(a,input,flight='classic'){const m=getMove(input),v=motion(a,m,flight);return {...normalisePlane(path(a,m,1,flight)),energy:clamp(a.energy-m.cost,1,6),bank:v.turn,throttle:v.throttle};}
function relative(a,b){return {d:Math.hypot(b.x-a.x,b.y-a.y),angle:norm(Math.atan2(b.x-a.x,a.y-b.y)-a.h)};}
function solution(a,b,combat='classic'){
 const r=relative(a,b),reasons=[];
 if(a.ammo<=0)reasons.push('No bursts remaining');
 if(a.alt!==b.alt)reasons.push('Different altitude');
 if(r.d>280)reasons.push('Out of range ('+Math.round(r.d)+' m)');
 if(Math.abs(r.angle)>20*R)reasons.push('Target outside nose cone');
 const alignment=clamp(1-Math.abs(r.angle)/(20*R),0,1);
 const accuracy=clamp(.52+.43*alignment-.18*clamp(r.d/280,0,1)-Math.abs(a.bank||0)/180*.12-Math.max(0,(a.throttle||1)-1)*.1,.25,.95);
 const potential=reasons.length?0:r.d<110?3:r.d<190?2:1;
 return {fired:!reasons.length,reason:reasons.join(' · '),range:r.d,angle:r.angle,alignment,accuracy,potential,expected:combat==='quality'?potential*accuracy:potential,aim:alignment>=.75?'Centered aim':alignment>=.35?'Angled shot':'Edge of firing arc'};
}
function random(seed){let x=seed>>>0;if(!x)x=0x6d2b79f5;x^=x<<13;x^=x>>>17;x^=x<<5;return {seed:x>>>0,value:(x>>>0)/4294967296};}
function fire(a,b,combat,seed,immune=false){const info=solution(a,b,combat),rolls=[];let rolled=0;if(info.fired){if(combat==='quality'){for(let i=0;i<info.potential;i++){const next=random(seed);seed=next.seed;rolls.push(next.value);if(next.value<info.accuracy)rolled++;}}else rolled=info.potential;}return {...info,rolls,rolled,damage:immune?0:rolled,seed};}
function verdictFor(p,e,stats,mission,round){if(p.hp===0&&e.hp===0)return 'draw';if(p.hp===0)return 'loss';if(e.hp===0)return 'win';if(mission==='first'){if(stats.dealt>=3&&stats.taken>=3)return 'draw';if(stats.dealt>=3)return 'win';if(stats.taken>=3)return 'loss';}if(mission==='escape'&&round>=8)return 'win';if(round>=40||p.ammo===0&&e.ammo===0)return 'draw';return null;}
function canonicalState(s){return {p:normalisePlane(s.p),e:normalisePlane(s.e),round:s.round,seed:s.seed>>>0,flight:s.flight,combat:s.combat,mission:s.mission,stats:{dealt:s.stats.dealt,taken:s.stats.taken,bursts:s.stats.bursts,tailTurns:s.stats.tailTurns},cheats:{assisted:s.cheats.assisted,god:s.cheats.god,reveal:s.cheats.reveal},over:!!s.over,verdict:s.verdict||null};}
function validState(s){const structural=!!s&&validPlane(s.p)&&validPlane(s.e)&&Number.isInteger(s.round)&&s.round>=1&&s.round<=40&&Number.isInteger(s.seed)&&s.seed>0&&s.seed<=4294967295&&['classic','momentum'].includes(s.flight)&&['classic','quality'].includes(s.combat)&&['duel','first','escape'].includes(s.mission)&&s.stats&&['dealt','taken','bursts','tailTurns'].every(k=>Number.isInteger(s.stats[k])&&s.stats[k]>=0&&s.stats[k]<=120)&&s.cheats&&['assisted','god','reveal'].every(k=>typeof s.cheats[k]==='boolean')&&(!(s.cheats.god||s.cheats.reveal)||s.cheats.assisted)&&typeof s.over==='boolean'&&[null,'win','loss','draw'].includes(s.verdict)&&s.over===!!s.verdict;if(!structural)return false;return verdictFor(s.p,s.e,s.stats,s.mission,s.over?s.round:s.round-1)===s.verdict;}
function resolveTurn(state,command){
 if(!validState(state))throw new Error('Invalid flight state');
 if(state.over)throw new Error('This sortie has ended');
 if(!command||command.version!==1||command.type!=='resolve-turn'||command.turn!==state.round||typeof command.playerMove!=='string'||typeof command.enemyMove!=='string')throw new Error('Command does not belong to this turn');
 const pm=getMove(command.playerMove),em=getMove(command.enemyMove);
 if(!pm||!em||restriction(state.p,pm,state.flight)||restriction(state.e,em,state.flight))throw new Error('Illegal maneuver');
 const p=move(state.p,pm,state.flight),e=move(state.e,em,state.flight);
 const playerShot=fire(p,e,state.combat,state.seed),enemyShot=fire(e,p,state.combat,playerShot.seed,state.cheats.god);
 if(playerShot.fired)p.ammo--;if(enemyShot.fired)e.ammo--;
 p.hp=Math.max(0,p.hp-enemyShot.damage);e.hp=Math.max(0,e.hp-playerShot.damage);
 const own=relative(p,e),foe=relative(e,p),tail=Math.abs(own.angle)<35*R&&Math.abs(foe.angle)>145*R;
 const stats={dealt:state.stats.dealt+playerShot.damage,taken:state.stats.taken+enemyShot.damage,bursts:state.stats.bursts+(playerShot.fired?1:0),tailTurns:state.stats.tailTurns+(tail?1:0)};
 const verdict=verdictFor(p,e,stats,state.mission,state.round);
 const result=canonicalState({...state,p,e,stats,seed:enemyShot.seed,verdict,over:!!verdict,round:verdict?state.round:state.round+1});
 return {state:result,shots:{player:playerShot,enemy:enemyShot}};
}
function applyTestCode(state,code){if(!validState(state)||state.over)throw new Error('Start a live sortie first');if(!['repair','energy','ammo','god','reveal','win'].includes(code))throw new Error('Unknown cheat code');const s=clone(canonicalState(state));s.cheats.assisted=true;if(code==='repair')s.p.hp=10;if(code==='energy')s.p.energy=6;if(code==='ammo')s.p.ammo=12;if(code==='god')s.cheats.god=!s.cheats.god;if(code==='reveal')s.cheats.reveal=!s.cheats.reveal;if(code==='win'){s.e.hp=0;s.over=true;s.verdict='win';}return s;}
function sameState(a,b){const clean=s=>{const q=canonicalState(s);for(const key of ['p','e']){const z=q[key];q[key]={x:z.x,y:z.y,h:z.h,alt:z.alt,energy:z.energy,hp:z.hp,ammo:z.ammo,craft:z.craft,bank:z.bank,throttle:z.throttle};}return q;};return JSON.stringify(clean(a))===JSON.stringify(clean(b));}
function validateLog(log){
 try{
  if(!log||log.format!=='canvas-aces-replay'||log.version!==1||log.rulesVersion!==version||!validState(log.initial)||!Array.isArray(log.events)||log.events.length>500)return {ok:false,reason:'Unsupported or invalid recording'};
  let state=clone(canonicalState(log.initial));const frames=[];
  for(const event of log.events){
   if(!event||!validState(event.after))throw new Error('Invalid recorded state');
   if(event.type==='turn'){
    const before=clone(state),result=resolveTurn(state,event.command);
    if(!sameState(result.state,event.after))throw new Error('Recorded turn does not match its commands and seed');
    const pm=getMove(event.command.playerMove),em=getMove(event.command.enemyMove);
    frames.push({animation:{p0:before.p,e0:before.e,p1:move(before.p,pm,before.flight),e1:move(before.e,em,before.flight),pm,em,rules:before.flight,turn:before.round},outcome:{turn:before.round,player:pm.label,enemy:em.label,hits:[result.shots.player.damage,result.shots.enemy.damage],shots:result.shots},after:clone(result.state)});
    state=result.state;
   }else if(event.type==='cheat'){state=applyTestCode(state,event.code);if(!sameState(state,event.after))throw new Error('Recorded cheat does not match its result');}
   else throw new Error('Unknown recording event');
  }
  return {ok:true,frames,state};
 }catch(error){return {ok:false,reason:error.message};}
}
function evaluatePosition(a,b,flight='classic',combat='classic'){
 const own=solution(a,b,combat),foe=solution(b,a,combat),r=relative(a,b),threat=relative(b,a);
 const options=moves.filter(m=>!restriction(a,m,flight)).length;
 const distanceScore=-Math.abs(r.d-175)*.075,headingScore=-Math.abs(r.angle)*24,energyScore=a.energy*4,tailBonus=Math.abs(r.angle)<35*R&&Math.abs(threat.angle)>140*R?22:0,flexibility=(options-6)*2.5;
 return {attack:own.expected*80,exposure:foe.expected*65,distanceScore,headingScore,energyScore,tailBonus,flexibility,options,total:own.expected*80-foe.expected*65+distanceScore+headingScore+energyScore+tailBonus+flexibility};
}
return Object.freeze({version,profiles,moves,getMove,hasProfile,normalisePlane,validPlane,restriction,motion,path,move,relative,solution,random,verdictFor,canonicalState,validState,resolveTurn,applyTestCode,sameState,validateLog,evaluatePosition});
});
