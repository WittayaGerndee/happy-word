/* ============================================================
   🧠 จำอะไรหายไป — ดูของ 3–5 ชิ้น ปิดผ้า เอาออก 1 ชิ้น แล้วทาย
   ทักษะ: ความจำระยะสั้น
   ------------------------------------------------------------
   ไม่มีการจับเวลาให้จำ เด็กกดปุ่ม "พร้อมแล้ว" เองเมื่อดูเสร็จ
   (เด็กแต่ละคนใช้เวลาไม่เท่ากัน การบังคับเวลาทำให้เครียด)
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;
var ROUNDS = 4;

H.Screens.missing = function (params) {
  var el = H.el;
  var round = params.round || 0;
  if (round >= ROUNDS) { finishAll(); return; }

  var n = [3, 3, 4, 5][round];
  var items = window.HWA_pick(n, ['animals', 'fruits', 'vehicles', 'home']);
  var goneIdx = (Math.random() * n) | 0;
  var gone = items[goneIdx];

  var wrap = el('div', 'g-wrap');
  wrap.appendChild(el('div', 'bunny', '🐰'));
  var bub = el('div', 'bubble', 'ดูให้ดีนะ จำให้ได้ว่ามีอะไรบ้าง');
  wrap.appendChild(bub);

  var row = el('div', 'miss-row');
  var nodes = [];
  items.forEach(function (w) {
    var it = el('button', 'miss-item', w.emoji);
    it.style.border = 'none'; it.style.background = 'none';
    it.setAttribute('aria-label', w.english);
    it.addEventListener('click', function () { H.sfx.pop(); H.speak(w.english); });
    row.appendChild(it);
    nodes.push(it);
  });
  wrap.appendChild(row);

  var ctrl = el('div', 'btn-col');
  ctrl.style.marginTop = '10px';
  var ready = H.btn('👀 จำได้แล้ว!', 'accent', hide);
  ctrl.appendChild(ready);
  wrap.appendChild(ctrl);

  var dots = el('div', 'g-dots');
  for (var i = 0; i < ROUNDS; i++) {
    dots.appendChild(el('div', 'd' + (i < round ? ' done' : i === round ? ' on' : '')));
  }
  wrap.appendChild(dots);

  H.app.appendChild(wrap);

  /* อ่านชื่อของทีละชิ้นให้ฟังก่อน จะได้จำง่ายขึ้นและได้คำศัพท์ไปด้วย */
  items.forEach(function (w, k) {
    H.later(function () {
      nodes[k].style.animation = 'aJump .5s var(--ease-bounce)';
      H.speak(w.english);
      H.later(function () { nodes[k].style.animation = ''; }, 520);
    }, 400 + k * 950);
  });

  function hide() {
    H.clearTimers();
    ctrl.remove();
    H.setBubble('หลับตาแป๊บนึงนะ...');
    row.innerHTML = '';
    var cover = el('div', 'miss-cover', '🪄✨');
    row.appendChild(cover);
    H.sfx.swoosh();

    H.later(function () {
      row.innerHTML = '';
      items.forEach(function (w, k) {
        if (k === goneIdx) return;
        var it = el('button', 'miss-item', w.emoji);
        it.style.border = 'none'; it.style.background = 'none';
        it.setAttribute('aria-label', w.english);
        it.addEventListener('click', function () { H.sfx.pop(); H.speak(w.english); });
        row.appendChild(it);
      });
      ask();
    }, 1400);
  }

  function ask() {
    H.setBubble('อะไรหายไปเอ่ย?');
    H.speak('What is missing?', { rate: 0.75 });

    var others = H.shuffle(window.HWA_pick(6, ['animals', 'fruits', 'vehicles', 'home'])
      .filter(function (x) {
        return x.id !== gone.id && items.every(function (y) { return y.id !== x.id; });
      })).slice(0, 2);
    var choices = H.shuffle([gone].concat(others));

    var pickRow = el('div', 'g-row');
    pickRow.style.marginTop = '14px';
    var tries = 0, done = false;

    choices.forEach(function (w) {
      var b = el('button', 'g-tile', w.emoji);
      b.setAttribute('aria-label', w.english);
      b.dataset.id = w.id;
      b.addEventListener('click', function () { pick(w, b); });
      pickRow.appendChild(b);
    });
    wrap.insertBefore(pickRow, dots);

    function pick(w, node) {
      if (done) return;

      if (w.id === gone.id) {
        done = true;
        node.classList.add('ok');
        H.sfx.yay();
        H.confettiFrom(node);
        H.bunnyEmote('excited');
        H.setBubble('ใช่เลย! ' + gone.english + ' หายไป');
        H.speak(gone.english);
        H.addStars(1);
        H.later(function () { H.sfx.ting(); }, 220);
        H.later(function () { H.go('missing', { round: round + 1 }); }, 2000);
        return;
      }

      tries++;
      H.sfx.gentle();
      node.classList.remove('soft'); void node.offsetWidth; node.classList.add('soft');
      H.speak(w.english);

      if (tries === 1) {
        H.setBubble('อันนี้ยังอยู่นะ ลองดูอีกที');
      } else if (tries === 2) {
        H.setBubble(H.bunnySay('hint'));
        var wrongs = Array.prototype.filter.call(pickRow.children, function (x) {
          return x.dataset.id !== gone.id && !x.classList.contains('gone');
        });
        if (wrongs.length) wrongs[0].classList.add('gone');
      } else {
        H.setBubble(H.bunnySay('showAnswer'));
        Array.prototype.forEach.call(pickRow.children, function (x) {
          if (x.dataset.id === gone.id) x.classList.add('point'); else x.classList.add('gone');
        });
      }
    }
  }

  function finishAll() {
    var w2 = el('div', 'g-wrap');
    w2.appendChild(el('div', 'bunny excited', '🐰'));
    H.app.appendChild(w2);
    H.addStars(2);
    H.finishBox(w2, {
      title: 'ความจำดีมาก!',
      sub: 'ทายถูกครบ ' + ROUNDS + ' รอบ',
      again: function () { H.go('missing', { round: 0 }); }
    });
  }
};
})();
