/* ============================================================
   🎨 สีอะไรเอ่ย — โจทย์บอกสี เด็กแตะของที่เป็นสีนั้น
   ทักษะ: เรียนรู้สี (+ ได้ยินชื่อสีภาษาอังกฤษซ้ำ ๆ)
   No-Fail: ผิดกี่ครั้งก็ได้ ระบบค่อย ๆ ช่วยจนถูก ได้ดาวเท่ากัน
   ============================================================ */
(function () {
'use strict';
var H = window.HWA, PK = window.HWA_PACKS;
var ROUNDS = 5;

H.Screens.colorgame = function (params) {
  var el = H.el, round = params.round || 0;

  if (round >= ROUNDS) { done(); return; }

  /* เลือกสีโจทย์จากสีที่มีของให้เลือกจริง ๆ อย่างน้อย 1 ชิ้น */
  var usable = PK.colors.filter(function (c) {
    return window.HWA_ALL.filter(function (w) { return w.color === c.id; }).length >= 1;
  });
  var target = H.shuffle(usable)[0];

  var same = H.shuffle(window.HWA_ALL.filter(function (w) { return w.color === target.id; }))[0];
  var others = H.shuffle(window.HWA_ALL.filter(function (w) {
    return w.color !== target.id && w.emoji !== same.emoji;
  })).slice(0, 3);
  /* กันตัวลวงสีซ้ำกันเอง เพื่อให้ภาพอ่านง่าย */
  var seen = {};
  others = others.filter(function (w) {
    if (seen[w.color]) return false; seen[w.color] = 1; return true;
  });
  var items = H.shuffle([same].concat(others));

  var wrap = el('div', 'g-wrap');
  wrap.appendChild(el('div', 'bunny', '🐰'));

  var prompt = el('div', 'g-prompt');
  var chip = el('span', 'color-chip');
  chip.style.background = target.hex;
  prompt.appendChild(chip);
  prompt.appendChild(el('span', '', 'อะไรเป็น' + target.thai + '?'));
  var say = el('button', 'g-say', '🔊');
  say.setAttribute('aria-label', 'ฟังอีกครั้ง');
  say.addEventListener('click', function () { H.sfx.pop(); H.speak(target.english); });
  prompt.appendChild(say);
  wrap.appendChild(prompt);

  var row = el('div', 'g-row');
  row.style.marginTop = '18px';
  var tries = 0, finished = false;

  items.forEach(function (w) {
    var b = el('button', 'g-tile', w.emoji);
    b.setAttribute('aria-label', w.english);
    b.dataset.color = w.color;
    b.addEventListener('click', function () { tap(w, b); });
    row.appendChild(b);
  });
  wrap.appendChild(row);

  var dots = el('div', 'g-dots');
  for (var i = 0; i < ROUNDS; i++) {
    dots.appendChild(el('div', 'd' + (i < round ? ' done' : i === round ? ' on' : '')));
  }
  wrap.appendChild(dots);

  H.app.appendChild(wrap);
  H.announce('หาของสี' + target.thai);
  H.later(function () { H.speak(target.english, { rate: 0.8 }); }, 380);

  function tap(w, node) {
    if (finished) return;

    if (w.color === target.id) {
      finished = true;
      node.classList.add('ok');
      H.sfx.yay();
      H.confettiFrom(node);
      H.bunnyEmote('excited');
      H.setBubble(H.bunnySay('correct'));
      H.speak(target.english + '. ' + w.english + '.', { rate: 0.78 });
      H.addStars(1);
      H.later(function () { H.sfx.ting(); }, 220);
      H.later(function () { H.go('colorgame', { round: round + 1 }); }, 1900);
      return;
    }

    tries++;
    H.sfx.gentle();
    node.classList.remove('soft'); void node.offsetWidth; node.classList.add('soft');
    /* ถือโอกาสสอน: บอกว่าตัวที่แตะไปเป็นสีอะไร */
    var c = PK.colors.filter(function (x) { return x.id === w.color; })[0];
    H.speak(c ? c.english : w.english);

    if (tries === 1) {
      H.setBubble(H.bunnySay('encourage'));
    } else if (tries === 2) {
      H.setBubble(H.bunnySay('hint'));
      var wrongs = Array.prototype.filter.call(row.children, function (n) {
        return n.dataset.color !== target.id && !n.classList.contains('gone');
      });
      if (wrongs.length) wrongs[0].classList.add('gone');
    } else {
      H.setBubble(H.bunnySay('showAnswer'));
      Array.prototype.forEach.call(row.children, function (n) {
        if (n.dataset.color === target.id) n.classList.add('point');
        else n.classList.add('gone');
      });
    }
    H.later(function () { H.speak(target.english, { rate: 0.78 }); }, 900);
  }

  function done() {
    var w2 = el('div', 'g-wrap');
    w2.appendChild(el('div', 'bunny excited', '🐰'));
    H.app.appendChild(w2);
    H.addStars(2);
    H.finishBox(w2, {
      title: 'รู้จักสีเยอะเลย!',
      sub: 'ตอบครบ ' + ROUNDS + ' ข้อแล้ว',
      again: function () { H.go('colorgame', { round: 0 }); }
    });
  }
};
})();
