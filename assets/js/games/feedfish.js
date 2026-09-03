/* ============================================================
   🐠 ให้อาหารปลา — เลือกอาหารให้ตรงกับปลาที่หิว
   ทักษะ: การจำแนก (จับคู่สีอาหารกับสีปลา) + ชื่อสีภาษาอังกฤษ
   No-Fail: เลือกผิด ปลาแค่ส่ายหัว แล้ว Bunny ใบ้ให้
   ============================================================ */
(function () {
'use strict';
var H = window.HWA, PK = window.HWA_PACKS;
var ROUNDS = 5;
var FISH = ['🐠', '🐟', '🐡', '🐙', '🦑', '🐳'];

H.Screens.feedfish = function (params) {
  var el = H.el;
  var round = params.round || 0;
  if (round >= ROUNDS) { finish(); return; }

  var palette = H.shuffle(PK.colors.filter(function (c) {
    return ['red', 'yellow', 'blue', 'green', 'orange', 'purple', 'pink'].indexOf(c.id) >= 0;
  })).slice(0, 3);
  var hungry = palette[0];
  var shapes = H.shuffle(FISH).slice(0, 3);

  var wrap = el('div', 'g-wrap');

  var prompt = el('div', 'g-prompt');
  prompt.appendChild(el('span', '', 'ปลา' + hungry.thai + 'หิวแล้ว!'));
  var say = el('button', 'g-say', '🔊');
  say.setAttribute('aria-label', 'ฟังอีกครั้ง');
  say.addEventListener('click', function () { H.sfx.pop(); H.speak(hungry.english); });
  prompt.appendChild(say);
  wrap.appendChild(prompt);

  var pond = el('div', 'pond');
  wrap.appendChild(pond);

  var foods = el('div', 'food-bar');
  wrap.appendChild(foods);

  var dots = el('div', 'g-dots');
  for (var i = 0; i < ROUNDS; i++) {
    dots.appendChild(el('div', 'd' + (i < round ? ' done' : i === round ? ' on' : '')));
  }
  wrap.appendChild(dots);
  H.app.appendChild(wrap);

  /* ---- วางปลา ---- */
  var fishNodes = {};
  H.shuffle(palette).forEach(function (c, idx) {
    var f = el('div', 'fish', shapes[idx]);
    f.style.background = c.hex;
    f.style.borderRadius = '50%';
    f.style.padding = '10px 14px';
    f.style.boxShadow = '0 6px 14px rgba(0,0,0,.18)';
    f.style.left = (8 + idx * 30) + '%';
    f.style.top  = (14 + (idx % 2) * 34) + '%';
    f.setAttribute('aria-label', 'ปลา' + c.thai);
    f.dataset.color = c.id;
    if (c.id === hungry.id) {
      f.classList.add('hot', 'hungry');
      f.style.animation = 'bob 1.6s ease-in-out infinite';
      f.appendChild(el('span', 'hint-bubble', '💭'));
    }
    f.addEventListener('click', function () {
      H.sfx.pop(); H.speak(c.english);
      f.classList.remove('fed'); void f.offsetWidth; f.classList.add('fed');
    });
    pond.appendChild(f);
    fishNodes[c.id] = f;
  });

  /* ---- อาหาร ---- */
  var tries = 0, done = false;
  H.shuffle(palette).forEach(function (c) {
    var b = el('button', 'g-tile', '');
    b.style.setProperty('--tint', c.hex);
    b.classList.add('tinted');
    b.dataset.color = c.id;
    b.setAttribute('aria-label', 'อาหาร' + c.thai);
    var chip = el('span', '', '🍚');
    chip.style.fontSize = '46px';
    b.appendChild(chip);
    b.addEventListener('click', function () { pick(c, b); });
    foods.appendChild(b);
  });

  H.announce('เลือกอาหารสี' + hungry.thai);
  H.later(function () { H.speak(hungry.english, { rate: 0.8 }); }, 380);

  function pick(c, node) {
    if (done) return;

    if (c.id === hungry.id) {
      done = true;
      node.classList.add('ok');
      var f = fishNodes[hungry.id];
      H.sfx.yay();
      H.confettiFrom(f, 28);
      f.classList.add('fed');
      f.textContent = '😋';
      H.bunnyEmote('excited');
      H.setBubble('อิ่มแล้ว! ' + hungry.english);
      H.speak(hungry.english + ' fish. Yummy!', { rate: 0.78 });
      H.addStars(1);
      H.later(function () { H.sfx.ting(); }, 220);
      H.later(function () { H.go('feedfish', { round: round + 1 }); }, 2000);
      return;
    }

    tries++;
    H.sfx.gentle();
    node.classList.remove('soft'); void node.offsetWidth; node.classList.add('soft');
    H.speak(c.english);

    if (tries === 1) {
      H.setBubble('ปลาตัวที่เด้งอยู่หิวนะ ดูสีของมันสิ');
    } else if (tries === 2) {
      H.setBubble(H.bunnySay('hint'));
      var wrongs = Array.prototype.filter.call(foods.children, function (x) {
        return x.dataset.color !== hungry.id && !x.classList.contains('gone');
      });
      if (wrongs.length) wrongs[0].classList.add('gone');
    } else {
      H.setBubble(H.bunnySay('showAnswer'));
      Array.prototype.forEach.call(foods.children, function (x) {
        if (x.dataset.color === hungry.id) x.classList.add('point'); else x.classList.add('gone');
      });
    }
    H.later(function () { H.speak(hungry.english, { rate: 0.78 }); }, 900);
  }

  function finish() {
    var w2 = el('div', 'g-wrap');
    w2.appendChild(el('div', 'bunny excited', '🐰'));
    H.app.appendChild(w2);
    H.addStars(2);
    H.finishBox(w2, {
      title: 'ปลาอิ่มทุกตัวแล้ว!',
      sub: 'ให้อาหารครบ ' + ROUNDS + ' ตัว',
      again: function () { H.go('feedfish', { round: 0 }); }
    });
  }
};
})();
