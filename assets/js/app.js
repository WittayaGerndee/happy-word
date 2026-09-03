/* ============================================================
   Happy Word Adventure — app.js
   สร้างตาม Concept v2:
   - Part 10.2  ปลดล็อกเสียงบน iOS ก่อนเข้าเกม
   - Part 4.1   Free Play Mode
   - Part 4.2   No-Fail System
   - Part 4.3   จังหวะสบาย ๆ ไม่มี timer
   - Part 12.2  หน้าเดียว สลับ view ด้วย JS
   - Part 13.2  localStorage หลายโปรไฟล์
   ============================================================ */
(function () {
'use strict';

var D   = window.HWA_DATA;
var app = document.getElementById('app');
var topbar = document.getElementById('topbar');
var starCount = document.getElementById('starCount');
var starBox = document.getElementById('starBox');
var announcer = document.getElementById('announcer');

/* ============================================================
   1. STORAGE  (Concept Part 13)
   ============================================================ */

var KEY = 'hwa';
var state = null;

function blankProfile() {
  return {
    id: 'p1', name: 'หนู', avatar: '🐰',
    createdAt: Date.now(),
    stars: 0, totalStarsEarned: 0,
    unlockedAnimals: [],
    learnedWords: [],
    words: {},
    streak: { current: 0, best: 0, lastPlayDate: '' },
    totalPlaySeconds: 0
  };
}

function blankState() {
  return {
    version: 2,
    activeProfile: 'p1',
    profiles: { p1: blankProfile() },
    settings: { sound: true, music: false, language: 'th', showThai: 'auto' }
  };
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return blankState();
    var d = JSON.parse(raw);
    if (!d.version || !d.profiles) return blankState();
    return d;
  } catch (e) { return blankState(); }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

function P() { return state.profiles[state.activeProfile]; }

function wordRec(id) {
  var p = P();
  if (!p.words[id]) {
    p.words[id] = { seen: 0, correct: 0, wrong: 0, hintUsed: 0, streak: 0, lastSeen: 0 };
  }
  return p.words[id];
}

function addStars(n) {
  var p = P();
  p.stars += n; p.totalStarsEarned += n;
  starCount.textContent = p.stars;
  starBox.classList.remove('pop');
  void starBox.offsetWidth;
  starBox.classList.add('pop');
  save();
}

function markStreakToday() {
  var p = P();
  var today = new Date().toISOString().slice(0, 10);
  if (p.streak.lastPlayDate === today) return;
  var y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  p.streak.current = (p.streak.lastPlayDate === y) ? p.streak.current + 1 : 1;
  if (p.streak.current > p.streak.best) p.streak.best = p.streak.current;
  p.streak.lastPlayDate = today;
  save();
}

/* ============================================================
   2. AUDIO  (Concept Part 10)
   จุดสำคัญ: iOS Safari บล็อก autoplay
   ต้องปลดล็อกด้วยการแตะของผู้ใช้ก่อนเท่านั้น
   ============================================================ */

var audioCtx = null;
var voice = null;

function unlockAudio() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      /* เล่นเสียงเงียบ 1 เฟรม เพื่อจองสิทธิ์การเล่นเสียงบน iOS */
      var b = audioCtx.createBuffer(1, 1, 22050);
      var s = audioCtx.createBufferSource();
      s.buffer = b; s.connect(audioCtx.destination); s.start(0);
    }
    if (window.speechSynthesis) {
      /* พูดเงียบ ๆ หนึ่งครั้งในจังหวะที่ผู้ใช้แตะ เพื่อขออนุญาตใช้เสียงจากเบราว์เซอร์ */
      try { speechSynthesis.cancel(); } catch (e) {}
      var u = new SpeechSynthesisUtterance('a');
      u.volume = 0; u.rate = 10;
      speechSynthesis.speak(u);
      pickVoice();
      /* บางเบราว์เซอร์โหลดรายชื่อเสียงช้า ลองเลือกซ้ำอีกรอบ */
      setTimeout(pickVoice, 400);
      setTimeout(pickVoice, 1500);
    }
  } catch (e) {}
}

function pickVoice() {
  if (!window.speechSynthesis) return;
  var vs = speechSynthesis.getVoices();
  if (!vs.length) return;
  var prefer = ['Samantha', 'Google US English', 'Karen', 'Moira', 'Tessa', 'Alex'];
  for (var i = 0; i < prefer.length; i++) {
    var f = vs.filter(function (v) { return v.name.indexOf(prefer[i]) === 0; })[0];
    if (f) { voice = f; return; }
  }
  voice = vs.filter(function (v) { return /^en(-|_)/i.test(v.lang); })[0] || null;
}
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = pickVoice;

