const Core=require('../flight-core.cjs'),Pilot=require('../easy-pilot.cjs');

function simulate(n,policy='hint',pilot=Pilot){
 const seed=12345+n*1237;let aiSeed=seed,choiceSeed=234+n;
 const plane=v=>Core.normalisePlane({x:0,y:150,h:0,alt:1,energy:6,hp:10,ammo:12,craft:'kestrel',...v});
 let state=Core.canonicalState({p:plane(),e:plane({x:[45,-45,75][n%3],y:-190,h:Math.PI,hp:8,craft:'swift'}),round:1,seed,flight:'classic',combat:'classic',mission:'duel',assist:true,training:false,stats:{dealt:0,taken:0,bursts:0,tailTurns:0},cheats:{assisted:false,god:false,reveal:false},over:false,verdict:null});
 const log={format:'canvas-aces-replay',version:1,rulesVersion:Core.version,initial:state,events:[]};
 const random=()=>{const r=Core.random(aiSeed);aiSeed=r.seed;return r.value};
 let maxQuiet=0,maxTurnRun=0,turnRun=0,lastTurn=null,extensions=0;
 while(!state.over){
  const enemy=pilot.rival(state,log,random);let id='cruise';
  if(policy==='hint'||policy==='mistakes'&&state.round>n%5)id=pilot.hint(state,log);
  if(policy==='random'||policy==='mistakes'&&state.round<=n%5){const r=Core.random(choiceSeed);choiceSeed=r.seed;id=['left','cruise','right'][Math.floor(r.value*3)]}
  const player=pilot.steer(state,id),command={version:1,type:'resolve-turn',turn:state.round,playerMove:player.id,enemyMove:enemy.id};
  if(pilot.phase&&pilot.phase(log)==='extend')extensions++;
  state=Core.resolveTurn(state,command).state;log.events.push({type:'turn',command,after:state});
  maxQuiet=Math.max(maxQuiet,Pilot.quietTurns(log));
  turnRun=enemy.id===lastTurn?turnRun+1:1;lastTurn=enemy.id;
  if(Core.getMove(enemy.id).turn)maxTurnRun=Math.max(maxTurnRun,turnRun);
 }
 return {state,log,maxQuiet,maxTurnRun,extensions};
}
function summarize(count=120,pilot=Pilot){
 const results={};
 for(const policy of ['straight','random','hint','mistakes']){
  const row={games:count,win:0,loss:0,draw:0,turns:0,damageTaken:0,damagedFlights:0,maxQuiet:0,maxTurnRun:0,extensionTurns:0,maxTurns:0};
  for(let n=0;n<count;n++){
   const r=simulate(n,policy,pilot),s=r.state;row[s.verdict]++;row.turns+=s.round;row.maxTurns=Math.max(row.maxTurns,s.round);row.damageTaken+=s.stats.taken;row.damagedFlights+=s.stats.taken>0?1:0;
   row.maxQuiet=Math.max(row.maxQuiet,r.maxQuiet);row.maxTurnRun=Math.max(row.maxTurnRun,r.maxTurnRun);row.extensionTurns+=r.extensions;
  }
  row.averageTurns=Number((row.turns/count).toFixed(2));results[policy]=row;
 }
 return results;
}
if(require.main===module){
 const baseline=process.argv.includes('--baseline');
 const pilot=baseline?require('../tests/fixtures/easy-before.cjs'):Pilot;
 console.log(JSON.stringify({setup:'120 deterministic seeds, all three standard offsets; 40-turn cap; original v11 combat rules; mistakes = 0–4 random opening moves, then Hint',policy:baseline?'379e8c1 Easy AI':'revised Easy AI',results:summarize(120,pilot)},null,2));
}
module.exports={simulate,summarize};
