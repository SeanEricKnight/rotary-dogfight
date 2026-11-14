// Baseline UI policy from supplied archive commit 379e8c1, adapted to explicit arguments.
// For before/after simulations only. This is not a historical rules-engine fixture.
const Core=require('../../flight-core.cjs');
module.exports={steer(state,id){if(!state.training&&id==='cruise'&&Core.relative(state.p,state.e).d>300)return Core.getMove('boost');if(id!=='cruise'&&Math.abs(Core.relative(state.p,state.e).angle)>70*Math.PI/180)return Core.getMove(id==='left'?'hardleft':'hardright');return Core.getMove(id)},rival(state,log,random){
 const predicted=Core.move(state.p,Core.getMove('cruise'),'classic');let best='cruise',high=-Infinity;
 for(const id of ['left','cruise','right','hardleft','hardright','boost']){
  if(id==='boost'&&Core.relative(state.e,state.p).d<330)continue;
  const next=Core.move(state.e,Core.getMove(id),'classic'),r=Core.relative(next,predicted);
  const score=Core.solution(next,predicted).potential*70-Core.solution(predicted,next).potential*12-Math.abs(r.angle)*50-Math.abs(r.d-170)*.08+random()*20;
  if(score>high){high=score;best=id;}
 }
 return Core.getMove(best);
},hint(state){const r=Core.relative(state.p,state.e);return r.angle>15*Math.PI/180?'right':r.angle< -15*Math.PI/180?'left':'cruise'}};