/* iOS พัก AudioContext เมื่อสลับแอป — ต้องปลุกใหม่ตอนกลับมา */
document.addEventListener('visibilitychange', function () {
  if (!document.hidden && audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
});

/* พูดคำภาษาอังกฤษ — ตอนนี้ใช้ TTS ของเครื่อง
   เมื่อมีไฟล์เสียงอัดจริง ให้เช็ค word.audio ก่อนตรงนี้ */
var speakTimer = null;
var keepAliveTimer = null;

/* Chrome หยุดพูดเองเมื่อพูดต่อเนื่องนานเกิน 15 วินาที
   ต้อง pause/resume เป็นระยะเพื่อกันเสียงหายกลางคัน */
function keepSpeechAlive() {
  clearInterval(keepAliveTimer);
  keepAliveTimer = setInterval(function () {
    try {
      if (speechSynthesis.speaking) { speechSynthesis.pause(); speechSynthesis.resume(); }
      else clearInterval(keepAliveTimer);
    } catch (e) { clearInterval(keepAliveTimer); }
  }, 8000);
}

function speak(text, opts) {
  if (!state.settings.sound || !window.speechSynthesis || !text) return;
  opts = opts || {};

  clearTimeout(speakTimer);
  try { speechSynthesis.cancel(); } catch (e) {}

  /* Chrome จะทิ้ง utterance ถ้าเรียก speak() ทันทีหลัง cancel()
     ต้องหน่วงสักเสี้ยววินาที เสียงถึงจะออกทุกครั้ง */
  speakTimer = setTimeout(function () {
    try {
      if (!voice) pickVoice();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = (voice && voice.lang) || 'en-US';
      u.rate = opts.rate || 0.78;
      u.pitch = opts.pitch || 1.15;
      u.volume = 1;
      if (voice) u.voice = voice;
      speechSynthesis.speak(u);
      keepSpeechAlive();
    } catch (e) {}
  }, 90);
}

/* วงแหวนกระเพื่อมรอบสิ่งที่กำลังถูกอ่านออกเสียง */
function pulse(node) {
  if (!node) return;
  node.classList.remove('speaking');
  void node.offsetWidth;
  node.classList.add('speaking');
  setTimeout(function () { node.classList.remove('speaking'); }, 900);
}

/* ป้ายคำศัพท์ลอยขึ้นตอนอ่านออกเสียง — ให้เด็กเห็นคำที่กำลังได้ยิน */
function sayLabel(node, word, stage) {
  if (!node || !stage) return;
  var lab = document.createElement('div');
  lab.className = 'say-label';
  lab.innerHTML = '<span class="sl-icon">🔊</span>' + word;
  lab.style.left = node.style.left || '50%';
  lab.style.top = node.style.top || '50%';
  stage.appendChild(lab);
  setTimeout(function () { lab.remove(); }, 1600);
}

/* เสียงเอฟเฟกต์สังเคราะห์ด้วย WebAudio — ยังไม่ต้องมีไฟล์ mp3 */
function tone(freq, dur, type, vol, delay) {
  if (!audioCtx || !state.settings.sound) return;
  try {
    var t0 = audioCtx.currentTime + (delay || 0);
    var osc = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol || 0.18, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  } catch (e) {}
}

var sfx = {
  pop:     function () { tone(720, 0.08, 'triangle', 0.14); },
  ting:    function () { tone(1180, 0.16, 'sine', 0.16); tone(1560, 0.20, 'sine', 0.10, 0.07); },
  yay:     function () { tone(660, 0.12, 'triangle', 0.16); tone(880, 0.12, 'triangle', 0.16, 0.10);
                         tone(1180, 0.26, 'triangle', 0.16, 0.20); },
  gentle:  function () { tone(430, 0.16, 'sine', 0.12); tone(370, 0.22, 'sine', 0.10, 0.13); },
  fanfare: function () { [523, 659, 784, 1047].forEach(function (f, i) {
                           tone(f, 0.28, 'triangle', 0.15, i * 0.11); }); },
  swoosh:  function () { tone(300, 0.14, 'sine', 0.07); }
};

/* ============================================================
   3. เอฟเฟกต์ภาพ  (Concept Part 9.7-9.8)
   ============================================================ */

var cv = document.getElementById('fx');
var ctx = cv.getContext('2d');
var parts = [];
var raf = null;

function sizeCanvas() {
  cv.width = window.innerWidth * (window.devicePixelRatio || 1);
  cv.height = window.innerHeight * (window.devicePixelRatio || 1);
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

var CONF = ['#FFC93C', '#FF8A7A', '#7BC96F', '#A78BFA', '#6FD3F0', '#FFD54F'];

function confetti(x, y, n) {
  var dpr = window.devicePixelRatio || 1;
  n = n || 46;
  for (var i = 0; i < n; i++) {
    parts.push({
      x: x * dpr, y: y * dpr,
      vx: (Math.random() - 0.5) * 13 * dpr,
      vy: (Math.random() * -13 - 4) * dpr,
      g: 0.42 * dpr,
      s: (5 + Math.random() * 6) * dpr,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: CONF[(Math.random() * CONF.length) | 0],
      life: 90 + Math.random() * 40
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}

function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (var i = parts.length - 1; i >= 0; i--) {
    var p = parts[i];
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    if (p.life <= 0 || p.y > cv.height + 60) { parts.splice(i, 1); continue; }
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.62);
    ctx.restore();
  }
  if (parts.length) raf = requestAnimationFrame(tick);
  else { raf = null; ctx.clearRect(0, 0, cv.width, cv.height); }
}

function confettiFrom(el, n) {
  var r = el.getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top + r.height / 2, n);
}

/* ผีเสื้อบินผ่านเป็นครั้งคราว (Concept Part 4.4 Ambient Life) */
var bLayer = document.getElementById('butterflyLayer');
function butterfly() {
  var b = document.createElement('div');
  b.className = 'butterfly';
  b.textContent = Math.random() < 0.5 ? '🦋' : '🐝';
  b.style.top = (18 + Math.random() * 52) + '%';
  bLayer.appendChild(b);
  setTimeout(function () { b.remove(); }, 14200);
}
setInterval(function () { if (Math.random() < 0.55) butterfly(); }, 17000);
setTimeout(butterfly, 3000);

/* โหมดกลางคืน (Concept Part 4.5) */
(function () {
  var h = new Date().getHours();
  if (h >= 19 || h < 6) document.body.classList.add('night');
})();

/* ============================================================
   3.5 เต็มหน้าจอ (สำคัญมากบนแท็บเล็ต — กันเด็กกดหลุดออกจากเกม)
   ============================================================ */

var docEl = document.documentElement;

function fsElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function fsSupported() {
  return !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen);
}

function enterFullscreen() {
  try {
    var fn = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
    if (fn) {
      var r = fn.call(docEl);
      if (r && r.catch) r.catch(function () {});
    }
  } catch (e) {}
}

function exitFullscreen() {
  try {
    var fn = document.exitFullscreen || document.webkitExitFullscreen;
    if (fn) {
      var r = fn.call(document);
      if (r && r.catch) r.catch(function () {});
    }
  } catch (e) {}
}

function toggleFullscreen() {
  if (fsElement()) exitFullscreen(); else enterFullscreen();
}

function syncFullscreenBtn() {
  var b = document.getElementById('btnFull');
  if (!b) return;
  var on = !!fsElement();
  document.body.classList.toggle('is-fullscreen', on);
  b.textContent = on ? '⤡' : '⛶';
  b.setAttribute('aria-label', on ? 'ออกจากเต็มหน้าจอ' : 'เต็มหน้าจอ');
}

['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
  document.addEventListener(ev, syncFullscreenBtn);
});

