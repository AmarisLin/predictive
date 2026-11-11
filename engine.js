(()=>{
'use strict';
const S=window.PREDICTIVE_STORY,C=window.PREDICTIVE_CLOUD,ADDRESS=window.PREDICTIVE_ADDRESS,clone=s=>JSON.parse(JSON.stringify(s));
const last=S.length-1,photoIndex=S.findIndex(n=>n.gate==='photo'),addressIndex=S.findIndex(n=>n.gate==='address'),compareIndex=S.findIndex(n=>n.gate==='compare');
const phases=['chat','warning','black','dawn','morning'],cloudSteps=['locked','offer','later','settings','account','confirm','syncing','dictionary'];
const textOK=(x,max=180)=>typeof x==='string'&&x.length<=max;
const listOK=(xs,max=180,count=5)=>Array.isArray(xs)&&xs.length<=count&&xs.every(x=>textOK(x,max));
const finalPhrase=t=>String(t).replace(/头/g,'頭').replace(/\s+/g,'').includes('看它的頭');
function initial(){return{version:6,index:0,entries:[],inbox:[...S[0].incoming],draft:'',lexicon:[...clone(window.PREDICTIVE_WORDS),{word:ADDRESS,uses:1,lastUsed:'昨天 18:20'}],clearCount:0,predictionOn:true,action:'他還醒著',autoPending:false,autoText:'',lexiconViewed:false,photoViewed:false,photoSent:false,evidence:{draft:false,image:false},archived:false,phase:'chat',morningShown:0,addressCopied:false,clipboard:'',cloudStep:'locked',cloudLoggedIn:false,cloudSynced:false,epilogue:'locked',epTurn:0,epDraft:'',epMessages:[]};}
function learn(s,word){const found=s.lexicon.find(w=>w.word===word);if(found){found.uses++;found.lastUsed='剛剛';}else{s.lexicon.push({word,uses:1,lastUsed:'剛剛'});s.lexicon=s.lexicon.slice(-150);}}
function ensureAddress(s){if(s.index===addressIndex&&!s.lexicon.some(w=>w.word===ADDRESS))learn(s,ADDRESS);}
function observe(s,action){const n=clone(s);if(n.phase!=='chat')return n;n.action=action;if(n.clearCount>0&&n.index>=addressIndex)learn(n,action);return n;}
function predict(s,text=s.draft){
 if(s.epilogue==='friend')return s.epTurn===2?['他在打字','。','先這樣']:[...window.PREDICTIVE_FRIEND.candidates[s.epTurn]];
 if(s.epilogue==='warning')return['不要看','不要看','不要看'];
 if(s.phase!=='chat')return['不能看','不能看','不能看'];
 const first=s.index===0?'睡不著':s.action,normal=String(text).trim()?['。','先這樣']:['我','你'];
 if(s.index===last){if(text==='看')normal.splice(0,2,'它的','一下');else if(text==='看它')normal.splice(0,2,'的頭','一下');else if(text==='看它的')normal.splice(0,2,'頭','意思');}
 return s.predictionOn?[first,...normal]:[first,'',''];
}
function draft(s,text,commit=true){
 if(s.epilogue==='friend'){const n=clone(s);n.epDraft=Array.from(String(text)).slice(0,80).join('');if(commit&&n.epTurn===2&&n.epDraft.replace(/头/g,'頭').replace(/\s/g,'').includes('我不看它的頭'))n.epilogue='warning';return n;}
 if(s.phase!=='chat'||s.autoPending)return clone(s);
 let n=clone(s);const old=n.draft;n.draft=Array.from(String(text)).slice(0,80).join('');if(!commit)return n;
 n=observe(n,Array.from(n.draft).length<Array.from(old).length?'他把字刪掉了':S[n.index].observer||'他在打字');
 if(n.index===last&&finalPhrase(n.draft)){n.phase='warning';return n;}
 if(S[n.index].auto&&Array.from(n.draft).length>=2){n.autoPending=true;n.autoText=predict(n)[0];}return n;
}
function append(s,word){return draft(s,s.draft+word);}
function dictionary(s){const n=observe(s,'他在看詞庫');n.lexiconViewed=true;ensureAddress(n);return n;}
function clear(s){const n=clone(s);n.lexicon=[];n.clearCount=Math.min(100,n.clearCount+1);n.action='他清掉了詞庫';return n;}
function copyAddress(s){const n=clone(s);if(n.phase==='chat'&&n.index===addressIndex&&n.lexicon.some(w=>w.word===ADDRESS)){n.addressCopied=true;n.clipboard=ADDRESS;n.action='他在複製地址';}return n;}
function pasteAddress(s){return s.addressCopied&&s.index===addressIndex?draft(s,s.clipboard):clone(s);}
function toggle(s,on){return observe({...clone(s),predictionOn:!!on},'他關掉了聯想');}
function photo(s){if(s.index<photoIndex)return clone(s);const n=observe(s,'他在看照片');n.photoViewed=true;return n;}
function compare(s){const n=clone(s);if(n.photoViewed&&n.photoSent){n.evidence.image=true;n.action='他在比對照片';}return n;}
function inspect(s,index){const n=clone(s);if(n.entries[index]?.automatic)n.evidence.draft=true;return n;}
function archive(s){return{...clone(s),archived:true};}
function hint(s){if(s.epilogue==='friend'||s.epilogue==='warning')return window.PREDICTIVE_FRIEND.prompts[s.epTurn];if(S[s.index].id==='clear-dictionary'&&s.clearCount>0)return'清掉了。';return S[s.index].prompt;}
function submit(s,{photo=false,automatic=false}={}){
 const n=clone(s),node=S[n.index],original=n.draft.trim();
 if(n.phase!=='chat')return{state:n,error:'finished'};
 if(node.gate==='dictionary'&&!n.lexiconViewed)return{state:n,error:'dictionary'};
 if(node.gate==='address'&&(!n.addressCopied||original.replace(/\s/g,'')!==ADDRESS))return{state:n,error:'address'};
 if(node.gate==='compare'&&!n.evidence.image)return{state:n,error:'compare'};
 if(node.gate==='photo'&&(!photo||!n.photoViewed))return{state:n,error:'photo'};
 if(photo&&node.gate!=='photo')return{state:n,error:'photo'};
 if(n.index===last)return{state:n,error:'head'};
 if(node.auto&&!automatic||n.autoPending&&!automatic||automatic&&(!n.autoPending||!node.auto))return{state:n,error:'automatic'};
 if(!photo&&!original)return{state:n,error:'empty'};
 const text=photo?'照片':automatic?n.autoText:original,reply=node.id==='clear-dictionary'&&n.clearCount>0?node.replyAfterClear:node.reply;
 const entry={turn:n.index,text,original:photo?'':original,automatic,photo,read:!node.unread,incoming:[...n.inbox],reply:[...reply]};
 n.entries.push(entry);if(!photo)learn(n,original);if(photo)n.photoSent=true;
 n.draft='';n.autoPending=false;n.autoText='';n.index++;n.inbox=[...S[n.index].incoming];n.action=S[n.index].observer||'他正在看訊息';ensureAddress(n);
 return{state:n,entry,error:null};
}
function advance(s){const n=clone(s);if(n.phase==='warning')n.phase='black';else if(n.phase==='black')n.phase='dawn';else if(n.phase==='dawn')n.phase='morning';else if(n.phase==='morning'){if(n.morningShown<2)n.morningShown++;else if(n.cloudStep==='locked')n.cloudStep='offer';}return n;}
function cloudAvailable(s){return s.phase==='morning'&&s.morningShown===2&&s.cloudStep!=='locked';}
function cloudAccount(s){const n=clone(s);if(cloudAvailable(n))n.cloudStep=n.cloudLoggedIn?'confirm':'account';return n;}
function cloudLogin(s){const n=clone(s);if(cloudAvailable(n)&&n.cloudStep==='account'){n.cloudLoggedIn=true;n.cloudStep='confirm';}return n;}
function cloudDecision(s,sync){const n=clone(s);if(n.cloudStep==='confirm')n.cloudStep=sync?'syncing':'settings';return n;}
function cloudFinish(s){const n=clone(s);if(n.cloudStep!=='syncing')return n;for(const item of C.latest){const old=n.lexicon.find(w=>w.word===item.word);if(old)Object.assign(old,{uses:item.uses,lastUsed:item.lastUsed});else n.lexicon.push({word:item.word,uses:item.uses,lastUsed:item.lastUsed});}n.lexicon=n.lexicon.slice(-150);n.cloudSynced=true;n.cloudStep='dictionary';n.epilogue='cloud-wait';return n;}
function cloudBack(s){const n=clone(s);if(cloudAvailable(n)&&n.cloudStep!=='syncing')n.cloudStep='settings';return n;}
function cloudDictionary(s){const n=clone(s);if(cloudAvailable(n)&&n.cloudSynced)n.cloudStep='dictionary';return n;}
function settingsDecision(s,go){const n=clone(s);if(n.cloudStep==='offer')n.cloudStep=go?'settings':'later';return n;}
function settingsOffer(s){const n=clone(s);if(n.cloudStep==='later')n.cloudStep='offer';return n;}
function friendOffer(s){const n=clone(s);if(n.cloudSynced&&['cloud-wait','cloud-read'].includes(n.epilogue)){n.cloudStep='dictionary';n.epilogue='chat-offer';}return n;}
function friendDecision(s,go){const n=clone(s);if(n.epilogue==='chat-offer')n.epilogue=go?'friend':'cloud-read';return n;}
function friendSend(s){const n=clone(s);if(n.epilogue!=='friend'||n.epTurn>=2||n.epDraft.trim()!==window.PREDICTIVE_FRIEND.prompts[n.epTurn])return{state:n,error:'friend'};n.epMessages.push(n.epDraft.trim());n.epTurn++;n.epDraft='';return{state:n,error:null};}
function powerAdvance(s){const n=clone(s),next={warning:'powerblack',powerblack:'battery',battery:'powernotice',powernotice:'done'};if(next[n.epilogue])n.epilogue=next[n.epilogue];return n;}
function recordText(s){const lines=['聯想詞predictive','對話紀錄',''];for(const e of s.entries){lines.push('['+S[e.turn].time+']');e.incoming.forEach(t=>lines.push('阿寧：'+t));lines.push('我：'+(e.photo?'照片（已傳送）':e.text)+(e.read?'':'（未讀）'));if(e.automatic)lines.push('輸入框原文：'+e.original,'送出方式：自動');e.reply.forEach(t=>lines.push('阿寧：'+t));lines.push('');}s.inbox.forEach(t=>lines.push('阿寧：'+t));if(s.draft)lines.push('未送出草稿：'+s.draft);if(s.phase!=='chat')lines.push('聯想詞：不能看 / 不能看 / 不能看');if(s.phase==='morning'){lines.push('','[07:12]');window.PREDICTIVE_MORNING.slice(0,s.morningShown).forEach(m=>lines.push('阿寧：'+m.text));}if(s.cloudSynced){lines.push('','雲端詞庫：最近7條／總學習記錄2347筆／來源1台裝置');C.latest.forEach(w=>lines.push(w.word+' · '+w.lastUsed));}if(s.epMessages.length){lines.push('','[第七天 · 阿寧的手機／蘇蘇聊天室]');window.PREDICTIVE_FRIEND.history.forEach(t=>lines.push('阿寧：'+t+'（未讀）'));s.epMessages.forEach(t=>lines.push('阿寧：'+t+'（未讀）'));}if(s.epDraft)lines.push('阿寧未送出草稿：'+s.epDraft);if(['warning','powerblack','battery','powernotice','done'].includes(s.epilogue))lines.push('聯想詞：不要看 / 不要看 / 不要看');lines.push('','已複製地址：'+s.addressCopied,'清除詞庫次數：'+s.clearCount,'已比對照片：'+s.evidence.image,'雲端同步完成：'+s.cloudSynced,'原始草稿已保留：'+s.archived);return lines.join('\n');}
function valid(raw){
 if(!raw||![5,6].includes(raw.version))return null;const s=clone(raw);if(s.version===5){s.version=6;s.epilogue=s.cloudSynced?'cloud-wait':'locked';s.epTurn=0;s.epDraft='';s.epMessages=[];}
 if(!Number.isInteger(s.index)||s.index<0||s.index>=S.length||!Array.isArray(s.entries)||s.entries.length!==s.index||!listOK(s.inbox)||!textOK(s.draft,80)||!textOK(s.action,30)||!textOK(s.autoText,30)||!phases.includes(s.phase)||!Array.isArray(s.lexicon)||s.lexicon.length>150||!Number.isInteger(s.clearCount)||s.clearCount<0||s.clearCount>100||!cloudSteps.includes(s.cloudStep))return null;
 for(const k of ['predictionOn','autoPending','lexiconViewed','photoViewed','photoSent','archived','addressCopied','cloudLoggedIn','cloudSynced'])if(typeof s[k]!=='boolean')return null;
 if(!textOK(s.clipboard,80)||s.clipboard!==(s.addressCopied?ADDRESS:'')||!s.evidence||typeof s.evidence.draft!=='boolean'||typeof s.evidence.image!=='boolean')return null;
 if(!s.lexicon.every(w=>w&&textOK(w.word,80)&&w.word&&Number.isInteger(w.uses)&&w.uses>0&&w.uses<=100000&&textOK(w.lastUsed,30)))return null;
 for(let i=0;i<s.entries.length;i++){const e=s.entries[i],node=S[i];if(!e||e.turn!==i||!textOK(e.text,80)||!e.text||!textOK(e.original,80)||e.photo!==(node.gate==='photo')||e.automatic!==!!node.auto||e.read!==!node.unread||!listOK(e.incoming)||!listOK(e.reply))return null;if(!e.photo&&!e.original||!e.photo&&!e.automatic&&e.original!==e.text)return null;if(node.gate==='address'&&e.text.replace(/\s/g,'')!==ADDRESS)return null;}
 if(s.index>addressIndex&&!s.addressCopied||s.photoSent!==(s.index>photoIndex)||s.photoViewed&&s.index<photoIndex||s.evidence.image&&(!s.photoSent||!s.photoViewed)||s.evidence.draft&&!s.entries.some(e=>e.automatic))return null;
 if(s.index>=4&&!s.lexiconViewed||s.index>compareIndex&&!s.evidence.image)return null;
 if(s.autoPending&&(s.index!==1||Array.from(s.draft).length<2||!s.autoText||s.phase!=='chat')||!s.autoPending&&s.autoText)return null;
 if(s.phase!=='chat'&&(s.index!==last||!finalPhrase(s.draft)))return null;
 if(!Number.isInteger(s.morningShown)||s.morningShown<0||s.morningShown>2||s.phase!=='morning'&&s.morningShown!==0)return null;
 if(s.cloudStep!=='locked'&&!cloudAvailable(s)||s.cloudStep==='locked'&&(s.cloudLoggedIn||s.cloudSynced)||['confirm','syncing','dictionary'].includes(s.cloudStep)&&!s.cloudLoggedIn||s.cloudSynced&&!s.cloudLoggedIn||s.cloudStep==='dictionary'&&!s.cloudSynced)return null;
 const epSteps=['locked','cloud-wait','cloud-read','chat-offer','friend','warning','powerblack','battery','powernotice','done'];
 if(!epSteps.includes(s.epilogue)||!Number.isInteger(s.epTurn)||s.epTurn<0||s.epTurn>2||!textOK(s.epDraft,80)||!Array.isArray(s.epMessages)||s.epMessages.length!==s.epTurn||s.epMessages.some((t,i)=>t!==window.PREDICTIVE_FRIEND.prompts[i]))return null;
 if(s.epilogue!=='locked'&&(!s.cloudSynced||s.phase!=='morning')||s.cloudSynced&&s.epilogue==='locked')return null;
 if(['locked','cloud-wait','cloud-read','chat-offer'].includes(s.epilogue)&&(s.epTurn!==0||s.epDraft))return null;
 if(['warning','powerblack','battery','powernotice','done'].includes(s.epilogue)&&(s.epTurn!==2||!s.epDraft.replace(/头/g,'頭').replace(/\s/g,'').includes('我不看它的頭')))return null;
 return s;
}
window.PredictiveEngine={initial,predict,draft,append,observe,dictionary,clear,copyAddress,pasteAddress,toggle,photo,compare,inspect,archive,hint,submit,advance,cloudAccount,cloudLogin,cloudDecision,cloudFinish,cloudBack,cloudDictionary,settingsDecision,settingsOffer,friendOffer,friendDecision,friendSend,powerAdvance,recordText,valid,finalPhrase};
})();
