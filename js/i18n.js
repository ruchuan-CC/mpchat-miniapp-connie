const zh = {
  hi:'嗨', title:'Connie Play', tagline:'无聊点一点，运气碰一碰',
  fortune:'今日运势', fortuneDesc:'抽一支 Connie 签',
  rps:'猜拳对决', rpsDesc:'和 Connie 比一把',
  reaction:'反应力', reactionDesc:'变绿就点！测手速',
  lucky:'幸运数字', luckyDesc:'1–9 选一个碰运气',
  back:'返回', shareScore:'发给 Connie', shareLink:'分享小程序',
  drawing:'抽签中…', draw:'抽今日运势', drawn:'今日已抽',
  luck:'运势', tip:'Connie 说',
  pick:'出拳！', you:'你', connie:'Connie', win:'你赢了！🎉', lose:'Connie 赢了', drawResult:'平局～', again:'再来一局',
  rock:'✊ 石头', paper:'✋ 布', scissors:'✌️ 剪刀',
  wait:'等绿…', go:'点！', tooSoon:'太早了！', ms:'毫秒', tryAgain:'再试一次', start:'开始',
  pickNum:'选一个数字', reveal:'揭晓', match:'命中！超级幸运 ✨', close:'差一点', miss:'没中，再抽一次',
  sent:'已发到私聊，去看看吧', sendFail:'发送失败', needStart:'请先私聊 Connie 发一条消息', rateLimited:'太频繁了，歇一分钟',
  notReady:'打开中…稍后再试', netErr:'网络异常', copied:'已复制', copyFail:'复制失败',
  outsideTitle:'请在 MPChat 里打开', outsideDesc:'Connie Play 是小程序，在 App 里打开才能玩、才能把成绩发给你。',
  openInApp:'打开 Connie',
  footer:'Connie Play · @connie_bot',
  scoreFortune:(l,tip)=>`🔮 今日运势：${l}\n💬 ${tip}\n—— from Connie Play`,
  scoreRps:(r)=>`✊ 猜拳：${r}\n—— vs Connie`,
  scoreReact:(ms)=>`⚡ 反应力：${ms} ms\n—— Connie Play`,
  scoreLucky:(n,hit)=>`🎲 幸运数字：我选 ${n}，${hit}\n—— Connie Play`,
};
const en = {
  hi:'Hey', title:'Connie Play', tagline:'Tap for luck. Play for fun.',
  fortune:"Today's fortune", fortuneDesc:'Draw Connie’s stick',
  rps:'Rock-Paper-Scissors', rpsDesc:'Face off with Connie',
  reaction:'Reaction', reactionDesc:'Tap when it turns green',
  lucky:'Lucky number', luckyDesc:'Pick 1–9 and hope',
  back:'Back', shareScore:'Send to Connie', shareLink:'Share MiniApp',
  drawing:'Drawing…', draw:'Draw today’s fortune', drawn:'Already drawn today',
  luck:'Luck', tip:'Connie says',
  pick:'Your move!', you:'You', connie:'Connie', win:'You win! 🎉', lose:'Connie wins', drawResult:'Draw~', again:'Play again',
  rock:'✊ Rock', paper:'✋ Paper', scissors:'✌️ Scissors',
  wait:'Wait for green…', go:'TAP!', tooSoon:'Too soon!', ms:'ms', tryAgain:'Try again', start:'Start',
  pickNum:'Pick a number', reveal:'Reveal', match:'Hit! Super lucky ✨', close:'So close', miss:'Miss — try again',
  sent:'Sent to your chat!', sendFail:'Failed to send', needStart:'Message Connie in private first', rateLimited:'Slow down — try in a minute',
  notReady:'Still opening… try later', netErr:'Network error', copied:'Copied', copyFail:'Copy failed',
  outsideTitle:'Open in MPChat', outsideDesc:'Connie Play is a MiniApp. Open it in MPChat to play and send scores.',
  openInApp:'Open Connie',
  footer:'Connie Play · @connie_bot',
  scoreFortune:(l,tip)=>`🔮 Today’s fortune: ${l}\n💬 ${tip}\n—— from Connie Play`,
  scoreRps:(r)=>`✊ RPS: ${r}\n—— vs Connie`,
  scoreReact:(ms)=>`⚡ Reaction: ${ms} ms\n—— Connie Play`,
  scoreLucky:(n,hit)=>`🎲 Lucky number: I picked ${n} — ${hit}\n—— Connie Play`,
};
let dict = zh;
export function setLang(code){ dict = String(code||navigator.language||'').toLowerCase().startsWith('en') ? en : zh; document.documentElement.lang = dict===en?'en':'zh-CN'; }
export function isEn(){ return dict===en; }
export const t = (k, ...args) => {
  const v = dict[k];
  if (typeof v === 'function') return v(...args);
  return v ?? k;
};