/* ============================================================
   4. BUNNY  (Concept Part 4.6 + ภาคผนวก B.2)
   ============================================================ */

var lastLine = {};
function bunnySay(mood) {
  var lines = D.bunnyLines[mood] || [''];
  var line, guard = 0;
  do { line = lines[(Math.random() * lines.length) | 0]; guard++; }
  while (lines.length > 1 && line === lastLine[mood] && guard < 12);
  lastLine[mood] = line;
  return line;
}

function setBubble(text) {
  var b = document.querySelector('.bubble');
  if (!b) return;
  b.textContent = text;
  b.style.animation = 'none';
  void b.offsetWidth;
  b.style.animation = '';
}

function bunnyEmote(cls) {
  var b = document.querySelector('.bunny');
  if (!b) return;
  b.className = 'bunny ' + (cls || '');
  if (cls === 'excited') setTimeout(function () { b.className = 'bunny'; }, 1300);
}

/* ============================================================
   5. UTIL
   ============================================================ */

function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = (Math.random() * (i + 1)) | 0;
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function announce(t) { announcer.textContent = t; }

/* แสดงคำไทยตามความคุ้นเคย (Concept Part 5.3) */
function thaiFor(w) {
  if (state.settings.showThai === 'never') return '';
  if (state.settings.showThai === 'always') return w.thai;
  return wordRec(w.id).seen <= 4 ? w.thai : '';
}

/* Smart Review — น้ำหนักการสุ่ม (Concept Part 8.3) */
function getWeight(rec, now) {
  var w = 1 + rec.wrong * 2 + rec.hintUsed * 1.5 - rec.correct * 0.8 - rec.streak * 0.5;
  if (rec.lastSeen) w += Math.min(((now - rec.lastSeen) / 86400000) * 0.6, 3);
  if (rec.seen === 0) w = 5;
  return Math.min(Math.max(w, 0.3), 8);
}

function pickWords(n, exclude) {
  var now = Date.now();
  var pool = D.words.filter(function (w) { return !exclude || exclude.indexOf(w.id) < 0; });
  var picked = [];
  while (picked.length < n && pool.length) {
    var total = 0;
    var weights = pool.map(function (w) {
      var x = getWeight(wordRec(w.id), now); total += x; return x;
    });
    var r = Math.random() * total, idx = 0;
    for (var i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) { idx = i; break; } }
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}

/* ============================================================
   6. ROUTER  (Concept Part 12.2)
   ============================================================ */

var timers = [];
function clearTimers() { timers.forEach(clearTimeout); timers = []; }
function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

var Screens = {};
var current = '';

function go(name, params, skipPush) {
  clearTimers();
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (current) sfx.swoosh();
  app.classList.add('leaving');
  setTimeout(function () {
    current = name;
    app.innerHTML = '';
    var stale = document.getElementById('fpBar');
    if (stale) stale.remove();
    topbar.hidden = (name === 'splash');
    document.getElementById('btnHome').style.visibility =
      (name === 'home' || name === 'splash') ? 'hidden' : 'visible';
    Screens[name](params || {});
    app.classList.remove('leaving');
    if (!skipPush) {
      try { history.pushState({ n: name, p: params || {} }, '', '#' + name); } catch (e) {}
    }
  }, 200);
}

