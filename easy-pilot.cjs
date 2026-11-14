/* Rotary Dogfight's solo Easy policies. Not part of the replay rules. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./flight-core.cjs'));
 else root.RotaryEasyPilot=factory(root.RotaryDogfightCore);
})(globalThis,function(Core){
 'use strict';
 const R=Math.PI/180,ids=['left','cruise','right','hardleft','hardright','boost'];
 const move=(a,id)=>Core.move(a,Core.getMove(id),'classic');
 function steer(state,id){
  if(!state.training&&id==='cruise'&&Core.relative(state.p,state.e).d>300)return Core.getMove('boost');
  if(id!=='cruise'&&Math.abs(Core.relative(state.p,state.e).angle)>70*R)return Core.getMove(id==='left'?'hardleft':'hardright');
  return Core.getMove(id);
 }
 function quietTurns(log){
  if(!log)return 0;
  const turns=log.events.filter(e=>e.type==='turn');let count=0;
  for(let i=turns.length-1;i>=0;i--){
   const a=turns[i].after.stats,b=i?turns[i-1].after.stats:log.initial.stats;
   if(a.dealt!==b.dealt||a.taken!==b.taken)break;
   count++;
  }
  return count;
 }
 function phase(log){const quiet=quietTurns(log);return quiet>=6&&(quiet-6)%9<3?'extend':'engage';}
 function rival(state,log,random){
  // A short, straight extension breaks a sustained orbit without alternating turns.
  if(phase(log)==='extend')return Core.getMove('boost');
  const predicted=move(state.p,'cruise');let best='cruise',high=-Infinity;
  for(const id of ids){
   if(id==='boost'&&Core.relative(state.e,state.p).d<330)continue;
   const next=move(state.e,id),r=Core.relative(next,predicted);
   const score=Core.solution(next,predicted).potential*70-Core.solution(predicted,next).potential*12-Math.abs(r.angle)*50-Math.abs(r.d-170)*.08+random()*20;
   if(score>high){high=score;best=id;}
  }
  return Core.getMove(best);
 }
 function hint(state,log){
  // Extrapolate only the last *observed* move, never the committed next move.
  const previous=log&&[...log.events].reverse().find(e=>e.type==='turn');
  const observed=previous&&ids.includes(previous.command.enemyMove)?previous.command.enemyMove:'cruise';
  const guesses=observed==='cruise'?[['cruise',1]]:[[observed,.7],['cruise',.3]];
  function value(p,e){const r=Core.relative(p,e);return Core.solution(p,e).potential*350-Core.solution(e,p).potential*65-Math.abs(r.angle)*55-Math.abs(r.d-150)*.12;}
  let best='cruise',high=-Infinity;
  for(const id of ['cruise','left','right']){
   const next=move(state.p,steer(state,id).id);let score=0;
   for(const [guess,weight] of guesses){
    const target=move(state.e,guess);let following=-Infinity;
    for(const second of ['cruise','left','right']){
     const p2=move({...next,energy:6},steer({...state,p:next,e:target},second).id),e2=move({...target,energy:6},guess);
     following=Math.max(following,value(p2,e2));
    }
    score+=weight*(value(next,target)+following*.8);
   }
   if(score>high){high=score;best=id;}
  }
  return best;
 }
 return Object.freeze({steer,quietTurns,phase,rival,hint});
});
