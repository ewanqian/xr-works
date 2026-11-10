import {WORKS,Study,clamp} from './studio-core.mjs';

const $=id=>document.getElementById(id);
const requested=new URLSearchParams(location.search).get('work');
const state=new Study(requested),work=state.config;
let canvas=$('stage');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let session=null,reference=null,anchor=null,lastFrame=performance.now(),primaryHand=null,handArmed=false,xrStarting=false;
let downSource=null,pointer=[0,0,0],cursorVisible=false,visualPulses=[],replayTimers=[],replaying=false;
const C={paper:[.91,.89,.8],warm:[.92,.63,.41],muted:[.24,.32,.26],light:[.6,.72,.58],blue:[.5,.65,.71]};
const identity=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function perspective(fov,aspect,near=.05,far=100){const f=1/Math.tan(fov/2),m=new Float32Array(16);m[0]=f/aspect;m[5]=f;m[10]=(far+near)/(near-far);m[11]=-1;m[14]=2*far*near/(near-far);return m;}
function world(p){if(!anchor)return p;const c=Math.cos(anchor.yaw),s=Math.sin(anchor.yaw);return [anchor.x+c*p[0]+s*p[2],anchor.y+p[1],anchor.z-s*p[0]+c*p[2]];}
function local(p){if(!anchor)return p;const x=p[0]-anchor.x,z=p[2]-anchor.z,c=Math.cos(anchor.yaw),s=Math.sin(anchor.yaw);return[c*x-s*z,p[1]-anchor.y,s*x+c*z];}
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);

class FiniteAudio{
  constructor(){this.context=null;this.enabled=false;this.level=.55;this.voices=new Set();this.output=null;this.generation=0;this.pending=false;}
  async enable(){
    const generation=++this.generation;this.pending=true;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)throw Error('此浏览器不支持 Web Audio。');
    if(!this.context){
      const c=this.context=new AC({latencyHint:'interactive'}),compressor=c.createDynamicsCompressor();
      this.output=c.createGain();this.output.gain.value=0;
      const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=170;hp.Q.value=.7;
      compressor.threshold.value=-15;compressor.knee.value=14;compressor.ratio.value=3;compressor.attack.value=.008;compressor.release.value=.17;
      this.input=c.createGain();this.input.gain.value=.4;this.input.connect(hp);hp.connect(compressor);compressor.connect(this.output);this.output.connect(c.destination);
    }
    try{await this.context.resume();}finally{if(generation===this.generation)this.pending=false;}
    if(generation!==this.generation||document.hidden)return false;
    if(this.context.state!=='running')throw Error('声音还未解锁，请再点一次开启声音。');
    this.enabled=true;this.output.gain.setTargetAtTime(this.level,this.context.currentTime,.035);return true;
  }
  mute(){this.generation++;this.pending=false;this.enabled=false;if(this.context)this.output.gain.setTargetAtTime(0,this.context.currentTime,.018);this.stopVoices();}
  stopVoices(){for(const v of this.voices){try{v.stop();}catch{}}this.voices.clear();}
  volume(v){this.level=clamp(v,0,1);if(this.context)this.output.gain.setTargetAtTime(this.enabled?this.level:0,this.context.currentTime,.03);}
  play(event){
    if(!this.enabled||!this.context||this.context.state!=='running'||event.silent||event.type!=='note')return;
    const c=this.context,t=c.currentTime+.008,frequency=440*Math.pow(2,(work.notes[event.index]-69)/12);
    const duration=state.work==='resonance'?.65+event.intensity*.55:state.work==='atlas'?1.0:state.work==='garden'?1.3:.7;
    const partials=state.work==='resonance'?[[1,.16],[2.01,.035],[3.99,.013]]:state.work==='garden'?[[1,.13],[1.5,.038],[2,.018]]:[[1,.14],[2,.025]];
    if(this.voices.size+partials.length>24)return;
    for(const [multiple,amp] of partials){
      const o=c.createOscillator(),g=c.createGain(),pan=c.createStereoPanner();
      o.type='sine';o.frequency.value=frequency*multiple;pan.pan.value=clamp(work.points[event.index][0]*.9,-.8,.8);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amp*(.65+event.intensity*.22),t+.018);
      g.gain.exponentialRampToValueAtTime(.0001,t+duration);g.gain.linearRampToValueAtTime(0,t+duration+.02);
      o.connect(g);g.connect(pan);pan.connect(this.input);this.voices.add(o);
      o.onended=()=>{this.voices.delete(o);o.disconnect();g.disconnect();pan.disconnect();};
      o.start(t);o.stop(t+duration+.025);
    }
  }
}
const audio=new FiniteAudio();

