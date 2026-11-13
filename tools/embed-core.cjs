const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),file=path.join(root,'index.html'),html=fs.readFileSync(file,'utf8'),core=fs.readFileSync(path.join(root,'flight-core.cjs'),'utf8');
if(!/<script id="flight-core">[\s\S]*?<\/script>/.test(html))throw new Error('Engine script marker is missing');
fs.writeFileSync(file,html.replace(/<script id="flight-core">[\s\S]*?<\/script>/,()=>'<script id="flight-core">\n'+core+'\n</script>'));
console.log('Embedded engine synchronized.');
