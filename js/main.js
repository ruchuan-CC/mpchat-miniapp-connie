import { setLang, t } from './i18n.js';
import { getLaunch, tryCall, haptic } from './sdk.js';
import * as api from './api.js';
import { toast, copy, esc } from './util.js';
import * as G from './games.js';

export const SHARE_BASE = 'https://mp.net/connie_bot/play';

const app = document.getElementById('app');
const { initData, unsafe } = getLaunch();
const user = unsafe.user || {};
setLang(user.language_code || 'zh');
tryCall('ready'); tryCall('expand');

let route = 'home';
let verified = false;
let lastScoreText = '';
let reactTimer = null, reactStart = 0, reactPhase = 'idle';

function outside(){
  return `<div class="card empty"><div class="emoji">🎮</div><h1>${t('outsideTitle')}</h1><p>${t('outsideDesc')}</p>
  <a class="btn" style="display:grid;place-items:center;text-decoration:none" href="${SHARE_BASE}">${t('openInApp')}</a></div>`;
}

function hero(){
  const name = esc(user.first_name || user.username || 'friend');
  const cls = verified ? 'ok' : '';
  return `<section class="card hero"><div class="hero-row">
    <div class="mascot">🦊</div>
    <div style="min-width:0">
      <div class="name">${t('hi')}，${name}</div>
      <div class="tag">${t('tagline')}</div>
      <div class="who"><span class="dot ${cls}"></span>${t('title')}</div>
    </div>
  </div></section>`;
}

function home(){
  return `${hero()}
  <div class="grid">
    <button class="tile" data-go="fortune"><span class="emoji">🔮</span><span class="t">${t('fortune')}</span><span class="d">${t('fortuneDesc')}</span></button>
    <button class="tile" data-go="rps"><span class="emoji">✊</span><span class="t">${t('rps')}</span><span class="d">${t('rpsDesc')}</span></button>
    <button class="tile" data-go="reaction"><span class="emoji">⚡</span><span class="t">${t('reaction')}</span><span class="d">${t('reactionDesc')}</span></button>
    <button class="tile" data-go="lucky"><span class="emoji">🎲</span><span class="t">${t('lucky')}</span><span class="d">${t('luckyDesc')}</span></button>
  </div>
  <button class="btn ghost" data-act="share-link">${t('shareLink')}</button>
  <div class="footer">${t('footer')}</div>`;
}

function top(title){
  return `<div class="topbar"><button class="back" data-go="home">← ${t('back')}</button><h2 class="h">${title}</h2></div>`;
}

function shareBar(){
  return `<div class="row-btns"><button class="btn" data-act="send-score">${t('shareScore')}</button>
  <button class="btn secondary" data-act="share-link">${t('shareLink')}</button></div>`;
}

/* —— fortune —— */
function viewFortune(){
  return `<section class="card">${top(t('fortune'))}
    <div class="stick" id="stick"><div class="scroll">签</div></div>
    <p class="hint" id="fh">${t('fortuneDesc')}</p>
    <div id="fres"></div>
    <button class="btn" id="fbtn" data-act="draw">${t('draw')}</button>
    <div id="fshare" hidden>${shareBar()}</div>
  </section>`;
}
function doDraw(){
  const stick = document.getElementById('stick');
  const btn = document.getElementById('fbtn');
  const f = G.fortuneToday();
  if (f.cached){
    showFortune(f); return;
  }
  stick.classList.add('drawing');
  btn.disabled = true; btn.textContent = t('drawing');
  setTimeout(() => {
    stick.classList.remove('drawing');
    showFortune(f);
    haptic('medium');
  }, 700);
}
function showFortune(f){
  document.getElementById('stick').innerHTML = `<div class="result-card"><div class="big">${esc(f.level)}</div><div class="sub">${esc(f.tip)}</div></div>`;
  document.getElementById('fh').textContent = t('luck');
  const btn = document.getElementById('fbtn');
  btn.disabled = true; btn.textContent = t('drawn');
  document.getElementById('fshare').hidden = false;
  lastScoreText = t('scoreFortune', f.level, f.tip);
}

/* —— rps —— */
let rpsState = null;
function viewRps(){
  return `<section class="card">${top(t('rps'))}
    <div class="hands" id="hands">
      <div class="hand"><div class="emo" id="youEmo">❔</div><div class="lab">${t('you')}</div></div>
      <div class="vs">VS</div>
      <div class="hand"><div class="emo" id="coEmo">❔</div><div class="lab">${t('connie')}</div></div>
    </div>
    <div class="outcome" id="out">${t('pick')}</div>
    <div class="choices">
      <button class="choice" data-act="rps" data-m="rock">✊</button>
      <button class="choice" data-act="rps" data-m="paper">✋</button>
      <button class="choice" data-act="rps" data-m="scissors">✌️</button>
    </div>
    <div id="rshare" hidden>${shareBar()}
      <button class="btn ghost" data-act="rps-again" style="margin-top:8px">${t('again')}</button>
    </div>
  </section>`;
}
function playRps(m){
  rpsState = G.rpsRound(m);
  document.getElementById('youEmo').textContent = G.rpsEmoji[rpsState.you];
  document.getElementById('coEmo').textContent = G.rpsEmoji[rpsState.connie];
  const map = { win:t('win'), lose:t('lose'), draw:t('drawResult') };
  document.getElementById('out').textContent = map[rpsState.result];
  document.getElementById('rshare').hidden = false;
  const label = `${G.rpsLabel(rpsState.you)} vs ${G.rpsLabel(rpsState.connie)} → ${map[rpsState.result]}`;
  lastScoreText = t('scoreRps', label);
  haptic(rpsState.result==='win'?'medium':'light');
}