class SpaceRenderer{
  constructor(){
    this.supportsXR=true;
    this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,xrCompatible:true,premultipliedAlpha:false});
    if(!this.gl)throw Error('这个浏览器没有可用的 WebGL。请使用支持 WebGL 的浏览器打开。');
    const gl=this.gl;
    this.program=this.programFrom(`attribute vec3 pos;attribute vec4 color;attribute float size;uniform mat4 projection,view;uniform float ratio;varying vec4 tint;void main(){vec4 p=view*vec4(pos,1.);gl_Position=projection*p;gl_PointSize=clamp(size*ratio*2.4/max(.7,-p.z),1.,30.);tint=color;}`,`precision mediump float;varying vec4 tint;uniform float points;void main(){float a=1.;if(points>.5){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;a=1.-smoothstep(.4,1.,d);}gl_FragColor=vec4(tint.rgb,tint.a*a);}`);
    this.buffer=gl.createBuffer();this.attributes={pos:gl.getAttribLocation(this.program,'pos'),color:gl.getAttribLocation(this.program,'color'),size:gl.getAttribLocation(this.program,'size')};
    this.uniforms={projection:gl.getUniformLocation(this.program,'projection'),view:gl.getUniformLocation(this.program,'view'),ratio:gl.getUniformLocation(this.program,'ratio'),points:gl.getUniformLocation(this.program,'points')};
    this.textProgram=this.programFrom(`attribute vec3 pos;attribute vec2 uv;uniform mat4 projection,view;varying vec2 tex;void main(){gl_Position=projection*view*vec4(pos,1.);tex=uv;}`,`precision mediump float;uniform sampler2D image;varying vec2 tex;void main(){gl_FragColor=texture2D(image,tex);}`);
    this.textBuffer=gl.createBuffer();this.texture=gl.createTexture();this.textCanvas=document.createElement('canvas');this.textCanvas.width=1024;this.textCanvas.height=256;this.lastText='';
    gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  }
  programFrom(v,f){const gl=this.gl,p=gl.createProgram();for(const[type,src]of[[gl.VERTEX_SHADER,v],[gl.FRAGMENT_SHADER,f]]){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(p,s);}gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
  resize(){const gl=this.gl,r=Math.min(2,devicePixelRatio||1),w=Math.round(canvas.clientWidth*r),h=Math.round(canvas.clientHeight*r);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);return w/h;}
  draw(data,kind,projection,view){if(!data.length)return;const gl=this.gl,u=this.uniforms,a=this.attributes;gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);for(const [k,n,o]of[['pos',3,0],['color',4,12],['size',1,28]]){gl.enableVertexAttribArray(a[k]);gl.vertexAttribPointer(a[k],n,gl.FLOAT,false,32,o);}gl.uniformMatrix4fv(u.projection,false,projection);gl.uniformMatrix4fv(u.view,false,view);gl.uniform1f(u.ratio,session?1.4:Math.min(2,devicePixelRatio||1));gl.uniform1f(u.points,kind===gl.POINTS?1:0);gl.drawArrays(kind,0,data.length/8);}
  label(projection,view){
    const text=`${work.title} · ${state.count}/${work.count}\n${state.completed?'完成 · 用系统按钮退出':state.work==='resonance'?'右手捏合，再松开':state.work==='atlas'?`下一位置：${work.names[state.count]}`:state.work==='garden'&&state.count>=6?'停手三秒，等待平衡':'选位置，捏合确认'}\n${audio.enabled?'有限余音 · 松手留白':'当前静音'} · 控制器扳机也可操作`;
    const gl=this.gl;if(text!==this.lastText){this.lastText=text;const c=this.textCanvas.getContext('2d');c.clearRect(0,0,1024,256);c.fillStyle='rgba(13,19,15,.92)';c.fillRect(0,0,1024,256);c.strokeStyle='#61715b';c.strokeRect(2,2,1020,252);c.textAlign='center';text.split('\n').forEach((line,i)=>{c.font=`${i===0?38:29}px sans-serif`;c.fillStyle=i===0?'#eee9dd':i===1?'#e3a87b':'#a4b299';c.fillText(line,512,63+i*69);});gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.textCanvas);}
    const p=this.textProgram,vertices=[];for(const[x,y,u,v]of[[-.8,.68,0,0],[.8,.68,1,0],[.8,1.08,1,1],[-.8,.68,0,0],[.8,1.08,1,1],[-.8,1.08,0,1]])vertices.push(...world([x,y,-.12]),u,v);
    gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,this.textBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW);const ap=gl.getAttribLocation(p,'pos'),au=gl.getAttribLocation(p,'uv');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(au);gl.vertexAttribPointer(au,2,gl.FLOAT,false,20,12);gl.uniformMatrix4fv(gl.getUniformLocation(p,'projection'),false,projection);gl.uniformMatrix4fv(gl.getUniformLocation(p,'view'),false,view);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.uniform1i(gl.getUniformLocation(p,'image'),0);gl.drawArrays(gl.TRIANGLES,0,6);
    gl.disableVertexAttribArray(ap);gl.disableVertexAttribArray(au);
  }
  render(geometry,projection,view){this.draw(geometry.lines,this.gl.LINES,projection,view);this.draw(geometry.points,this.gl.POINTS,projection,view);if(session)this.label(projection,view);}
}
class ProjectionRenderer{
  constructor(){
    this.supportsXR=false;this.gl=null;this.context=canvas.getContext('2d');
    if(!this.context)throw Error('这个浏览器无法创建图形画布。请换一个浏览器。');
  }
  resize(){const ratio=Math.min(2,devicePixelRatio||1),w=Math.round(canvas.clientWidth*ratio),h=Math.round(canvas.clientHeight*ratio);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}return w/h;}
  clear(){this.context.clearRect(0,0,canvas.width,canvas.height);}
  render(geometry,projection,view){
    const c=this.context,ratio=Math.min(2,devicePixelRatio||1);
    const transform=(m,p)=>[m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12]*p[3],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13]*p[3],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]*p[3],m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15]*p[3]];
    const projected=(data,i)=>{const eye=transform(view,[data[i],data[i+1],data[i+2],1]),clip=transform(projection,eye);if(clip[3]<=0)return null;return{x:(clip[0]/clip[3]+1)*canvas.width/2,y:(1-clip[1]/clip[3])*canvas.height/2,depth:eye[2],size:clamp(data[i+7]*ratio*2.4/Math.max(.7,-eye[2]),1,30)};};
    const color=(data,i,alpha=1)=>`rgba(${Math.round(data[i+3]*255)},${Math.round(data[i+4]*255)},${Math.round(data[i+5]*255)},${data[i+6]*alpha})`;
    c.lineWidth=.7*ratio;
    for(let i=0;i<geometry.lines.length;i+=16){const a=projected(geometry.lines,i),b=projected(geometry.lines,i+8);if(!a||!b)continue;c.strokeStyle=color(geometry.lines,i);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
    const dots=[];for(let i=0;i<geometry.points.length;i+=8){const p=projected(geometry.points,i);if(p)dots.push({...p,index:i});}dots.sort((a,b)=>a.depth-b.depth);
    for(const p of dots){c.fillStyle=color(geometry.points,p.index,.17);c.beginPath();c.arc(p.x,p.y,p.size*.65,0,Math.PI*2);c.fill();c.fillStyle=color(geometry.points,p.index,.95);c.beginPath();c.arc(p.x,p.y,p.size*.28,0,Math.PI*2);c.fill();}
  }
}
let renderer;
try{renderer=new SpaceRenderer();}catch(error){
  try{const replacement=canvas.cloneNode(false);canvas.replaceWith(replacement);canvas=replacement;renderer=new ProjectionRenderer();$('input-mode').textContent='兼容预览 / 3D PROJECTION';document.querySelector('.prototype-note').textContent='兼容预览 · 使用同一三维场景的透视投影，保留全部桌面交互与声音；此浏览器无法开启 XR。';}
  catch(fallbackError){$('stage-error').hidden=false;$('stage-error').textContent=fallbackError.message;$('perform').disabled=true;}
}

