const hand = 'https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/';
const spatial = 'https://ewanqian.github.io/performable-music/spatial-playground/';

// Stable published entrances. The index does not migrate or retire their source.
export const catalog = [
  { id: 'hand-osc', title: 'Hand / Space / OSC', zh: '手部追踪与空间信号', aliases: ['Hand Lab', 'Spatial Hand Lab', 'Sugar Hand Lab', 'Hands OSC'], group: 'input', input: '双手 · OSC', device: '桌面 / XR', href: hand, status: '基础工具', description: '查看手部关节，把空间动作送入自己的系统。' },
  { id: 'hand-synth', title: 'Hand / Synth / Space', zh: '手势声音实验', aliases: ['Hand Lab', 'Spatial Hand Lab', 'Sugar Hand Lab', 'Hands OSC Sound'], group: 'sound', input: '捏合 · 声音', device: '桌面 / XR', href: `${hand}instrument.html`, status: '声音原型', description: '用捏合与双手距离控制声音，体验输入与反馈的关系。' },
  { id: 'gesture-dynamics', title: 'Gesture Dynamics', zh: '动作与空间粒子', group: 'input', input: '蓄力 · 喷流', device: '桌面 / Quest', href: `${hand}gesture-dynamics.html`, status: '研究原型', description: '握拳蓄积、剑指喷流、张掌释放，观察动作的连续变化。' },
  { id: 'phalanx', title: 'Phalanx Approach', zh: '指节触点实验', group: 'input', input: '指节 · 校准', device: '桌面 / XR', href: `${hand}phalanx-approach.html`, status: '输入工具', description: '对比三种接近判定方式，找到适合自己手型的触点。' },
  { id: 'hand-seal', title: 'Hand Seal Trainer', zh: '掌诀训练器', group: 'symbol', input: '跟练 · 认位', device: '桌面 / XR', href: `${hand}handseal-trainer.html`, status: '研究原型', description: '指节标签、十二辰认位与剑指姿势的可解释跟练。' },
  { id: 'atlas-culture', title: 'Gestural Atlas · Culture', zh: '动作与文化符号', group: 'symbol', input: '轨迹 · 图谱', device: '桌面 / XR', href: `${hand}atlas-culture.html`, status: '研究原型', description: '从剑指、数图与星图出发，研究符号如何成为交互。' },
  { id: 'atlas-music', title: 'Gestural Atlas · Performance', zh: '手势演奏图谱', group: 'sound', input: '双手 · 演奏', device: '桌面 / XR', href: `${hand}atlas-music.html`, status: '声音原型', description: '捏合、双手距离、轨迹与指节，四种音乐动作语法。' },
  { id: 'spatial-waves', title: 'Spatial Waves', zh: '四个三维声音体积', group: 'sound', input: '穿越 · 分轨', device: '桌面 / Quest', href: `${hand}spatial-waves.html`, status: '声音原型', description: '进入有深度的声音体积，尝试空间声像与四路分轨。' },
  { id: 'studies', title: 'Spatial Studies 05', zh: '空间乐谱实验', group: 'sound', input: '触发 · 乐谱', device: '桌面 / XR', href: `${hand}studies.html?lab=score`, status: '比较实验', description: '比较声音圆、编排状态与实时参数之间的关系。' },
  { id: 'spellcraft-east', title: 'Spellcraft · East', zh: '东方幻想动作', group: 'fan', input: '瞄准 · 组合', device: '桌面 / Quest', href: `${hand}spellcraft.html?line=east`, status: '交互原型', description: '画符、剑阵和星图组合，共用同一套施法引擎。' },
  { id: 'spellcraft-west', title: 'Spellcraft · West', zh: '西方幻想动作', group: 'fan', input: '蓄力 · 命中', device: '桌面 / Quest', href: `${hand}spellcraft.html?line=west`, status: '交互原型', description: '投掷、冻结、格挡与引力，观察释放与命中的反馈。' },
  { id: 'sixfold', title: 'Sixfold / Warlock', zh: '术士六系 · 空间体验', group: 'fan', input: '掌心 · 施放', device: '桌面 / Quest', href: `${spatial}warlock-immersion/`, status: '粉丝原型', description: '召唤、冻结与碎裂的分段动作，六种元素体验。' },
  { id: 'warlock-comparison', title: 'Warlock · Six Elements', zh: '术士六系 · 对照版本', group: 'archive', input: '动作 · 对照', device: '桌面 / Quest', href: `${spatial}warlock-lab/`, status: '对照档案', description: '保留另一套术士实现，用于对比手势与声音反馈。' },
  { id: 'organic', title: 'Organic Fields', zh: '有机声音场', group: 'sound', input: '双手 · 场', device: '桌面 / XR', href: `${hand}playground.html`, status: '声音原型', description: '已分享的有机场实验，继续保留原始入口。' },
  { id: 'morphology', title: 'Spatial Morphology Lab', zh: '空间形态实验室', group: 'sound', input: '变量 · A/B', device: '桌面 / WebGL', href: `${spatial}morphology-lab/`, status: '研究工具', description: '六类三维结构与 54 组参数对照，用同一视角比较空间形态。' },
  { id: 'neural', title: 'Neural Field', zh: '示意脑结构与信号', group: 'sound', input: '区域 · 信号', device: '桌面 / XR', href: `${hand}neural.html`, status: '合成信号', description: '脑结构示意、观察模式与手势视听；使用合成信号。' },
  { id: 'neuro', title: 'Neuro Field', zh: '网络脉冲 · 对照版本', group: 'archive', input: '网络 · 脉冲', device: '桌面 / XR', href: `${hand}neuro-field.html`, status: '对照档案', description: '保留网络传播实验，比较结构、节奏与可读性。' },
  { id: 'xr-cast', title: 'XR Cast', zh: '星图与四声部', group: 'archive', input: '星图 · 声部', device: '桌面 / XR', href: `${hand}xr-cast.html`, status: '对照档案', description: '文化符号与声音映射的早期实验。' },
  { id: 'critical-field', title: 'Critical Field XR', zh: '四幕空间视听', group: 'sound', input: '场景 · 乐谱', device: '桌面 / VR', href: spatial, status: '演出研究', description: '初始条件、场、干预与余像，四幕空间演出研究。' },
  { id: 'greenhouse', title: 'Greenhouse in Transit', zh: '便携温室', group: 'symbol', input: '探索 · 故事', device: '桌面 / Quest', href: 'https://ewanqian.github.io/Greenhouse-in-Transit/xr/experience-v2/index.html', status: '独立项目', description: '打开行李箱，探索观察、携带与重新栖居的空间故事。' },
];

