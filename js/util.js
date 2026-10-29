import { t } from './i18n.js';
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let timer;
export function toast(msg, kind=''){
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = 'toast show ' + kind;
  clearTimeout(timer); timer = setTimeout(() => { el.className = 'toast'; }, 2400);
}
export async function copy(text){
  try { await navigator.clipboard.writeText(text); toast(t('copied'),'ok'); return; } catch {}
  try {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove();
    toast(ok ? t('copied') : t('copyFail'), ok ? 'ok' : 'bad');
  } catch { toast(t('copyFail'),'bad'); }
}
export function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
export function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
export function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