/* —— reaction —— */
function viewReaction(){
  reactPhase = 'idle';
  return `<section class="card">${top(t('reaction'))}
    <p class="hint">${t('reactionDesc')}</p>
    <div class="arena wait" id="arena" data-act="arena">${t('start')}</div>
    <div id="ashare" hidden>${shareBar()}
      <button class="btn ghost" data-act="react-reset" style="margin-top:8px">${t('tryAgain')}</button>
    </div>
  </section>`;
}
function arenaTap(){
  const el = document.getElementById('arena');
  if (!el) return;
  if (reactPhase === 'idle' || reactPhase === 'done' || reactPhase === 'early'){
    clearTimeout(reactTimer);
    reactPhase = 'wait';
    el.className = 'arena wait';
    el.textContent = t('wait');
    document.getElementById('ashare').hidden = true;
    reactTimer = setTimeout(() => {
      reactPhase = 'ready';
      reactStart = performance.now();
      el.className = 'arena ready';
      el.textContent = t('go');
    }, G.reactionDelay());
    return;
  }
  if (reactPhase === 'wait'){
    clearTimeout(reactTimer);
    reactPhase = 'early';
    el.className = 'arena early';
    el.textContent = t('tooSoon');
    haptic('heavy');
    return;
  }
  if (reactPhase === 'ready'){
    const ms = Math.round(performance.now() - reactStart);
    reactPhase = 'done';
    el.className = 'arena done';
    el.innerHTML = `<div class="score">${ms}</div><div>${t('ms')}</div>`;
    lastScoreText = t('scoreReact', ms);
    document.getElementById('ashare').hidden = false;
    haptic('medium');
  }
}

/* —— lucky —— */
let luckyPick = null;
function viewLucky(){
  luckyPick = null;
  const nums = Array.from({length:9},(_,i)=>i+1).map(n=>`<button class="num" data-act="pick-num" data-n="${n}">${n}</button>`).join('');
  return `<section class="card">${top(t('lucky'))}
    <p class="hint">${t('pickNum')}</p>
    <div class="nums" id="nums">${nums}</div>
    <div class="reveal-box" id="rev"></div>
    <button class="btn" id="lbtn" data-act="reveal" disabled>${t('reveal')}</button>
    <div id="lshare" hidden>${shareBar()}</div>
  </section>`;
}
function pickNum(n, btn){
  luckyPick = n;
  document.querySelectorAll('.num').forEach(b=>b.classList.toggle('on', Number(b.dataset.n)===n));
  document.getElementById('lbtn').disabled = false;
  document.getElementById('rev').innerHTML = '';
  document.getElementById('lshare').hidden = true;
}
function doReveal(){
  if (!luckyPick) return;
  const r = G.luckyDraw(luckyPick);
  const map = { match:t('match'), close:t('close'), miss:t('miss') };
  document.getElementById('rev').innerHTML = `<div class="big">${r.draw}</div><div>${map[r.verdict]}</div>`;
  lastScoreText = t('scoreLucky', r.pick, map[r.verdict] + ` (Connie: ${r.draw})`);
  document.getElementById('lshare').hidden = false;
  haptic(r.verdict==='match'?'medium':'light');
}

/* —— send / share —— */
async function sendScore(){
  if (!initData) return toast(t('notReady'),'bad');
  if (!lastScoreText) return;
  try {
    const r = await api.sendToMe(initData, lastScoreText);
    if (r.ok){ toast(t('sent'),'ok'); haptic(); }
    else {
      const m = { BOT_CANNOT_INITIATE:'needStart', RATE_LIMITED:'rateLimited', INIT_DATA_INVALID:'notReady', INIT_DATA_EXPIRED:'notReady' }[r.error] || 'sendFail';
      toast(t(m),'bad');
    }
  } catch { toast(t('netErr'),'bad'); }
}

function render(){
  if (!initData || !unsafe.user){ app.innerHTML = outside(); return; }
  if (route === 'home') app.innerHTML = home();
  else if (route === 'fortune'){ app.innerHTML = viewFortune(); const f=G.fortuneToday(); if(f.cached) showFortune(f); }
  else if (route === 'rps') app.innerHTML = viewRps();
  else if (route === 'reaction') app.innerHTML = viewReaction();
  else if (route === 'lucky') app.innerHTML = viewLucky();
}

app.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]');
  if (go){ clearTimeout(reactTimer); route = go.dataset.go; render(); return; }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  if (act === 'draw') doDraw();
  else if (act === 'rps') playRps(el.dataset.m);
  else if (act === 'rps-again'){ route='rps'; render(); }
  else if (act === 'arena') arenaTap();
  else if (act === 'react-reset'){ route='reaction'; render(); }
  else if (act === 'pick-num') pickNum(Number(el.dataset.n), el);
  else if (act === 'reveal') doReveal();
  else if (act === 'send-score') sendScore();
  else if (act === 'share-link') copy(`${SHARE_BASE}?startapp=from_${encodeURIComponent(user.id??'')}`);
});

async function bootVerify(){
  if (!initData) return;
  try {
    const r = await api.verify(initData);
    verified = !!r.ok;
    const dot = document.querySelector('.dot');
    if (dot) dot.classList.toggle('ok', verified);
  } catch {}
}

render();
bootVerify();