function vertex(list,p,c,alpha=1,size=4){list.push(...world(p),...c,alpha,size);}
function geometry(now){
  const lines=[],points=[],line=(a,b,c=C.muted,alpha=1)=>{vertex(lines,a,c,alpha);vertex(lines,b,c,alpha);},dot=(p,c=C.paper,size=5,alpha=1)=>vertex(points,p,c,alpha,size);
  const ring=(p,r,c=C.muted,alpha=.7,plane='xy')=>{for(let i=0;i<56;i++){const a=i/56*Math.PI*2,b=(i+1)/56*Math.PI*2;const point=t=>plane==='xz'?[p[0]+Math.cos(t)*r,p[1],p[2]+Math.sin(t)*r]:[p[0]+Math.cos(t)*r,p[1]+Math.sin(t)*r,p[2]];line(point(a),point(b),c,alpha);}};
  ring([0,-.56,-.03],.93,C.muted,.5,'xz');
  for(let i=0;i<17;i++){const a=i/16*Math.PI*2;dot([Math.cos(a)*.93,-.56,Math.sin(a)*.93],C.light,2,.35);}
  visualPulses=visualPulses.filter(p=>now-p.at<4300);
  const power=index=>visualPulses.filter(p=>p.index===index).reduce((a,p)=>a+Math.exp(-(now-p.at)/800)*p.intensity,0);
  if(state.work==='resonance'){
    work.points.forEach((p,index)=>{const strength=power(index)+(state.pending?.index===index ? .15 : 0);for(let j=0;j<40;j++){const pos=k=>{const y=-.48+k/40*.98,w=Math.sin(k/40*Math.PI);return[p[0]+Math.sin(k*.65-now*.006)*w*strength*.055,y,p[2]+w*(.08+strength*.13)];};line(pos(j),pos(j+1),index===state.selected?C.warm:C.paper,.55+.25*Math.min(1,strength));}dot([p[0],.5,p[2]],C.paper,5);dot([p[0],-.48,p[2]],C.paper,5);ring(p,.042+strength*.08,index===state.selected?C.warm:C.light,.65);});
  }else if(state.work==='score'){
    work.points.forEach((p,index)=>{const s=power(index),color=index===state.selected?C.warm:C.paper;ring(p,.12+s*.08,color,.8);if(index===0)dot(p,color,10+s*10);if(index===1)for(let j=-2;j<=2;j++)line([p[0]-.1,p[1]+j*.04,p[2]],[p[0]+.1,p[1]+j*.04,p[2]+.04],color,.7);if(index===2){for(let j=0;j<5;j++){const y=p[1]+(j-2)*.035;line([p[0]-.1,y,p[2]-.07],[p[0]+.1,y,p[2]+.07],color,.6);}}if(index===3)ring(p,.047,C.light,.65);});
    for(let i=0;i<8;i++){const p=[-.7+i*.2,-.42,.15];dot(p,i<state.count?C.warm:C.muted,i<state.count?6:3);if(i&&i<state.count)line([p[0]-.2,p[1],p[2]],p,C.warm,.6);}
  }else if(state.work==='atlas'){
    work.points.forEach((p,index)=>{const accepted=index<state.count,expected=index===state.count,chosen=index===state.selected;dot(p,accepted?C.warm:expected?C.paper:C.light,accepted?10:expected?9:5,accepted||expected?1:.55);if(expected||chosen)ring(p,expected?.065:.09,expected?C.warm:C.light,.8);if(index>0)line(work.points[index-1],p,index<state.count?C.warm:C.muted,index<state.count?.9:.45);if(accepted)ring(p,.025,C.warm,.5);});
    if(state.completed){line(work.points[6],work.points[0],C.warm,.8);ring([0,0,0],.84,C.light,.3);}
  }else{
    const nodes=[];for(let i=0;i<67;i++){const a=i*2.399963,r=Math.sqrt(i/67)*.78,z=Math.sin(i*1.77)*.22;nodes.push([Math.cos(a)*r,Math.sin(a)*r*.61,z]);}
    const glow=nodes.map(n=>visualPulses.reduce((sum,p)=>{const age=(now-p.at)/1000,wave=age*.48,dist=distance(n,work.points[p.index]);return sum+Math.exp(-Math.pow(dist-wave,2)*70)*Math.max(0,1-age/3.8);},0));
    for(let i=0;i<nodes.length;i++){for(let j=i+1;j<nodes.length;j++){const d=distance(nodes[i],nodes[j]);if(d<.28)line(nodes[i],nodes[j],glow[i]+glow[j]>.3?C.light:C.muted,.22+Math.min(.65,(glow[i]+glow[j])*.45));}dot(nodes[i],glow[i]>.2?C.warm:C.light,3+glow[i]*9,.45+Math.min(.55,glow[i]));}
    work.points.forEach((p,index)=>{ring(p,.055,index===state.selected?C.warm:C.paper,.85);dot(p,C.paper,5);});
  }
  for(const p of visualPulses){const age=(now-p.at)/1000,origin=work.points[p.index];if(age<1.6)ring([origin[0],origin[1],origin[2]-.03],.04+age*.14,p.silent?C.light:C.warm,(1-age/1.6)*.45);}
  if(cursorVisible){dot(pointer,C.warm,8);ring(pointer,.025,C.warm,.7);}
  return {lines,points};
}

