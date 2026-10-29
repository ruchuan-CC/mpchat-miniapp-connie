export const API_BASE = window.__API_BASE__ || 'https://vuytcyhewmrcyxehbsrd.supabase.co/functions/v1/mpchat-miniapp-prod/';
async function post(path, body){
  const res = await fetch(new URL(path, API_BASE), { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  let data = {};
  try { data = await res.json(); } catch {}
  return { status: res.status, ...data };
}
export const verify = (initData) => post('api/verify', { initData });
export const sendToMe = (initData, text) => post('api/send', { initData, text });