export const groups = [
  { id: 'all', label: '全部' },
  { id: 'input', label: '手部输入' },
  { id: 'sound', label: '声音 / 视听' },
  { id: 'symbol', label: '符号 / 叙事' },
  { id: 'fan', label: '幻想交互' },
  { id: 'archive', label: '对照档案' },
];

export const classes = {
  warlock: {
    name: '术士', en: 'Warlock', number: '01', status: '已有交互原型', ready: true,
    title: '积蓄、塑形、释放。',
    description: '从现有六系实验继续深化。让不同能力拥有自己的蓄力、命中与余韵，再接入对应的音乐切片。',
    actions: ['召唤', '持续塑形', '释放 / 冻结', '命中 / 碎裂', '消散', '超能'],
    gesture: '现有原型 · 掌心与手势',
  },
  titan: {
    name: '泰坦', en: 'Titan', number: '02', status: '动作研究计划', ready: false,
    title: '重量、冲量、支撑。',
    description: '计划研究蓄力、近身冲击与防御的身体感。先确认可在头显活动范围内完成的动作，再建立声音层次。',
    actions: ['准备', '蓄势', '冲击', '接触', '回收', '超能'],
    gesture: '计划 · 等待动作与声音参考',
  },
  hunter: {
    name: '猎人', en: 'Hunter', number: '03', status: '动作研究计划', ready: false,
    title: '精度、节奏、轻盈。',
    description: '计划研究瞄准、投掷与连续动作的节奏。为起手、飞行、命中和收势分别留出声音位置。',
    actions: ['准备', '瞄准 / 蓄力', '投射', '命中', '收势', '超能'],
    gesture: '计划 · 等待动作与声音参考',
  },
};

export const soundEvents = [
  { id: 'summon', label: '起手', en: 'SUMMON' },
  { id: 'charge', label: '蓄力', en: 'CHARGE' },
  { id: 'cast', label: '释放', en: 'CAST' },
  { id: 'impact', label: '命中', en: 'IMPACT' },
  { id: 'release', label: '收束', en: 'RELEASE' },
  { id: 'ultimate', label: '超能', en: 'ULTIMATE' },
];
