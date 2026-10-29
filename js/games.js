import { t, isEn } from './i18n.js';
import { pick, randInt, todayKey } from './util.js';

const FORTUNE_ZH = [
  { level:'大吉', tip:'今天适合大胆一点，Connie 给你加点运气。' },
  { level:'中吉', tip:'节奏刚好，把想做的事推进一步就好。' },
  { level:'小吉', tip:'小确幸会来敲门，记得回个消息。' },
  { level:'吉', tip:'平稳前行，一杯水、一次深呼吸就够了。' },
  { level:'末吉', tip:'先收一收，观察比行动更重要。' },
  { level:'凶转吉', tip:'开局可能坎坷，但傍晚会变晴。' },
];
const FORTUNE_EN = [
  { level:'Great luck', tip:'Go bold today — Connie’s rooting for you.' },
  { level:'Good luck', tip:'Nice pace. Push one thing forward.' },
  { level:'Small luck', tip:'A tiny joy is coming. Reply when it knocks.' },
  { level:'Steady', tip:'Keep it calm — water and a breath will do.' },
  { level:'Mixed', tip:'Watch first; act later.' },
  { level:'Cloudy→clear', tip:'Rough start, sunny evening.' },
];

export function fortuneToday(){
  const key = 'connie_fortune_' + todayKey();
  try {
    const cached = localStorage.getItem(key);
    if (cached) return { ...JSON.parse(cached), cached:true };
  } catch {}
  const list = isEn() ? FORTUNE_EN : FORTUNE_ZH;
  const f = pick(list);
  try { localStorage.setItem(key, JSON.stringify(f)); } catch {}
  return { ...f, cached:false };
}

const RPS = ['rock','paper','scissors'];
export function rpsRound(you){
  const connie = pick(RPS);
  let result = 'draw';
  if (you !== connie) {
    const win = (you==='rock'&&connie==='scissors')||(you==='paper'&&connie==='rock')||(you==='scissors'&&connie==='paper');
    result = win ? 'win' : 'lose';
  }
  return { you, connie, result };
}
export const rpsEmoji = { rock:'✊', paper:'✋', scissors:'✌️' };
export const rpsLabel = (k) => ({ rock:t('rock'), paper:t('paper'), scissors:t('scissors') }[k]);

export function reactionDelay(){ return randInt(1200, 3200); }

export function luckyDraw(pickNum){
  const n = randInt(1, 9);
  const diff = Math.abs(n - pickNum);
  let verdict = 'miss';
  if (diff === 0) verdict = 'match';
  else if (diff === 1) verdict = 'close';
  return { pick: pickNum, draw: n, verdict };
}