window.addEventListener('popstate', function (e) {
  if (e.state && Screens[e.state.n]) go(e.state.n, e.state.p, true);
  else go('home', {}, true);
});

function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function btn(label, cls, onClick) {
  var b = el('button', 'btn ' + (cls || ''), label);
  b.addEventListener('click', function () { sfx.pop(); onClick(); });
  return b;
}

/* ============================================================
   7. หน้าจอ: SPLASH — ปลดล็อกเสียง (ต้องมาก่อนทุกอย่าง)
   ============================================================ */

Screens.splash = function () {
  var wrap = el('div');
  wrap.appendChild(el('div', 'bunny', '🐰'));
  wrap.appendChild(el('h1', 'title', 'Happy Word Adventure'));
  wrap.appendChild(el('p', 'subtitle', 'น้องคำดี ตะลุยโลกภาษา'));

  var b = el('button', 'btn big', '👆 แตะเพื่อเริ่ม');
  b.addEventListener('click', function () {
    unlockAudio();                    /* ต้องอยู่ใน user gesture เท่านั้น */
    /* แท็บเล็ต/มือถือ: เข้าเต็มจอให้เลย เด็กจะได้ไม่กดโดนแถบเบราว์เซอร์หลุดออกไป */
    if (fsSupported() && window.matchMedia('(pointer: coarse)').matches) enterFullscreen();
    markStreakToday();
    later(function () { sfx.pop(); }, 30);
    go('home');   /* เห็นเมนูก่อนเสมอ — ปุ่มเล่นเพลินอยู่บนสุดและใหญ่ที่สุดอยู่แล้ว */
  });
  wrap.appendChild(b);
  wrap.appendChild(el('p', 'splash-hint', '🔊 อย่าลืมเปิดเสียงนะ'));
  app.appendChild(wrap);
};

/* ============================================================
   8. หน้าจอ: HOME
   ============================================================ */

Screens.home = function () {
  var wrap = el('div');
  wrap.appendChild(el('div', 'bunny', '🐰'));
  wrap.appendChild(el('div', 'bubble', bunnySay('greet')));
  wrap.appendChild(el('h1', 'title', 'Happy Word Adventure'));

  var col = el('div', 'btn-col');
  col.appendChild(btn('🎪 เล่นเพลิน', 'big', function () { go('freeplay'); }));
  col.appendChild(btn('🎯 เลือกเกม', 'accent', function () { go('games'); }));
  col.appendChild(btn('🏡 สวนสัตว์ของหนู', 'calm', function () { go('zoo'); }));
  wrap.appendChild(col);
  app.appendChild(wrap);

  later(function () { speak('Hello! Let us learn animals.', { rate: 0.85 }); }, 400);
};

/* ============================================================
   9. หน้าจอ: FREE PLAY — เล่นเพลิน (Concept Part 4.1)
   ไม่มีคำถาม ไม่มีถูกผิด ไม่มีดาว
   ============================================================ */

Screens.freeplay = function () {
  var wrap = el('div');
  wrap.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column';
  wrap.appendChild(el('div', 'bubble', bunnySay('freeplay')));

  var stage = el('div', 'freeplay-stage');
  wrap.appendChild(stage);
  app.appendChild(wrap);

  var bonus = P().unlockedAnimals
    .map(function (id) {
      return D.bonusAnimals.filter(function (b) { return b.id === id; })[0];
    })
    .filter(Boolean);
  var list = shuffle(D.words).concat(bonus);

  var cols = window.innerWidth < 560 ? 3 : 4;
  var rows = Math.ceil(list.length / cols);
  var rowGap = rows > 1 ? (72 / (rows - 1)) : 0;   /* เว้นที่ด้านล่างไว้ให้ปุ่มเล่นเกม */
  var taps = 0, invited = false;

  list.forEach(function (w, i) {
    var b = el('button', 'animal', w.emoji);
    b.setAttribute('aria-label', w.english + ' ' + w.thai);
    var r = (i / cols) | 0, c = i % cols;
    b.style.left = (5 + c * (86 / cols) + (Math.random() * 6 - 3)) + '%';
    b.style.top  = (4 + r * rowGap + (Math.random() * 5 - 2.5)) + '%';
    b.style.animationDelay = (Math.random() * 3) + 's';

    b.addEventListener('click', function () {
      sfx.pop();
      speak(w.english);            /* อ่านออกเสียงชื่อสัตว์เป็นภาษาอังกฤษ */
      sayLabel(b, w.english, stage); /* แสดงคำที่กำลังอ่านให้เห็นด้วย */

      var moves = ['jump', 'wiggle', 'spin'];
      var m = moves[(Math.random() * moves.length) | 0];
      b.classList.remove('jump', 'wiggle', 'spin');
      void b.offsetWidth;
      b.classList.add(m);
      later(function () { b.classList.remove(m); }, 900);

      var h = el('div', 'heart', ['💛', '💚', '💙', '💜', '✨'][(Math.random() * 5) | 0]);
      h.style.left = b.style.left;
      h.style.top = b.style.top;
      stage.appendChild(h);
      setTimeout(function () { h.remove(); }, 1200);

      taps++;
      if (taps === 8 && !invited) {
        invited = true;
        setBubble(bunnySay('invite'));
      }
    });

    /* แตะค้าง → พูดประโยคเต็ม */
    var hold = null;
    b.addEventListener('pointerdown', function () {
      hold = setTimeout(function () { speak(w.sentence, { rate: 0.72 }); }, 650);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
      b.addEventListener(ev, function () { clearTimeout(hold); });
    });

    stage.appendChild(b);
  });

  /* แตะพื้นหลัง → ผีเสื้อบินออกมา */
  stage.addEventListener('click', function (e) {
    if (e.target === stage) { butterfly(); sfx.pop(); }
  });

  var bar = el('div', 'hint-bar');
  bar.id = 'fpBar';
  bar.appendChild(btn('🎮 เล่นเกม', 'accent', function () { go('learn'); }));
  document.body.appendChild(bar);
};

