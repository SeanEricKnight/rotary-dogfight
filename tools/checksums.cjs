const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
function files(dir=''){
 return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>{
  if(['.git','node_modules','.DS_Store','Thumbs.db','SHA256SUMS'].includes(e.name))return [];
  const name=path.posix.join(dir,e.name);return e.isDirectory()?files(name):[name];
 }).sort();
}
const sums=files().map(name=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex')+'  '+name+'\n').join('');
if(process.argv.includes('--write')){fs.writeFileSync(path.join(root,'SHA256SUMS'),sums);console.log('SHA256SUMS updated.');}
else if(fs.readFileSync(path.join(root,'SHA256SUMS'),'utf8')!==sums){console.error('SHA256SUMS is stale or incomplete. Run npm run checksums.');process.exitCode=1;}
else console.log('All project checksums match.');