function refresh(){
  $('phase').textContent=replaying?'正在回放一次动作谱':state.completed?'这一段已经完成':state.work==='garden'&&state.count>=6?'等待网络安定':state.pending&&state.work==='resonance'?'正在积累张力':state.count?'继续构成':'等待第一个动作';
  $('progress-number').textContent=`${state.count} / ${work.count}`;$('progress-fill').style.width=`${state.count/work.count*100}%`;
  $('status').textContent=state.message;$('target-label').textContent=`${work.names[state.selected]}${state.work==='atlas'&&!state.completed?` · 下一位置 ${work.names[state.count]}`:''}`;
  $('perform').disabled=state.completed||replaying||!renderer;$('perform').classList.toggle('is-down',!!state.pending);
  $('replay').disabled=!state.events.length;$('export').disabled=!state.events.length;
  $('completion').hidden=!state.completed||replaying;
  for(const b of $('node-selector').children){const i=Number(b.dataset.index);b.classList.toggle('is-selected',i===state.selected);b.classList.toggle('is-visited',state.events.some(e=>e.index===i));b.setAttribute('aria-pressed',String(i===state.selected));}
  $('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound').textContent=audio.enabled?'关闭声音':'开启声音';$('sound-state').textContent=audio.enabled?'FINITE SOUND / 有限余音':'声音未开启';
  $('replay').textContent=replaying?'停止回放':'回放这段动作';
}
function emit(event,now=performance.now()){
  if(event?.type==='note'){audio.play(event);visualPulses.push({...event,at:now});}refresh();
}
function press(source='desktop'){
  if(replaying)return;
  if(downSource&&downSource!==source)return;
  downSource=source;emit(state.press(performance.now(),source));
}
function release(source='desktop',cancel=false){if(downSource!==source)return;emit(state.release(performance.now(),cancel));downSource=null;}
function stopReplay(){for(const t of replayTimers)clearTimeout(t);replayTimers=[];replaying=false;audio.stopVoices();refresh();}
function reset(){stopReplay();state.reset();downSource=null;primaryHand=null;visualPulses=[];refresh();}
function select(index){state.select(index);refresh();}
function nearest(p){let best=0,d=Infinity;work.points.forEach((x,i)=>{const n=Math.hypot(x[0]-p[0],x[1]-p[1]);if(n<d){d=n;best=i;}});select(best);}
function canvasPointer(event){const r=canvas.getBoundingClientRect(),aspect=r.width/r.height,scale=Math.tan(Math.PI/7)*2.35;pointer=[clamp(((event.clientX-r.left)/r.width*2-1)*aspect*scale,-1.2,1.2),clamp((1-(event.clientY-r.top)/r.height*2)*scale,-.8,.8),.03];cursorVisible=true;nearest(pointer);}