/* ============================================================
   10. หน้าจอ: LEARN CARD  (Concept Part 6.1)
   ============================================================ */

Screens.learn = function (params) {
  var words = params.words || pickWords(3);
  var i = params.i || 0;
  var w = words[i];

  var rec = wordRec(w.id);
  rec.seen++; rec.lastSeen = Date.now();
  if (P().learnedWords.indexOf(w.id) < 0) P().learnedWords.push(w.id);
  save();

  var card = el('div', 'card');
  var art = el('div', 'emoji-art', w.emoji);
  art.setAttribute('role', 'img');
  art.setAttribute('aria-label', w.english);
  art.addEventListener('click', function () {
    sfx.pop();
    speak(w.english);            /* อ่านออกเสียงชื่อสัตว์ */
    pulse(art);
    art.style.animation = 'none';
    void art.offsetWidth;
    art.style.animation = 'aJump .55s var(--ease-bounce)';
    later(function () { art.style.animation = 'bob 3.4s ease-in-out infinite'; }, 600);
  });
  card.appendChild(art);
  card.appendChild(el('h2', 'word-en', w.english));
  card.appendChild(el('p', 'word-th', thaiFor(w)));

  var row = el('div', 'row');

  if (i > 0) {
    var back = el('button', 'icon-btn', '←');
    back.setAttribute('aria-label', 'ย้อนกลับ');
    back.addEventListener('click', function () {
      sfx.pop(); go('learn', { words: words, i: i - 1 });
    });
    row.appendChild(back);
  }

  var listen = el('button', 'icon-btn', '🔊');
  listen.setAttribute('aria-label', 'ฟังอีกครั้ง');
  listen.addEventListener('click', function () { sfx.pop(); speak(w.english); });
  row.appendChild(listen);

  var isLast = i === words.length - 1;
  row.appendChild(btn(isLast ? '🎮 เล่นเกม!' : 'ถัดไป →', isLast ? 'accent' : '', function () {
    if (isLast) go('quiz', { words: words });
    else go('learn', { words: words, i: i + 1 });
  }));
  card.appendChild(row);

  var dots = el('div', 'dots');
  words.forEach(function (_, k) { dots.appendChild(el('div', 'dot' + (k === i ? ' on' : ''))); });
  card.appendChild(dots);

  app.appendChild(card);
  announce(w.english + ' ' + w.thai);
  later(function () { speak(w.english); }, 420);
};

/* ============================================================
   11. หน้าจอ: QUIZ — No-Fail System (Concept Part 4.2)
   ตอบผิดได้ไม่จำกัด ระบบค่อย ๆ ช่วยจนถูก และได้ดาวเท่ากันเสมอ
   ============================================================ */

