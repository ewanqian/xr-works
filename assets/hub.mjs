import { catalog, groups, classes, soundEvents } from '../data/catalog.mjs';

const $ = (selector) => document.querySelector(selector);
const search = $('#library-search');
const filterHost = $('#category-filters');
const list = $('#catalog-list');
const params = new URLSearchParams(location.search);
let category = groups.some((item) => item.id === params.get('group')) ? params.get('group') : 'all';
let query = (params.get('q') || '').slice(0, 200);
search.value = query;

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function updateQuery() {
  const url = new URL(location.href);
  if (category === 'all') url.searchParams.delete('group');
  else url.searchParams.set('group', category);
  if (query.trim()) url.searchParams.set('q', query.trim());
  else url.searchParams.delete('q');
  history.replaceState(null, '', url);
}

function drawFilters() {
  filterHost.replaceChildren();
  groups.forEach((group) => {
    const count = group.id === 'all' ? catalog.length : catalog.filter((entry) => entry.group === group.id).length;
    const button = node('button', '', group.label);
    button.type = 'button';
    button.dataset.group = group.id;
    button.setAttribute('aria-pressed', String(category === group.id));
    button.append(node('span', '', String(count).padStart(2, '0')));
    button.addEventListener('click', () => {
      category = group.id;
      filterHost.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.group === category)));
      renderCatalog();
      updateQuery();
    });
    filterHost.append(button);
  });
}

function renderCatalog() {
  const needle = query.toLocaleLowerCase().trim();
  const matches = catalog.filter((entry) => (category === 'all' || entry.group === category)
    && [entry.title, entry.zh, entry.description, entry.input, entry.device, entry.status, ...(entry.aliases || []), groups.find((group) => group.id === entry.group)?.label]
      .join(' ').toLocaleLowerCase().includes(needle));
  const fragment = document.createDocumentFragment();
  matches.forEach((entry) => {
    const anchor = node('a', 'catalog-row');
    anchor.href = entry.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', `打开 ${entry.zh} / ${entry.title}（新标签页）`);
    const title = node('div', 'catalog-title');
    title.append(node('strong', '', entry.title), node('small', '', entry.zh));
    const device = node('div', 'catalog-device', entry.device);
    device.append(node('small', '', entry.status));
    const arrow = node('span', 'catalog-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    anchor.append(node('span', 'catalog-num', String(catalog.indexOf(entry) + 1).padStart(2, '0')), title,
      node('p', 'catalog-description', entry.description), node('span', 'catalog-input', entry.input), device, arrow);
    fragment.append(anchor);
  });
  list.replaceChildren(fragment);
  $('#result-count').textContent = `${matches.length} 个入口${category !== 'all' ? ` · ${groups.find((group) => group.id === category).label}` : ' · 全部研究'}`;
  $('#empty-state').hidden = matches.length > 0;
}

search.addEventListener('input', () => { query = search.value.slice(0, 200); renderCatalog(); updateQuery(); });
$('#reset-search').addEventListener('click', () => {
  category = 'all'; query = ''; search.value = ''; drawFilters(); renderCatalog(); updateQuery(); search.focus();
});
drawFilters();
renderCatalog();

// The fan-study expansion is deliberately one class-aware cue map.
// Selecting a future class never pretends that an implementation is available.
let selectedClass = 'warlock';
const tabs = [...document.querySelectorAll('[data-class]')];
const clips = new Map();
let activeClip = null;
const clipMessage = $('#clip-message');

function stopClips(announce = false) {
  clips.forEach(({ audio }) => { audio.pause(); audio.currentTime = 0; });
  activeClip = null;
  if (announce) clipMessage.textContent = '全部试听已停止。';
  updateClipButtons();
}

function changeClass(id, focus = false) {
  if (!classes[id]) return;
  stopClips();
  selectedClass = id;
  const choice = classes[id];
  tabs.forEach((tab) => {
    const chosen = tab.dataset.class === id;
    tab.setAttribute('aria-selected', String(chosen));
    tab.tabIndex = chosen ? 0 : -1;
    if (chosen && focus) tab.focus();
  });
  $('#class-panel').setAttribute('aria-labelledby', `tab-${id}`);
  $('#class-status').textContent = choice.status;
  $('#class-status').classList.toggle('is-planned', !choice.ready);
  $('#class-number').textContent = `CLASS / ${choice.number}`;
  $('#class-title').textContent = choice.title;
  $('#class-description').textContent = choice.description;
  $('#class-gesture').textContent = choice.gesture;
  $('#class-actions').replaceChildren(...choice.actions.map((action) => node('span', '', action)));
  $('#class-launch').hidden = !choice.ready;
  renderClips();
  clipMessage.textContent = `当前职业：${choice.name}。每段最多 30 MB。`;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => changeClass(tab.dataset.class));
  tab.addEventListener('keydown', (event) => {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    changeClass(tabs[next].dataset.class, true);
  });
});

