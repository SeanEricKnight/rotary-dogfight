const {spawnSync}=require('child_process'),path=require('path');
for(const name of ['sync.test.cjs','core.test.cjs','ui.test.cjs','matches.test.cjs','easy.test.cjs']){
 const result=spawnSync(process.execPath,[path.join(__dirname,name)],{stdio:'inherit'});
 if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);
}
