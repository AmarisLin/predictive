/* 六結局路由；只管理遊戲內選項，沒有真實同步或通話。 */
(()=>{'use strict';
const E=window.PredictiveEngine,copy=s=>JSON.parse(JSON.stringify(s));
const endings=[null,
{id:1,name:'斷線',kind:'失聯結局',scene:'螢幕錄影',messages:[]},
{id:2,name:'同步',kind:'異常擴散',scene:'帳號與同步',messages:[['system','正在合併學習記錄…'],['system','同步完成 · 來源 2 台裝置'],['word','他也看見了'],['system','最後更新：剛剛']]},
{id:3,name:'回覆',kind:'不明身分',scene:'蘇蘇',messages:[['out','床底下'],['system','已讀'],['in','你怎麼知道？'],['system','蘇蘇正在輸入…'],['in','我沒有告訴過你。']]},
{id:4,name:'離線',kind:'假性安全',scene:'離線詞庫',messages:[['system','雲端同步已關閉'],['system','隔天早上 · 07:12'],['in','昨天睡著了，怎麼了？'],['system','個人詞庫 · 離線'],['word','他以為刪掉了']]},
{id:5,name:'天亮',kind:'存活結局',scene:'語音通話 · 蘇蘇',messages:[['system','已中止詞庫連線'],['system','正在撥打電話…'],['in','喂？阿寧？'],['out','先別碰那個鍵盤。到亮的地方去。'],['in','好，我到樓下了。'],['out','我看見你了。'],['system','07:18 · 通話仍在繼續']]},
{id:6,name:'另一個聲音',kind:'真結局 · 兩人存活',scene:'蘇蘇',messages:[['out','先別抬頭。你拍的照片是哪裡？'],['in','走廊。我現在躲在床底下。'],['out','詞庫裡的「救我」，是你打的？'],['in','嗯。它一直看著我。'],['in','我不敢傳，只能把字留在詞庫。'],['system','03:46「救我」· 03:47「他睡著了」'],['out','我知道了。「不能看」也是你。'],['in','別相信那些說我睡著了的字。'],['out','把手機螢幕朝下，沿著牆到門口。別看床上。'],['system','07:18 · 門口'],['in','我出來了。你在哪？'],['out','樓下。燈亮著的地方。'],['system','同步已停止 · 兩台手機均離線']]}
];
function empty(){return{stage:'idle',ending:0,shown:0,notes:false,choice:''};}
function normalize(s){if(!s.branch){s.branch=empty();if(s.epilogue==='done')Object.assign(s.branch,{stage:'ending',ending:1});}return s;}
const initial=E.initial,valid=E.valid,power=E.powerAdvance,record=E.recordText;
E.initial=()=>normalize(initial());
E.valid=raw=>{let n=valid(raw);if(!n)return null;n=normalize(n);const b=n.branch;if(!b||!['idle','decision','verify','sequence','ending'].includes(b.stage)||!Number.isInteger(b.ending)||b.ending<0||b.ending>6||typeof b.notes!=='boolean'||typeof b.choice!=='string'||b.choice.length>30||!Number.isInteger(b.shown)||b.shown<0)return null;if(b.stage!=='idle'&&(n.phase!=='morning'||n.morningShown!==2))return null;if(['sequence','ending'].includes(b.stage)){if(!endings[b.ending]||b.shown>endings[b.ending].messages.length)return null;if(b.stage==='ending'&&b.shown!==endings[b.ending].messages.length)return null;}else if(b.ending!==0||b.shown!==0)return null;if(b.ending===6&&(!b.notes||!n.evidence.image))return null;if(['decision','verify'].includes(b.stage)&&(n.epilogue!=='friend'||n.epTurn!==2))return null;if(b.stage==='verify'&&!b.notes)return null;return n;};
E.powerAdvance=s=>{const n=normalize(power(s));if(n.epilogue==='done')Object.assign(n.branch,{stage:'ending',ending:1,shown:0});return n;};
E.recordText=s=>record(s)+(s.branch?.ending?'\n結局 '+s.branch.ending+'/6｜'+endings[s.branch.ending].name:'');
function eligible(s){return s.phase==='morning'&&s.morningShown===2;}
function clues(s){const n=normalize(copy(s));if(eligible(n)&&n.cloudSynced&&n.epilogue==='friend')n.branch.notes=true;return n;}
function choose(s,key){const n=normalize(copy(s)),b=n.branch;if(!eligible(n)||['sequence','ending'].includes(b.stage))return n;let end=0;
if(key==='offline'&&b.stage==='idle'&&!n.cloudSynced&&['settings','confirm'].includes(n.cloudStep))end=4;
if(key==='resync'&&b.stage==='idle'&&n.epilogue==='friend'&&n.epTurn>=1)end=2;
if(key==='underbed'&&b.stage==='idle'&&n.epilogue==='friend'&&n.epTurn===1)end=3;
if(key==='stop'&&b.stage==='idle'&&n.epilogue==='friend'&&n.epTurn===2)b.stage='decision';
if(key==='call'&&b.stage==='decision')end=5;
if(key==='trace'&&b.stage==='decision'&&b.notes&&n.evidence.image)b.stage='verify';
if(key==='trust'&&b.stage==='verify')end=3;
if(key==='warn'&&b.stage==='verify'&&b.notes&&n.evidence.image)end=6;
if(key==='back'&&['decision','verify'].includes(b.stage))b.stage='idle';
if(end){b.stage='sequence';b.ending=end;b.shown=0;b.choice=key;}
return n;}
function advance(s){const n=normalize(copy(s)),b=n.branch;if(b.stage==='sequence'){if(b.shown<endings[b.ending].messages.length)b.shown++;if(b.shown===endings[b.ending].messages.length)b.stage='ending';}return n;}
window.PredictiveBranches={endings,clues,choose,advance};
})();
