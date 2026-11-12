/* 對話、回覆提示及固定觀察句。所有資料皆為虛構。 */
window.PREDICTIVE_STORY=[
{id:'arrival',time:'02:31',incoming:['蘇蘇','怎麼還沒睡'],prompt:'睡不著，輸入法好像怪怪的。',reply:['嗯？我看看']},
{id:'auto-send',time:'02:32',incoming:['剛剛那句怎麼了'],prompt:'我打沒幾個字，它就自己送出去了。',auto:true,reply:['妳沒按到？']},
{id:'explain',time:'02:33',incoming:['還是一樣嗎'],prompt:'剛剛那句不是我傳的，我一個人住。',reply:['那去設定看看']},
{id:'dictionary',time:'02:34',incoming:['詞庫裡有嗎'],prompt:'這些我都沒打過。',gate:'dictionary',reply:['先清掉試試？']},
{id:'clear-dictionary',time:'02:35',incoming:['我等妳'],prompt:'先不清，我再試試。',reply:['好，那再試一次'],replyAfterClear:['再打看看']},
{id:'address',time:'02:36',incoming:['對了，那家店地址再傳我一下'],prompt:'到詞庫複製店家地址。',gate:'address',reply:['收到了']},
{id:'something-nearby',time:'02:37',incoming:['還有怪字嗎'],prompt:'等一下，我旁邊好像有東西。',reply:['在哪？','拍給我看看']},
{id:'photo',time:'02:38',incoming:['慢慢來'],prompt:'按 ＋ 查看照片，再傳給朋友。',gate:'photo',reply:['哪裡？轉角嗎？']},
{id:'he-is-typing',time:'02:39',incoming:['我這邊看不太到'],prompt:'照片裡明明有人。',gate:'compare',observer:'他在打字',reply:['要不要開個燈']},
{id:'he-noticed',time:'02:40',incoming:['我再看一下'],prompt:'傳出去以後，人就不見了。',observer:'他發現了',reply:['可能是影子','別嚇自己了']},
{id:'goodnight',time:'02:42',incoming:['睡吧，明天再弄'],prompt:'好，晚安。',reply:['晚安，蘇蘇']},
{id:'are-you-asleep',time:'02:45',incoming:[],prompt:'睡了嗎？',unread:true,reply:[]},
{id:'look-at-its-head',time:'02:46',incoming:[],prompt:'看它的頭',reply:[]}

];
window.PREDICTIVE_MORNING=[
{time:'3 小時前',text:'你昨晚 03:47 傳給我的「他睡著了」是什麼意思？'},
{time:'現在',text:'你還好嗎？'}
];
window.PREDICTIVE_WORDS=(()=>{
 const eerie=[['他睡了嗎',214,'昨天 03:12'],['還沒',198,'昨天 03:12'],['門沒鎖',77,'昨天 03:31'],['他翻身了',61,'昨天 03:40'],['床底下好冷',40,'昨天 03:52'],['他睡著的時候嘴是張開的',23,'前天 02:58'],['再近一點',12,'昨天 03:44'],['他沒發現',9,'今天 01:06']];
 const ordinary=['早安','晚安','謝謝','明天見','我到了','路上小心','等我一下','先吃飯','回家了','今天好冷','記得帶傘','我快到了','等等再聊','先去洗澡','收到','好喔','早點休息','晚點回你','工作加油','週末愉快','我去買晚餐','剛下班','沒問題','明天再說','現在有點忙','我在路上','我看到訊息了','等等見','幫我留一份','不用擔心','先忙你的','晚餐吃什麼'];
 return [...eerie.map(([word,uses,lastUsed])=>({word,uses,lastUsed})),...ordinary.map((word,i)=>({word,uses:i<28?4:3,lastUsed:'昨天 18:20'}))];
})();

window.PREDICTIVE_TIMING={warning:2000,black:3000,dawn:1800,firstMessage:650,messageGap:1400,afterMessages:2000,sync:1600,cloudRead:4000,finalWarning:2200,powerBlack:1200,battery:2500,powerNotice:5000,replyFast:1100,replyNormal:1600};

window.PREDICTIVE_ADDRESS='城南路118號2樓';
window.PREDICTIVE_CLOUD={total:2347,devices:1,lastUpdate:'今天 03:47',account:'09** *** 706',latest:[
{word:'他睡著了',uses:1,lastUsed:'今天 03:47',danger:true},
{word:'救我',uses:1,lastUsed:'今天 03:46',danger:true},
{word:'它在床上',uses:3,lastUsed:'今天 03:44',danger:true},
{word:'別開燈',uses:41,lastUsed:'今天 03:40',danger:false},
{word:'我也睡不著',uses:19,lastUsed:'今天 03:12',danger:false},
{word:'床底下好冷',uses:40,lastUsed:'昨天 03:52',danger:false},
{word:'他睡了嗎',uses:214,lastUsed:'昨天 03:12',danger:false}
]};

window.PREDICTIVE_FRIEND={name:'蘇蘇',status:'最後上線 7 天前',time:'03:34',history:['警察說你手機關機了','我去你家看了，門沒鎖','第七天了'],prompts:['蘇蘇','你在哪','我不看它的頭'],candidates:[['睡著了','在床上','不會回來了'],['床底下','他床上','這裡']]};