function updateClipButtons() {
  $('#clip-grid').querySelectorAll('[data-play]').forEach((button) => {
    const clip = clips.get(button.dataset.play);
    button.disabled = !clip;
    button.textContent = clip && !clip.audio.paused ? '暂停' : '试听';
    button.setAttribute('aria-pressed', String(Boolean(clip && !clip.audio.paused)));
  });
}

function renderClips() {
  const fragment = document.createDocumentFragment();
  soundEvents.forEach((soundEvent) => {
    const key = `${selectedClass}:${soundEvent.id}`;
    const clip = clips.get(key);
    const slot = node('div', 'clip-slot');
    const heading = node('div', 'clip-slot-top', soundEvent.label);
    heading.append(node('small', '', soundEvent.en));
    const name = node('p', 'clip-name', clip ? clip.name : '还没有声音切片');
    name.title = clip ? clip.name : '';
    const controls = node('div', 'clip-controls');
    const label = node('label', '', clip ? '更换文件' : '选择音频');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*,.wav,.mp3,.ogg,.m4a,.aif,.aiff,.flac';
    fileInput.setAttribute('aria-label', `${classes[selectedClass].name} ${soundEvent.label}：选择本地音频`);
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      if (file.size > 30 * 1024 * 1024) {
        clipMessage.textContent = '这段音频超过 30 MB。请先裁成一个较短的动作切片。';
        fileInput.value = '';
        return;
      }
      if (!file.type.startsWith('audio/') && !/\.(wav|mp3|ogg|m4a|aif|aiff|flac)$/i.test(file.name)) {
        clipMessage.textContent = '请选择音频文件，例如 WAV、MP3 或 M4A。';
        fileInput.value = '';
        return;
      }
      stopClips();
      if (clips.has(key)) URL.revokeObjectURL(clips.get(key).url);
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.preload = 'metadata';
      audio.loop = false;
      audio.volume = 0.5;
      clips.set(key, { name: file.name, audio, url });
      audio.addEventListener('ended', () => { if (activeClip === key) activeClip = null; updateClipButtons(); });
      audio.addEventListener('error', () => {
        if (clips.get(key)?.audio !== audio) return;
        clipMessage.textContent = `浏览器无法播放「${file.name}」，请试试 WAV 或 MP3。`;
        updateClipButtons();
      });
      clipMessage.textContent = `已绑定 ${classes[selectedClass].name} / ${soundEvent.label}：${file.name}。点击试听。`;
      renderClips();
    });
    label.append(fileInput);
    const play = node('button', '', '试听');
    play.type = 'button';
    play.dataset.play = key;
    play.disabled = !clip;
    play.setAttribute('aria-label', `${classes[selectedClass].name} ${soundEvent.label}：试听或暂停`);
    play.addEventListener('click', async () => {
      const current = clips.get(key);
      if (!current) return;
      if (!current.audio.paused) { current.audio.pause(); activeClip = null; updateClipButtons(); return; }
      stopClips();
      activeClip = key;
      try {
        await current.audio.play();
        if (activeClip !== key) current.audio.pause();
        else clipMessage.textContent = `正在试听 ${classes[selectedClass].name} / ${soundEvent.label}：${current.name}`;
      } catch {
        if (activeClip === key) {
          activeClip = null;
          clipMessage.textContent = '没有开始播放。请再点一次试听，或更换为 WAV / MP3。';
        }
      }
      updateClipButtons();
    });
    const clear = node('button', 'clip-clear', '×');
    clear.type = 'button';
    clear.disabled = !clip;
    clear.setAttribute('aria-label', `清除 ${classes[selectedClass].name} ${soundEvent.label} 的切片`);
    clear.addEventListener('click', () => {
      const current = clips.get(key);
      if (!current) return;
      current.audio.pause();
      URL.revokeObjectURL(current.url);
      clips.delete(key);
      if (activeClip === key) activeClip = null;
      renderClips();
      clipMessage.textContent = `${soundEvent.label}的切片已清除。`;
    });
    controls.append(label, play, clear);
    slot.append(heading, name, controls);
    fragment.append(slot);
  });
  $('#clip-grid').replaceChildren(fragment);
  updateClipButtons();
}

