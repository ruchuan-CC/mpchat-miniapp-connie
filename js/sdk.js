// Thin wrapper around window.MpChat.WebApp. Only initData/initDataUnsafe are relied on;
// everything else is feature-detected (progressive enhancement).
export function getWebApp(){ return (window.MpChat && window.MpChat.WebApp) || null; }
export function getLaunch(){
  const w = getWebApp();
  // Dev/screenshot hook: window.__MOCK_WEBAPP__ = { initData, initDataUnsafe }
  const src = window.__MOCK_WEBAPP__ || w || {};
  return { initData: src.initData || '', unsafe: src.initDataUnsafe || {} };
}
export function tryCall(name, ...args){
  const w = getWebApp();
  try { if (w && typeof w[name] === 'function') w[name](...args); } catch {}
}
export function haptic(type='light'){
  const w = getWebApp();
  try { w?.HapticFeedback?.impactOccurred?.(type); } catch {}
}
