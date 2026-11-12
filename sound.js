/* Local synthesized sound design. No microphone, downloads or autoplay. */
(()=>{'use strict';
let ctx=null,master=null,enabled=true,bed=null,testTimer=null,lastType=-1,failed=false;
const shots=new Set(),counts={type:0,send:0,receive:0,dial:0,breath:0};
function report(){if(typeof document!=='undefined')document.documentElement.dataset.soundState=JSON.stringify({enabled,context:ctx?.state||'closed',breathing:!!bed,failed,counts});}
function engine(){if(ctx)return ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error('Audio unavailable');ctx=new C();master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination);return ctx;}
function make(seconds,fn){const c=engine(),b=c.createBuffer(1,Math.ceil(seconds*c.sampleRate),c.sampleRate),d=b.getChannelData(0);let smooth=0;for(let i=0;i<d.length;i++){const noise=Math.random()*2-1;smooth=.76*smooth+.24*noise;d[i]=Math.max(-.9,Math.min(.9,fn(i/c.sampleRate,noise,smooth)));}return b;}
function playBuffer(buffer,loop=false){const node=ctx.createBufferSource();node.buffer=buffer;node.loop=loop;node.connect(master);node.start();return node;}
async function activate(){enabled=true;try{engine();await ctx.resume();failed=false;report();return true;}catch{failed=true;report();return false;}}
function effect(kind){if(!enabled||!ctx||ctx.state!=='running')return false;const now=ctx.currentTime;if(kind==='type'&&now-lastType<.026)return false;if(kind==='type')lastType=now;let buffer;
if(kind==='type')buffer=make(.035,(t,n)=>.12*Math.exp(-t*125)*(n*.5+Math.sin(2*Math.PI*1700*t)*.22));
else if(kind==='send')buffer=make(.18,(t,n,s)=>.065*Math.sin(Math.PI*t/.18)*Math.sin(2*Math.PI*(450*t+1800*t*t))+.025*s*Math.sin(Math.PI*t/.18));
else if(kind==='receive')buffer=make(.28,t=>{const e=Math.sin(Math.PI*Math.min(1,t/.28))**2;return .065*e*(Math.sin(2*Math.PI*740*t)+.45*Math.sin(2*Math.PI*1110*t));});
else if(kind==='dial')buffer=make(.8,t=>{const edge=Math.min(1,t/.025,(.8-t)/.035);return .075*edge*(Math.sin(2*Math.PI*440*t)+.45*Math.sin(2*Math.PI*480*t));});
else return false;
const node=playBuffer(buffer);shots.add(node);node.onended=()=>shots.delete(node);counts[kind]++;report();return true;}
function breath(on){if(!on||!enabled||!ctx||ctx.state!=='running'){if(bed){try{bed.stop();}catch{}bed=null;}report();return;}if(bed)return;
// Continuous air flow with overlapping inhale/exhale and a periodic loop envelope.
const b=make(20,(t,n,s)=>{const phase=2*Math.PI*t/2.5+.18*Math.sin(2*Math.PI*t/10),env=.19+.81*(.5+.5*Math.sin(phase))**.75,tremor=.94+.06*Math.sin(2*Math.PI*7.5*t);return env*tremor*(.22*s+.012*n+.003*Math.sin(2*Math.PI*108*t));});
const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=b;src.loop=true;filter.type='lowpass';filter.frequency.value=2400;gain.gain.value=.68;src.connect(filter);filter.connect(gain);gain.connect(master);src.start();bed=src;src.onended=()=>{src.disconnect();filter.disconnect();gain.disconnect();};counts.breath++;report();}
function hush(){for(const n of shots){try{n.stop();}catch{}}shots.clear();}
function silence(){clearTimeout(testTimer);testTimer=null;hush();breath(false);report();}
function demoBreath(){clearTimeout(testTimer);breath(true);testTimer=setTimeout(()=>breath(false),6500);}
window.PredictiveSound={activate,effect,breath,hush,silence,demoBreath,status:()=>({enabled,available:!!(window.AudioContext||window.webkitAudioContext),context:ctx?.state||'closed',breathing:!!bed,failed,counts:{...counts}})};
})();