Screens.quiz = function (params) {
  var words = params.words || pickWords(3);
  var qIndex = params.q || 0;
  var earned = params.earned || 0;
  var TOTAL = 5;

  if (qIndex >= TOTAL) { go('result', { words: words, earned: earned }); return; }

  var w = (qIndex < words.length) ? words[qIndex] : pickWords(1)[0];
  var rec = wordRec(w.id);
  rec.lastSeen = Date.now();

  /* ตัวลวงต้องเป็นคำที่เด็กเคยเรียนแล้วก่อน (ภาคผนวก B.4) */
  var learned = P().learnedWords;
  var pool = D.words.filter(function (x) { return x.id !== w.id && learned.indexOf(x.id) >= 0; });
  var fallback = D.words.filter(function (x) { return x.id !== w.id && learned.indexOf(x.id) < 0; });
  var dis = shuffle(pool).slice(0, 2);
  fallback = shuffle(fallback);
  while (dis.length < 2 && fallback.length) dis.push(fallback.pop());
  var choices = shuffle([w].concat(dis));

  var wrap = el('div');
  wrap.appendChild(el('div', 'bunny', '🐰'));
  wrap.appendChild(el('div', 'bubble', (w.thai || w.english) + 'อยู่ไหนนะ?'));

  var q = el('div', 'row');
  var listen = el('button', 'icon-btn', '🔊');
  listen.setAttribute('aria-label', 'ฟังอีกครั้ง');
  listen.addEventListener('click', function () { sfx.pop(); speak(w.english); });
  q.appendChild(listen);
  q.appendChild(el('div', 'question', w.english));
  wrap.appendChild(q);

  var row = el('div', 'choices');
  var attempts = 0;
  var done = false;

  choices.forEach(function (c) {
    var b = el('button', 'choice',
      '<span class="ce">' + c.emoji + '</span><span class="cw">' + c.english + '</span>');
    b.setAttribute('aria-label', c.english);
    b.dataset.id = c.id;
    b.addEventListener('click', function () { answer(c, b); });
    row.appendChild(b);
  });
  wrap.appendChild(row);

  var dots = el('div', 'dots');
  for (var k = 0; k < TOTAL; k++) dots.appendChild(el('div', 'dot' + (k === qIndex ? ' on' : '')));
  wrap.appendChild(dots);

  app.appendChild(wrap);
  later(function () { speak(w.english); }, 350);

  /* จังหวะสบาย ๆ — ไม่มี timer มีแค่การใบ้เบา ๆ (Concept Part 4.3) */
  later(function () { if (!done) { setBubble(bunnySay('idle')); speak(w.english); } }, 20000);
  later(function () { if (!done) bunnyEmote('sleepy'); }, 45000);

  function answer(choice, node) {
    if (done) return;

    if (choice.id === w.id) {
      /* ถูก — ได้ดาวเสมอ ไม่ว่าจะพยายามกี่ครั้ง */
      done = true;
      node.classList.add('correct');
      rec.correct++;
      if (attempts === 0) rec.streak++; else rec.streak = 0;
      save();

      sfx.yay();
      confettiFrom(node);
      bunnyEmote('excited');
      setBubble(bunnySay('correct'));
      speak(w.english);
      addStars(1);
      later(function () { sfx.ting(); }, 220);
      announce('ถูกต้อง ได้ดาวหนึ่งดวง');

      later(function () {
        go('quiz', { words: words, q: qIndex + 1, earned: earned + 1 });
      }, 1700);
      return;
    }

    /* ยังไม่ถูก — ค่อย ๆ ช่วย ไม่มีการลงโทษ
       และถือโอกาสสอนว่าตัวที่แตะไปคือตัวอะไร */
    attempts++;
    rec.wrong++;
    sfx.gentle();
    speak(choice.english);
    node.classList.remove('shake');
    void node.offsetWidth;
    node.classList.add('shake');

    if (attempts === 1) {
      setBubble(bunnySay('encourage'));
    } else if (attempts === 2) {
      rec.hintUsed++;
      setBubble(bunnySay('hint'));
      var wrongs = Array.prototype.filter.call(row.children, function (n) {
        return n.dataset.id !== w.id && !n.classList.contains('fade');
      });
      if (wrongs.length) wrongs[0].classList.add('fade');
    } else {
      rec.hintUsed++;
      setBubble(bunnySay('showAnswer'));
      Array.prototype.forEach.call(row.children, function (n) {
        if (n.dataset.id === w.id) n.classList.add('point');
        else n.classList.add('fade');
      });
    }
    later(function () { speak(w.english); }, 520);
    save();
  }
};

/* ============================================================
   12. หน้าจอ: RESULT
   ============================================================ */

Screens.result = function (params) {
  var earned = params.earned || 0;
  var words = params.words || [];

  addStars(2);   /* โบนัสเล่นครบรอบ */

  var newAnimal = null;
  for (var i = 0; i < words.length; i++) {
    if (P().unlockedAnimals.indexOf(words[i].id) < 0) {
      P().unlockedAnimals.push(words[i].id);
      newAnimal = words[i];
      break;
    }
  }
  save();

  var wrap = el('div');
  wrap.appendChild(el('div', 'bunny excited', '🐰'));
  wrap.appendChild(el('h2', 'title', '🎉 เก่งมาก!'));

  var st = el('div', 'result-stars');
  wrap.appendChild(st);
  wrap.appendChild(el('div', 'bubble', bunnySay('finish')));

  if (newAnimal) {
    var na = el('div', 'new-animal');
    na.appendChild(el('span', 'big', newAnimal.emoji));
    na.appendChild(el('div', 'word-en', newAnimal.english));
    na.appendChild(el('div', 'word-th', 'เข้าสวนสัตว์แล้ว!'));
    wrap.appendChild(na);
  }

  var col = el('div', 'btn-col');
  col.appendChild(btn('🏡 ไปดูสวนสัตว์', 'accent', function () { go('zoo'); }));
  col.appendChild(btn('🃏 จับคู่ภาพสัตว์', '', function () { go('memory'); }));
  col.appendChild(btn('🎪 เล่นเพลิน', 'calm', function () { go('freeplay'); }));
  wrap.appendChild(col);
  app.appendChild(wrap);

  /* ดาวขึ้นทีละดวง — สนุกกว่าขึ้นพร้อมกันหมด */
  var total = earned + 2;
  for (var s = 0; s < total; s++) {
    (function (n) {
      later(function () {
        st.appendChild(el('span', '', '⭐'));
        sfx.ting();
      }, 300 + n * 240);
    })(s);
  }
  later(function () {
    sfx.fanfare();
    confetti(window.innerWidth / 2, window.innerHeight * 0.34, 70);
    speak('Great job!', { rate: 0.9 });
  }, 500 + total * 240);

  announce('ได้ดาว ' + total + ' ดวง');
};

