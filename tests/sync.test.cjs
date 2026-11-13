const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const core=html.match(/<script id="flight-core">([\s\S]*?)<\/script>/);
assert(core);assert.equal(core[1].trim(),fs.readFileSync(path.join(root,'flight-core.cjs'),'utf8').trim(),'Embedded and standalone engines diverged');
assert(!/<(?:script|link|img)[^>]+(?:src|href)="https?:/i.test(html));
console.log('PASS packaging: embedded and standalone engines match; the game loads no external assets.');
