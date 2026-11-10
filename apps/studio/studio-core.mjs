export const WORKS = {
  resonance: {number:'01',title:'掌中残响',en:'HELD RESONANCE',statement:'一个动作，给空间留下多少余音？',description:'选择一根弦，按住，再松开。六次动作构成一段有呼吸的短句；不操作时，空间保持安静。',input:'按住 → 张力 → 松开',output:'瓷质余音 / 空间弦',action:'按住，再松开',count:6,names:['弦 1','弦 2','弦 3','弦 4','弦 5'],points:[[-.65,0,0],[-.325,0,.06],[0,0,.12],[.325,0,.06],[.65,0,0]],notes:[60,62,65,67,69],hint:'点选弦，按住再松开。方向键选位，空格演奏；头显中捏合并松开。',development:'从一根弦开始。按住的时间改变余音的长度和展开幅度，选择改变音高与空间位置。六次释放之后，让最后一个形状自然落下。',method:'方法来源：极简输入实验室的一键输入；音画同源乐器的 Trigger / Continuous / State。',complete:'让余音落下',ending:'六次释放构成了你的短句。可以回放，或导出动作谱。'},
  score:{number:'02',title:'空间铸谱',en:'SCORE FOUNDRY',statement:'把一次选择，排成一段可以重演的空间。',description:'四个节点分别打开不同的形态与音色。用八次有意的触发编排一个起伏，保留动作之间的间隔。',input:'选择 → 触发 → 编排',output:'八次声音事件 / 动作谱',action:'触发这个节点',count:8,names:['点','线','面','息'],points:[[-.62,.12,-.06],[-.2,-.16,.15],[.22,.18,-.03],[.65,-.12,.08]],notes:[60,67,72,76],hint:'点击空间节点或下方按钮选位，再触发。1–4 选位，空格演奏。息节点只留下视觉停顿。',development:'点建立开始，线连接时间，面展开空间，息留下空白。八次操作完成一段动作谱，回放只执行一遍。停顿同样被记录。',method:'方法来源：One-Button Input 的状态推进；Scene Forge 的空间关系；Show Score 的记录与重演。',complete:'这段空间有了谱',ending:'声音、空间与停顿共享同一份动作记录。回放一遍，听听关系是否成立。'},
  atlas:{number:'03',title:'掌上星图',en:'PALM ATLAS',statement:'先学会看见一个位置，再把它变成自己的符号。',description:'沿着提示依次连接七个空间位置。每次确认都有清楚的反馈，最后得到一个由你亲手连成的符形。',input:'认位 → 确认 → 连线',output:'七次清音 / 个人星图',action:'确认这个位置',count:7,names:['始','引','转','衡','合','映','归'],points:[[-.64,-.27,.03],[-.46,.17,-.13],[-.12,.38,.08],[.18,.13,-.05],[.53,.32,.1],[.64,-.24,-.09],[.05,-.33,.06]],notes:[60,62,65,67,69,74,72],hint:'寻找带有光环的下一位置，再确认。方向键或 1–7 选位；空格确认。',development:'位置先被提示，再被主动确认，随后与上一个位置连接。选错时只指出下一位置，不跳过学习过程。这是自创的当代交互符形。',method:'方法来源：Hand Seal Trainer 的认位与纠错；Phalanx 的有意确认；Gestural Atlas 的符号组合。',complete:'七个动作，一张星图',ending:'最后的符形保留了你逐步连接的路径。试着重新开始，不依赖提示记住它。'},
  garden:{number:'04',title:'共生之庭',en:'GARDEN OF SIGNALS',statement:'当空间开始回应，你还需要一直控制它吗？',description:'从四个入口送入六次轻脉冲。信号沿网络扩散；之后停手三秒，让这个小小的系统自己安定下来。',input:'激励 → 观察 → 留白',output:'传播网络 / 离散和声',action:'送入一次脉冲',count:6,names:['根','枝','叶','芽'],points:[[-.6,-.15,0],[-.2,.28,.08],[.23,-.25,-.04],[.61,.18,.04]],notes:[60,65,69,74],hint:'选择入口并触发。六次之后停手三秒。频繁触发会被限速，观察也是过程的一部分。',development:'种子被送入，局部激励扩展为网络关系。第六次输入后，留白让场域进入平衡。结尾保留网络，不让声音无限累积。',method:'方法来源：Organic Fields 的动作场；Neural Field 的传播；音画同源乐器的 Quiet / Active 状态。',complete:'让系统继续呼吸',ending:'你提供了初始条件，也给它留下了安静。网络保留痕迹，声音已经收束。'}
};
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number.isFinite(v)?v:min));
export class Study {
  constructor(work='resonance'){this.work=WORKS[work]?work:'resonance';this.config=WORKS[this.work];this.reset();}
  reset(){this.events=[];this.count=0;this.selected=this.work==='resonance'?2:0;this.pending=null;this.started=null;this.lastAt=-Infinity;this.releasedAt=null;this.completed=false;this.message=this.work==='atlas'?'先找到「始」，确认第一个位置。':this.work==='garden'?'送入一个脉冲，观察它怎样扩散。':'选择一个位置，给空间第一个动作。';}
  select(index){this.selected=clamp(Math.round(index),0,this.config.names.length-1);}
  press(now,source='desktop'){
    if(!Number.isFinite(now)||this.completed||this.pending)return null;
    if(this.work==='garden'&&this.count>=this.config.count){this.pending={at:now,index:this.selected,source,settling:true};this.releasedAt=null;this.message='六次已经足够。请松开并停手三秒，让网络安定。';return {type:'hold'};}
    if(now-this.lastAt<(this.work==='garden'?550:120)){this.message='留一点间隔，再做下一个动作。';return null;}
    if(this.work==='atlas'&&this.selected!==this.count){this.message=`下一位置是「${this.config.names[this.count]}」。沿光环找到它，再确认。`;return {type:'miss'};}
    this.pending={at:now,index:this.selected,source};
    if(this.work==='resonance'){this.message='张力正在积累。松开，让声音出现。';return {type:'hold'};}
    return this.commit(now,1);
  }
  release(now,cancel=false){
    if(!this.pending)return null;
    if(cancel){this.pending=null;this.releasedAt=null;this.message='动作已取消。重新确认后继续。';return null;}
    if(this.work==='resonance')return this.commit(now,clamp((now-this.pending.at)/1000,.12,1.6));
    this.pending=null;if(this.work==='garden'&&this.count>=this.config.count)this.releasedAt=now;return null;
  }
  commit(now,intensity){
    if(!this.pending||!Number.isFinite(now)||this.completed)return null;
    if(this.started===null)this.started=now;
    const event={type:'note',index:this.pending.index,time:Math.round(now-this.started),duration:Math.round(intensity*1000),intensity:clamp(intensity,.12,1.6),silent:this.work==='score'&&this.pending.index===3};
    this.events.push(event);this.count++;this.lastAt=now;
    if(this.work==='resonance')this.pending=null;
    if(this.count>=this.config.count&&this.work!=='garden')this.completed=true;
    this.message=this.completed?this.config.ending:this.work==='atlas'?`已连接「${this.config.names[event.index]}」。下一位置：「${this.config.names[this.count]}」。`:this.work==='garden'&&this.count>=this.config.count?'现在停手三秒，让波动自然落下。':this.work==='score'?`${event.silent?'留下一次停顿':'留下一个声音事件'}。继续编排第 ${this.count+1} 次选择。`:`第 ${this.count} 次余音已留下。换一个位置，或改变按住的时间。`;
    return event;
  }
  tick(now){if(this.work==='garden'&&!this.completed&&!this.pending&&this.count===this.config.count&&this.releasedAt!==null&&now-this.releasedAt>=3000){this.completed=true;this.message=this.config.ending;return {type:'complete'};}return null;}
  export(){return {format:'xr-creations-actions',version:1,work:this.work,title:this.config.title,tempo:null,events:this.events.map(e=>({...e})),note:'Relative action timing in milliseconds. No hand-joint recordings or uploaded media.'};}
}