/* ============================================================
   12.5 หน้าจอ: จับคู่ภาพสัตว์ (Memory Match)
   ------------------------------------------------------------
   - ไม่มีเวลาจับ ไม่มีจำนวนครั้งจำกัด เปิดผิดกี่ครั้งก็ได้
   - เปิดการ์ดทุกใบจะอ่านออกเสียงชื่อสัตว์เป็นภาษาอังกฤษ
   - เริ่มที่ 3 คู่ แล้วค่อย ๆ เพิ่มเป็น 4, 5, 6 คู่
   ============================================================ */

Screens.memory = function (params) {
  var pairs = Math.min(Math.max(params.pairs || 3, 2), 6);
  var picked = pickWords(pairs);

  /* สร้างสำรับ: สัตว์ตัวละ 2 ใบ แล้วสับ */
  var deck = [];
  picked.forEach(function (w) {
    deck.push({ w: w, key: w.id + '-a' });
    deck.push({ w: w, key: w.id + '-b' });
  });
  deck = shuffle(deck);

  var wrap = el('div');
  wrap.appendChild(el('div', 'bunny', '🐰'));
  wrap.appendChild(el('div', 'bubble', 'หาสัตว์ที่เหมือนกันนะ!'));

  var grid = el('div', 'memory-grid ' + (pairs <= 3 ? 'cols-3' : 'cols-4'));
  wrap.appendChild(grid);

  var prog = el('div', 'memory-progress');
  for (var i = 0; i < pairs; i++) prog.appendChild(el('span', 'mp-heart', '💛'));
  wrap.appendChild(prog);

  app.appendChild(wrap);

  var first = null;
  var lock = false;
  var found = 0;

  deck.forEach(function (card) {
    var b = el('button', 'mcard',
      '<span class="mc-inner">' +
        '<span class="mc-face mc-back">🐾</span>' +
        '<span class="mc-face mc-front">' + card.w.emoji + '</span>' +
      '</span>');
    b.setAttribute('aria-label', 'การ์ดคว่ำ');
    b.dataset.id = card.w.id;
    b.card = card;
    b.addEventListener('click', function () { flip(b); });
    grid.appendChild(b);
  });

  function flip(b) {
    if (lock) return;
    if (b.classList.contains('open') || b.classList.contains('matched')) {
      /* แตะการ์ดที่เปิดอยู่แล้ว = อยากฟังชื่อซ้ำ ให้ฟังได้เลย */
      sfx.pop();
      speak(b.card.w.english);
      return;
    }

    sfx.pop();
    b.classList.add('open');
    b.setAttribute('aria-label', b.card.w.english);
    speak(b.card.w.english);          /* อ่านออกเสียงทุกครั้งที่เปิดการ์ด */

    if (!first) { first = b; return; }

    if (first.dataset.id === b.dataset.id) {
      /* เจอคู่แล้ว */
      lock = true;
      var a = first;
      first = null;
      later(function () {
        a.classList.add('matched');
        b.classList.add('matched');
        a.classList.remove('open');
        b.classList.remove('open');
        sfx.yay();
        confettiFrom(b, 28);
        bunnyEmote('excited');
        setBubble('เจอแล้ว! ' + b.card.w.english);
        addStars(1);
        later(function () { sfx.ting(); }, 200);

        found++;
        var hearts = prog.querySelectorAll('.mp-heart');
        if (hearts[found - 1]) hearts[found - 1].classList.add('on');
        announce('เจอคู่ ' + b.card.w.english);

        lock = false;
        if (found === pairs) later(finish, 900);
      }, 620);
      return;
    }

    /* ยังไม่ใช่คู่ — คว่ำกลับเบา ๆ ไม่มีการลงโทษ ไม่มีเสียงลบ */
    lock = true;
    var a2 = first;
    first = null;
    later(function () {
      a2.classList.add('nomatch');
      b.classList.add('nomatch');
      sfx.gentle();
      setBubble('ยังไม่ใช่คู่ ลองใหม่นะ');
    }, 700);
    later(function () {
      [a2, b].forEach(function (n) {
        n.classList.remove('open', 'nomatch');
        n.setAttribute('aria-label', 'การ์ดคว่ำ');
      });
      lock = false;
    }, 1500);
  }

  function finish() {
    addStars(2);
    sfx.fanfare();
    confetti(window.innerWidth / 2, window.innerHeight * 0.35, 70);
    speak('Great job!', { rate: 0.9 });

    /* ปลดล็อกสัตว์ที่เจอในเกมนี้เข้าสวนสัตว์ */
    picked.forEach(function (w) {
      if (P().unlockedAnimals.indexOf(w.id) < 0) P().unlockedAnimals.push(w.id);
    });
    save();

    var box = el('div', 'new-animal');
    box.appendChild(el('div', 'title', '🎉 เก่งมาก!'));
    box.appendChild(el('div', 'word-th', 'จับคู่ครบทุกคู่แล้ว'));
    wrap.appendChild(box);

    var col = el('div', 'btn-col');
    col.style.marginTop = '16px';
    col.appendChild(btn(
      pairs < 6 ? '➕ ลองแบบยากขึ้น' : '🔁 เล่นอีกรอบ',
      'accent',
      function () { go('memory', { pairs: pairs < 6 ? pairs + 1 : pairs }); }
    ));
    col.appendChild(btn('🔁 เล่นระดับเดิมอีก', '', function () { go('memory', { pairs: pairs }); }));
    col.appendChild(btn('🏡 ไปดูสวนสัตว์', 'calm', function () { go('zoo'); }));
    wrap.appendChild(col);

    grid.style.opacity = '.55';
  }
};

