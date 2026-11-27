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
 q("lab-change-pattern").addEventListener("click",()=>{data.value="Pump | 30 days | Ready\nValve | 14 days | Unknown\nFilter | 7 days | Ready";runStructure()});
 q("lab-change-claim").addEventListener("click",()=>{quote.value="Replace the seal before every startup.";runEvidence()});
 function bindChoices(attribute, output, messages){
  const buttons=[...root.querySelectorAll("["+attribute+"]")];
  buttons.forEach(button=>{
   button.setAttribute("aria-pressed","false");
   button.addEventListener("click",()=>{
    buttons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
    const choice=button.getAttribute(attribute);
    q(output).textContent=messages[choice];
   });
  });
 }
 bindChoices("data-structure-choice","lab-structure-feedback",{
  A:"NOT THIS ONE / Record A contains all three required fields. Compare the status column again.",
  B:"PATTERN DETECTED / Record B has no status. The repeated format reveals the missing field.",
  C:"NOT THIS ONE / Record C contains all three required fields. Compare the status column again."
 });
 bindChoices("data-repair-choice","lab-repair-feedback",{
  guess:"NOT SUPPORTED / Other devices being ready does not establish the valve's status. Copying that value invents information.",
  flag:"GOOD DECISION / Mark the status as unknown and request evidence if it is needed. The structure is restored without inventing a fact."
 });
 bindChoices("data-evidence-choice","lab-evidence-feedback",{
  a:"SOURCE MATCH / The manual explicitly instructs the reader to inspect the seal before startup.",
  b:"NOT SUPPORTED / Inspecting a seal and replacing it are different actions. The source does not require replacement.",
  c:"NOT SUPPORTED / Recording pressure is an instruction, not a guarantee of safe operation."
 });
 bindChoices("data-limit-choice","lab-limit-feedback",{
  yes:"NOT ESTABLISHED / The manual gives an inspection instruction, but no replacement interval.",
  no:"EVIDENCE LIMIT IDENTIFIED / No replacement interval is given. Do not invent one."
 });
 const mapState={first:null,second:null};
 function renderMap(){
  q("lab-map-edge-one").textContent=mapState.first==="correct"?"↓ sends readings to":"? / relationship pending";
  q("lab-map-edge-two").textContent=mapState.second==="correct"?"↓ sends readings to":"? / relationship pending";
  q("lab-map-status").textContent=mapState.first==="correct"&&mapState.second==="correct"?"MAP COMPLETE / Both directed relationships are supported by the brief.":"Select both source-supported relationships to complete the map.";
 }
 for(const [key,attr,output] of [["first","data-map-first","lab-map-first-feedback"],["second","data-map-second","lab-map-second-feedback"]]){
  const buttons=[...root.querySelectorAll("["+attr+"]")];
  buttons.forEach(button=>{
   button.setAttribute("aria-pressed","false");
   button.addEventListener("click",()=>{
    buttons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
    mapState[key]=button.getAttribute(attr);
    q(output).textContent=mapState[key]==="correct"?"RELATIONSHIP CONFIRMED / This direction follows the source.":"NOT SUPPORTED / The brief describes readings flowing in the opposite direction.";
    renderMap();
   });
  });
 }
 bindChoices("data-map-limit","lab-map-limit-feedback",{
  yes:"NOT ESTABLISHED / Receiving readings does not establish that the controller changes temperature.",
  no:"EVIDENCE LIMIT IDENTIFIED / Leave that relationship out unless further evidence supports it."
 });
 q("lab-map-reset").addEventListener("click",()=>{
  mapState.first=null;mapState.second=null;
  root.querySelectorAll("[data-map-first],[data-map-second],[data-map-limit]").forEach(b=>b.setAttribute("aria-pressed","false"));
  q("lab-map-first-feedback").textContent="Choose the direction supported by the brief.";
  q("lab-map-second-feedback").textContent="Choose the second connection.";
  q("lab-map-limit-feedback").textContent="Distinguish a source-supported relationship from a plausible assumption.";
  renderMap();
 });
 renderMap();
 runStructure();runEvidence();
}
if(typeof document!=="undefined"){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot()}
if(typeof module!=="undefined"&&module.exports)module.exports={structural,evidence};
})();