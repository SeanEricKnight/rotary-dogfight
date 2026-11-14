const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),file=path.join(root,'index.html');let html=fs.readFileSync(file,'utf8');
for(const [id,name] of [['flight-core','flight-core.cjs'],['easy-pilot','easy-pilot.cjs']]){
 const marker=new RegExp('<script id="'+id+'">[\\s\\S]*?<\\/script>');
 if(!marker.test(html))throw new Error('Missing embedded script: '+id);
 html=html.replace(marker,()=>'<script id="'+id+'">\n'+fs.readFileSync(path.join(root,name),'utf8')+'\n</script>');
}
fs.writeFileSync(file,html);fs.writeFileSync(path.join(root,'Canvas-Aces.html'),html);
console.log('Engine, Easy policy and both HTML entry points synchronized.');