/* ============================================================
   13. หน้าจอ: MY ZOO
   ============================================================ */

Screens.zoo = function () {
  var p = P();
  var wrap = el('div');
  wrap.appendChild(el('h2', 'title', '🏡 สวนสัตว์ของหนู'));
  wrap.appendChild(el('p', 'subtitle',
    'มีเพื่อนแล้ว ' + p.unlockedAnimals.length + ' ตัว จาก ' + D.words.length));

  var grid = el('div', 'zoo-grid');
  D.words.forEach(function (w) {
    var has = p.unlockedAnimals.indexOf(w.id) >= 0;
    var c = el('button', 'zoo-cell' + (has ? '' : ' locked'),
      '<span class="ze">' + (has ? w.emoji : '🔒') + '</span>' +
      '<span class="zw">' + (has ? w.english : '???') + '</span>');
    c.setAttribute('aria-label', has ? w.english + ' ' + w.thai : 'ยังไม่ปลดล็อก');
    c.addEventListener('click', function () {
      sfx.pop();
      if (!has) return;
      speak(w.english);            /* อ่านออกเสียงชื่อสัตว์ */
      var e = c.querySelector('.ze');
      e.style.animation = 'none';
      void e.offsetWidth;
      e.style.animation = 'aJump .55s var(--ease-bounce)';
    });
    grid.appendChild(c);
  });
  wrap.appendChild(grid);

  var col = el('div', 'btn-col');
  col.style.marginTop = '18px';
  col.appendChild(btn('🎮 เล่นต่อ', 'accent', function () { go('learn'); }));
  wrap.appendChild(col);
  app.appendChild(wrap);
};

/* ============================================================
   14. เริ่มระบบ
   ============================================================ */

state = load();
starCount.textContent = P().stars;

document.getElementById('btnHome').addEventListener('click', function () {
  sfx.pop();
  go('home');
});

var fullBtn = document.getElementById('btnFull');
if (fsSupported()) {
  fullBtn.hidden = false;
  fullBtn.addEventListener('click', function () { sfx.pop(); toggleFullscreen(); });
  syncFullscreenBtn();
}

document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });
window.addEventListener('beforeunload', save);

/* ป้ายเวอร์ชันเล็ก ๆ มุมล่างขวา — ไว้เช็คว่าเบราว์เซอร์โหลดไฟล์ใหม่แล้วจริงไหม */
var vTag = document.createElement('div');
vTag.className = 'version-tag';
vTag.textContent = 'v5';
document.body.appendChild(vTag);

/* ============================================================
   15. เปิด API ให้ไฟล์เกมเสริมใน assets/js/games/*.js เรียกใช้
   ------------------------------------------------------------
   ทำไมต้องมี? เพราะ app.js เป็น IIFE ตัวช่วยข้างในจึงเป็น private
   การส่งออกเป็นชุดเดียวทำให้เพิ่มเกมใหม่ได้โดยไม่ต้องแตะ app.js อีก
   ============================================================ */
window.HWA = {
  el: el, btn: btn, go: go, Screens: Screens, app: app,
  speak: speak, pulse: pulse, sayLabel: sayLabel, sfx: sfx, tone: tone,
  confetti: confetti, confettiFrom: confettiFrom, butterfly: butterfly,
  bunnySay: bunnySay, setBubble: setBubble, bunnyEmote: bunnyEmote,
  shuffle: shuffle, later: later, clearTimers: clearTimers, announce: announce,
  addStars: addStars, save: save, profile: P, wordRec: wordRec,
  pickWords: pickWords, thaiFor: thaiFor, data: D,
  rnd: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
  /* กล่องสรุปท้ายเกม — ทุกเกมใช้หน้าตาเดียวกัน เด็กจะได้คุ้นเคย */
  finishBox: function (wrap, opts) {
    opts = opts || {};
    sfx.fanfare();
    confetti(window.innerWidth / 2, window.innerHeight * 0.35, 70);
    speak(opts.say || 'Great job!', { rate: 0.9 });
    var box = el('div', 'new-animal');
    box.appendChild(el('div', 'title', '🎉 ' + (opts.title || 'เก่งมาก!')));
    if (opts.sub) box.appendChild(el('div', 'word-th', opts.sub));
    wrap.appendChild(box);
    var col = el('div', 'btn-col');
    col.style.marginTop = '16px';
    if (opts.next) col.appendChild(btn(opts.nextLabel || '➕ เล่นต่อ', 'accent', opts.next));
    if (opts.again) col.appendChild(btn('🔁 เล่นอีกรอบ', '', opts.again));
    col.appendChild(btn('🎯 เลือกเกมอื่น', 'calm', function () { go('games'); }));
    wrap.appendChild(col);
  }
};

go('splash', {}, true);

})();
