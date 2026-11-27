/* Interactive Code Lab — independent teaching demonstrations, no network. */
(function(){
"use strict";
function structural(input){
 const rows=input.split(/\r?\n/).filter(x=>x.trim()).map(x=>x.split("|").map(y=>y.trim()));
 const counts=rows.map(x=>x.length);
 const uniform=rows.length>=2&&counts[0]>1&&counts.every(n=>n===counts[0]);
 return "ROWS: "+rows.length+"\nCOLUMN COUNTS: "+(counts.join(", ")||"—")+"\nPATTERN CANDIDATE: "+(uniform?"DETECTED":"NOT DETECTED")+"\nSEMANTIC VALIDATION: NOT PERFORMED";
}
function evidence(source,quote){
 const norm=x=>x.replace(/\s+/g," ").trim();
 const q=norm(quote);
 if(!q)return "STATUS: ENTER A PASSAGE\nNo evidence comparison performed.";
 const found=norm(source).includes(q);
 return "TEXT MATCH: "+(found?"FOUND":"NOT FOUND")+"\n"+(found?"The passage occurs in the source.":"No matching passage was found.")+"\nMEANING / CLAIM SUPPORT: NOT VALIDATED";
}
function boot(){
 const root=document.getElementById("code-lab");
 if(!root)return;
 const q=id=>root.querySelector("#"+id);
 const data=q("lab-rows"),src=q("lab-source"),quote=q("lab-quote");
 const defaults={rows:data.value,source:src.value,quote:quote.value};
 function runStructure(){q("lab-structure-output").textContent=structural(data.value)}
 function runEvidence(){q("lab-evidence-output").textContent=evidence(src.value,quote.value)}
 data.addEventListener("input",runStructure);
 src.addEventListener("input",runEvidence);
 quote.addEventListener("input",runEvidence);
 q("lab-reset-structure").addEventListener("click",()=>{data.value=defaults.rows;runStructure();data.focus()});
 q("lab-reset-evidence").addEventListener("click",()=>{src.value=defaults.source;quote.value=defaults.quote;runEvidence();quote.focus()});
 q("lab-change-pattern").addEventListener("click",()=>{data.value="A | 10 | ACTIVE\nB | 20\nC | 30 | INACTIVE";runStructure()});
 q("lab-change-claim").addEventListener("click",()=>{quote.value="The pump is safe at 80 bar.";runEvidence()});
 runStructure();runEvidence();
}
if(typeof document!=="undefined"){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot()}
if(typeof module!=="undefined"&&module.exports)module.exports={structural,evidence};
})();