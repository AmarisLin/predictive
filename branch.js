/* 三結局；所有同步與通話均為劇情模擬。 */
(()=>{'use strict';
const E=window.PredictiveEngine,copy=s=>JSON.parse(JSON.stringify(s)),offlineReply='她睡著了';
const endings=[null,
{id:1,scene:'螢幕錄影',caption:'阿寧的手機在臥室地板被找到，因為沒電而關機',detail:'充電後找到了一段和蘇蘇對話的螢幕錄影',messages:[]},
{id:2,scene:'語音通話 · 蘇蘇',caption:'通話時間168小時37分13秒',detail:'用戶「蘇蘇」已失蹤七天',messages:[['system','正在撥打電話…'],['in','不要看'],['in','快跑']]},
{id:3,scene:'阿寧',caption:'你也睡不著嗎',detail:'',messages:[['system','雲端同步已關閉'],['system','07:14'],['in','應該好了吧，早點睡。']]}
];
function empty(){return{revision:3,stage:'idle',ending:0,shown:0,choice:'',draft:''};}
function normalize(s){if(!s.branch){s.branch=empty();if(s.epilogue==='done')Object.assign(s.branch,{stage:'ending',ending:1});}else if(s.branch.revision!==3){const old=s.branch,id=old.revision===2?old.ending:({1:1,4:3,5:2})[old.ending];s.branch=empty();if(endings[id]&&['sequence','ending'].includes(old.stage))Object.assign(s.branch,{stage:old.stage,ending:id,shown:old.stage==='ending'?endings[id].messages.length:0,choice:old.choice||''});}return s;}
const initial=E.initial,valid=E.valid,power=E.powerAdvance,record=E.recordText;
E.initial=()=>normalize(initial());
E.valid=raw=>{let n=valid(raw);if(!n)return null;n=normalize(n);const b=n.branch;if(!b||b.revision!==3||!['idle','sequence','offline-input','ending'].includes(b.stage)||!Number.isInteger(b.ending)||b.ending<0||b.ending>3||typeof b.choice!=='string'||b.choice.length>30||!Number.isInteger(b.shown)||b.shown<0||typeof b.draft!=='string'||!offlineReply.startsWith(b.draft))return null;if(b.stage!=='idle'&&(n.phase!=='morning'||n.morningShown!==2))return null;if(b.stage==='idle'){if(b.ending!==0||b.shown!==0||b.draft)return null;}else{if(!endings[b.ending]||b.shown>endings[b.ending].messages.length)return null;if(['ending','offline-input'].includes(b.stage)&&b.shown!==endings[b.ending].messages.length)return null;if(b.stage==='offline-input'&&(b.ending!==3||b.draft===offlineReply))return null;if(b.draft&&b.ending!==3)return null;}return n;};
E.powerAdvance=s=>{const n=normalize(power(s));if(n.epilogue==='done')Object.assign(n.branch,{stage:'ending',ending:1,shown:0});return n;};
E.recordText=s=>record(s)+(s.branch?.ending?'\n'+(s.branch.stage==='ending'?'結局'+s.branch.ending:'進行中')+'\n'+endings[s.branch.ending].messages.slice(0,s.branch.shown).map(([kind,text])=>text).join('\n')+(s.branch.ending===3&&['offline-input','ending'].includes(s.branch.stage)?'\n聯想詞：後面\n輸入：'+s.branch.draft:''):'');
function choose(s,key){const n=normalize(copy(s)),b=n.branch;if(n.phase!=='morning'||n.morningShown!==2||b.stage!=='idle')return n;let end=0;
if(key==='offline'&&!n.cloudSynced&&['settings','confirm'].includes(n.cloudStep))end=3;
if(key==='call'&&n.epilogue==='friend'&&n.epTurn===2)end=2;
if(end){b.stage='sequence';b.ending=end;b.shown=0;b.choice=key;}return n;}
function advance(s){const n=normalize(copy(s)),b=n.branch;if(b.stage==='sequence'){if(b.shown<endings[b.ending].messages.length)b.shown++;if(b.shown===endings[b.ending].messages.length)b.stage=b.ending===3?'offline-input':'ending';}return n;}
function write(s,text){const n=normalize(copy(s));if(n.branch.stage!=='offline-input'||typeof text!=='string'||!offlineReply.startsWith(text))return n;n.branch.draft=text;if(text===offlineReply)n.branch.stage='ending';return n;}
window.PredictiveBranches={endings,choose,advance,write,offlineReply};
})();
