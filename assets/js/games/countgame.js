/* ============================================================
   🔢 นับผลไม้ — นับของแล้วเลือกตัวเลข
   ทักษะ: การนับ 1–10
   จุดสำคัญ: แตะผลไม้ทีละชิ้นได้ ระบบจะนับ one, two, three... ให้ฟัง
   (เด็กวัยนี้เรียนการนับด้วย "การชี้ทีละชิ้น" ไม่ใช่การมองรวม ๆ)
   ============================================================ */
(function () {
'use strict';
var H = window.HWA, PK = window.HWA_PACKS;
var ROUNDS = 5;

H.Screens.countgame = function (params) {
  var el = H.el;
  var round = params.round || 0;
  if (round >= ROUNDS) { finish(); return; }

  /* จำนวนค่อย ๆ ยากขึ้น: 1–3, 2–4, 3–6, 4–8, 5–10 */
  var lo = [1, 2, 3, 4, 5][round], hi = [3, 4, 6, 8, 10][round];
  var n = H.rnd(lo, hi);
  var fruit = window.HWA_pick(1, ['fruits'])[0];
  var numWord = PK.numbers[n - 1];

  var wrap = el('div', 'g-wrap');
  wrap.appendChild(el('div', 'bunny', '🐰'));

  var prompt = el('div', 'g-prompt');
  prompt.appendChild(el('span', '', 'มี' + fruit.thai + 'กี่ลูก?'));
  var say = el('button', 'g-say', '🔊');
  say.setAttribute('aria-label', 'ฟังอีกครั้ง');
  say.addEventListener('click', function () {
    H.sfx.pop(); H.speak('How many ' + fruit.english + '?', { rate: 0.75 });
  });
  prompt.appendChild(say);
  wrap.appendChild(prompt);

  /* ---- สนามของที่ต้องนับ ---- */
  var field = el('div', 'count-field');
  var counted = 0;
  for (var i = 0; i < n; i++) {
    (function () {
      var it = el('button', 'count-item', fruit.emoji);
      it.style.border = 'none';
      it.style.background = 'none';
      it.style.animationDelay = (Math.random() * 3) + 's';
      it.setAttribute('aria-label', fruit.english);
      it.addEventListener('click', function () {
        if (it.dataset.done === '1') { H.sfx.pop(); return; }
        it.dataset.done = '1';
        counted++;
        H.sfx.pop();
        it.classList.add('counted');
        it.style.filter = 'drop-shadow(0 0 0 #fff) saturate(1.3)';
        it.style.opacity = '.75';
        H.speak(PK.numbers[Math.min(counted, 10) - 1].english, { rate: 0.85 });
      });
      field.appendChild(it);
    })();
  }
  wrap.appendChild(field);

  /* ---- ตัวเลือกตัวเลข ---- */
  var pool = [];
  for (var k = Math.max(1, n - 3); k <= Math.min(10, n + 3); k++) if (k !== n) pool.push(k);
  var choices = H.shuffle([n].concat(H.shuffle(pool).slice(0, 2)));

  var row = el('div', 'g-row');
  var tries = 0, done = false;
  choices.forEach(function (c) {
    var b = el('button', 'g-tile num-tile', String(c));
    b.setAttribute('aria-label', String(c));
    b.dataset.n = c;
    b.addEventListener('click', function () { pick(c, b); });
    row.appendChild(b);
  });
  wrap.appendChild(row);

  var dots = el('div', 'g-dots');
  for (var d = 0; d < ROUNDS; d++) {
    dots.appendChild(el('div', 'd' + (d < round ? ' done' : d === round ? ' on' : '')));
  }
  wrap.appendChild(dots);

  H.app.appendChild(wrap);
  H.announce('นับ ' + fruit.thai + ' มีกี่ลูก');
  H.later(function () { H.speak('How many ' + fruit.english + '?', { rate: 0.75 }); }, 380);

  function pick(c, node) {
    if (done) return;

    if (c === n) {
      done = true;
      node.classList.add('ok');
      H.sfx.yay();
      H.confettiFrom(node);
      H.bunnyEmote('excited');
      H.setBubble(H.bunnySay('correct'));
      H.speak(numWord.english + '. ' + n + ' ' + fruit.english + '.', { rate: 0.75 });
      H.addStars(1);
      H.later(function () { H.sfx.ting(); }, 220);
      H.later(function () { H.go('countgame', { round: round + 1 }); }, 2100);
      return;
    }

    tries++;
    H.sfx.gentle();
    node.classList.remove('soft'); void node.offsetWidth; node.classList.add('soft');

    if (tries === 1) {
      H.setBubble('ลองแตะทีละลูกแล้วนับดูนะ');
      countAloud();
    } else if (tries === 2) {
      H.setBubble(H.bunnySay('hint'));
      var wrongs = Array.prototype.filter.call(row.children, function (x) {
        return +x.dataset.n !== n && !x.classList.contains('gone');
      });
      if (wrongs.length) wrongs[0].classList.add('gone');
      countAloud();
    } else {
      H.setBubble(H.bunnySay('showAnswer'));
      Array.prototype.forEach.call(row.children, function (x) {
        if (+x.dataset.n === n) x.classList.add('point'); else x.classList.add('gone');
      });
      countAloud();
    }
  }

  /* Bunny นับให้ฟังทีละลูก พร้อมเด้งของตามจังหวะ */
  function countAloud() {
    var items = field.children;
    for (var i = 0; i < items.length; i++) {
      (function (idx) {
        H.later(function () {
          var it = items[idx];
          it.classList.remove('counted'); void it.offsetWidth; it.classList.add('counted');
          H.sfx.pop();
          H.speak(PK.numbers[idx].english, { rate: 0.9 });
        }, 500 + idx * 700);
      })(i);
    }
  }

  function finish() {
    var w2 = el('div', 'g-wrap');
    w2.appendChild(el('div', 'bunny excited', '🐰'));
    H.app.appendChild(w2);
    H.addStars(2);
    H.finishBox(w2, {
      title: 'นับเก่งมาก!',
      sub: 'นับครบ ' + ROUNDS + ' ข้อแล้ว',
      again: function () { H.go('countgame', { round: 0 }); }
    });
  }
};
})();