$('#stop-clips').addEventListener('click', () => stopClips(true));
$('#reset-clips').addEventListener('click', () => {
  stopClips();
  for (const [key, clip] of clips) {
    if (!key.startsWith(`${selectedClass}:`)) continue;
    URL.revokeObjectURL(clip.url);
    clips.delete(key);
  }
  renderClips();
  clipMessage.textContent = `${classes[selectedClass].name}的六个声音位置已清空。`;
});
$('.clip-station').addEventListener('toggle', (event) => { if (!event.target.open) stopClips(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopClips(); });
window.addEventListener('pagehide', () => stopClips());
renderClips();

// A small pointer-driven field, not a camera or hand-tracking preview.
// It is local, silent and rendered without external assets or libraries.
const canvas = $('#field-canvas');
const ctx = canvas.getContext('2d');
if (ctx) {
  let width = 1, height = 1, frameId = 0, inView = true;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const project = (x, y, z) => {
    const factor = 3.8 / (3.8 + z);
    const scale = Math.min(width * 0.36, height * 0.36);
    return [width * 0.5 + x * scale * factor, height * 0.49 + y * scale * factor, factor];
  };

  function fieldPoint(u, v, time) {
    const ridge = 0.13 * Math.cos(3 * u + 2 * v + time * 0.3);
    const radius = 0.67 + ridge;
    let x = (radius + 0.4 * Math.cos(v)) * Math.cos(u);
    let z = (radius + 0.4 * Math.cos(v)) * Math.sin(u);
    let y = 0.65 * Math.sin(v) + 0.12 * Math.cos(u * 2 + v);
    y += Math.exp(-((x - pointer.x * 1.4) ** 2 + (z - pointer.y) ** 2) * 2) * pointer.y * 0.3;
    const angleY = time * 0.055 + 0.44 + pointer.x * 0.17;
    const angleX = 0.66 + pointer.y * 0.12;
    const x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
    z = x * Math.sin(angleY) + z * Math.cos(angleY);
    x = x1;
    const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
    z = y * Math.sin(angleX) + z * Math.cos(angleX);
    y = y1;
    return project(x, y, z);
  }

  function draw(now = 0) {
    frameId = 0;
    if (!inView || document.hidden) return;
    pointer.x += (pointer.tx - pointer.x) * (reduced.matches ? 1 : 0.08);
    pointer.y += (pointer.ty - pointer.y) * (reduced.matches ? 1 : 0.08);
    const time = reduced.matches ? 0 : now * 0.001;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 0.55;
    for (let j = 0; j < 22; j++) {
      const v = (j / 22) * Math.PI * 2;
      ctx.beginPath();
      for (let i = 0; i <= 84; i++) {
        const p = fieldPoint((i / 84) * Math.PI * 2, v, time);
        if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = j % 5 === 0 ? 'rgba(190,201,204,0.49)' : 'rgba(163,177,182,0.27)';
      ctx.stroke();
    }
    for (let i = 0; i < 36; i++) {
      const u = (i / 36) * Math.PI * 2;
      ctx.beginPath();
      for (let j = 0; j <= 40; j++) {
        const p = fieldPoint(u, (j / 40) * Math.PI * 2, time);
        if (j === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = 'rgba(142,160,167,0.22)'; ctx.stroke();
    }
    for (let i = 0; i < 14; i++) {
      const p = fieldPoint((i / 14) * Math.PI * 2, i * 1.31, time);
      ctx.beginPath(); ctx.arc(p[0], p[1], i === 4 ? 3.2 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = i === 4 ? '#d4a086' : 'rgba(208,215,214,0.75)'; ctx.fill();
      if (i === 4) {
        ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(205,155,129,0.5)'; ctx.stroke();
      }
    }
    if (!reduced.matches) frameId = requestAnimationFrame(draw);
  }

  function requestDraw() { if (!frameId && inView && !document.hidden) frameId = requestAnimationFrame(draw); }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    requestDraw();
  }
  canvas.addEventListener('pointermove', (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.tx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointer.ty = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    $('#pointer-x').textContent = pointer.tx.toFixed(2);
    $('#pointer-y').textContent = (-pointer.ty).toFixed(2);
    requestDraw();
  });
  canvas.addEventListener('pointerleave', () => {
    pointer.tx = 0; pointer.ty = 0; $('#pointer-x').textContent = '0.00'; $('#pointer-y').textContent = '0.00'; requestDraw();
  });
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (!inView && frameId) { cancelAnimationFrame(frameId); frameId = 0; }
    else requestDraw();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameId) { cancelAnimationFrame(frameId); frameId = 0; }
    else requestDraw();
  });
  reduced.addEventListener('change', () => {
    if (frameId) { cancelAnimationFrame(frameId); frameId = 0; }
    requestDraw();
  });
  resize();
}