$('work-number').textContent=work.number;$('work-title').textContent=work.title;$('work-en').textContent=work.en;document.title=`${work.title} — XR Creations`;
for(const[id,key]of[['statement','statement'],['description','description'],['input-copy','input'],['output-copy','output'],['perform','action'],['gesture-hint','hint'],['development','development'],['method-credit','method'],['completion-title','complete'],['completion-copy','ending']])$(id).textContent=work[key];
$('stage-label').textContent=`${work.number} / ${work.en}`;
for(const tab of document.querySelectorAll('[data-work]'))if(tab.dataset.work===state.work)tab.setAttribute('aria-current','page');
work.names.forEach((name,index)=>{const b=document.createElement('button');b.type='button';b.dataset.index=String(index);b.textContent=name;b.addEventListener('click',()=>select(index));$('node-selector').append(b);});
canvas.addEventListener('pointermove',canvasPointer);
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();canvas.focus();canvasPointer(e);canvas.setPointerCapture(e.pointerId);press('pointer');});
canvas.addEventListener('pointerup',e=>{e.preventDefault();release('pointer');});
canvas.addEventListener('pointercancel',()=>release('pointer',true));
canvas.addEventListener('lostpointercapture',()=>release('pointer',true));
canvas.addEventListener('pointerleave',()=>{if(!downSource)cursorVisible=false;});
$('perform').addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();$('perform').setPointerCapture(e.pointerId);press('button');});
$('perform').addEventListener('pointerup',()=>release('button'));
$('perform').addEventListener('pointercancel',()=>release('button',true));
$('perform').addEventListener('lostpointercapture',()=>release('button',true));
$('perform').addEventListener('click',e=>{if(e.detail===0){press('accessible');setTimeout(()=>release('accessible'),180);}});
$('reset').addEventListener('click',reset);
document.addEventListener('keydown',e=>{
  if(e.target.matches('input,summary')||e.metaKey||e.ctrlKey||e.altKey||session)return;
  if(e.code==='Space'&&!e.repeat&&(!e.target.matches('button,a')||e.target.id==='perform'||e.target.closest('#node-selector'))){e.preventDefault();press('keyboard');}
  else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();select((state.selected-1+work.names.length)%work.names.length);}
  else if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();select((state.selected+1)%work.names.length);}
  else if(/^[1-7]$/.test(e.key)&&Number(e.key)<=work.names.length)select(Number(e.key)-1);
  else if(e.code==='KeyR')reset();
});
document.addEventListener('keyup',e=>{if(e.code==='Space')release('keyboard');});
window.addEventListener('blur',()=>{if(downSource)release(downSource,true);});
$('sound').addEventListener('click',async()=>{if(audio.enabled||audio.pending)audio.mute();else try{await audio.enable();}catch(error){audio.pending=false;state.message=error.message;}refresh();});
$('volume').addEventListener('input',e=>{audio.volume(Number(e.target.value)/100);});
$('replay').addEventListener('click',()=>{
  if(replaying){stopReplay();return;}
  if(downSource)release(downSource,true);
  audio.stopVoices();visualPulses=[];replaying=true;refresh();
  for(const event of state.events){replayTimers.push(setTimeout(()=>{visualPulses.push({...event,at:performance.now()});audio.play(event);select(event.index);},event.time));}
  replayTimers.push(setTimeout(()=>{replaying=false;replayTimers=[];refresh();},(state.events.at(-1)?.time||0)+2000));
});
$('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state.export(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`xr-creations-${state.work}-actions.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(downSource)release(downSource,true);stopReplay();audio.mute();refresh();}});
window.addEventListener('pagehide',()=>{stopReplay();audio.mute();if(session)session.end().catch(()=>{});});

async function xrSupport(){
  if(!renderer?.supportsXR){$('enter-vr').textContent='VR 不可用';$('enter-ar').textContent='MR 不可用';$('xr-status').textContent='兼容预览可直接试玩；此浏览器没有可用的 WebGL，头显入口暂不可用。';return;}
  if(!navigator.xr||!isSecureContext){$('enter-vr').textContent='VR 不可用';$('enter-ar').textContent='MR 不可用';$('xr-status').textContent='在支持 WebXR 的头显浏览器打开此页，或继续桌面 / 触屏试玩。';return;}
  const results=await Promise.allSettled(['immersive-vr','immersive-ar'].map(mode=>navigator.xr.isSessionSupported(mode)));
  results.forEach((r,i)=>{const ok=r.status==='fulfilled'&&r.value,b=$(i?'enter-ar':'enter-vr');b.disabled=!ok||!renderer;b.textContent=ok?(i?'进入 MR':'进入 VR'):(i?'MR 不支持':'VR 不支持');});
  $('xr-status').textContent=results.some(r=>r.status==='fulfilled'&&r.value)?'建议先开启声音。右手捏合或控制器扳机演奏；用头显系统按钮退出。':'当前设备不支持沉浸模式，可直接用鼠标、键盘或触屏试玩。';
}
function rayPoint(origin,direction){const p=local(origin),q=local(origin.map((x,i)=>x+direction[i])),d=q.map((x,i)=>x-p[i]);if(Math.abs(d[2])<.001)return null;const t=-p[2]/d[2];if(t<=0)return null;return[clamp(p[0]+d[0]*t,-1.2,1.2),clamp(p[1]+d[1]*t,-.65,.65),.03];}
function xrInput(frame,pose){
  const sources=[...session.inputSources],hand=sources.find(s=>s.hand&&s.handedness==='right')||sources.find(s=>s.hand);
  if(hand){
    const tip=frame.getJointPose(hand.hand.get('index-finger-tip'),reference),thumb=frame.getJointPose(hand.hand.get('thumb-tip'),reference);
    if(!tip||!thumb){if(downSource==='xr-hand')release('xr-hand',true);primaryHand=null;handArmed=false;cursorVisible=false;audio.stopVoices();return;}
    if(primaryHand&&primaryHand!==hand){if(downSource==='xr-hand')release('xr-hand',true);handArmed=false;}primaryHand=hand;
    const a=tip.transform.position,b=thumb.transform.position,v=pose.transform.position,mid=[(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2],eye=[v.x,v.y,v.z];
    const point=rayPoint(eye,mid.map((x,i)=>x-eye[i]));if(point){pointer=point;cursorVisible=true;if(!state.pending)nearest(point);}
    const gap=Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
    if(gap>.036){if(downSource==='xr-hand')release('xr-hand');handArmed=true;}
    else if(gap<.022&&handArmed&&downSource!=='xr-hand'){press('xr-hand');handArmed=false;}
  }else{
    if(downSource==='xr-hand'){release('xr-hand',true);audio.stopVoices();}primaryHand=null;handArmed=false;
    const controller=sources.find(s=>!s.hand&&s.handedness==='right')||sources.find(s=>!s.hand);
    if(controller){const p=frame.getPose(controller.targetRaySpace,reference);if(p){const m=p.transform.matrix,point=rayPoint([m[12],m[13],m[14]],[-m[8],-m[9],-m[10]]);if(point){pointer=point;cursorVisible=true;if(!state.pending)nearest(point);}}else{cursorVisible=false;if(downSource==='xr-controller')release('xr-controller',true);}}else{cursorVisible=false;if(downSource==='xr-controller')release('xr-controller',true);}
  }
}
async function enterXR(mode){
  if(session||xrStarting||!renderer?.supportsXR)return;
  xrStarting=true;$('enter-ar').disabled=true;$('enter-vr').disabled=true;let active=null;
  try{
    stopReplay();if(downSource)release(downSource,true);
    active=await navigator.xr.requestSession(mode,{optionalFeatures:['hand-tracking','local-floor']});session=active;anchor=null;primaryHand=null;handArmed=false;
    active.addEventListener('end',()=>{if(downSource)release(downSource,true);session=null;anchor=null;reference=null;primaryHand=null;cursorVisible=false;audio.mute();$('input-mode').textContent='DESKTOP / TOUCH';$('xr-status').textContent='已退出头显，声音已关闭。可以继续桌面试玩。';refresh();xrSupport();});
    active.addEventListener('visibilitychange',()=>{if(active.visibilityState!=='visible'){if(downSource)release(downSource,true);audio.stopVoices();}});
    active.addEventListener('selectstart',e=>{if(!e.inputSource.hand)press('xr-controller');});
    active.addEventListener('selectend',e=>{if(!e.inputSource.hand)release('xr-controller');});
    await renderer.gl.makeXRCompatible();active.updateRenderState({baseLayer:new XRWebGLLayer(active,renderer.gl,{alpha:mode==='immersive-ar'})});
    try{reference=await active.requestReferenceSpace('local-floor');}catch{reference=await active.requestReferenceSpace('local');}
    if(session!==active)return;
    $('input-mode').textContent=mode==='immersive-ar'?'MR / LIVE INPUT':'VR / LIVE INPUT';$('enter-ar').disabled=true;$('enter-vr').disabled=true;
    active.requestAnimationFrame(xrFrame);
  }catch(error){state.message=`头显未能启动：${error.message}`;if(active){try{await active.end();}catch{}if(session===active)session=null;}refresh();}
  finally{xrStarting=false;if(!session)xrSupport().catch(()=>{});}
}
function xrFrame(now,frame){
  if(!session)return;session.requestAnimationFrame(xrFrame);
  if(session.visibilityState!=='visible'){if(downSource)release(downSource,true);handArmed=false;audio.stopVoices();return;}
  const pose=frame.getViewerPose(reference);if(!pose){if(downSource)release(downSource,true);audio.stopVoices();return;}
  if(!anchor){const p=pose.transform.position,q=pose.transform.orientation,fx=-2*(q.x*q.z+q.w*q.y),fz=-(1-2*(q.x*q.x+q.y*q.y)),len=Math.hypot(fx,fz)||1;anchor={x:p.x+fx/len*1.75,y:p.y-.12,z:p.z+fz/len*1.75,yaw:Math.atan2(-fx,-fz)};}
  xrInput(frame,pose);if(state.tick(performance.now()))refresh();const geometryNow=geometry(now),gl=renderer.gl,layer=session.renderState.baseLayer;
  gl.bindFramebuffer(gl.FRAMEBUFFER,layer.framebuffer);gl.clearColor(.045,.065,.05,session.environmentBlendMode==='opaque'?1:0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  for(const view of pose.views){const viewport=layer.getViewport(view);gl.viewport(viewport.x,viewport.y,viewport.width,viewport.height);renderer.render(geometryNow,view.projectionMatrix,view.transform.inverse.matrix);}
}
$('enter-vr').addEventListener('click',()=>enterXR('immersive-vr'));
$('enter-ar').addEventListener('click',()=>enterXR('immersive-ar'));
function desktopFrame(now){requestAnimationFrame(desktopFrame);if(!renderer||session||document.hidden)return;if(reduced&&now-lastFrame<50)return;lastFrame=now;if(state.tick(now))refresh();const gl=renderer.gl,aspect=renderer.resize(),view=identity();view[14]=-2.35;if(gl){gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);}else renderer.clear();renderer.render(geometry(now),perspective(Math.PI/3.5,aspect),view);}
refresh();xrSupport().catch(error=>{$('xr-status').textContent=`头显检测失败：${error.message}。桌面试玩仍可使用。`;});requestAnimationFrame(desktopFrame);
